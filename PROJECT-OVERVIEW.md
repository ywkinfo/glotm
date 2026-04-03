# GloTm — Cross-border Trademark Operating Guides

이 문서는 실행 지시서가 아니라, 현재 상태와 방향을 공유하기 위한 전략 브리프다.

## 현재 검증된 상태

| 항목 | 현재 상태 |
|------|-----------|
| Last updated | 2026-04-03 |
| Verified on | 2026-04-03 |
| Current phase | Phase 2 — 포지셔닝, tier governance, Gateway alignment |
| Current focus | `ChaTm` Sprint 1 심화 -> `MexTm` 핵심 장 심화/계획 고정 -> `EuTm` 안정화 -> `Report / Gateway` trust layer 정합화 -> incubate 유지보수 |
| Do not start yet | 신규 국가 추가, pricing/paywall, prerender/SEO 2단계, 새 파이프라인 도입, 의존성 추가 |

### 현재 운영 스냅샷

- 루트 `GloTm`: `npm run build` 통과. `BrowserRouter` 기반 셸에서 Gateway, `LatTm`, `MexTm`, `UsaTm`, `JapTm`, `ChaTm`, `EuTm`, `UKTm`을 함께 연결한다.
- Gateway `/`: portfolio tier와 buyer narrative를 드러내는 루트 랜딩으로 운영한다.
- 현재 포트폴리오는 총 7개 가이드이며, 모두 루트 셸에서 직접 열 수 있다.
- `LatTm`: 20개 챕터, 검색 엔트리 780개. `flagship` tier.
- `MexTm`: 15개 챕터, 검색 엔트리 297개. `growth` tier.
- `ChaTm`: 15개 챕터, 검색 엔트리 202개. `growth` tier.
- `EuTm`: 14개 챕터, 검색 엔트리 206개. `validate` tier.
- `UsaTm`: 14개 챕터, 검색 엔트리 171개. `incubate` tier.
- `JapTm`: 15개 챕터, 검색 엔트리 140개. `incubate` tier.
- `UKTm`: 14개 챕터, 검색 엔트리 93개. `incubate` tier.
- scorecard 기준 메타데이터는 `src/products/registry.ts`와 `src/products/scorecard.ts`에서 함께 관리한다.
- 세부 실행 규칙은 `CODEX-INSTRUCTIONS.md`와 `Harness/` 문서에서 관리한다.

---

## 한 줄 요약

브랜드 관리자와 인하우스 IP 팀이 시장 우선순위, 출원 경로, 유지·집행 판단을 빠르게 정리하도록 돕는 cross-border trademark operating guides 포트폴리오.

---

## 배경

해외 시장에 진출하는 기업이 국가별 상표 실무 정보를 얻으려면 현재 세 가지 선택지뿐이다.

| 방법 | 문제 |
|------|------|
| 인터넷 검색 | 산발적인 로펌 블로그, 신뢰 불가 |
| ChatGPT 질의 | 정확도 검증 불가 |
| 로펌 유료 문의 | 느리고 비용 높음 |

변호사 대상 프리미엄 가이드(INTA, Chambers)는 존재하지만 브랜드 관리자용 실무 자료는 드물다. GloTm은 이 빈자리를 “법률 정보 사이트”가 아니라 “운영 판단용 guide portfolio”로 채우는 것을 목표로 한다.

GloTm의 사업 범위는 특정 지역이 아니라 글로벌 시장 전체다. 다만 현재 90일 계획의 원칙은 신규 시장 확장보다 기존 포트폴리오의 depth, verification, QA를 먼저 정렬하는 것이다.

---

## 타겟 사용자

- 해외 진출 준비 또는 운영 중인 한국/아시아 소비재 기업의 브랜드 관리자
- 기업 내 인하우스 IP 담당자
- 현재 buyer entry 기준의 핵심 사용자: 라틴아메리카/멕시코/중국 진출 판단이 급한 팀
- 핵심 니즈: 로펌 연결 전 내부 판단을 위한 구조화된 운영 정보

