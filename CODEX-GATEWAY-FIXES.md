# Gateway 콘텐츠 개선 — Claude Code 작업 지시서

작성 기준: 2026-03-29
대상 프로젝트: GloTm (Vite + React + TypeScript)
작업 범위: Phase 1 (로컬 웹앱 완성도 강화, 즉시 배포 전제 없음)

---

## 작업 전 확인 사항

이 지시서는 아래 파일들을 직접 확인한 뒤 작성되었다.
변경 대상 파일 목록:

| 파일 | 역할 |
|---|---|
| `glotm-intro-chapter-v2.md` | 인트로 마크다운 원본. `src/content/intro.ts`가 파싱해 Gateway에 공급 |
| `src/app/App.tsx` | Gateway 랜딩 페이지 (`GatewayLandingPage` 컴포넌트) + 앱 레이아웃 |
| `src/content/intro.ts` | 마크다운 파서. `introDocument`, `getIntroSection()` 제공 |
| `src/products/registry.ts` | 6개 가이드의 메타데이터 (`liveShellProducts`) |

---

## 🔴 높음 — 즉시 처리

### 작업 1: "What GloTm Solves" 텍스트 현행화

**문제**: `glotm-intro-chapter-v2.md` 108행의 "라틴아메리카 중심 파일럿에 있다"가 현재 6개 가이드 live 상태와 맞지 않음.

**파일**: `glotm-intro-chapter-v2.md`
**위치**: `## GloTm은 무엇을 하려는가` 섹션 첫 번째 문단 (108행)

**현재 텍스트**:
```
다만 현재의 실행 우선순위는 여전히 라틴아메리카 중심 파일럿에 있다.
```

**수정 방향**:
- "라틴아메리카 중심 파일럿"이라는 표현을 제거하거나, 현재 상태를 반영하는 표현으로 교체
- 바로 뒤에 "실제 개발 포트폴리오는 이미 6개 가이드까지 넓어져 있으며"라는 문장이 이어지므로, 앞뒤 흐름이 자연스럽게 연결되도록 조정
- 예시: "다만 현재 기준 제품은 LatTm이며, 전체 포트폴리오는 6개 가이드로 확장되어 있다." 정도로 한 문장 통합 가능
- 단, 이 마크다운은 `src/content/intro.ts`가 파싱하므로, `##` 헤딩 구조와 문단 구분(빈 줄)을 깨뜨리지 않도록 주의

**검증**: 수정 후 `npm run dev`로 로컬 서버 띄우고 Gateway의 "What GloTm Solves" 섹션에서 변경된 텍스트가 정상 렌더링되는지 확인.

---

### 작업 2: 히어로 CTA 위계 재정리

**문제**: `App.tsx` 199~213행에서 `liveShellProducts.map()`으로 6개 버튼을 나열하는데, 첫 번째(LatTm)만 `--primary`, 나머지 5개는 `--secondary`로 처리됨. 시각적으로 6개가 거의 동등하게 보이는 문제.

**파일**: `src/app/App.tsx`
**위치**: `GatewayLandingPage` 컴포넌트 내 `gateway-actions` div (199~213행)

**수정 방향**:
- 히어로 섹션의 CTA는 LatTm 하나만 남기고 Primary로 유지
- 나머지 5개 버튼은 히어로에서 제거
- 대신 아래의 "Current Pilot Scope" 섹션(304~348행)에 이미 각 가이드별 카드와 링크가 있으므로, 히어로에서 중복 나열할 필요 없음
- LatTm 버튼 옆에 텍스트 링크 형태로 "전체 가이드 보기 ↓" (페이지 내 앵커) 하나를 추가하는 것은 선택 사항

**주의**:
- 페이지 하단의 "Suggested Reading Flow" 섹션(351~377행)에도 동일한 6개 버튼 나열이 있음. 이것은 작업 3과 함께 처리
- `registry.ts`의 `primaryCtaLabel` 필드는 변경 불필요 (카드에서 여전히 사용됨)

---

### 작업 3: "Suggested Reading Flow" 섹션 위치 이동 + CTA 축소

**문제**: Reading Flow 섹션이 페이지 맨 하단(351~377행)에 있어 사실상 안 보임. 내용상 히어로 바로 아래가 적절.

**파일**: `src/app/App.tsx`
**위치**: `gateway-cta-card` 섹션 (351~377행)

**수정 방향**:

(A) 위치 이동:
- `gateway-cta-card` 섹션을 히어로(`gateway-hero`) 바로 아래, "Why It Surfaces Late"(`gateway-section` 첫 번째) 바로 위로 이동
- 즉 JSX 순서: `gateway-hero` → `gateway-cta-card` → `gateway-section`(Why It Surfaces Late) → ...

(B) CTA 축소:
- 이 섹션 내 CTA도 현재 6개 동등 나열 (363~375행)
- LatTm만 Primary 버튼으로 남기고, 나머지는 제거하거나 텍스트 링크로 간소화
- 섹션의 설명 텍스트(357~361행)는 현재 LatTm → 국가 가이드 → EuTm 순서를 잘 설명하고 있으므로 유지

