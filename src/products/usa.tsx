import { Link } from "react-router-dom";

import { createConfiguredReader } from "./configuredReader";
import { getProductPathBySlug } from "./registry";
import { buildGeneratedContentUrl } from "./shared";

const documentDataUrl = buildGeneratedContentUrl("usa", "document-data.json");
const searchEntriesUrl = buildGeneratedContentUrl("usa", "search-index.json");

const latamPath = getProductPathBySlug("latam");

const {
  ReaderRoot: UsaReaderRoot,
  HomePage: UsaHomePage,
  ChapterPage: UsaChapterPage,
  loadDocumentData,
  loadSearchEntries,
  productMeta: usaProductMeta
} = createConfiguredReader({
  productSlug: "usa",
  documentDataUrl,
  searchEntriesUrl,
  storageKey: "usatm_reading_bookmark",
  topbarKicker: "UsaTm Incubate",
  loadingMessage: "미국 연방 상표 가이드 콘텐츠를 불러오는 중입니다.",
  homeHeroKicker: "미국 단일국가 incubate guide",
  homeSummary: (
    <>
      USPTO 중심의 미국 연방 상표 실무를 빠르게 점검하기 위한 단일국가 가이드입니다.
      권역 단위 구조를 먼저 잡고 싶다면 <Link to={latamPath}>LatTm</Link>에서 큰 흐름을 본 뒤,
      미국 단일 시장 쟁점을 확인할 때 이 트랙으로 내려오는 구성이 자연스럽습니다. 현재는 대형 확장보다 filing basis,
      specimen, monitoring row를 빠르게 다시 보는 reader utility 유지에 초점을 둡니다.
    </>
  ),
  positioningKicker: "UsaTm Positioning",
  positioningTitle: "미국 연방 실무를 lighter depth로 유지하는 incubate guide",
  positioningNote: (
    <>
      현재 UsaTm은 새로 추가된 미국 단일 시장 트랙으로, USPTO 출원, specimen 운영,
      등록 후 유지관리, marketplace 및 분쟁 대응을 미국 연방 기준으로 빠르게 점검하는 용도에
      맞춰져 있습니다. 지금 라운드에서는 대형 확장보다 filing basis row, specimen owner map,
      monitoring triage를 반복 검증하며 lighter track을 안정적으로 유지하는 쪽이 우선입니다.
    </>
  ),
  chapterBadge: "USA",
  chapterEyebrow: "미국 심화 읽기",
  contentStatus: "draft"
});

export {
  UsaChapterPage,
  UsaHomePage,
  UsaReaderRoot,
  loadDocumentData,
  loadSearchEntries,
  usaProductMeta
};