---

## 콘텐츠 구성

전체 제품 범위는 국가별·권역별 가이드를 축적하는 cross-border trademark operating guides다.

현재 개발된 포트폴리오는 권역형 2개(`LatTm`, `EuTm`)와 단일국가형 5개(`MexTm`, `UsaTm`, `JapTm`, `ChaTm`, `UKTm`)로 구성되며, 현재는 7개 모두 루트 셸에서 직접 읽을 수 있다. 다만 투자 강도와 승격 기준은 tier별로 다르게 관리한다.

### 현재 개발된 포트폴리오

| 가이드 | 유형 | 전략 tier | lifecycle | 챕터 수 | 검색 엔트리 | 현재 의미 |
|------|------|------|------|------|------|------|
| `LatTm` | 권역형 | flagship | mature | 20 | 780 | 기준 프레임 보호 |
| `MexTm` | 단일국가 | growth | mature | 15 | 297 | buyer entry 핵심 트랙 |
| `ChaTm` | 단일국가 | growth | beta | 15 | 202 | 중국 실무 밀도 강화 트랙 |
| `EuTm` | 권역형 | validate | beta | 14 | 206 | 권역 검증·정합성 안정화 |
| `UsaTm` | 단일국가 | incubate | beta | 14 | 171 | lighter track |
| `JapTm` | 단일국가 | incubate | beta | 15 | 140 | lighter track |
| `UKTm` | 단일국가 | incubate | pilot | 14 | 93 | lighter track · draft 공개본 |

### 승격 기준

- `Pilot`: 챕터 12+, search density 5+, verification freshness 120일 이하, root smoke QA 통과
- `Beta`: 챕터 14+, search density 9+, verification freshness 90일 이하, workspace pipeline + root standard verification 통과
- `Mature`: 챕터 15+, search density 12+, verification freshness 60일 이하, full pipeline + reader/search QA 통과, unresolved high-risk verification gap 0건

현재 lifecycle status는 일단 유지하되, 이후 승격은 월 1회 scorecard 리뷰에서만 반영한다. 초기 정렬 기간에는 grandfathered status가 남을 수 있으며 자동 강등은 하지 않는다.

### 현재 집중 우선순위

- `ChaTm`: Sprint 1 우선 6장 강화로 growth 실질화
- `MexTm`: growth 대표 트랙. buyer entry 가치와 실무 밀도 강화, 보강 계획과 taskboard를 먼저 고정
- `EuTm`: 범위 확대 없이 fact verification와 문서 정합성 안정화
- `Report`·`Gateway`: guide 본문 보강 뒤 교차 관할권 trust layer와 진입 신뢰 보강
- `JapTm`·`UKTm`·`UsaTm`: JapTm beta 유지, UKTm pilot 유지, UsaTm standard QA 유지
- `LatTm`: flagship 보호. freshness, search density, reader QA 우선

### 현재 실행 순서

1. `ChaTm`
2. `MexTm`
3. `EuTm`
4. `Report` / `Gateway`
5. `JapTm`
6. `UKTm`
7. `UsaTm`

이 순서는 `buyer impact + 현재 포트폴리오 전략 + 실제 콘텐츠 밀도 부족`을 함께 반영한 운영 우선순위다. 가장 얇은 가이드부터 무조건 채우는 방식이 아니라, growth/validate 레인의 체감 가치와 buyer entry 효과를 먼저 끌어올리는 데 목적이 있다.

### LatTm (중남미 상표 보호 운영 가이드) — 글로벌 확장을 위한 1차 기준 파일럿, 콘텐츠/앱 고도화 진행 중

`LatTm`은 현재 GloTm의 기준 제품이다. 20개 챕터로 구성된 중남미 19개국 상표 출원·유지·집행 실무 가이드를 제공하며, 현재 우선순위는 배포보다 로컬 웹앱 완성도와 읽기 경험 안정화에 있다.

