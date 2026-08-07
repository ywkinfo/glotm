// 진입점에서 도달 가능한 모듈 그래프를 만든다. 용도는 하나 — 어떤 모듈이 실제로 번들·출하 경로에
// 실리는지 판정하는 것이다(`module-boundary.test.ts`).
//
// 왜 직접 만드는가: 앞선 판은 `src/**`의 각 파일에서 직접 import만 훑었다. 그래서 `src` 밖 bridge를
// 경유하는 경로를 통째로 놓쳤는데, 이 저장소에는 그 경로가 실재한다
// (`scripts/prerender.ts` → `scripts/seo.ts` → `src/*` → prerender HTML → dist).
//
// 두 가지 원칙:
//  1. specifier 해석은 손으로 하지 않는다. `ts.resolveModuleName`이 `.js` → `.ts` extension
//     substitution, index 해상도, 확장자 생략을 전부 처리한다(moduleResolution: Bundler).
//  2. import 수집은 정규식이 아니라 AST로 한다. 주석·문자열 안의 `import.meta.glob` 같은 것에
//     오탐하지 않기 위해서다.

import { readFileSync } from "node:fs";
import path from "node:path";

import ts from "typescript";

// 이 가드가 정적으로 따라갈 수 없는 import 형태. 발견되면 그래프를 조용히 좁히는 대신 호출자가
// 실패시킨다 — "모르는 것을 안다고 하지 않는다"가 이 가드의 유일한 안전장치다.
//
// Vite query import(`?raw`, `?url`)는 여기 없다. 그건 추측 없이 정확히 다룰 수 있기 때문이다:
// 쿼리를 떼고 해석해 TS 모듈로 떨어지면 그 자체가 진짜 간선이고(`./discovery?raw`는 모듈 텍스트를
// 번들에 인라인하므로 실제로 데이터가 실린다), 마크다운 같은 비-TS 에셋으로 떨어지면 이 가드가
// 추적하는 모듈 그래프와 무관하다. 실제로 `src/content/intro.ts`가 `.md?raw`를 쓰고 있다.
export type UnresolvableKind = "glob" | "dynamic-expression";

export type UnresolvableImport = {
  file: string;
  kind: UnresolvableKind;
  snippet: string;
};

export type ModuleGraph = {
  // 진입점 포함, 도달 가능한 파일의 절대경로
  reachable: Set<string>;
  // 실패 메시지에서 import 체인을 복원하기 위한 역방향 간선
  parents: Map<string, { from: string; specifier: string }>;
  unresolvable: UnresolvableImport[];
};

type FileImports = {
  specifiers: string[];
  unresolvable: UnresolvableImport[];
};

function isImportMetaGlob(node: ts.CallExpression) {
  const callee = node.expression;

  if (!ts.isPropertyAccessExpression(callee)) {
    return false;
  }

  const globNames = new Set(["glob", "globEager"]);

  return (
    globNames.has(callee.name.text) &&
    ts.isMetaProperty(callee.expression) &&
    callee.expression.keywordToken === ts.SyntaxKind.ImportKeyword
  );
}

function snippetOf(node: ts.Node, sourceFile: ts.SourceFile) {
  const text = node.getText(sourceFile).replace(/\s+/g, " ").trim();

  return text.length > 120 ? `${text.slice(0, 119)}…` : text;
}

