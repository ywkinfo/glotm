# UsaTm Fact Verification Log

이 문서는 `master.md`에 넣기 전 재검증이 필요한 민감 정보를 관리한다.
원칙은 단순하다. 구조는 본문에 먼저 쓰고, 수치와 세부 기한은 이 문서에서 확인한 뒤 승격한다.

기준일: 2026-04-03

| 항목 | 현재 작업 가정 | 검증 상태 | 최종 공개본 반영 규칙 | 1차 출처 |
|---|---|---|---|---|
| USPTO 기본 출원 수수료 | 클래스당 기본 fee가 존재하며 금액은 변동 가능 | 확인 필요 | 본문에는 수치 대신 "클래스별 정부수수료"로 표기하고, 공개 직전 공식 fee page 재확인 | https://www.uspto.gov/trademarks/basics/how-much-does-it-cost |
| 출원 시스템 이름 | 기본 출원 진입점은 `Trademark Center` | 2026-03-28 확인 | 본문에 시스템 이름 사용 가능. 다만 화면 명칭/로그인 흐름은 출판 직전 재확인 | https://www.uspto.gov/trademarks/basics/trademark-process |
| 로그인 요구 | USPTO.gov 계정, 2단계 인증, 신원확인이 요구됨 | 2026-03-28 확인 | 운영 체크리스트에 반영 가능 | https://www.uspto.gov/teas |
| 외국 주소 출원인 대리인 요건 | foreign-domiciled applicant는 U.S.-licensed attorney 필요 | 2026-03-28 확인 | 본문에 반영 가능. 예외 여부는 별도 검토 없이 단정 확장 금지 | https://www.uspto.gov/trademarks/basics/do-i-need-attorney |
| opposition 제기 시점 | Official Gazette 공고 후 제기 가능하며 기한이 짧다 | 2026-03-28 확인 | 본문에는 "공고 직후 짧은 법정 기간"으로 우선 표기, 필요 시 정확 기한 추가 | https://www.uspto.gov/trademarks/ttab/initiating-new-proceeding |
| Statement of Use 제출 구조 | intent-to-use는 notice of allowance 이후 추가 제출이 필요 | 부분 확인 | 본문에는 "후속 사용 입증 단계"로 설명하고 세부 기한은 공개 직전 보강 | https://www.uspto.gov/trademarks/basics/how-much-does-it-cost |
| 유지관리 주기 | 5-6년차, 9-10년차, 이후 10년마다 핵심 제출이 존재 | 2026-03-28 확인 | 본문에 구조 반영 가능. 정확 서류명은 함께 표기 가능 | https://www.uspto.gov/trademarks/maintain/keeping-your-registration-alive |
| Section 15 위치 | 5년 연속 사용 뒤 선택 가능한 별도/결합 제출 | 2026-03-28 확인 | 본문에서는 선택적 강화 수단으로 설명 | https://www.uspto.gov/trademarks/basics/maintaining-registration |
| Post Registration Audit | specimen과 사용 주장 정합성이 audit 리스크를 좌우 | 2026-03-28 확인 | 본문에 반영 가능 | https://www.uspto.gov/trademarks/maintain/post-registration-audit-program |
| CBP e-Recordation 전제 | Principal Register 등록이 있어야 recordation 가능 | 2026-03-28 확인 | 본문에 반영 가능 | https://www.cbp.gov/trade/priority-issues/ipr/protection |
| CBP e-Recordation 수수료 | 국제분류 class당 별도 fee 존재 | 2026-03-28 확인 | 본문에는 수치보다 "class별 수수료"로 우선 표기 | https://www.cbp.gov/trade/priority-issues/ipr/protection |
| TTAB 권한 범위 | TTAB은 등록 여부를 다투며 금지명령/손해배상은 하지 않음 | 2026-03-28 확인 | 본문에 반영 가능 | https://www.uspto.gov/trademarks/trademark-trial-and-appeal-board/about-ttab |
| Assignment Center 명칭 | assignment/recordation 관련 온라인 센터 명칭 확인 필요 | 확인 필요 | 공개 전 현재 시스템명과 제출 경로를 다시 확인 | https://www.uspto.gov/sites/default/files/documents/Assignment-Center-CCC-USPTO-hour-Feb-2026.pdf |
| Letter of Protest 제출 방식 | 전용 전자 제출 흐름과 제한된 증거 범위가 있음 | 부분 확인 | 본문에는 "심사개입형 보조 절차"로 설명하고 상세 제출 규칙은 별도 보강 | https://www.uspto.gov/sites/default/files/LOP.pdf |
| Madrid outbound 경로 | 미국 기초출원/등록을 바탕으로 outbound 신청 가능 | 2026-03-28 확인 | 미국 단독 전략과 구분해 본문에 반영 가능 | https://www.uspto.gov/ip-policy/international-protection/madrid-protocol/outbound-applicants |

## Editorial Rule

- 본문에는 검증 상태가 `확인 필요`인 항목의 정확 숫자, 날짜, 세부 fee를 넣지 않는다.
- `부분 확인` 항목은 구조만 설명하고, 독자 행동을 좌우하는 세부값은 표로 분리하지 않는다.
- 출판 직전에는 이 문서의 `확인 필요`, `부분 확인`만 우선 재검증한다.

## 2026-04-03 refresh note

- local `content:prepare` full pipeline 통과
- `us_tm_accuracy_completeness_review.md` 기준으로 현재 공개본은 verification refresh 완료 판정
- 남은 `확인 필요`, `부분 확인`은 공개 직전 재확인 큐로 유지
