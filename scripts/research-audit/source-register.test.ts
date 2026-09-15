import { describe, expect, it } from "vitest";

import { parseSourceRegister } from "./source-register";

// 이 파서의 규칙은 하나다 — **같은 모양의 표 행을 URL 유무로 가른다.** 절 제목이 아니라 모양으로
// 가르기로 한 판단이 여기서 잠긴다. 워크스페이스마다 제목이 다르고(`죽은 URL` · `폐기된 sourceId` ·
// `제거된 출처`), 제목을 읽는 파서는 새 절이 생길 때마다 조용히 눈이 먼다.
describe("parseSourceRegister", () => {
  it("URL이 있는 행만 index에 넣는다", () => {
    const register = parseSourceRegister(
      [
        "| sourceId | 공식 출처 | URL |",
        "|---|---|---|",
        "| eutmr-consolidated | Regulation (EU) 2017/1001 | https://example.org/eutmr |",
        "",
        "| 폐기된 sourceId | 쓰이던 claim | 대체 |",
        "|---|---|---|",
        "| euipo-fees | EU-FEE-001 | eutmr-consolidated (Annex I) |"
      ].join("\n")
    );

    expect([...register.index.keys()]).toEqual(["eutmr-consolidated"]);
    expect(register.substitutions.map((entry) => entry.sourceId)).toEqual(["euipo-fees"]);
  });

  it("대체 행에서 claim id와 index에 실재하는 대체 근거만 뽑는다", () => {
    const register = parseSourceRegister(
      [
        "| eutmr-consolidated | EUTMR | https://example.org/eutmr |",
        "| euipo-fees | EU-FEE-001, EU-RNW-001 | eutmr-consolidated (제52·53조 unitary character) |"
      ].join("\n")
    );

    const [substitution] = register.substitutions;

    expect(substitution.claimIds).toEqual(["EU-FEE-001", "EU-RNW-001"]);
    // `unitary`·`character`도 sourceId 모양이지만 index에 없으므로 대체 근거가 아니다.
    expect(substitution.replacementIds).toEqual(["eutmr-consolidated"]);
  });

  it("대체 행이 앞선 index 행의 URL을 덮어쓰지 않는다", () => {
    // 살아 있는 URL을 가진 소스도 대체 행의 대상이 될 수 있다 — `euipo-priority-guidelines`처럼
    // 페이지는 열리지만 본문이 JS 셸이라 인용 근거가 못 되는 경우다. 두 행이 공존해야 한다.
    const register = parseSourceRegister(
      [
        "| eutmr-consolidated | EUTMR | https://example.org/eutmr |",
        "| euipo-priority-guidelines | EUIPO Guidelines 11.2 | https://example.org/guidelines |",
        "| euipo-priority-guidelines | EU-PRIO-001 | eutmr-consolidated (제34조 제1항) |"
      ].join("\n")
    );

    expect(register.index.get("euipo-priority-guidelines")).toContain("https://example.org/guidelines");
    expect(register.substitutions).toHaveLength(1);
    expect(register.substitutions[0].claimIds).toEqual(["EU-PRIO-001"]);
  });

  it("취소선을 두른 sourceId 셀은 등록으로 치지 않는다", () => {
    const register = parseSourceRegister(
      "| ~~euipo-fees~~ | ~~EUIPO — Fees~~ | **2026-09-13 폐기** |"
    );

    expect([...register.index.keys()]).toEqual([]);
    expect(register.substitutions).toEqual([]);
  });

  it("사유만 적은 행은 claim을 지정하지 않는다", () => {
    const register = parseSourceRegister(
      [
        "| 옛 sourceId | 사유 |",
        "|---|---|",
        "| gobmx-impi88 | gob.mx 포털 개편으로 네임스페이스 소멸. |"
      ].join("\n")
    );

    expect(register.substitutions[0].claimIds).toEqual([]);
    expect(register.substitutions[0].replacementIds).toEqual([]);
  });
});
