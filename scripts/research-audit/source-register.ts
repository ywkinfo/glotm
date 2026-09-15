// source register 파서. `claim-source-register.test.ts`가 쓰고, 그 테스트가 잠그는 계약이 곧
// 이 파일의 자료구조다. I/O는 하지 않는다 — markdown 문자열을 받아 표만 읽는다.
//
// register가 담는 행은 두 종류이고, **URL이 있느냐로 갈린다.** 절 제목을 보지 않는 이유는
// 워크스페이스마다 제목이 다르기 때문이다(`죽은 URL` · `폐기된 sourceId` · `제거된 출처`).
// 모양으로 가르면 새 절이 생겨도 파서를 고칠 일이 없다.
//
//   1. **index 행** — `| sourceId | 공식 출처 | https://… |`. claim이 sourceId로 가리킬 수 있는 출처.
//   2. **대체 행** — 같은 표 모양인데 https URL이 없다. "이 sourceId는 더 이상(또는 애초에)
//      claim을 지탱하지 않는다. 실제로 지탱하는 것은 이것이다"를 적는 행이다.
//
// 2번이 이 파일이 새로 생긴 이유다. 2026-09-13~14 두 회차가 같은 결함을 두 번 냈다 —
// `EU-FEE-001`은 죽은 URL(`euipo-fees`)을, `EU-PRIO-001`은 살아 있지만 본문이 JS 셸이라
// 인용할 수 없는 페이지(`euipo-priority-guidelines`)를 sourceId로 들고 있었고, 두 claim 다
// 실제 결론은 EUTMR 조문에서 났다. register 산문에는 그 사실이 적혀 있었는데 게이트가 읽지
// 못해서, 다음 회차가 같은 자리에 다시 걸렸다. 대체 행은 그 산문을 기계가 읽는 자리로 옮긴 것이다.

export type SourceRegisterSubstitution = {
  // 더 이상 claim을 지탱하지 않는 sourceId.
  sourceId: string;
  // 이 sourceId에 기대고 있던 claim. 비어 있으면(사유만 적은 행) 강제할 의무가 없다.
  claimIds: string[];
  // 실제로 지탱하는 출처. index에서 해석된 것만 담는다.
  replacementIds: string[];
  line: number;
  text: string;
};

export type SourceRegister = {
  // sourceId → 공식 URL. 같은 id가 여러 번 나오면 첫 index 행을 쓴다.
  index: Map<string, string>;
  substitutions: SourceRegisterSubstitution[];
};

// register의 sourceId 표기. 폐기 표시로 취소선을 두른 셀(`~~euipo-fees~~`)은 여기서 걸러진다 —
// 그 행은 "이 자리에 무엇이 있었는가"의 흔적이지 등록이 아니다.
const SOURCE_ID = /^[a-z0-9][a-z0-9-]*$/;

// claim id는 워크스페이스 접두사 + 축 + 일련번호다(EU-FEE-001, USA-CANC-001, MX-DL-001).
const CLAIM_ID = /\b[A-Z]{2,4}-[A-Z0-9]+-\d+\b/g;

// 대체 행의 설명 칸에서 sourceId 후보를 뽑는다. 뽑기만 하고, 실재 여부는 index로 거른다 —
// `eutmr-consolidated (제1조 제2항 unitary character)`에서 `unitary`·`character`도 같이 걸리는데,
// 이걸 오타 후보로 취급하면 산문을 쓸 때마다 게이트가 운다.
const SOURCE_ID_TOKEN = /[a-z0-9][a-z0-9-]*/g;

function splitRow(line: string) {
  return line.split("|").map((cell) => cell.trim());
}

export function parseSourceRegister(markdown: string): SourceRegister {
  const index = new Map<string, string>();
  const rows: { sourceId: string; rest: string; line: number }[] = [];

  markdown.split("\n").forEach((line, offset) => {
    if (!line.trimStart().startsWith("|")) {
      return;
    }

    const cells = splitRow(line);
    const sourceId = cells[1] ?? "";

    if (!SOURCE_ID.test(sourceId)) {
      return;
    }

    const url = cells.find((cell) => cell.includes("https://"));

    if (url) {
      // 먼저 나온 index 행이 이긴다. 뒤쪽 절의 대체 행이 URL을 지우지 못하게 하는 것이 요점이다.
      if (!index.has(sourceId)) {
        index.set(sourceId, url);
      }

      return;
    }

    rows.push({ sourceId, rest: cells.slice(2, -1).join(" "), line: offset + 1 });
  });

  const substitutions = rows.map(({ sourceId, rest, line }) => ({
    sourceId,
    claimIds: [...new Set(rest.match(CLAIM_ID) ?? [])],
    replacementIds: [
      ...new Set((rest.match(SOURCE_ID_TOKEN) ?? []).filter((token) => index.has(token)))
    ],
    line,
    text: rest
  }));

  return { index, substitutions };
}
