# UKTm 콘텐츠 확충 실행 계획서

## 목적

이 문서는 `UKTm`을 영국 단일국가 실무 가이드 워크스페이스로 빠르게 착수시키기 위한 실행 계획서다.
핵심 목표는 장별 원천 원고, 검증 로그, 조립/QA 파이프라인, 루트 셸 연동을 병렬로 준비해 3주 스프린트 안에 초도 공개본을 만드는 것이다.

## 핵심 원칙

1. 정본은 `content/source/chapters/*.md`와 `manifest.json`이다.
2. `master.md`는 조립 결과물이며, 집필팀이 직접 편집하지 않는다.
3. 사실 검증은 집필과 분리된 별도 레인으로 운영한다.
4. `EuTm`과 내용이 겹치면 영국 독자 판단이 필요한 차이만 남긴다.

## 팀 구조

- 총괄 PM / 편집 리드
- 마스터 원고 설계팀
- 챕터 집필팀 A
- 챕터 집필팀 B
- 챕터 집필팀 C
- 사실 검증팀
- 빌드/QA 팀
- 런타임 통합팀

## 3주 스프린트

### 0주차

- 목차, 파일명, H1 규칙, `manifest.json` 확정
- source register / fact log 템플릿 생성
- 빌드 스크립트 스캐폴드 생성

### 1주차

- 집필팀 A/B/C 병렬 초안 작성
- 검증팀 rolling verification
- 빌드/QA 팀 파이프라인 골격 완성

### 2주차

- 검증 반영
- `master.md` 조립
- QA 통과
- generated JSON 생성

### 3주차

- 루트 포트폴리오 연결
- `/uk` 라우트, 리더, 테스트 추가
- 회귀 수정

## 성공 기준

- 14개 챕터 구조 확정
- `build-master -> qa-content -> build-content` 정상 동작
- `/uk` 홈/챕터/검색/continue reading 동작
- 기존 live guide 회귀 없음
