# GloTm Stage 1 Trust Closeout Advisory Memo

작성일: 2026-06-21
검증 기준: GitHub `main` 공개 저장소 파일 실측 대조
적용 범위: Stage 1 trust/legal hardening closeout, Hermes 권한 경계, owner-only handoff 정리
관련 문서: [`hermes-stage1-baseline.md`](hermes-stage1-baseline.md)

## 결론

Stage 1 trust/legal hardening의 핵심 산출물은 이미 #76, #77, #79로 출하되었다. 이 메모의 역할은
이전 advisory의 stale 상태진단을 정정하고, 남은 closeout delta를 좁게 고정하는 것이다.

이번 closeout은 Report static surface의 trust/legal 접근성과 release gate 검증을 닫는 범위로 제한한다.
Hermes는 PR 후보 작성과 검증 증거 수집을 담당하되, Search Console, GA4 DebugView, live interactive QA
같은 owner 자격이 필요한 판정은 handoff로 남긴다.

## Shipped In #76, #77, #79

- #76: `LICENSE`와 `SECURITY.md`가 추가되어 공개 저장소의 license/security 기본 고지가 마련되었다.
- #77: `/legal`, `/privacy`, `/contact` runtime route가 추가되었고, 공통 source인 `src/trustLegal.ts`에서
  legal/privacy/contact 콘텐츠와 navigation 정의를 관리한다.
- #77: App routing/footer가 trust/legal page 정의를 소비하도록 연결되어 CSR 경로에서 legal/privacy/contact
  접근이 가능하다.
- #79: `scripts/seo.ts` static mirror와 sitemap 생성이 legal/privacy/contact page를 prerender하도록 확장되었다.
- #79: `scripts/seo.test.ts`는 prerender된 legal HTML에 legal notice가 포함되는지 검증한다.

## Remaining Closeout Delta

이번 PR이 닫는 항목은 아래로 한정한다.

- Report archive static body에 `/legal`, `/privacy`, `/contact` 링크를 추가한다.
- Report detail static body에 `/legal`, `/privacy`, `/contact` 링크를 추가한다.
- `test:seo`를 독립 script로 분리하고, `health:release`가 `build:pages:glotm` 이후 SEO static 검증을 실행하도록
  연결한다.
- 본 메모를 현재 `main` 상태에 맞춰 정정한다.

Gateway, Brief archive/detail, Guide static body의 trust/legal link 확대는 이번 HOLD SCOPE에서 제외한다. 필요하면
별도 micro-PR에서 다룬다.

## Owner-Only Verification

아래 항목은 Hermes가 코드나 CI만으로 완료 판정할 수 없다.

- Search Console에서 `/glotm/legal/`, `/glotm/privacy/`, `/glotm/contact/`, `/glotm/reports/` 색인 상태 확인
- GA4 DebugView에서 Gateway, Report, Brief, Guide landing/read 이벤트가 실제 라이브 트래픽으로 도착하는지 확인
- live interactive QA에서 drawer close, 검색, continue reading, report navigation, legal/footer navigation을 브라우저로 확인
- owner review 없이 `main`에 merge하지 않는 ruleset / owner bypass 경계 유지

## Guardrails Maintained

이번 closeout에서 유지해야 하는 금지/보류 사항은 다음과 같다.

- 신규 국가 추가 금지
- pricing/paywall 금지
- 이메일 게이트 금지
- 신규 파이프라인/의존성 추가 금지
- active promotion 금지
- ruleset / owner bypass 변경 금지
- `dist/` 또는 `public/generated/` 산출물 수기 편집 금지

## 참조 확인

- `LICENSE`
- `SECURITY.md`
- `src/app/App.tsx`
- `src/trustLegal.ts`
- `scripts/seo.ts`
- `scripts/seo.test.ts`
- `package.json`
