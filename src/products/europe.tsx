import { Link } from "react-router-dom";

import { createConfiguredReader } from "./configuredReader";
import { getProductPathBySlug } from "./registry";
import { buildGeneratedContentUrl } from "./shared";

const documentDataUrl = buildGeneratedContentUrl("europe", "document-data.json");
const searchEntriesUrl = buildGeneratedContentUrl("europe", "search-index.json");

const latamPath = getProductPathBySlug("latam");

const {
  ReaderRoot: EuropeReaderRoot,
  HomePage: EuropeHomePage,
  ChapterPage: EuropeChapterPage,
  loadDocumentData,
  loadSearchEntries,
  productMeta: europeProductMeta
} = createConfiguredReader({
  productSlug: "europe",
  documentDataUrl,
  searchEntriesUrl,
  storageKey: "eutm_reading_bookmark",
  topbarKicker: "EuTm Validate",
  loadingMessage: "유럽 상표 가이드 콘텐츠를 불러오는 중입니다.",
  homeHeroKicker: "유럽 권역 validate guide",
  homeSummary: (
    <>
      유럽은 EU-wide, core-state, UK split을 같은 운영 표에서 잠그고 evidence triage까지 이어 읽기
      위한 validate guide입니다. 라틴아메리카와 유럽의 권역형 프레임을 비교해 보고 싶다면 <Link to={latamPath}>LatTm</Link>과 함께 읽는 구성이 자연스럽습니다.
    </>
  ),
  positioningKicker: "EuTm Positioning",
  positioningTitle: "controlled EU+UK scope를 잠그는 validate regional guide",
  positioningNote: (
    <>
      현재 EuTm은 claim-map과 핵심 6장 기준선을 바탕으로 rights·route·evidence handoff를 controlled EU+UK scope 안에서 정리한 validate guide입니다.
    </>
  ),
  chapterBadge: "Europe",
  chapterEyebrow: "유럽 권역 읽기"
});

export {
  EuropeChapterPage,
  EuropeHomePage,
  EuropeReaderRoot,
  loadDocumentData,
  loadSearchEntries,
  europeProductMeta
};
