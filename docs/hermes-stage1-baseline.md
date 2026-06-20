# Hermes Stage 1 Baseline

이 문서는 Hermes 산출물을 채점하기 위한 Stage 1 기준선이다. 현재 `GloTm` 운영 단계에서는 새 기능 확장보다 trust/legal surface, static SEO mirror, release gate 정합성을 먼저 고정한다.

작성일: 2026-06-20
검증 기준: GitHub `main`의 공개 저장소 파일과 기존 운영 검토 메모
적용 범위: root shell, Gateway, Brief, Report, guide reader, prerender/static mirror, release verification

## 목적

Hermes가 생성하는 후속 PR과 운영 제안을 아래 기준에 맞춰 검토한다.

- 현재 Phase 2.5 organic-indexing portfolio 방향을 유지한다.
- 신규 국가, pricing/paywall, email gate, 새 pipeline, 새 dependency 도입은 Stage 1 범위에서 제외한다.
- 기존 surface의 신뢰 고지, 법적 고지, 운영자/문의 경로, static exposure, release gate를 먼저 정리한다.
- CSR 화면과 no-JS/crawler용 prerendered HTML 사이에 trust/legal 정보 차이가 생기지 않게 한다.

## 현재 운영 기준

`README.md`와 `PROJECT-OVERVIEW.md` 기준 현재 상태는 Phase 2.5 organic-indexing portfolio다. GitHub Pages 공개본은 이미 배포와 색인 운영 중이며, 현재 변경 원칙은 promotion-free organic indexing, provenance clarity, trust-layer coherence, organic discovery 강화다.

현재 root shell은 Gateway, Brief, Report, 7개 guide reader를 연결한다.

- Guide: `LatTm`, `MexTm`, `UsaTm`, `JapTm`, `ChaTm`, `EuTm`, `UKTm`
- Owner lane: `Report / Gateway`
- Release workflow: `.github/workflows/verify-release.yml`
- Main release command: `npm run verify:release`

## Stage 1 우선순위

### 1. Baseline 문서 고정

이 파일 자체가 첫 번째 기준선이다. 후속 Hermes 산출물은 이 문서와의 diff로 검토한다.

허용되는 변경:

- baseline 근거를 더 정확한 파일 경로, 명령 결과, 검증 로그로 보강
- 실제 구현 후 완료 상태를 반영
- Stage 1 scope를 좁히거나 명확히 하는 정리

주의할 변경:

- Stage 1 안에서 신규 제품/국가/수익화/게이트 기능을 추가하는 제안
- 검증 없이 현재 surface 상태를 단정하는 문구
- 운영 기준과 제품 카피를 같은 문서에서 섞는 변경

### 2. Legal / privacy / contact route 추가

공개 운영 사이트에는 최소한 다음 route가 필요하다.

- `/privacy`
- `/legal` 또는 `/terms`
- `/contact`

각 페이지는 법률 자문이 아니라 일반 정보 제공이라는 점, 운영자 연락 경로, 비공식성/비소속성, 저작권 또는 콘텐츠 소유 기준을 분명히 해야 한다.

### 3. Report surface trust notice 보강

Report archive와 Report detail은 현재 Stage 1에서 가장 먼저 보강할 runtime surface다. Report는 Gateway trust layer와 guide handoff 사이에 위치하므로 다음 항목을 명확히 포함해야 한다.

- 법률 자문 아님
- 일반 정보 제공 목적
- 운영자 또는 문의 경로
- 비공식성 및 특정 기관 비소속 고지
- copyright 또는 콘텐츠 권리 기준
- `/legal`, `/privacy`, `/contact` 연결

### 4. 공통 trust/legal 컴포넌트 도입

Gateway, Brief, Report, guide reader가 서로 다른 수준의 고지를 갖지 않도록 공통 문구 또는 공통 컴포넌트를 둔다.

권장 방향:

- 기존 guide reader footer의 고지를 무시하지 않는다.
- Gateway와 Brief에 이미 있는 positioning 문구를 중복으로 덮지 않는다.
- Report의 trust handoff 문구를 full legal notice로 착각하지 않는다.
- surface별 표현은 달라도 핵심 legal/trust facts는 같은 source에서 관리한다.

### 5. Static SEO mirror 정합성

`scripts/seo.ts`와 prerender 경로에서 생성되는 `bodyHtml`에도 최소 legal/trust 고지가 들어가야 한다. CSR hydration 후에만 보이는 고지는 no-JS, crawler, archive view에서 빠질 수 있다.

검토 기준:

- prerendered Gateway HTML에 trust/legal 고지가 있는가
- prerendered Brief archive/detail HTML에 필요한 고지가 있는가
- prerendered Report archive/detail HTML에 필요한 고지가 있는가
- sitemap과 canonical route에 legal/privacy/contact가 포함되는가

### 6. Public repo governance files 추가

공개 저장소 운영 hygiene로 다음 파일을 추가한다.

- `LICENSE`
- `SECURITY.md`

`SECURITY.md`에는 최소한 vulnerability report channel, supported scope, expected response principle을 둔다.

### 7. Dependency audit 기준 분리

운영 긴급도는 production 기준으로 먼저 본다.

- 우선 기준: `npm audit --omit=dev`
- dev-only critical은 production emergency로 과장하지 않는다.
- dependency 변경은 현재 phase의 “의존성 추가 금지” 가드레일과 충돌하지 않는 범위에서만 검토한다.

### 8. Release gate 강화

기존 `verify-release.yml`은 유지하되, `verify:release` 안에서 Stage 1 trust/static 조건을 확인하도록 보강한다.

추가 검증 후보:

- prerendered HTML에 legal/trust 문구 존재
- `dist/sitemap.xml` route count와 canonical route 확인
- `/privacy`, `/legal` 또는 `/terms`, `/contact` canonical 포함
- Report archive/detail static HTML에 고지 존재
- Gateway/Brief/Report가 같은 trust/legal source를 공유하는지 확인

## Stage 1에서 하지 않을 일

- 신규 국가 guide 추가
- pricing/paywall 추가
- email gate 3단계 구현
- 새 content pipeline 도입
- 새 dependency 추가
- ruleset 또는 admin bypass 변경
- 기존 guide/Gateway/Brief 고지를 없다고 단정하고 중복 구현
- dev-only audit 결과를 production outage처럼 처리

## 완료 판정

Stage 1은 다음 조건을 만족하면 완료로 본다.

- 이 baseline 문서가 저장소에 존재하고 docs index에서 찾을 수 있다.
- privacy/legal/contact route가 runtime과 static output 양쪽에 반영된다.
- Report archive/detail에 full legal/trust notice가 반영된다.
- Gateway, Brief, Report, guide reader의 trust/legal facts가 정합적이다.
- prerendered HTML에서 핵심 고지가 빠지지 않는다.
- `LICENSE`와 `SECURITY.md`가 존재한다.
- `npm run verify:release` 또는 그 하위 gate가 Stage 1 조건을 검증한다.

## 후속 작업 순서

1. `docs/README.md`에 이 문서를 등록한다.
2. Legal/privacy/contact route와 copy source를 설계한다.
3. Report archive/detail notice를 구현한다.
4. Common trust/legal source 또는 component를 정리한다.
5. `scripts/seo.ts` static mirror에 동일한 고지를 반영한다.
6. `LICENSE`, `SECURITY.md`를 추가한다.
7. Release verification에 static/legal checks를 추가한다.
