# MexTm Fact Verification Log

멕시코 상표 실무 본문에 반영하기 전, 변동성이 높은 사실을 확인하는 검증 로그입니다.

## 운영 원칙

- 본문보다 이 로그를 먼저 갱신합니다.
- 각 사실은 `Pending -> Verified -> Body-ready` 상태를 순서대로 통과합니다.
- 공식 수수료, 기한, 시스템명, 절차명은 IMPI·gob.mx·ANAM·WIPO 공식 자료를 우선합니다.
- 금액이나 기한이 포털/결제 단계에서 바뀔 수 있는 항목은 본문에 단정적으로 적지 않고 "최신 공식 안내 기준"으로 표현합니다.

## Verification Queue

| claim_id | category | chapter_ref | claim_text | jurisdiction | source_tier | official_source | evidence_excerpt | captured_at | last_verified | status | reviewer | notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MX-FEE-001 | fee | Ch4, Ch5, Ch7, Ch13, Appendix | IMPI 공식 fee 체계는 출원, 갱신, 사용 선언을 서로 다른 절차로 나누고, 직접출원은 `IMPI88`, 갱신은 `IMPI3170`, 사용 선언은 `IMPI-00-002`와 관련 수수료(art. 14d) 기준으로 관리한다 | IMPI | Tier 1 | https://www.gob.mx/tramites/ficha/solicitud-de-registro-de-marca-ante-el-impi/IMPI88 ; https://www.gob.mx/tramites/ficha/renovacion-de-signos-distintivos-marca-aviso-comercial-nombre-comercial/IMPI3170 ; https://pase.impi.gob.mx/Faqs/PreguntasFrecuentes.pdf | IMPI 직접출원과 갱신은 별도 trámite로 안내되고, PASE FAQ는 사용 선언·갱신에 `IMPI-00-002`와 art. 14c/14d payment를 연결한다 | 2026-04-01 | 2026-04-01 | Body-ready | Codex | 제4장 기한·비용 handoff 표, 14일 action board, 부록 캘린더/체크리스트에 반영 완료. 개별 금액보다 절차 분리와 최신 공식 안내 재확인 원칙 유지 |
| MX-DL-001 | deadline | Ch4, Ch6, Ch7, Ch13, Appendix | 공개본에서 고정 가능한 핵심 기한은 `공고 후 1개월 opposition`, `2018-08-10 이후 등록은 grant 후 3년+3개월 내 declaration of use`, `등록 존속 10년`이다 | IMPI/WIPO | Tier 1/Tier 3 | https://www.impi.gob.mx/cloud/AON/Materiales%20IMPI%20PDF/Triptico%20Sistema%20de%20Oposicio%CC%81n.pdf ; https://pase.impi.gob.mx/Faqs/PreguntasFrecuentes.pdf ; https://www.gob.mx/tramites/ficha/renovacion-de-signos-distintivos-marca-aviso-comercial-nombre-comercial/IMPI3170 ; https://www.wipo.int/documents/d/madrid-system/information-notices-en-2024-madrid_2024_32_e.pdf | IMPI opposition material은 publication in Gaceta 후 1개월 opposition 구조를 설명하고, PASE FAQ와 WIPO notice는 2018-08-10 이후 등록 건의 3년+3개월 declaration of use를 안내한다. 갱신 안내는 10-year structure를 다시 확인한다 | 2026-04-01 | 2026-04-01 | Body-ready | Codex | 제4장 기한·비용 handoff 표와 14일 action board, 부록 체크리스트에 반영 완료. office action 답변기한·연장 규칙은 계속 보류 |
| MX-NORM-001 | terminology | Ch1, Ch3, Ch4, Ch5, Appendix | 공식 시스템명은 `Tu cuenta PASE`, `Marca en Línea`, `MARCia`, `ClasNiza`, `MARCANET`, `SIGA/Gaceta` 축으로 통일한다 | IMPI | Tier 1 | https://www.gob.mx/impi/acciones-y-programas/preguntas-frecuentes-tu-cuenta-pase ; https://www.gob.mx/cms/uploads/attachment/file/826944/23_mayo_23_TU_CUENTA_PASE.pdf ; https://transparencia.impi.gob.mx/Paginas/Transparencia-Focalizada.aspx | gob.mx IMPI PASE page와 안내 PDF는 `Tu cuenta PASE` 안에서 `Marca en Línea`, `MARCia`, `Clasniza` 서비스를 함께 소개하고, transparency page는 `MARCANET`을 외부 조회 서비스로 설명한다 | 2026-04-01 | 2026-04-01 | Body-ready | Codex | 제1장 공식 시스템명 표준안, IMPI 운영 구조 control sheet, 제4장 buyer-entry 경로 선택표에 반영 완료. 첫 등장 시 스페인어 병기 유지 |
| MX-ENF-001 | enforcement | Ch9, Ch10, Ch11, Ch13, Appendix | 멕시코의 행정 집행은 IMPI의 `declaraciones administrativas`와 `medidas provisionales`를 중심으로 돌고, 국경 단계에서는 ANAM 문서와 pedimento/annex 흐름이 실무 증거 축이 된다 | IMPI/ANAM/WIPO Lex | Tier 1 | https://www.wipo.int/wipolex/en/text/577613 ; https://anam.gob.mx/copias-certificadas-de-pedimento/ ; https://anam.gob.mx/derechos-productos-y-aprovechamientos/ | LFPPI는 IMPI의 행정 선언과 임시조치, 그리고 import/export/transit goods의 자유로운 유통 정지 권한을 규정한다. ANAM은 pedimento와 anexos의 certified copies 절차 및 관련 DPA payment 구조를 공개한다 | 2026-04-01 | 2026-04-01 | Body-ready | Codex | 제11장 통제 포트폴리오 보드, 권리 조합 decision table, 제13장 사례 회수 표와 evidence bundle 표에서 IMPI 절차와 ANAM 문서 흐름 연결을 반영 완료 |

