import { Link } from "react-router-dom";

import { createConfiguredReader } from "./configuredReader";
import documentDataUrl from "../../EuTm/content/generated/document-data.json?url";
import searchEntriesUrl from "../../EuTm/content/generated/search-index.json?url";

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
  topbarKicker: "EuTm Live",
  loadingMessage: "유럽 상표 가이드 콘텐츠를 불러오는 중입니다.",
  homeHeroKicker: "유럽 권역 라이브 가이드",
  homeSummary: (
    <>
      유럽 권역 상표 운영 구조를 빠르게 점검하기 위한 라이브 가이드입니다. 라틴아메리카와 유럽의
      권역형 프레임을 비교해 보고 싶다면 <Link to="/latam">LatTm</Link>과 함께 읽는 구성이
      자연스럽습니다.
    </>
  ),
  homeStatusLabel: "Live 상태의 유럽 권역 가이드",
  positioningKicker: "EuTm Positioning",
  positioningTitle: "유럽 권역 운영 구조를 바로 읽을 수 있는 live regional guide",
  positioningNote: (
    <>
      현재 EuTm은 EU 단위 전략, 권역 확장 구조, 유지관리, 집행 및 병행 국가 이슈를 유럽 권역
      기준으로 빠르게 점검하는 용도에 맞춰져 있습니다.
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