| 영역 | 챕터 |
|------|------|
| 전략 | 제1장. 전략 프레임 |
| Pre-Filing | 제2장. 포트폴리오 설계 / 제3장. 검색·충돌 분석 |
| Filing | 제4장. 출원 경로 선택 / 제5장. 출원서 작성·제출 |
| 심사·이의 | 제6장. Examination·Opposition 대응 |
| 등록 후 | 제7장. Post-Registration 유지관리 |
| 사용·증거 | 제8장. 사용 증거 관리 |
| 계약 | 제9장. 유통·라이선스·프랜차이즈 |
| 분쟁 | 제10장. 모니터링 / 제11장. Enforcement / 제12장. 국경·통관 |
| 온라인 | 제13장. 플랫폼 대응 |
| 리스크 | 제14장. 리스크·분쟁 통제 |
| 관리 | 제15장. 포트폴리오·내부 통제 (RACI) |
| 국가별 | 제16장. 핵심 8개국 실행 가이드 |
| 산업별 | 제17장. 산업별 전략 |
| 사례 | 제18장. 실패 사례 분석 (한국기업 중심) |
| 운영 | 제19장. 운영 시스템 구축 가이드 |
| 부록 | 템플릿·점검표 모음 |

### MexTm (멕시코 상표 실무 가이드) — 파일럿 2단계 핵심 트랙, core reader parity 반영 완료 / 워크스페이스 파이프라인 구축 완료

`MexTm`은 전략적으로 중요한 멕시코 심화 가이드다. 현재 `npm run build`는 통과하며 `document-data.json` 기준 15개 챕터와 297개 검색 엔트리를 생성한다. 리더 측면에서는 continue reading, outline, reading progress, 이전/다음 이동, 섹션 추적, action bar까지 루트 셸 기준 core reader parity를 맞췄다. 워크스페이스 자체에는 `manifest.json`, `build-master.ts`, `qa-content.ts`가 갖춰져 있으며, 루트 `content:prepare`에서도 `build-master -> qa-content -> build-content` 전체 흐름을 사용한다.

### UsaTm (미국 상표 실무 가이드) — live shell에 연결된 단일국가 가이드

`UsaTm`은 USPTO 중심의 미국 연방 상표 실무를 다루는 단일국가 가이드다. 현재 `document-data.json` 기준 14개 챕터와 171개 검색 엔트리를 생성하며, 루트 `GloTm` 셸 `/usa` 경로에 연결된 상태다. 이번 verification refresh에서 local full pipeline과 research review를 다시 통과해 `beta`를 유지한다. 다음 우선순위는 대형 확장보다 standard QA를 반복 재현하면서 운영 문구와 reader utility를 다듬는 일이다.

### JapTm (일본 상표 실무 가이드) — live shell에 연결된 단일국가 가이드

`JapTm`은 일본 단일 시장 상표 실무를 다루는 가이드다. 현재 `document-data.json` 기준 15개 챕터와 140개 검색 엔트리를 생성하며, 루트 `GloTm` 셸 `/japan` 경로에 연결된 상태다. verification refresh와 density push 뒤에 root standard verification까지 통과하면서 `beta`와 `standard QA` 상태로 정렬했다. 다음 우선순위는 대형 확장보다, 지금 만든 검색/운영 utility가 실제 reader flow에서 잘 작동하는지 반복 검증하며 lighter track을 안정적으로 유지하는 일이다.

### ChaTm (중국 상표 실무 가이드) — live shell에 연결된 단일국가 가이드

`ChaTm`은 중국 단일 시장 상표 실무를 다루는 가이드다. 현재 `document-data.json` 기준 15개 챕터와 202개 검색 엔트리를 생성하며, 루트 `GloTm` 셸 `/china` 경로에 연결된 상태다. 현재 루트 `content:prepare`에서도 `build-master.ts -> qa-content.ts -> build-content.ts` 전체 흐름을 타며, 카드에서는 "Sprint 1 잠금 6장 보강 완료" 상태를 함께 노출한다.

### EuTm (유럽 상표 운영 가이드) — live shell에 연결된 권역형 가이드