## Sprint handoff

Sprint 1에서 writer가 바로 썼던 핵심 handoff는 아래 네 장이다.

| chapter_ref | 우선 연결할 claim_id | handoff 메모 |
| --- | --- | --- |
| Ch1 | MX-NORM-001 | IMPI 시스템명 표준안과 buyer-entry control sheet를 같이 유지 |
| Ch4 | MX-DL-001, MX-FEE-001 | 경로 선택 직후 기한·비용 handoff 표와 mixed structure 메모 연결 |
| Ch11 | MX-ENF-001 | 자산 통제 포트폴리오와 asset recovery pack, digital asset lockdown을 같이 설명 |
| Ch13 | MX-ENF-001 | 사례 회수 표와 incident postmortem을 control sheet 보강으로 연결 |

## Sprint 2 handoff

이번 스프린트에서 writer가 바로 쓰는 핵심 handoff는 아래 세 장이다.

| chapter_ref | 우선 연결할 claim_id | handoff 메모 |
| --- | --- | --- |
| Ch5 | MX-NORM-001, MX-FEE-001 | `Tu cuenta PASE` / `Marca en Línea` / `ClasNiza` / `MARCia` / `MARCANET` / `SIGA/Gaceta` 용어를 filing packet 관점에서 고정하고, `IMPI88`와 후속 비용 owner를 분리해 적는다 |
| Ch7 | MX-DL-001, MX-FEE-001 | `2018-08-10` 이후 등록분의 declaration of use와 10년 갱신 구조를 하나의 유지관리 캘린더로 연결하되, declaration/renewal owner는 별도 행으로 남긴다 |
| Ch10 | MX-ENF-001 | IMPI `declaraciones administrativas`·`medidas provisionales`와 ANAM `pedimento/annex` 흐름을 one-pack evidence board로 묶고, first-48-hours escalation memo까지 같이 둔다 |
