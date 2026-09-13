# LatTm Source Register

이 문서는 `LatTm` 공개본이 근거로 삼는 1차 출처를 sourceId 단위로 고정한다.
`content/research/claim-map.json`의 `sourceIds`는 아래 표의 키로 공식 URL에 연결되고,
회귀 가드 [`scripts/research-audit/claim-source-register.test.ts`](../../../scripts/research-audit/claim-source-register.test.ts)가
"claim이 참조하는 sourceId가 이 표에 실재하고 URL까지 추적되는가"를 강제한다.

기준일: 2026-09-12 (아래 출처를 실제로 열어 대조한 날 — 직전 기준일은 2026-03-27)

> **2026-09-12 재대조 회차에서 이 표가 처음으로 실사됐다.** 2026-09-12 도입 회차의 기록("어떤
> 출처도 다시 열지 못했다 — egress가 전부 CONNECT 403")은 같은 날 오전까지의 상태였고, 같은 날
> 재측정에서 `wipo.int`·`gob.mx`·`impi.gob.mx`·`inapi.cl`·`portaltramites.inpi.gob.ar`가 다시
> 열렸다(`sic.gov.co`만 여전히 연결 실패). owner 데스크톱 내장 브라우저 경로도 함께 열려 두 경로로
> 대조했다.
>
> **그 실사가 이 표의 결함 세 개를 드러냈다.** 등록만 해 두고 열어 본 적이 없으면 URL이 죽어도
> 아무도 모른다는 것이 결함의 공통 원인이다:
>
> | sourceId | 등록돼 있던 상태 | 이번 회차 조치 |
> |---|---|---|
> | `inapi-chile-ley-21355` | **404** — 사이트 개편으로 `/noticias/...` 경로가 사라짐 | 살아 있는 같은 기사(`/sala-de-prensa/detalle-noticia/...`)로 교체 |
> | `inpi-argentina-renewals` | **로그인 벽** — 거래용 포털 화면이라 claim을 검증할 수 없는 면이었다 | INPI 공개 안내면(`argentina.gob.ar`)으로 교체하고 id를 `inpi-argentina-ddjj-medio-termino`로 바꿈 |
> | `sic-colombia-scope` | **연결 실패**(두 경로 모두) | 등록은 유지하되 대체 1차 출처로 안데스공동체 `can-decision-486`을 추가해 claim을 검증 |
>
> 등록은 실사가 아니고, 구조화도 재검증이 아니다 — 그리고 **살아 있는지조차 실사 전에는 모른다**.
>
> **2026-09-12 데스크톱 세션 독립 재측정.** 위 세 건을 다른 세션·다른 채널에서 다시 재 봤고 진단이 그대로
> 확인됐다: 구 INAPI URL(`/noticias/ley-21355-...`)은 **404**(1,251바이트 오류면), 교체한 INAPI 기사면과
> INPI 아르헨티나 공개 안내면은 **둘 다 200**(각 46KB·48KB). `sic.gov.co`는 이 세션에서도 node URL과
> 루트 모두 연결 실패라 **채널 세 개가 전부 실패**했다 — 페이지가 죽은 것인지 망 차단인지는 여전히
> 구분되지 않으므로 등록을 유지한 판단이 맞다. `can-decision-486` 편찬본(1.6MB)은 열렸고 **제154조를
> 축자 대조**했다(편찬본 55면): 「El derecho al uso exclusivo de una marca se adquirirá por el registro de
> la misma ante la respectiva oficina nacional competente」 — `LA-ANDEAN-001`의 핵심(공동체 단일 등록
> 부재, 국가별 관청 등록으로 권리 취득)이 규범 원문과 일치한다.

> **왜 이 파일이 필요한가.** `npm run audit:facts`는 HIGH risk claim에 sourceId가 **몇 개 있는지**만 센다
> ([`scripts/research-audit/audit-facts.ts`](../../../scripts/research-audit/audit-facts.ts)). 실재하지 않는
> sourceId를 써도 `factIntegrity=100`이 나오므로, register가 없으면 claim-map은 스스로를 증명하지 못한다.

## Claim-map sourceId 매핑

| sourceId | 공식 출처 | URL |
|---|---|---|
| wipo-madrid-members | WIPO Madrid System 공식 회원국 목록 | https://www.wipo.int/en/web/madrid-system/members |
| sic-colombia-scope | SIC(콜롬비아 산업통상감독원) — 콜롬비아 등록의 효력 범위와 회원국별 별도 등록 필요 안내 **(2026-09-12 두 경로 모두 연결 실패 — 다음 회차 재시도 대상)** | https://www.sic.gov.co/node/79 |
| impi-use-declaration-notice | IMPI 공지 — 상표·상업광고·상호 사용선언의 전자 제출 안내 | https://www.gob.mx/impi/prensa/el-impi-facilita-la-presentacion-de-la-declaracion-de-uso-de-marcas-avisos-y-nombres-comerciales-por-medio-de-sus-servicios-electronicos-279218?idiom=es |
| impi-maintenance-seminar | IMPI 세미나 자료 「Vigencia y conservación de derechos — signos distintivos」 — 등록일 3주년 후 3개월 창 | https://www.impi.gob.mx/cloud/Seminario_en_linea_Ley_Federal_de_Proteccion_a_la_/D%C3%ADa%2002%20-%205%20de%20octubre/04%20Vigencia%20y%20conservaci%C3%B3n%20derechos%20signos%20distintivos.pdf |
| inpi-argentina-ddjj-medio-termino | INPI Argentina 공개 안내 — 중간 사용선언(DJUM) 제출 절차·지연 효과·갱신 연동 | https://www.argentina.gob.ar/servicio/presentar-la-declaracion-jurada-de-uso-de-medio-termino-de-una-marca |
| inapi-chile-ley-21355 | INAPI 기사 — 법률 제21.355호 2022-05-09 시행(불사용 취소 개념 도입) | https://www.inapi.cl/sala-de-prensa/detalle-noticia/entra-en-vigor-ley-que-moderniza-el-sistema-de-propiedad-industrial-en-chile |
| can-decision-486 | 안데스공동체 사무국 — 「Decisiones Andinas en Propiedad Intelectual(텍스트 편찬본)」 Decisión 486 제154조 | https://www.comunidadandina.org/StaticFiles/201761102019%20en%20Propiedad%20Intelectual.pdf |

## 갱신 규칙

- `lastVerified`는 **그 출처를 실제로 연 회차의 날짜**만 적는다. 이 표에 URL을 추가하는 것,
  sourceId를 새로 만드는 것, 문서를 고쳐 쓰는 것은 어느 것도 재검증이 아니다.
- 출처가 열리지 않은 회차는 날짜를 옮기지 않고 그 사실을 기록에 남긴다
  (`docs/briefs-discovery.md`의 "등록은 실사가 아니다"와 같은 규칙이다).
- **등록 URL이 죽었으면 claim이 아니라 이 표를 먼저 고친다.** 2026-09-12 회차에서 세 건이 그랬다.
  교체할 때는 ⓐ 같은 기관의 살아 있는 면인지, ⓑ 그 면이 claim의 값을 실제로 말하는지를 함께 본다 —
  기관만 같고 값을 말하지 않는 면으로 갈아 끼우면 `audit:facts`의 sourceId 카운트만 채우고
  검증은 비게 된다. 거래용·로그인 포털은 이 조건을 구조적으로 만족하지 못하므로 1차 출처로 쓰지 않는다.
