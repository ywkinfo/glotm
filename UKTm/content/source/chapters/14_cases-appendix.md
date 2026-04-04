# 사례, 체크리스트, 실행 부록

이 마지막 장의 목적은 법리를 더 추가하는 것이 아니라, 앞선 13개 장을 실제 업무 흐름으로 바꾸는 것이다. 영국 상표 운영은 사건이 생길 때마다 처음부터 다시 생각하면 느려지므로, 반복 가능한 시나리오와 즉시 복사 가능한 부록 링크가 필요하다.

## 대표 시나리오 1: 런치 직전 충돌 발견

검색 막판에 red conflict가 발견되면, 24시간 안에 `표장 유지`, `명세 축소`, `표장 교체`, `출시 순서 변경` 중 어디까지 열어둘지 정해야 한다. 이때 Ch02 검색 브리프와 Ch03 출원 전략 메모가 즉시 연결돼야 한다.

## 대표 시나리오 2: opposition 예고 수령

TM7A 또는 opposition signal이 오면 가장 먼저 `방어할 핵심 범위`와 `양보 가능한 범위`를 나눈다. cooling-off는 기다리는 시간이 아니라 협상 창이므로, 사업 일정과 fallback mark를 같은 시트에 적어야 한다.

## 대표 시나리오 3: 온라인 침해와 .uk 도메인 동시 발생

seller 삭제만으로 끝나지 않는 사건이라면 플랫폼 패킷과 Nominet DRS 자료를 같은 사건 번호로 묶는다. listing 삭제, 도메인 분쟁, 결제/호스팅 통지가 한 네트워크인지 확인하는 것이 핵심이다.

## 대표 시나리오 4: 4년 차 weak-use mark 발견

갱신은 아직 멀었지만 영국 사용 증거가 약한 mark가 보이면 즉시 evidence vault card를 열어 실사용 구조를 점검한다. 5년 시점 직전에 급히 자료를 모으는 것보다, 4년 차에 drop / narrow / reinforce 판단을 하는 편이 훨씬 싸다.

## 실사용 체크리스트

| 영역 | 점검 질문 |
| --- | --- |
| 출원 전 | owner, actual user, approval line이 정리됐는가 |
| 검색 | RAG와 fallback mark가 정리됐는가 |
| filing | classes와 wording이 실제 사용 계획과 맞는가 |
| opposition | cooling-off 전략 메모가 있는가 |
| use evidence | evidence vault card가 분기 업데이트되는가 |
| enforcement | IPEC / High Court / platform / Nominet route를 구분하는가 |
| customs | HMRC high-risk brand list가 있는가 |
| governance | 월간·분기 리뷰가 살아 있는가 |

## 부록 링크 허브

| 부록 | 용도 |
| --- | --- |
| Appendix A | 검색 브리프 1페이지 초안 |
| Appendix B | evidence vault card |
| Appendix C | 플랫폼 신고 공통 패킷 |
| Appendix D | 기본 RACI 템플릿 |
| Appendix E | Brexit 이후 운영 차이 빠른 확인표 |

## Appendix B: evidence vault card

| 필드 | 적어 둘 내용 |
| --- | --- |
| mark | house mark / product mark |
| goods/services | 실제 사용 중인 핵심 범위 |
| owner / actual user | 권리자, 판매 주체, approval line |
| channel | D2C, retail, distributor, marketplace |
| territory | UK / EU / Global |
| 대표 증거 | 판매 페이지, 패키지, invoice, 광고 |
| source URL or doc id | listing URL, order id, shipment ref |
| file status | 원본 / 제출용 / working memo |
| last checked | 분기 또는 반기 날짜 |
| next action | hold / reinforce / narrow / drop |

## 마감 전 점검표

- 모든 챕터에서 최소 1개 이상의 표 또는 체크리스트를 확인했는가
- Ch06, Ch08, Ch10, Ch13의 핵심 숫자와 포럼 설명이 verification log와 일치하는가
- 부록 5종이 실제 복사 가능한 템플릿 형태인가
- `content:master`, `content:qa`, `content:build`를 다시 돌렸는가

## 2026-04-04 검증 메모

2026-04-04 기준 UKTm 공개본 콘텐츠 검증을 다시 완료했다.

- 검증 기준일: 2026-04-04
- 검증 범위: 제1장~제14장 전체 구조, 핵심 운영 섹션, 검색 색인 밀도
- 검증 방법: 장별 heading 구조 점검, 검색 엔트리 분포 확인, UKIPO 기준 주요 절차 사실 확인, local `content:prepare` 재현
- 이 버전에서 수정된 항목: 없음 (draft 공개본 stability 재확인)
- 다음 권장 검증 시점: 60일 이내 (Brexit 이후 UKIPO 운영 변경 발생 시 즉시)
- 고위험 검증 갭: 0건
- 운영 상태: incubate pilot · smoke QA · structure hold · 2026-04-04 local/root verification refreshed