`EuTm`은 유럽 권역형 운영 가이드다. 현재 `document-data.json` 기준 14개 챕터와 206개 검색 엔트리를 생성하며, 루트 `GloTm` 셸 `/europe` 경로에 연결된 상태다. 최근에는 docs sync와 EU/UK 기준선 정리를 거치며 장별 원고 체계와 reader 탐색 밀도가 함께 올라갔다.

### UKTm (영국 상표 실무 가이드) — live shell에 연결된 단일국가 early track

`UKTm`은 UKIPO 중심의 영국 단일 시장 실무를 빠르게 점검하는 가이드다. 현재 `document-data.json` 기준 14개 챕터와 93개 검색 엔트리를 생성하며, 루트 `GloTm` 셸 `/uk` 경로에 연결된 상태다. 이번 verification refresh에서 fact log와 local full pipeline을 다시 확인했고, lifecycle은 `pilot`로 유지한다. Gateway에서는 계속 draft 공개본 성격의 early track으로 약하게 노출하되, verification freshness와 고위험 gap은 이번 라운드 기준으로 정리된 상태다.

### 향후 확장 방향

- 파일럿 검증 후 동일한 정보 구조와 빌드 파이프라인으로 신규 권역 가이드를 순차 연결
- 후속 신규 후보: 캐나다, 동남아, 중동, 기타 전략 국가/권역
- 목표: 지역별 실무 가이드를 누적해 글로벌 상표 운영 지식베이스로 발전

---

## 기술 현황

### 아키텍처

현재 구현은 루트 `GloTm` 셸 아래에서 `LatTm`/`MexTm`/`UsaTm`/`JapTm`/`ChaTm`/`EuTm`/`UKTm` live guide를 연결하는 구조다. 추후 신규 가이드를 같은 방식으로 추가할 수 있는 형태를 지향한다.

```
마크다운 원고 → 워크스페이스별 콘텐츠 파이프라인
              (full pipeline 또는 build-content shortcut)
                                                 ↓
                                  document-data.json / search-index.json
                                                 ↓
         GloTm BrowserRouter 셸 (Gateway + LatTm + MexTm + UsaTm + JapTm + ChaTm + EuTm + UKTm)
```

### 현재 검증된 기술 사실

| 항목 | 현재 상태 |
|------|-----------|
| GloTm 앱 구조 | React + Vite SPA |
| GloTm 라우터 | 루트 `BrowserRouter` 사용 중 |
| GloTm 렌더링 | `createRoot` 기반 CSR |
| Live shell guides | `LatTm`, `MexTm`, `UsaTm`, `JapTm`, `ChaTm`, `EuTm`, `UKTm` |
| LatTm 콘텐츠 빌드 | `build-master.ts` → `qa-content.ts` → `build-content.ts` |
| LatTm 생성 산출물 | 20개 챕터 / 검색 엔트리 780개 |
| MexTm 생성 산출물 | 15개 챕터 / 검색 엔트리 297개 |
| UsaTm 생성 산출물 | 14개 챕터 / 검색 엔트리 171개 |
| JapTm 생성 산출물 | 15개 챕터 / 검색 엔트리 140개 |
| ChaTm 생성 산출물 | 15개 챕터 / 검색 엔트리 202개 |
| EuTm 생성 산출물 | 14개 챕터 / 검색 엔트리 206개 |
| UKTm 생성 산출물 | 14개 챕터 / 검색 엔트리 93개 |
| GloTm build status | pass |
| MexTm build status | pass |
| 루트 `content:prepare` 특징 | 가이드별로 full pipeline과 `build-content.ts` shortcut이 혼재 |
| Gateway 랜딩 | intro 문서 전체 복제가 아니라 복수의 핵심 섹션과 CTA 중심의 선별 랜딩 |
| 추가 live routes | `/japan`, `/china`, `/europe`, `/uk` 연결 완료 |
| 배포 상태 | GitHub Pages 공개본 운영 중 (`/glotm/`) |

### 기술 스택

