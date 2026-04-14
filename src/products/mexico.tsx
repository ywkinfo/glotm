import { Link } from "react-router-dom";

import { createConfiguredReader } from "./configuredReader";
import { getProductPathBySlug } from "./registry";
import { buildGeneratedContentUrl } from "./shared";

const documentDataUrl = buildGeneratedContentUrl("mexico", "document-data.json");
const searchEntriesUrl = buildGeneratedContentUrl("mexico", "search-index.json");

const latamPath = getProductPathBySlug("latam");

const {
  ReaderRoot: MexicoReaderRoot,
  HomePage: MexicoHomePage,
  ChapterPage: MexicoChapterPage,
  loadDocumentData,
  loadSearchEntries,
  productMeta: mexicoProductMeta
} = createConfiguredReader({
  productSlug: "mexico",
  documentDataUrl,
  searchEntriesUrl,
  storageKey: "mextm_reading_bookmark",
  topbarKicker: "MexTm Growth",
  loadingMessage: "멕시코 심화 가이드 콘텐츠를 불러오는 중입니다.",
  homeHeroKicker: "멕시코 growth country guide",
  homeSummary: (
    <>
      멕시코 buyer-entry 판단표를 filing packet handoff, rights-maintenance triage,
      border-control escalation까지 이어 읽기 위한 심화 가이드입니다.
      권역 단위 구조를 먼저 잡고 싶다면 <Link to={latamPath}>LatTm</Link>에서 큰 흐름을 본 뒤
      이 트랙으로 내려오는 구성이 가장 자연스럽습니다.
    </>
  ),
  positioningKicker: "MexTm Positioning",
  positioningTitle: "buyer-entry 다음 handoff를 잠그는 growth country guide",
  positioningNote: (
    <>
      현재 MexTm은 buyer-entry control을 filing packet handoff, rights-maintenance triage,
      border-control escalation까지 같은 시장 기준선에서 이어 읽게 정리한 growth guide입니다.
    </>
  ),
  chapterBadge: "Mexico",
  chapterEyebrow: "심화 읽기"
});

export {
  MexicoChapterPage,
  MexicoHomePage,
  MexicoReaderRoot,
  loadDocumentData,
  loadSearchEntries,
  mexicoProductMeta
};