// 한 파일에서 모듈 참조를 모은다. 정적 import/export-from, 리터럴 동적 import는 specifier로,
// 나머지 Vite 전용 형태는 unresolvable로 분류한다.
export function collectFileImports(filePath: string, sourceText: string): FileImports {
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.ESNext,
    true,
    /\.tsx$/.test(filePath) ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  );

  const specifiers: string[] = [];
  const unresolvable: UnresolvableImport[] = [];

  const pushSpecifier = (specifier: string) => {
    // 쿼리를 떼고 해석한다. TS 모듈로 떨어지면 진짜 간선으로 잡히고, 에셋이면 해석에 실패해
    // 그래프에서 자연히 빠진다.
    specifiers.push(specifier.split("?")[0] ?? specifier);
  };

  const visit = (node: ts.Node) => {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      pushSpecifier(node.moduleSpecifier.text);
    }

    if (ts.isImportEqualsDeclaration(node) && ts.isExternalModuleReference(node.moduleReference)) {
      const reference = node.moduleReference.expression;

      if (ts.isStringLiteral(reference)) {
        pushSpecifier(reference.text);
      }
    }

    if (ts.isCallExpression(node)) {
      if (isImportMetaGlob(node)) {
        unresolvable.push({ file: filePath, kind: "glob", snippet: snippetOf(node, sourceFile) });
      } else if (node.expression.kind === ts.SyntaxKind.ImportKeyword) {
        const argument = node.arguments[0];

        if (argument && ts.isStringLiteral(argument)) {
          pushSpecifier(argument.text);
        } else {
          // `import(\`./${name}.ts\`)` 처럼 값이 실행 시점에 정해지는 형태.
          unresolvable.push({
            file: filePath,
            kind: "dynamic-expression",
            snippet: snippetOf(node, sourceFile)
          });
        }
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);

  return { specifiers, unresolvable };
}

function isTraversable(filePath: string) {
  if (filePath.includes(`${path.sep}node_modules${path.sep}`)) {
    return false;
  }

  return /\.tsx?$/.test(filePath) && !filePath.endsWith(".d.ts");
}

export function buildModuleGraph(
  entryFiles: string[],
  options: ts.CompilerOptions,
  host: ts.ModuleResolutionHost = ts.sys
): ModuleGraph {
  const reachable = new Set<string>();
  const parents = new Map<string, { from: string; specifier: string }>();
  const unresolvable: UnresolvableImport[] = [];
  const cache = ts.createModuleResolutionCache(process.cwd(), (fileName) => fileName, options);

  const queue = entryFiles.map((entry) => path.resolve(entry));

  for (const entry of queue) {
    reachable.add(entry);
  }

  while (queue.length > 0) {
    const current = queue.shift()!;

    let sourceText: string;

    try {
      sourceText = readFileSync(current, "utf8");
    } catch {
      // 진입점 실존 검사는 호출자 책임이다. 여기서는 읽을 수 없는 파일을 건너뛴다.
      continue;
    }

    const imports = collectFileImports(current, sourceText);
    unresolvable.push(...imports.unresolvable);

    for (const specifier of imports.specifiers) {
      const resolved = ts.resolveModuleName(specifier, current, options, host, cache).resolvedModule;

      if (!resolved) {
        continue;
      }

      const resolvedPath = path.resolve(resolved.resolvedFileName);

      if (!isTraversable(resolvedPath) || reachable.has(resolvedPath)) {
        continue;
      }

      reachable.add(resolvedPath);
      parents.set(resolvedPath, { from: current, specifier });
      queue.push(resolvedPath);
    }
  }

  return { reachable, parents, unresolvable };
}

export function mergeModuleGraphs(graphs: ModuleGraph[]): ModuleGraph {
  const merged: ModuleGraph = { reachable: new Set(), parents: new Map(), unresolvable: [] };

  for (const graph of graphs) {
    for (const file of graph.reachable) {
      merged.reachable.add(file);
    }

    for (const [child, edge] of graph.parents) {
      if (!merged.parents.has(child)) {
        merged.parents.set(child, edge);
      }
    }

    merged.unresolvable.push(...graph.unresolvable);
  }

  return merged;
}

// `prerender.ts → seo.ts → discovery.ts` 형태로 실제 경로를 복원한다.
// 어떤 파일이 왜 번들에 들어왔는지 모르면 위반을 고칠 수 없다.
export function formatImportChain(graph: ModuleGraph, target: string, rootDir = process.cwd()) {
  const chain: string[] = [];
  let cursor: string | undefined = path.resolve(target);

  while (cursor) {
    chain.unshift(path.relative(rootDir, cursor));
    cursor = graph.parents.get(cursor)?.from;
  }

  return chain.join(" → ");
}
