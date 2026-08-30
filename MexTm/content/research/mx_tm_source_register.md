# MexTm Source Register

이 문서는 `MexTm` 공개본이 근거로 삼는 1차 출처를 sourceId 단위로 고정한다.
`content/research/claim-map.json`의 `sourceIds`는 아래 표의 키로 공식 URL에 연결되고,
회귀 가드 [`scripts/research-audit/claim-source-register.test.ts`](../../../scripts/research-audit/claim-source-register.test.ts)가
"claim이 참조하는 sourceId가 이 표에 실재하고 URL까지 추적되는가"를 강제한다.

기준일: 2026-08-30 (전건 본문 개방 확인)

> **왜 이 파일이 필요한가.** `npm run audit:facts`는 HIGH risk claim에 sourceId가 **몇 개 있는지**만 센다
> ([`scripts/research-audit/audit-facts.ts`](../../../scripts/research-audit/audit-facts.ts)). 그래서 2026-08-30 라운드에서
> `gobmx-impi88`·`gobmx-impi3170` 두 출처가 포털 개편으로 통째로 사라진 뒤에도 `factIntegrity=100`이 계속 나왔다.
> 링크가 죽은 것을 게이트가 아니라 사람이 열어봐서 발견했다는 뜻이다.

## Claim-map sourceId 매핑

| sourceId | 공식 출처 | URL |
|---|---|---|
| wipolex-lfppi-2020 | Ley Federal de Protección a la Propiedad Industrial (WIPO Lex, Nueva Ley DOF 01-07-2020) — 제178·221·233·237조 | https://www.wipo.int/wipolex/en/text/577613 |
| impi-formatos-list | IMPI — Formatos para presentar trámites en el IMPI (서식 코드 정본 목록) | https://www.gob.mx/impi/acciones-y-programas/servicios-que-ofrece-el-impi-formatos |
| impi-pase-faq-2026 | IMPI — Preguntas Frecuentes, servicios electrónicos (Tu cuenta PASE) | https://pase.impi.gob.mx/Faqs/PreguntasFrecuentes.pdf |
| impi-opposition-triptico | IMPI — Tríptico Sistema de Oposición | https://www.impi.gob.mx/cloud/AON/Materiales%20IMPI%20PDF/Triptico%20Sistema%20de%20Oposicio%CC%81n.pdf |
| wipo-madrid-2024-32 | WIPO Information Notice No. 32/2024 — 멕시코 지정 국제등록의 사용선언 요건 (2024-12-20) | https://www.wipo.int/documents/d/madrid-system/information-notices-en-2024-madrid_2024_32_e.pdf |
| gobmx-pase-faq | gob.mx/impi — Plataforma de servicios electrónicos (Tu cuenta PASE) 안내 | https://www.gob.mx/impi/acciones-y-programas/preguntas-frecuentes-tu-cuenta-pase |
| gobmx-pase-guide-pdf | IMPI — Tu Cuenta PASE 안내 자료 (2023-05-23) | https://www.gob.mx/cms/uploads/attachment/file/826944/23_mayo_23_TU_CUENTA_PASE.pdf |
| impi-transparencia-focalizada | IMPI — Transparencia Focalizada (MARCANET·Gaceta 정보시스템) | https://transparencia.impi.gob.mx/Paginas/Transparencia-Focalizada.aspx |
| anam-pedimento-copies | ANAM — Copias certificadas de pedimento | https://anam.gob.mx/copias-certificadas-de-pedimento/ |
| anam-dpa-fees | ANAM — Derechos, productos y aprovechamientos | https://anam.gob.mx/derechos-productos-y-aprovechamientos/ |

## 매핑 주의사항

