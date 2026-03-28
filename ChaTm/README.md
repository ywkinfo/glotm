# ChaTm

중국 상표제도와 중국 상표 실무 운영 이슈를 다루는 워크스페이스입니다.
현재 활성 런타임은 루트 `GloTm` 셸이며, `ChaTm`는 `/china` 경로로 연결된 live country guide입니다.

## Structure

- `content/source/master.md`: 현재 빌드가 읽는 정본 원고
- `content/source/chapters/`: 장별 초안과 후속 분리용 보조 자산
- `content/source/appendix/`: 부록 초안과 참고 자산
- `content/research/`: 중국 상표제도 조사 메모와 출처 정리
- `content/generated/`: 검색 인덱스와 렌더링용 JSON 산출물
- `scripts/build-content.ts`: 마스터 원고를 앱 소비용 JSON으로 변환
- `Harness/`: 현재 구조와 편집 규칙 문서

## Commands

- `npm run content:build`: `content/source/master.md`를 읽어 `content/generated/`를 재생성

## Notes

- 현재 빌드는 `master.md`만 정본 입력으로 사용합니다.
- `LatTm` 수준의 `manifest.json`, `build-master.ts`, `qa-content.ts`는 아직 없습니다.
- `chapters/`와 `appendix/`는 후속 분리 작업을 위한 보조 폴더이며 자동 조립되지 않습니다.
- 루트 `GloTm` 셸은 이 워크스페이스의 `content/generated/` 산출물을 읽어 `/china` 리더를 렌더링합니다.