**검증**: 이동 후 페이지 상단에서 Reading Flow가 보이는지, 히어로 CTA와 중복감 없이 자연스러운지 로컬에서 확인.

---

## 🟡 중간 — 위 3개 완료 후 처리

### 작업 4: 헤더 문장 잘림 원인 확인

**문제**: 브리핑 문서에서 "Gateway가 intro 문서 일부만 잘라서 렌더링하면서 헤더 문장이 잘릴 수 있다"는 가능성이 제기됨.

**확인 방법**:
- `src/content/intro.ts`의 `parseIntroDocument()` 함수가 `## ` 헤딩을 어떻게 파싱하는지 이미 확인됨 (79~105행)
- `App.tsx`에서 `getIntroSection("왜 상표 이슈는 늦게 드러나는가")` 등으로 섹션을 가져올 때, 제목이 정확히 매칭되지 않으면 `undefined` 반환 → 텍스트 누락 가능
- `introDocument.title`(184행), `introDocument.quote`(186~193행), `whyLate?.paragraphs.slice(0, 1)`(194~198행) 등에서 `.slice()`나 옵셔널 체이닝으로 일부만 표시하는 로직이 있음

**작업**: 로컬에서 Gateway 페이지를 렌더링하고, 각 섹션 헤더가 원본 마크다운의 `##` 제목과 일치하는지 육안 대조. 잘리는 곳이 있으면 `App.tsx`의 해당 `.slice()` 범위 또는 `intro.ts` 파싱 로직을 수정.

---

### 작업 5: 가이드 카드 그룹핑 (권역형 vs 국가형)

**문제**: "Current Pilot Scope" 섹션(317~348행)에서 6개 카드가 동일 그리드로 나열됨. 권역형(LatTm·EuTm)과 국가형(MexTm·UsaTm·JapTm·ChaTm)의 시각 구분 없음.

**파일**: `src/app/App.tsx` 317~348행 + `src/products/registry.ts`

**수정 방향**:
- `registry.ts`에 이미 `coverageType: "region" | "country"` 필드가 존재함
- `App.tsx` 166~167행에서 이미 `regionProducts`와 `countryProducts`를 분리하고 있으나, 카드 그리드(317행)에서는 사용하지 않음
- 카드 그리드를 두 그룹으로 분리하고, 각 그룹 위에 소제목 또는 kicker 레이블 추가:
  - "권역 가이드 (Regional)" → LatTm, EuTm
  - "국가 가이드 (Country)" → MexTm, UsaTm, JapTm, ChaTm
- 스타일 차이는 최소한으로: kicker 텍스트 구분 정도면 충분. 색상 분리까지는 불필요.

---

### 작업 6: ChaTm 완성도 표시

**문제**: LatTm(약 20개 챕터)과 ChaTm(약 6개 챕터)이 나란히 카드로 나올 때 콘텐츠 양 차이가 인지되지 않음.

**파일**: `src/products/registry.ts` + `src/app/App.tsx`

**수정 방향**:
- `registry.ts`의 ChaTm 엔트리에 콘텐츠 성숙도를 나타내는 필드 추가 (예: `maturityNote?: string`)
- 값 예시: `"지속 업데이트 중"` 또는 `"초기 버전 — 챕터 확장 예정"`
- `App.tsx` 카드 컴포넌트에서 해당 필드가 있을 때만 상태 표시 추가
- 이미 `status: "Beta"`, `statusTone: "beta"` 필드가 있으므로, 기존 status pill과 별도로 표시하거나 tooltip 형태를 사용

---

## 🔵 보류 — Phase 2 이후 결정

아래 항목은 이번에 수정하지 않는다. 기록 목적으로만 남긴다.

1. **영문/한국어 레이블 혼용 정리**: kicker 텍스트가 영문("Why It Surfaces Late", "What GloTm Solves" 등)이고 본문이 한국어인 구조. Phase 2 영문 독자 확장 시점에 정책 결정 후 일괄 처리.
2. **인터랙티브 분기 UI**: 단계 선택 → 지역 선택 → 추천 연결 구조. Phase 4~5 과제.
3. **상황별 플레이북 / 체크리스트 자동 생성**: Phase 5 이후.
4. **인트로 문서 독자 호명 타이밍**: `glotm-intro-chapter-v2.md` 첫 문단에 독자 직접 호명 한 줄 추가 건. 마크다운 수정이므로 작업 1과 함께 처리해도 되지만, 기존 인용 블록(`>`) 구조와의 조율이 필요하므로 별도 판단.

---

## 작업 순서 요약

```
1. 작업 1 (마크다운 텍스트 수정) — 단독 완료 가능
2. 작업 2 + 작업 3 (히어로 CTA + Reading Flow 이동) — 함께 처리
3. npm run dev 로컬 확인
4. 작업 4 (헤더 잘림 확인) — 3번 확인 중 같이 수행
5. 작업 5 (카드 그룹핑) — 독립 작업
6. 작업 6 (ChaTm 완성도 표시) — 독립 작업
```

테스트가 있다면 각 단계 후 `npm test` 실행.