- **`impi-formatos-list`는 두 URL이 헷갈린다.** 위 표의 `gob.mx/impi/acciones-y-programas/servicios-que-ofrece-el-impi-formatos`가 서식 코드 정본이며, 여기에 `IMPI-00-002`(Solicitud de Renovación **y** Declaración de Uso Real y Efectivo de Signos Distintivos)와 `IMPI-00-014`(Declaración de Uso Real y Efectivo de Signos Distintivos)가 한 표 안에 나란히 있다. 반면 `https://www.impi.gob.mx/formatos`는 배너·플라이어 등 홍보 자산 폴더이고 `MARCAS.pdf` 같은 스캔본만 있어 **서식 코드를 확인할 수 없다** — 이쪽을 열고 "코드가 없다"고 결론내지 않는다.
- **`impi-opposition-triptico` URL 인코딩.** `Oposicio%CC%81n`(결합 악센트) 형태를 그대로 써야 열린다. 정규화하면 404다.
- **`impi-opposition-triptico`의 근거법 표기 주의.** 이 리플릿 본문은 근거법을 `Ley de la Propiedad Industrial`(2020 LFPPI 이전 법)로 부른다. 도해의 1개월 구조 자체는 현행 LFPPI 제221조와 일치하므로 값의 근거로는 쓰되, **법령명은 이 리플릿을 따르지 않는다.**
- **`impi-transparencia-focalizada`는 오래된 안내면이다.** 페이지 표기가 `Última actualización: 31 enero 2022`다. 시스템 명칭(MARCANET·Gaceta) 확인용으로만 쓰고 절차·수수료 근거로 쓰지 않는다.
- **`impi-pase-faq-2026` PDF는 텍스트 레이어가 부분적이다.** 67쪽 15MB이고 추출 시 질의응답 줄이 잘린다. 인용할 때 원문 페이지를 함께 확인한다.

## 채널 메모 (2026-08-30 실측)

**`gob.mx` HTML 페이지는 살아 있어도 curl로 열리지 않는다.** 브라우저 User-Agent를 붙여도 `200` + 약 1,900바이트짜리 `Challenge Validation` WAF 응답이 온다. 이 응답은 **죽은 페이지와 살아 있는 페이지에서 똑같이** 나온다 — 실측: 죽은 ficha 2건과 살아 있는 `gobmx-pase-faq`·`impi-formatos-list`가 모두 같은 응답이었다.

- 따라서 **`gob.mx` HTML은 curl을 건너뛰고 바로 인앱 브라우저로 연다.** 삶과 죽음은 브라우저에서만 갈린다(죽은 것은 `https://www.gob.mx/` 루트로 리다이렉트, 산 것은 본문 로드).
- 예외: `gob.mx/cms/uploads/*` 정적 첨부(`gobmx-pase-guide-pdf`)는 curl로 정상 통과한다.
- `wipo.int`·`anam.gob.mx`·`transparencia.impi.gob.mx`·`impi.gob.mx/cloud/*`는 UA를 붙인 curl로 열린다.

## 제거된 출처 (2026-08-30)

| 옛 sourceId | 사유 |
|---|---|
| gobmx-impi88 | gob.mx 포털 개편으로 `/tramites/ficha/*` 네임스페이스 소멸. 브라우저로 열면 포털 루트로 리다이렉트된다. |
| gobmx-impi3170 | 동일 사유. |

두 sourceId는 `claim-map.json`의 `sourceIds`에서 제거했고, `MX-FEE-001`·`MX-DL-001`의 근거는 LFPPI 조문(`wipolex-lfppi-2020`)으로 옮겼다. 경위는 `mx_tm_fact_verification_log.md`의 `2026-08-30 재검증` 절에 있다.

## 미해결 (owner 판단)

- **ficha ID(`IMPI88`·`IMPI3170`) 존속 여부.** `MX-FEE-001` 본문은 gob.mx 트라미테 ficha ID를 여전히 언급한다. 후속 등록부는 CONAMER 「Catálogo Nacional de Regulaciones, Trámites y Servicios」(https://www.catalogonacional.gob.mx/)이나 그 Buscador가 결과를 JS로 채우고 이 채널에서는 호출이 뜨지 않아 확인하지 못했다. claim에서 ficha 축을 유지할지 서식(formato) 축만 남길지 결정이 필요하다 — 서식 축은 `impi-formatos-list`로 이미 뒷받침된다.

## 운영 규칙

- 본문에 수수료·기한·서식 코드·시스템명을 단정해 쓰기 전 이 표에 출처를 추가한다.
- 출처가 없는 문장은 `mx_tm_fact_verification_log.md`에서 `추가검증 필요`로 표시한다.
- URL이 리다이렉트되면 최종 URL로 이 표를 갱신한다. 죽은 URL은 위 `제거된 출처` 표로 옮기고 경위를 fact log에 남긴다.
