# GloTm Harness QA Gate

이 문서는 작업 완료 직전 확인하는 최소 게이트다.
사람이 읽는 런타임 흐름 체크리스트는 [`../docs/phase1-runtime-qa.md`](../docs/phase1-runtime-qa.md)를 계속 기준으로 유지한다.

## Always

- [ ] `npm run test` 통과
- [ ] `npm run build` 통과

메모:

- 루트 `build`는 `prebuild`에서 콘텐츠 생성 스크립트를 함께 실행한다.
- 이 게이트의 명령은 루트 [`package.json`](../package.json)에 실제 존재하는 스크립트만 사용한다.

## If Content Or Pipeline Changed

### LatTm

- [ ] `npm run content:latam` 통과
- [ ] `qa-content` 결과가 error 0
- [ ] warning은 검토하고 기록하되, v1에서는 자동 실패 조건으로 보지 않음
- [ ] `LatTm/content/generated/search-index.json` 엔트리 수가 780 미만으로 줄지 않음
- [ ] `LatTm/content/generated/document-data.json` 챕터 수가 20에서 예상 없이 줄지 않음

### MexTm

- [ ] `npm run content:mexico` 통과
- [ ] `MexTm/content/generated/search-index.json` 엔트리 수가 280 미만으로 줄지 않음
- [ ] `MexTm/content/generated/document-data.json` 챕터 수가 15에서 예상 없이 줄지 않음

판단 규칙:

- 엔트리 수나 챕터 수가 감소하면 원인을 설명하거나 의도된 편집임을 함께 남긴다.
- generated JSON은 손으로 맞추지 말고 원고와 스크립트에서 원인을 찾는다.

## If UI Or Reader Changed

- [ ] Gateway `/`에서 `LatTm` 홈 `/latam`으로 진입 가능
- [ ] `LatTm` 홈에서 챕터 카드 또는 필터로 챕터 진입 가능
- [ ] `LatTm` 챕터에서 outline/hash 이동 정상
- [ ] `LatTm` 검색 결과에서 올바른 챕터/섹션으로 이동
- [ ] `LatTm` continue reading 복귀 정상
- [ ] `LatTm` 이전/다음 내비 정상
- [ ] `/mexico` 홈 렌더링 정상
- [ ] `MexTm` outline, 검색, 이전/다음, reading progress 정상
- [ ] `MexTm` continue reading 복귀 정상

추가 메모:

- 이 항목은 [`../docs/phase1-runtime-qa.md`](../docs/phase1-runtime-qa.md)의 핵심 흐름을 짧게 옮긴 것이다.
- UI 변경 범위가 크면 문서의 상세 체크리스트까지 함께 본다.
