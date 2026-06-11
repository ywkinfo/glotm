# EuTm Mature QA Checklist

이 문서는 `EuTm`을 `growth / mature` tier로 승급하기 위한 full QA 증빙이다.

## 1. Coverage Scope
- [x] 15 chapters (부록 포함)
- [x] 핵심 4장(Ch3·6·10·14) 심화 + 부록 신설 (판단표·체크리스트·매트릭스 반영)
- [x] EU 공통 프레임 유지
- [x] UK 병행 판단(calendar/evidence) 정합성 확인

## 2. Source Reliability (1차 출처 재대조)
- [x] EUIPO / WIPO / GOV.UK / UKIPO 1차 출처 재검증 (claim-map 10건; UK fee £205/£245·우선권 6개월·comparable mark·Brexit 2021 날짜를 2026-06-10 정정 + source-register URL 연결)
- [x] fact-freshness: monthly-review 기준 factsReviewedOn 적용

## 3. Verification Method
- [x] source register와 claim-map 대조
- [x] `qa-content.ts` (0 error, 15 chapters)
- [x] fact verification log (integrity 100)

## 4. Known Limitations
- [x] 개별 회원국별 deep-dive(법원 절차, 수수료, 서류 디테일)는 controlled gap으로 유지
- [x] 15장 전환 후 검색 엔트리 회귀 가드 수치 보존 (actual: 260 entries)

## 5. Reader/Search Smoke
- [x] /europe reader 홈/챕터/목차/검색 flow 안정성 확인 (e2e 스모크 통과)
- [x] appendix 랜딩 확인
