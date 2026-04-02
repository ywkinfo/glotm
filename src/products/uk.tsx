import { Link } from "react-router-dom";

import { createConfiguredReader } from "./configuredReader";
import { getProductPathBySlug } from "./registry";
import { buildGeneratedContentUrl } from "./shared";

const documentDataUrl = buildGeneratedContentUrl("uk", "document-data.json");
const searchEntriesUrl = buildGeneratedContentUrl("uk", "search-index.json");

const europePath = getProductPathBySlug("europe");

const {
  ReaderRoot: UkChapterRoot,
  HomePage: UkHomePage,
  ChapterPage: UkChapterPage,
  loadDocumentData,
  loadSearchEntries,
  productMeta: ukProductMeta
} = createConfiguredReader({
  productSlug: "uk",
  documentDataUrl,
  searchEntriesUrl,
  storageKey: "uktm_reading_bookmark",
  topbarKicker: "UKTm Incubate",
  loadingMessage: "영국 상표 가이드 콘텐츠를 불러오는 중입니다.",
  homeHeroKicker: "영국 단일국가 incubate guide",
  homeSummary: (
    <>
      영국 시장 상표 실무를 빠르게 점검하기 위한 단일국가 가이드입니다. EU 공통 프레임과 병행해
      읽고 싶다면 <Link to={europePath}>EuTm</Link>으로 큰 구조를 먼저 잡은 뒤, 영국 단일국가
      판단이 필요한 순간 이 트랙으로 내려오는 구성이 자연스럽습니다.
    </>
  ),
  homeStatusLabel: "Incubate tier · Pilot lifecycle의 영국 단일 시장 가이드",
  positioningKicker: "UKTm Positioning",
  positioningTitle: "영국 단일 시장 실무를 lighter depth로 유지하는 incubate guide",
  positioningNote: (
    <>
      현재 UKTm은 UKIPO 중심 출원 흐름, 사용증거와 non-use cancellation, 영국 온라인 침해와
      분쟁 대응을 단일 시장 기준으로 빠르게 점검하는 용도에 맞춰져 있습니다.
    </>
  ),
  chapterBadge: "UK",
  chapterEyebrow: "영국 심화 읽기",
  contentStatus: "draft"
});

export {
  UkChapterPage,
  UkChapterRoot as UkReaderRoot,
  UkHomePage,
  loadDocumentData,
  loadSearchEntries,
  ukProductMeta
};
