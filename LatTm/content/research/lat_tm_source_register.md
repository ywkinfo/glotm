# LatTm Source Register

이 문서는 `LatTm` 공개본이 근거로 삼는 1차 출처를 sourceId 단위로 고정한다.
`content/research/claim-map.json`의 `sourceIds`는 아래 표의 키로 공식 URL에 연결되고,
회귀 가드 [`scripts/research-audit/claim-source-register.test.ts`](../../../scripts/research-audit/claim-source-register.test.ts)가
"claim이 참조하는 sourceId가 이 표에 실재하고 URL까지 추적되는가"를 강제한다.

기준일: 2026-03-27 (아래 출처를 실제로 열어 대조한 날)

> **이 표의 출처는 새로 고른 것이 아니다.** 전부
> [`fact-verification-log.md`](fact-verification-log.md)가 2026-03-27 검증 회차에서 열어 기록한
> URL이며, 이 파일은 그 기록을 sourceId 단위로 구조화하기만 한다. 2026-09-12 도입 회차에서는
> 어떤 출처도 다시 열지 못했다 — 이 환경의 egress 정책이 `wipo.int`·`sic.gov.co`·`gob.mx`·
> `impi.gob.mx`·`inpi.gob.ar`·`inapi.cl`를 전부 CONNECT 403으로 막는다. 그래서 claim-map의
> `lastVerified`는 전부 **2026-03-27에 머문다**. 등록은 실사가 아니고, 구조화도 재검증이 아니다.

> **왜 이 파일이 필요한가.** `npm run audit:facts`는 HIGH risk claim에 sourceId가 **몇 개 있는지**만 센다
> ([`scripts/research-audit/audit-facts.ts`](../../../scripts/research-audit/audit-facts.ts)). 실재하지 않는
> sourceId를 써도 `factIntegrity=100`이 나오므로, register가 없으면 claim-map은 스스로를 증명하지 못한다.

## Claim-map sourceId 매핑

| sourceId | 공식 출처 | URL |
|---|---|---|
| wipo-madrid-members | WIPO Madrid System 공식 회원국 목록 | https://www.wipo.int/en/web/madrid-system/members |
| sic-colombia-scope | SIC(콜롬비아 산업통상감독원) — 콜롬비아 등록의 효력 범위와 회원국별 별도 등록 필요 안내 | https://www.sic.gov.co/node/79 |
| impi-use-declaration-notice | IMPI 공지 — 상표·상업광고·상호 사용선언의 전자 제출 안내 | https://www.gob.mx/impi/prensa/el-impi-facilita-la-presentacion-de-la-declaracion-de-uso-de-marcas-avisos-y-nombres-comerciales-por-medio-de-sus-servicios-electronicos-279218?idiom=es |
| impi-maintenance-seminar | IMPI 세미나 자료 「Vigencia y conservación de derechos — signos distintivos」 — 등록일 3주년 후 3개월 창 | https://www.impi.gob.mx/cloud/Seminario_en_linea_Ley_Federal_de_Proteccion_a_la_/D%C3%ADa%2002%20-%205%20de%20octubre/04%20Vigencia%20y%20conservaci%C3%B3n%20derechos%20signos%20distintivos.pdf |
| inpi-argentina-renewals | INPI Argentina 갱신·선언 포털 — 중간 사용선언과 갱신 연동 | https://portaltramites.inpi.gob.ar/Marcas/Renovaciones |
| inapi-chile-ley-21355 | INAPI 안내 — 법률 제21.355호(2022년 시행) 산업재산권 제도 개정 | https://www.inapi.cl/noticias/ley-21355-moderniza-el-sistema-de-propiedad-industrial-con-enfasis-en-la-reactivacion-economica-y-la-innovacion |

## 갱신 규칙

- `lastVerified`는 **그 출처를 실제로 연 회차의 날짜**만 적는다. 이 표에 URL을 추가하는 것,
  sourceId를 새로 만드는 것, 문서를 고쳐 쓰는 것은 어느 것도 재검증이 아니다.
- 출처가 열리지 않은 회차는 날짜를 옮기지 않고 그 사실을 기록에 남긴다
  (`docs/briefs-discovery.md`의 "등록은 실사가 아니다"와 같은 규칙이다).
