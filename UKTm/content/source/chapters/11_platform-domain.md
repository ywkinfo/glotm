# 플랫폼, 도메인, 온라인 침해 대응

온라인 침해는 한 채널에서만 끝나지 않는다. 영국에서는 marketplace listing, SNS 광고, reseller 사이트, .uk 도메인이 동시에 연결되는 경우가 많기 때문에 `채널별 따로 대응`보다 `사건 단위 묶음 대응`이 중요하다.

특히 .uk 도메인 문제는 Nominet의 Domain Disputes Resolution Service를 활용할 수 있으므로, 플랫폼 신고와 도메인 분쟁을 한 사건으로 볼지 분리할지 초기에 정해야 한다.

## online incident quick board

UKTm의 online 장은 모든 플랫폼별 절차를 깊게 설명하기보다, 사건을 어떤 row로 먼저 열지 보여 주는 편이 early track에 더 맞다.

| 먼저 적을 질문 | platform row 쪽 신호 | domain row 쪽 신호 | 다음 handoff |
| --- | --- | --- | --- |
| 문제의 핵심이 listing인가 도메인인가 | listing 삭제가 먼저 중요 | .uk 주소 자체를 막아야 함 | incident packet |
| seller network가 여러 채널에 퍼졌는가 | platform 묶음 대응 필요 | 단일 도메인 중심 | 반복 seller memo |
| 영국 채널만의 confusion이 큰가 | UK platform proof 우선 | DRS 또는 경고장 우선 | enforcement row |
| 같은 사건을 EuTm과 묶어 볼 것인가 | EU/UK 병행 note 필요 | UK 단독 note면 충분 | 제10장 disputes |

## 채널별 대응 표

| 채널 | 첫 대응 | 추가 escalation |
| --- | --- | --- |
| Marketplace | 플랫폼 신고 패킷 제출 | 반복 seller면 IPEC/세관 연계 검토 |
| SNS / 광고 | 광고 ID·계정 정보 확보 후 신고 | landing page 운영자와 도메인 대응 병행 |
| 독립몰 | hosting/contact 정보 확보 | 경고장 또는 결제/호스팅 통지 |
| .uk 도메인 | Nominet DRS 가능성 검토 | 긴급성·복잡도에 따라 법원 병행 |

## 공통 패킷을 먼저 만든다

플랫폼별 양식은 달라도 기본 자료는 거의 같다. 등록번호, 권리자, 침해 URL, genuine vs infringing 비교, 발견일, 원하는 구제 수준을 먼저 표준화하면 대응 속도가 올라간다.

실무 패킷 기본형은 `Appendix C`에 정리해 두면 채널별 대응자가 바뀌어도 품질이 흔들리지 않는다.

## Nominet DRS를 어디에 넣을지 정한다

`.uk` 도메인 문제는 단순 host takedown과 달리 registry 수준의 분쟁 경로를 검토할 수 있다. Nominet DRS를 바로 쓸지, 먼저 경고장과 협상을 할지는 사건의 긴급도와 confusion strength에 따라 달라진다.

| 질문 | DRS 쪽이 더 맞는 경우 | 다른 채널이 더 빠른 경우 |
| --- | --- | --- |
| 문제의 핵심이 도메인 자체인가 | Yes | No |
| seller network가 여러 플랫폼으로 퍼졌는가 | No | Yes |
| 빠른 listing 삭제가 더 중요한가 | No | Yes |
| 장기적으로 .uk 주소 사용 자체를 막아야 하는가 | Yes | No |

## 반복 seller 추적 기준

온라인 침해는 한 계정이 삭제돼도 다른 계정으로 재등장하는 경우가 많다. 그래서 플랫폼 대응은 단건 신고보다 `운영자 네트워크`를 기록하는 방향으로 설계해야 재발 대응이 빨라진다.

| 추적 항목 | 왜 필요한가 |
| --- | --- |
| seller ID / account handle | 같은 운영자의 재등장 식별 |
| 결제·연락처 단서 | 다른 계정과의 연결 확인 |
| 사용 표장 패턴 | 어떤 mark 조합을 반복적으로 쓰는지 파악 |
| 도메인 / 랜딩 URL | 플랫폼과 독립몰 사건 연결 |

## 온라인 침해 체크리스트

- 동일 seller / 동일 운영자가 다른 계정과 도메인으로 이어지는지 추적하는가
- 플랫폼 신고 패킷과 도메인 분쟁 자료를 같은 사건 번호로 관리하는가
- `.uk` 사건에서 Nominet DRS 검토 여부를 기록하는가
- 반복 침해 seller의 이전 신고 이력을 남기는가

## first 48 hours online memo

| 시간대 | 바로 할 일 | 멈춰서 확인할 일 |
| --- | --- | --- |
| 0~4시간 | listing URL, seller ID, 도메인, 캡처일 확보 | platform row와 domain row를 섞어 적고 있지 않은가 |
| 4~24시간 | incident packet, previous seller history, desired remedy 정리 | DRS가 맞는지 takedown이 더 빠른지 |
| 24~48시간 | 반복 seller / linked domain 여부와 enforcement escalation 결정 | 같은 사건을 UK 단독으로 볼지 EU/UK 병행으로 볼지 |

이 정도만 있어도 UKTm은 draft 공개본 단계에서 "어디서부터 사건을 열 것인가"를 빠르게 다시 찾는 reader utility를 충분히 제공한다.
