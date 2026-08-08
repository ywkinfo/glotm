// 출하 산출물(`dist/`)에 발굴 lane의 ops 데이터가 실렸는지 확인하는 방어선이다.
//
// 왜 vitest 파일이 아니라 CLI인가: `test:runtime`은 `--exclude` 방식이라 새 테스트 파일을 자동으로
// 집어가고, bare `npm test`도 전체를 돌린다. dist를 요구하는 테스트를 두면 빌드 전에 실행돼
// `Harness/QA-Gate.md`의 "Always: `npm run test` 통과" 계약이 clean tree에서 깨진다.
// 그래서 이 검사는 빌드 직후 release lane(`health:release`)에만 배선한다.
//
// **`dist/` 부재는 skip이 아니라 실패다.** release lane에서 산출물이 없다는 것 자체가 사고다.
// 정적 import 경계는 `module-boundary.test.ts`가 보고, 이건 그 뒤에 남는 마지막 그물이다.

import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { briefCandidates, briefSources } from "../src/briefs/discovery";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

// 텍스트 산출물 전부를 본다. 번들 js뿐 아니라 prerender html, sitemap xml, robots txt,
// source map, generated json 어디로든 문자열은 샐 수 있다.
const scannedExtensions = new Set([".html", ".js", ".css", ".json", ".map", ".xml", ".txt"]);

export type TokenHit = {
  file: string;
  token: string;
};

export function scanDirForTokens(rootPath: string, tokens: string[]): TokenHit[] {
  const hits: TokenHit[] = [];

  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const entryPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        walk(entryPath);
        continue;
      }

      if (!scannedExtensions.has(path.extname(entry.name))) {
        continue;
      }

      const content = readFileSync(entryPath, "utf8");

      for (const token of tokens) {
        if (content.includes(token)) {
          hits.push({ file: path.relative(rootPath, entryPath), token });
        }
      }
    }
  };

  walk(rootPath);

  return hits;
}

// 발굴 데이터가 산출물에 실렸다면 반드시 남는 흔적들. 대표 몇 개만 보면 나머지가 새는 경로를 놓치므로
// 후보 id는 전수로 본다.
//
// 소스 id는 **따옴표를 붙여서** 본다. 그냥 `uspto`·`impi`·`kipo`로 찾으면 가이드 본문의 정당한
// 기관명과 충돌한다(실측: `uspto` 7파일, `impi` 27파일이 걸린다 — 전부 UsaTm·MexTm 본문이다).
// 반면 따옴표를 씌운 `"uspto"` 형태는 현재 dist에서 0건이고, 실제로 데이터가 실리면 minify 후에도
// 프로퍼티 값의 따옴표는 남으므로 이 형태로 잡힌다.
//
// 구조 마커는 이 모듈에만 있는 필드명이다. 번들러는 데이터 리터럴의 프로퍼티 이름을 바꾸지 않으므로
// 후보·소스 id가 어떤 이유로 바뀌어도 이쪽이 남는다.
const structuralMarkers = [
  "sweepTarget",
  "reviewTrigger",
  "repository-backfill",
  "briefSweepLog"
];

export function getDiscoveryTokens() {
  return [
    ...briefCandidates.map((candidate) => candidate.id),
    ...briefSources.map((source) => `"${source.id}"`),
    ...structuralMarkers
  ];
}

export function runCheck(distDir = path.resolve(rootDir, "dist")) {
  if (!existsSync(distDir)) {
    return {
      ok: false,
      message: `dist/ not found at ${path.relative(rootDir, distDir)} — run this after \`build:pages:glotm\`. A missing release artifact is a failure here, not a skip.`,
      hits: [] as TokenHit[]
    };
  }

  const tokens = getDiscoveryTokens();
  const hits = scanDirForTokens(distDir, tokens);

  if (hits.length > 0) {
    const detail = hits.map((hit) => `  ${hit.file} ← ${hit.token}`).join("\n");

    return {
      ok: false,
      message: `discovery ops data reached the release artifact (${hits.length} hit(s)):\n${detail}`,
      hits
    };
  }

  return {
    ok: true,
    message: `check:dist-boundary → 0 hits across ${tokens.length} discovery tokens`,
    hits
  };
}

const entryArg = process.argv[1];

if (entryArg && import.meta.url === pathToFileURL(entryArg).href) {
  const result = runCheck();

  console.log(result.ok ? result.message : `check:dist-boundary FAILED\n${result.message}`);

  if (!result.ok) {
    process.exitCode = 1;
  }
}
