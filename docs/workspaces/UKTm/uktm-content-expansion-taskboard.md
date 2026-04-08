# UKTm 콘텐츠 확충 작업 분배표

## 공통 규칙

- 모든 공개본 수정은 `UKTm/content/source/chapters/`와 `UKTm/content/source/manifest.json`에서 시작한다.
- `master.md` 직접 수정 금지
- 검증 전 숫자, 기한, 수수료, 공식 절차명 단정 서술 금지

## 설계팀

- 챕터 14개 제목 확정
- 파일명 규칙 확정
- H1 / H2 규칙 확정
- `manifest.json` 유지
- 장간 중복 제거 메모 배포

## 집필팀 A

- 1장 시스템 맵
- 2장 검색/충돌
- 3장 출원 전략
- 4장 출원서/명세

## 집필팀 B

- 5장 심사/거절
- 6장 opposition/challenge
- 7장 유지관리/갱신
- 8장 사용/non-use cancellation

## 집필팀 C

- 9장 라이선스/유통
- 10장 집행/분쟁
- 11장 플랫폼/도메인
- 12장 세관/국경
- 13장 거버넌스/RACI
- 14장 사례/부록

## 검증팀

- source register 유지
- fact verification log 유지
- unresolved 문장 목록 관리
- 공개 직전 `추가검증 필요` 0건 목표

## 빌드/QA 팀

- `build-master.ts`
- `qa-content.ts`
- `build-content.ts`
- generated JSON 검증
- search density 점검

## 통합팀

- 루트 제품 등록
- `/uk` 라우트 연결
- sync 스크립트 추가
- 테스트 케이스 추가
- 회귀 테스트 통과
