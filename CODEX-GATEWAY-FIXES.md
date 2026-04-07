# Gateway 콘텐츠 정합화 상태 메모

작성 기준: 2026-04-01
상태: historical memo. 현재 SEO/Pages 상태는 `PROJECT-OVERVIEW.md`, `README.md`, `docs/phase1-runtime-qa.md`를 기준으로 본다.
대상 프로젝트: GloTm (Vite + React + TypeScript)
작업 범위: Phase 1 (로컬 웹앱 완성도 강화, 즉시 배포 전제 없음)

---

## 현재 기준 소스 오브 트루스

- 런타임 기준 live guide는 `LatTm`, `MexTm`, `UsaTm`, `JapTm`, `ChaTm`, `EuTm`, `UKTm`의 7개다.
- `LatTm`은 계속 기준 제품이다.
- `UKTm`은 live route이지만, Gateway 메시지에서는 draft 공개본 성격의 early track으로 약하게 노출한다.

확인 파일:

| 파일 | 역할 |
|---|---|
| `glotm-intro-chapter-v2.md` | Gateway가 파싱하는 intro 원문 |
| `src/app/App.tsx` | Gateway 랜딩 구조와 카피 |
| `src/products/registry.ts` | liveShellProducts 메타데이터 |
| `src/app/App.test.tsx` | Gateway 회귀 테스트 |

---

## 반영 완료 항목

### 1. "What GloTm Solves" 텍스트 현행화

- intro 원문을 6-guide 기준에서 7-guide 기준으로 갱신했다.
- `LatTm` 기준 제품 메시지는 유지했다.
- `UKTm`은 포트폴리오에는 포함하되 draft 공개본 성격의 early track으로만 설명한다.

### 2. 히어로 CTA 위계 유지

- Gateway 히어로 CTA는 `LatTm` 단일 primary만 유지한다.
- 다른 live guide CTA는 히어로에서 다시 나열하지 않는다.

### 3. "Suggested Reading Flow" 상단 배치 유지

- Reading Flow는 히어로 바로 아래에 유지한다.
- 이 섹션은 `LatTm` 중심 동선을 설명하고, 국가 가이드 진입과 `UKTm` early track, `EuTm` 권역 확장을 자연스럽게 이어 준다.
- 포트폴리오 전체 진입은 `#current-pilot-scope` 앵커로 연결한다.

### 4. "Current Pilot Scope" 그룹핑 유지

- 권역형(`LatTm`, `EuTm`)과 국가형(`MexTm`, `UsaTm`, `JapTm`, `ChaTm`, `UKTm`)을 분리해 노출한다.
- `ChaTm`은 카드에서 "지속 업데이트 중" 성숙도 메모를 유지한다.
- `UKTm`은 카드와 그룹 설명에서 draft 공개본 성격의 early track으로 표시한다.

### 5. 헤더 잘림 리스크 확인

- 현재 Gateway는 `getIntroSection()`으로 `##` 제목을 직접 매칭하고 있으며, 주요 섹션 제목은 원문과 맞춰져 있다.
- 현 시점 우선순위는 구조 변경이 아니라 카피 정합화와 회귀 보호다.

---

## 현재 남은 후속 과제

### Medium

1. Gateway 섹션별 수동 렌더링 QA를 주기적으로 반복해 헤더 잘림이나 카피 어색함이 없는지 확인
2. ChaTm 콘텐츠 밀도 확장
3. UKTm을 beta 수준으로 끌어올릴 콘텐츠/구조 안정화

### 당시 Phase 2 이후 보류

1. Prerender + SEO 메타데이터 (현재 구현 완료)
2. MexTm 빌드 파이프라인 패리티
3. 이메일 게이트 + 파일럿 배포

---

## 검증 기준

- `npm test`
- `npm run dev`
- Gateway 상단에서 Reading Flow가 바로 보이는지 수동 확인
- `LatTm`이 핵심 시작점으로 읽히는지 확인
- `UKTm`이 nav/카드에는 보이되, early track으로만 약하게 노출되는지 확인