| 항목 | 버전 |
|------|------|
| React | 19.1 |
| Vite | 6.3 |
| TypeScript | 5.8 |
| react-router-dom | 7.6 |
| 마크다운 처리 | unified (remark + rehype) |
| 검색 | MiniSearch (클라이언트 전문 검색) |
| 빌드 스크립트 | tsx |

### 해결해야 할 핵심 문제

Phase 1의 핵심은 루트 GloTm 셸 기준의 읽기 흐름 안정화다.

- Gateway `/` → `LatTm` 홈 `/latam`
- `LatTm` 홈 → 챕터 카드/필터 → 챕터 진입
- `LatTm` 챕터 → 섹션 목차 → 올바른 hash 이동
- `LatTm` 챕터 → 상단 검색 → 올바른 챕터/섹션 이동
- `LatTm` 챕터 → 이전/다음 이동
- `LatTm` 홈 → continue reading 복귀
- `MexTm` 홈 → continue reading 복귀
- `MexTm` 챕터 → 섹션 목차 / 검색 / 이전·다음 / 현재 위치 추적이 깨지지 않도록 유지
- `UsaTm`/`JapTm`/`ChaTm`/`EuTm`/`UKTm` 홈/챕터/검색/continue reading 스모크가 깨지지 않도록 유지

SEO용 prerender와 정적 메타데이터 준비는 별도 Phase 2 과제로 유지한다.

---

## 구현 로드맵

### Phase 1: 로컬 웹앱 완성도 강화

현재 기본 Phase. 별도 지시가 없으면 모든 개선 작업은 우선 이 범위 안에서 해결한다.

| 작업 | 상세 |
|------|------|
| 기준 구현 대상 | 루트 `GloTm` 셸 (`src/app/App.tsx`, `src/products/*`) |
| 읽기 경험 개선 | `LatTm` 기준 UX를 유지하면서 나머지 live guide 회귀를 안정화 |
| 콘텐츠 QA | 정적 QA, 런타임 QA, 수동 QA로 분리해 운영 |
| 로컬 검증 | `npm run dev` / `npm run build` / `npm run test` 기준으로 주요 사용자 흐름 안정화 |
| live guide 범위 | `MexTm`·`UsaTm`·`JapTm`·`ChaTm`·`EuTm`·`UKTm`의 continue reading, outline, 진행률, 이전/다음, 검색, 렌더링까지 핵심 읽기 흐름 보장 |

Phase 1 런타임 QA 체크포인트는 `docs/phase1-runtime-qa.md`에 정리한다.

### Phase 2: 루트 GloTm 셸 기준 prerender + 정적 메타데이터 준비

| 작업 | 상세 |
|------|------|
| 대상 | 루트 `GloTm` 셸의 공개 URL (`/`, `/latam`, `/latam/chapter/:chapterSlug`, `/mexico`, `/mexico/chapter/:chapterSlug`, `/usa`, `/usa/chapter/:chapterSlug`, `/japan`, `/japan/chapter/:chapterSlug`, `/china`, `/china/chapter/:chapterSlug`, `/europe`, `/europe/chapter/:chapterSlug`, `/uk`, `/uk/chapter/:chapterSlug`) |
| `prerender.ts` 신규 | 빌드 후 챕터별 HTML 생성 (`title`, `meta` 태그 주입) |
| 정적 메타데이터 | 홈/챕터별 `title`, `description`, Open Graph 메타 정리 |
| 배포 설정 | 정적 파일 우선 + SPA 폴백 라우팅 설정 |
| 검증 | `npm run build` 후 prerender 산출물 수와 챕터 수가 일치 |

### Phase 3: 파일럿 배포 및 이메일 게이트

| 작업 | 상세 |
|------|------|
| 배포 시점 | 로컬 웹앱 완성도 기준 충족 후 파일럿 배포 |
| 게이트 방식 | `localStorage` 소프트 마찰 (서버 인증 없음) |
| 공개 범위 | 각 가이드의 첫 번째 챕터 전체 공개 |
| 구독 절차 | 이메일 입력 → `localStorage` 저장 → 전체 접근 |
| 추후 연동 | Buttondown API로 실제 이메일 구독 처리 |

