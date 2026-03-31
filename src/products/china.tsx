import { Link } from "react-router-dom";

import { createConfiguredReader } from "./configuredReader";
import { getProductPathBySlug } from "./registry";
import { buildGeneratedContentUrl } from "./shared";

const documentDataUrl = buildGeneratedContentUrl("china", "document-data.json");
const searchEntriesUrl = buildGeneratedContentUrl("china", "search-index.json");

const latamPath = getProductPathBySlug("latam");

const {
  ReaderRoot: ChinaReaderRoot,
  HomePage: ChinaHomePage,
  ChapterPage: ChinaChapterPage,
  loadDocumentData,
  loadSearchEntries,
  productMeta: chinaProductMeta
} = createConfiguredReader({
  productSlug: "china",
  documentDataUrl,
  searchEntriesUrl,
  storageKey: "chatm_reading_bookmark",
  topbarKicker: "ChaTm Live",
  loadingMessage: "중국 상표 가이드 콘텐츠를 불러오는 중입니다.",
  homeHeroKicker: "중국 단일국가 라이브 가이드",
  homeSummary: (
    <>
      중국 단일 시장 상표 실무를 빠르게 점검하기 위한 라이브 가이드입니다. 권역 단위 구조를 먼저
      잡고 싶다면 <Link to={latamPath}>LatTm</Link>에서 큰 흐름을 본 뒤, 중국 출원·사용·집행
      쟁점을 확인할 때 이 트랙으로 내려오는 구성이 자연스럽습니다.
    </>
  ),
  homeStatusLabel: "Live 상태의 중국 단일 시장 가이드",
  positioningKicker: "ChaTm Positioning",
  positioningTitle: "중국 단일 시장 실무를 바로 읽을 수 있는 live track",
  positioningNote: (
    <>
      현재 ChaTm은 CNIPA 절차, 지정상품 설계, 사용 증거 관리, 플랫폼·행정·사법 집행 흐름을 중국
      단일 시장 기준으로 빠르게 점검하는 용도에 맞춰져 있습니다.
    </>
  ),
  chapterBadge: "China",
  chapterEyebrow: "중국 심화 읽기",
  contentStatus: "draft"
});

export {
  ChinaChapterPage,
  ChinaHomePage,
  ChinaReaderRoot,
  loadDocumentData,
  loadSearchEntries,
  chinaProductMeta
};
