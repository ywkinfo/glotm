import { Link } from "react-router-dom";

import { createConfiguredReader } from "./configuredReader";
import { getProductPathBySlug } from "./registry";
import { buildGeneratedContentUrl } from "./shared";

const documentDataUrl = buildGeneratedContentUrl("japan", "document-data.json");
const searchEntriesUrl = buildGeneratedContentUrl("japan", "search-index.json");

const latamPath = getProductPathBySlug("latam");

const {
  ReaderRoot: JapanReaderRoot,
  HomePage: JapanHomePage,
  ChapterPage: JapanChapterPage,
  loadDocumentData,
  loadSearchEntries,
  productMeta: japanProductMeta
} = createConfiguredReader({
  productSlug: "japan",
  documentDataUrl,
  searchEntriesUrl,
  storageKey: "japtm_reading_bookmark",
  topbarKicker: "JapTm Mature",
  loadingMessage: "일본 상표 가이드 콘텐츠를 불러오는 중입니다.",
  homeHeroKicker: "일본 단일국가 mature guide",
  homeSummary: (
    <>
      일본 단일 시장 상표 실무를 full QA로 묶어 운영하는 단일국가 가이드입니다. 권역 단위 구조를
      먼저 잡고 싶다면 <Link to={latamPath}>LatTm</Link>에서 큰 흐름을 본 뒤, 일본 출원 경로,
      심사·병존동의제도 대응, 등록 후 유지관리, 집행·세관 오케스트레이션을 확인할 때 이 트랙으로
      내려오는 구성이 자연스럽습니다. 선출원주의·존속기간·이의신청 같은 핵심 사실은 claim-map과
      1차 출처로 재대조해 유지합니다.
    </>
  ),
  positioningKicker: "JapTm Positioning",
  positioningTitle: "일본 단일 시장 실무를 growth mature lane으로 운영하는 full-QA guide",
  positioningNote: (
    <>
      현재 JapTm은 JPO 출원, 일본어 표기 설계, 심사·거절 대응과 병존동의제도(2024-04-01 시행),
      등록 후 유지관리, 세관·분쟁 집행을 일본 단일 시장 기준으로 판단하도록 구성돼 있습니다.
      filing route, examination·consent, maintenance, enforcement·customs 흐름이 reader flow에서
      흔들리지 않도록 claim-map freshness와 검색/이어 읽기 handoff를 반복 검증하는 데 초점을 둡니다.
    </>
  ),
  chapterBadge: "Japan",
  chapterEyebrow: "일본 심화 읽기"
});

export {
  JapanChapterPage,
  JapanHomePage,
  JapanReaderRoot,
  loadDocumentData,
  loadSearchEntries,
  japanProductMeta
};