### Phase 4: MexTm 루트 검증 경로 정렬 (멕시코 심화 파일럿)

| 작업 | 상세 |
|------|------|
| 루트 검증 경로 | 루트 `content:prepare`가 계속 shortcut을 유지할지, 워크스페이스 `content:prepare`를 직접 호출할지 정리 |
| 문서 계약 | README, QA 문서, 운영 브리프의 MexTm 설명을 실제 실행 경로와 일치시킴 |
| prerender + 게이트 | LatTm과 동일한 공개 전략이 필요한지 별도 Phase 2 이후 판단 |

### Phase 4 시작 조건

LatTm 파일럿 배포 후 월 100 유기 방문 달성 또는 은퇴 6개월 전, 둘 중 먼저 도래하는 시점.

### Phase 5: 글로벌 확장 템플릿화

| 작업 | 상세 |
|------|------|
| 공통 구조 정리 | manifest/build/QA 파이프라인을 권역별 재사용 가능 형태로 일반화 |
| 셸 온보딩 | 신규 가이드를 같은 규칙으로 연결 가능하게 정리 |
| 신규 권역 온보딩 | 캐나다, 동남아, 중동 등 후속 가이드 추가 |
| 운영 모델 검증 | 파일럿에서 검증된 SEO·구독 전환 구조를 다른 권역에 복제 |

---

## 최근 완료된 변경 (2026-03-28)

아래 항목은 최근 코드 기준으로 이미 반영된 UI/UX 정리 내용이다.

| 항목 | 이전 상태 | 현재 상태 |
|------|-----------|-----------|
| 본문 읽기 너비 | 약 980px 수준 | 820px로 축소해 가독성 개선 |
| 탑바 키커 | 내부 개발용 표현 중심 | `중남미 상표 실무 가이드`로 정리 |
| 홈 히어로 카피 | 기능 설명 중심 | 브랜드 관리자 대상 가치 제안 중심 |
| 챕터 카드 요약 | 높이 불균형 | 3줄 clamp로 통일 |
| 챕터 하단 내비 | 없음 | `← 이전` / `다음 →` 버튼 추가 |
| 법적 고지 | 없음 | 모든 페이지 하단에 법적 고지 표시 |

---

## 운영 제약

| 제약 | 내용 |
|------|------|
| 컨플릭 | 현 김앤장 재직 중. 직접 수익화·적극 프로모션 불가 |
| 운영 방식 | 은퇴 전까지 무료 서비스 |
| 배포 | 현재는 즉시 배포 계획 없음. 로컬 웹앱 완성도 확보 후 파일럿 배포 진행 |
| 작업자 | 1인 (상표 변리사 경력 20년+) |

---

## 성공 지표

| 시점 | 목표 |
|------|------|
| Phase 1 완료 시 | 로컬 환경에서 핵심 사용자 흐름, 검색, 챕터 읽기 경험 안정화 |
| 배포 후 4주 | `site:도메인` 검색에서 챕터 URL 10개+ 인덱싱 |
| 6개월 | 라틴아메리카/멕시코 파일럿 기준 유기 검색 유입 월 100회, 이메일 구독자 100명 |
| 은퇴 전 | 파일럿 구독자 500명, 핵심 키워드 Google 1페이지, 다음 권역 확장 준비 |
| 은퇴 후 | 파일럿에서 검증한 콘텐츠·구독 모델을 기반으로 글로벌 B2B 라이선스 전환 |

---

## 장기 비전 (현재 구현 범위 밖)

- 권역별 가이드를 누적해 글로벌 상표 운영 지식베이스 구축
- 은퇴 후 B2B 라이선스 모델 (연간 $3,000~$30,000)
- 화이트라벨 라이선스 (로펌·컨설팅 대상)
- 강의·웨비나 수익화
- 후속 확장 권역: 캐나다, 동남아, 중동 등
