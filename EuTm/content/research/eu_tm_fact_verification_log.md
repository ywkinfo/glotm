# EuTm Fact Verification Log

이번 스프린트에서는 새 범위를 넓히지 않고, 이미 검증된 사실이 어느 장에 어떻게 반영되었는지와 어떤 controlled gap이 남는지를 명확히 정리한다.

| Item | Why it matters | Primary source target | Chapter ref | Status | Notes |
|------|----------------|-----------------------|-------------|--------|-------|
| EUTM vs national filing split | 권리 구조 설계의 기준선 | EUIPO trade mark guidance, GOV.UK IP in the EU and EEA | Ch2 | Verified | EUTM는 EU 전체 단위로 등록·양도·취소되며, national filing은 국가별 직접 출원 구조로 본문 반영 완료 |
| EU-SEL-001 clearance variance memo | EUTM vs mixed structure 판단을 더 정확히 자르기 위한 기준선 | EUIPO Availability/TMview guidance, GOV.UK EU trade mark protection and comparable UK trade marks | Ch2 | Verified | TMview는 EU national office와 EUIPO 기록을 함께 보여 주며, UK는 EUTM 자동 커버 범위가 아니므로, 충돌 가능성이 core launch 국가나 UK에 집중되면 right-selection memo를 EU-wide와 local-risk로 분리하는 운영 기준을 본문에 반영 |
| Opposition timeline | 이의 대응 운영 달력 | EUIPO after applying guidance | Ch7 | Verified | 공고 후 3-month opposition period를 본문 반영했고, validate lane에서는 일정 관리 기준으로 유지 |
| EU-EVD-001 owner-user evidence memo | distributor / marketplace seller 사용을 genuine use 설명으로 묶는 기준선 | EUIPO cancellation guidance and genuine use materials | Ch8 | Verified | 제3자 판매 흔적도 owner, actual user, linkage, evidence location을 같이 적으면 evidence pack으로 설명 가능하도록 Ch8 triage와 linkage memo에 반영 |
| Proof of use window | 취소/방어 리스크 | EUIPO cancellation guidance and genuine use materials | Ch8 | Verified | 등록 후 continuous 5-year non-use revocation risk, 부분 사용 시 sub-category limitation 메모 반영 |
| Renewal timing and grace period | 갱신 운영 핵심 | EUIPO fees/payments and renewal guidance | Ch8 | Verified | EUTM는 10년 단위 갱신, 만료 전 6개월 basic renewal period와 추가 수수료가 붙는 6개월 grace period를 운영 문구와 캘린더 표에 반영 |
| Customs application scope | 물류 통제 설계 | European Commission customs "Defend your Rights" guidance | Ch12 | Verified | AFA 필요, national vs Union AFA, IPEP/COPIS 운영 구조를 본문 반영 |
| UK parallel track handling | 권역 범위 확정 | GOV.UK Brexit/IP in EU guidance, EUIPO Brexit Q&A | Ch2, Ch8 | Verified | EUTM와 EU designation은 UK를 자동 커버하지 않으며, 권리 선택과 갱신 캘린더에서 UK 병행 여부를 별도 표기로 관리 |
| EU-UK-001 launch split calendar | EU와 UK launch timing이 다를 때 renewal/evidence 설명을 흔들리지 않게 만드는 기준선 | GOV.UK EU trade mark protection guidance, EUIPO Brexit Q&A | Ch2, Ch8 | Verified | UK를 병행하더라도 launch timing, actual user, goods/services가 어긋나면 별도 rights calendar row와 evidence owner 메모를 두는 운영 기준을 Ch2/Ch8에 반영 |
| Madrid linkage | 국제출원 연결 전략 | WIPO Madrid official pages | Ch2 | Verified | Madrid 사용에는 national or regional application/registration 전제가 있다는 점 반영 |
| Exhaustion and parallel trade | 병행수입 판단 기준 | European Commission notice on exhaustion of IP rights | Ch10 | Verified | EU 단일시장 내 lawful placing on market와 third-country/UK 유통을 분리해서 본문 반영 |
| Absolute grounds language risk | 설명적·영어 의미 리스크 | EUIPO Brexit Q&A and trade mark guidelines references | Ch6 | Verified | 영어 의미는 여전히 EU relevant public 관점에서 문제될 수 있다는 점을 본문 반영 |

## Controlled gap

- 회원국별 세부 절차 차이와 개별국 집행 디테일은 이번 스프린트에서 전면 확장하지 않는다.
- 본문은 EU 공통 프레임과 UK 병행 판단까지를 기준선으로 유지하고, 개별국 차이는 메모 수준으로 통제한다.

## Next-round shortlist

- none

이번 라운드에서는 회원국별 차이를 새 `Pending`으로 넓히지 않는다.
