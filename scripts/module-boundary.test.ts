import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import ts from "typescript";
import { afterEach, describe, expect, it } from "vitest";

import { getDiscoveryTokens, scanDirForTokens } from "./check-dist-boundary";
import {
  buildModuleGraph,
  collectFileImports,
  formatImportChain,
  mergeModuleGraphs
} from "./module-graph";

const rootDir = path.resolve(__dirname, "..");

// tsconfig는 "필드 몇 개 비교"가 아니라 각각 파싱해서 쓴다. paths·baseUrl·moduleSuffixes·
// customConditions·rootDirs 같은 값이 나중에 갈라져도 해상도가 실제 프로젝트를 따라간다.
function loadCompilerOptions(configFileName: string) {
  const configPath = path.resolve(rootDir, configFileName);
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);

  expect(configFile.error, `${configFileName} could not be read`).toBeUndefined();

  const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, rootDir, undefined, configPath);

  return parsed.options;
}

// SPA 진입점은 index.html이 정본이다. 두 번째 module script가 추가되면 여기서 드러난다.
function readHtmlModuleEntries() {
  const html = ts.sys.readFile(path.resolve(rootDir, "index.html")) ?? "";
  const entries: string[] = [];
  const scriptPattern = /<script\b[^>]*type=["']module["'][^>]*>/gi;

  for (const match of html.matchAll(scriptPattern)) {
    const src = /\ssrc=["']([^"']+)["']/i.exec(match[0]);

    if (src?.[1]) {
      entries.push(path.resolve(rootDir, src[1].replace(/^\//, "")));
    }
  }

  return entries;
}

// pages 산출물을 만드는 스크립트는 build:pages가 정본이다. 새 스크립트가 추가되면 여기서 드러난다.
function readPagesEntries() {
  const packageJson = JSON.parse(ts.sys.readFile(path.resolve(rootDir, "package.json")) ?? "{}") as {
    scripts?: Record<string, string>;
  };
  const buildPages = packageJson.scripts?.["build:pages"] ?? "";

  return [...buildPages.matchAll(/scripts\/[\w.-]+\.ts\b/g)].map((match) =>
    path.resolve(rootDir, match[0])
  );
}

const discoveryModules = ["discovery.ts", "discoveryReport.ts"].map((name) =>
  path.resolve(rootDir, "src", "briefs", name)
);

function buildRealGraph() {
  const htmlEntries = readHtmlModuleEntries();
  const pagesEntries = readPagesEntries();

  return {
    htmlEntries,
    pagesEntries,
    graph: mergeModuleGraphs([
      buildModuleGraph(htmlEntries, loadCompilerOptions("tsconfig.app.json")),
      buildModuleGraph(pagesEntries, loadCompilerOptions("tsconfig.node.runtime.json"))
    ])
  };
}

describe("module boundary", () => {
  // 이 저장소에는 scripts → src bridge가 실재한다(prerender.ts → seo.ts → src/*). 그래서 경계는
  // "src 파일들"이 아니라 "출하 진입점에서 도달 가능한 그래프"로 판정해야 한다.
  it("keeps discovery ops data out of every shipped entry graph", () => {
    const { graph } = buildRealGraph();

    const offenders = discoveryModules
      .filter((modulePath) => graph.reachable.has(modulePath))
      .map((modulePath) => formatImportChain(graph, modulePath, rootDir));

    expect(offenders).toEqual([]);
  });

  it("derives its entry points from index.html and build:pages instead of a hardcoded list", () => {
    const { htmlEntries, pagesEntries } = buildRealGraph();

    expect(htmlEntries.map((entry) => path.relative(rootDir, entry))).toEqual(["src/main.tsx"]);
    expect(pagesEntries.map((entry) => path.relative(rootDir, entry))).toEqual([
      "scripts/prerender.ts",
      "scripts/generate-sitemap.ts",
      "scripts/prepare-pages.ts"
    ]);

    // 진입점이 실존해야 한다. 이름이 바뀌면 빈 그래프를 조용히 도는 대신 여기서 멈춘다.
    for (const entry of [...htmlEntries, ...pagesEntries]) {
      expect(ts.sys.fileExists(entry), `${path.relative(rootDir, entry)} does not exist`).toBe(true);
    }
  });

  // 이 가드는 glob·비리터럴 동적 import·query import을 따라갈 수 없다. 따라갈 수 없는 것이
  // 그래프에 들어오면 조용히 좁히는 대신 멈춘다.
  it("refuses to guess at import forms it cannot resolve", () => {
    const { graph } = buildRealGraph();

    const found = graph.unresolvable.map(
      (entry) => `${path.relative(rootDir, entry.file)} [${entry.kind}] ${entry.snippet}`
    );

    expect(
      found,
      "this guard does not model Vite glob or expression imports — extend scripts/module-graph.ts before introducing one"
    ).toEqual([]);
  });
});

describe("module graph resolver", () => {
  let fixtureDir: string | undefined;

  afterEach(() => {
    if (fixtureDir) {
      rmSync(fixtureDir, { recursive: true, force: true });
      fixtureDir = undefined;
    }
  });

  function createFixture(files: Record<string, string>) {
    fixtureDir = mkdtempSync(path.join(tmpdir(), "glotm-module-graph-"));

    for (const [relativePath, contents] of Object.entries(files)) {
      const filePath = path.join(fixtureDir, relativePath);
      mkdirSync(path.dirname(filePath), { recursive: true });
      writeFileSync(filePath, contents, "utf8");
    }

    return fixtureDir;
  }

  const options: ts.CompilerOptions = {
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ESNext,
    allowImportingTsExtensions: true,
    resolveJsonModule: true,
    noEmit: true
  };

  it("follows a bridge that lives outside the scanned source tree", () => {
    const dir = createFixture({
      "src/entry.ts": 'import { value } from "../bridge/reexport";\nexport const used = value;\n',
      "bridge/reexport.ts": 'export { value } from "../ops/secret";\n',
      "ops/secret.ts": "export const value = 1;\n"
    });

    const graph = buildModuleGraph([path.join(dir, "src/entry.ts")], options);
    const secret = path.join(dir, "ops/secret.ts");

    expect(graph.reachable.has(secret)).toBe(true);
    expect(formatImportChain(graph, secret, dir)).toBe(
      "src/entry.ts → bridge/reexport.ts → ops/secret.ts"
    );
  });

  it("resolves .js specifiers back to their TypeScript source", () => {
    const dir = createFixture({
      "src/entry.ts": 'import { value } from "./secret.js";\nexport const used = value;\n',
      "src/secret.ts": "export const value = 1;\n"
    });

    const graph = buildModuleGraph([path.join(dir, "src/entry.ts")], options);

    expect(graph.reachable.has(path.join(dir, "src/secret.ts"))).toBe(true);
  });

  it("follows literal dynamic imports and index resolution", () => {
    const dir = createFixture({
      "src/entry.ts":
        'export async function load() {\n  const mod = await import("./ops");\n  return mod.value;\n}\n',
      "src/ops/index.ts": "export const value = 1;\n"
    });

    const graph = buildModuleGraph([path.join(dir, "src/entry.ts")], options);

    expect(graph.reachable.has(path.join(dir, "src/ops/index.ts"))).toBe(true);
  });

  it("classifies glob and expression imports as unresolvable, and resolves query imports precisely", () => {
    const dir = createFixture({
      "src/entry.ts": [
        'const modules = import.meta.glob("./ops/*.ts");',
        'const name = "secret";',
        "export async function load() {",
        "  const mod = await import(`./ops/${name}.ts`);",
        "  return { modules, mod };",
        "}",
        'export { default as raw } from "./ops/secret.ts?raw";'
      ].join("\n"),
      "src/ops/secret.ts": "export default 1;\n"
    });

    const graph = buildModuleGraph([path.join(dir, "src/entry.ts")], options);

    expect(graph.unresolvable.map((entry) => entry.kind).sort()).toEqual([
      "dynamic-expression",
      "glob"
    ]);

    // `?raw`는 모듈 텍스트를 번들에 인라인하므로 추측이 아니라 진짜 간선으로 잡아야 한다.
    expect(graph.reachable.has(path.join(dir, "src/ops/secret.ts"))).toBe(true);
  });

  it("ignores query imports that point at non-module assets", () => {
    const dir = createFixture({
      "src/entry.ts": [
        'import doc from "./notes.md?raw";',
        "export const value = doc;"
      ].join("\n"),
      "src/notes.md": "# notes"
    });

    const graph = buildModuleGraph([path.join(dir, "src/entry.ts")], options);

    expect(graph.unresolvable).toEqual([]);
    expect([...graph.reachable].map((file) => path.relative(dir, file))).toEqual(["src/entry.ts"]);
  });

  // 정규식이 아니라 AST로 보기 때문에 주석·문자열 안의 같은 표현은 잡히지 않는다.
  it("does not flag import.meta.glob mentioned in comments or strings", () => {
    const imports = collectFileImports(
      "/virtual/example.ts",
      [
        "// import.meta.glob(\"./ops/*.ts\") is intentionally not used here",
        'const doc = "import.meta.glob is a Vite API";',
        "export const value = doc;"
      ].join("\n")
    );

    expect(imports.unresolvable).toEqual([]);
    expect(imports.specifiers).toEqual([]);
  });
});

describe("dist boundary scan", () => {
  let fixtureDir: string | undefined;

  afterEach(() => {
    if (fixtureDir) {
      rmSync(fixtureDir, { recursive: true, force: true });
      fixtureDir = undefined;
    }
  });

  it("finds tokens in shipped text artifacts and ignores other file types", () => {
    fixtureDir = mkdtempSync(path.join(tmpdir(), "glotm-dist-scan-"));
    mkdirSync(path.join(fixtureDir, "assets"), { recursive: true });
    writeFileSync(path.join(fixtureDir, "index.html"), "<p>clean</p>", "utf8");
    writeFileSync(path.join(fixtureDir, "assets/app.js"), "const id='2026-08-leak';", "utf8");
    writeFileSync(path.join(fixtureDir, "sitemap.xml"), "<loc>2026-08-leak</loc>", "utf8");
    // 스캔 대상 확장자가 아니므로 무시돼야 한다.
    writeFileSync(path.join(fixtureDir, "notes.md"), "2026-08-leak", "utf8");

    const hits = scanDirForTokens(fixtureDir, ["2026-08-leak"]);

    expect(hits.map((hit) => hit.file).sort()).toEqual([
      path.join("assets", "app.js"),
      "sitemap.xml"
    ]);
    expect(scanDirForTokens(fixtureDir, ["absent-token"])).toEqual([]);
  });

  // 소스 id를 맨몸으로 찾으면 가이드 본문의 정당한 기관명과 충돌한다(실측: dist에서 `uspto` 7파일,
  // `impi` 27파일). 그래서 소스 토큰은 따옴표를 씌운 형태여야 한다.
  it("quotes source-id tokens so legitimate guide prose does not trip the scan", () => {
    const tokens = getDiscoveryTokens();

    expect(tokens).toContain('"uspto"');
    expect(tokens).not.toContain("uspto");

    fixtureDir = mkdtempSync(path.join(tmpdir(), "glotm-dist-tokens-"));
    // 가이드 본문에 흔히 나오는 형태 — 잡히면 안 된다.
    writeFileSync(
      path.join(fixtureDir, "guide.html"),
      "<p>USPTO 심사 절차와 uspto.gov 안내를 참고합니다.</p>",
      "utf8"
    );
    // 실제로 데이터가 실린 형태 — 잡혀야 한다.
    writeFileSync(path.join(fixtureDir, "bundle.js"), 'const s={id:"uspto",sweepTarget:"x"};', "utf8");

    const hits = scanDirForTokens(fixtureDir, tokens);

    expect(hits.map((hit) => hit.file)).toEqual(["bundle.js", "bundle.js"]);
    expect(hits.map((hit) => hit.token).sort()).toEqual(['"uspto"', "sweepTarget"]);
  });
});
