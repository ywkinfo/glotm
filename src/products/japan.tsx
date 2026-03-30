import { Link } from "react-router-dom";

import { createConfiguredReader } from "./configuredReader";
import { getProductPathBySlug } from "./registry";
import documentDataUrl from "../../JapTm/content/generated/document-data.json?url";
import searchEntriesUrl from "../../JapTm/content/generated/search-index.json?url";

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
  topbarKicker: "JapTm Live",
  loadingMessage: "일본 상표 가이드 콘텐츠를 불러오는 중입니다.",
  homeHeroKicker: "일본 단일국가 라이브 가이드",
  homeSummary: (
    <>
      일본 단일 시장 상표 실무를 빠르게 점검하기 위한 라이브 가이드입니다. 권역 단위 구조를 먼저
      잡고 싶다면 <Link to={latamPath}>LatTm</Link>에서 큰 흐름을 본 뒤, 일본 출원·유지·분쟁
      쟁점을 확인할 때 이 트랙으로 내려오는 구성이 자연스럽습니다.
    </>
  ),
  homeStatusLabel: "Live 상태의 일본 단일 시장 가이드",
  positioningKicker: "JapTm Positioning",
  positioningTitle: "일본 단일 시장 실무를 바로 읽을 수 있는 live track",
  positioningNote: (
    <>
      현재 JapTm은 JPO 출원, 일본어 표기 설계, 등록 후 유지관리, 세관·분쟁 대응을 일본 단일 시장
      기준으로 빠르게 점검하는 용도에 맞춰져 있습니다.
    </>
  ),
  chapterBadge: "Japan",
  chapterEyebrow: "일본 심화 읽기",
  contentStatus: "draft"
});

export {
  JapanChapterPage,
  JapanHomePage,
  JapanReaderRoot,
  loadDocumentData,
  loadSearchEntries,
  japanProductMeta
};
