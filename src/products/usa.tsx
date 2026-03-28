import { Link } from "react-router-dom";

import { createConfiguredReader } from "./configuredReader";
import documentDataUrl from "../../UsaTm/content/generated/document-data.json?url";
import searchEntriesUrl from "../../UsaTm/content/generated/search-index.json?url";

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
  topbarKicker: "UsaTm Beta",
  loadingMessage: "미국 연방 상표 가이드 콘텐츠를 불러오는 중입니다.",
  homeHeroKicker: "미국 연방 심화 트랙",
  homeSummary: (
    <>
      USPTO 중심의 미국 연방 상표 실무를 빠르게 점검하기 위한 단일국가 가이드입니다.
      권역 단위 구조를 먼저 잡고 싶다면 <Link to="/latam">LatTm</Link>에서 큰 흐름을 본 뒤,
      미국 단일 시장 쟁점을 확인할 때 이 트랙으로 내려오는 구성이 자연스럽습니다.
    </>
  ),
  homeStatusLabel: "Beta 상태의 미국 연방 단일 시장 심화 가이드",
  positioningKicker: "UsaTm Positioning",
  positioningTitle: "미국 연방 실무를 빠르게 점검하는 신규 트랙",
  positioningNote: (
    <>
      현재 UsaTm은 새로 추가된 미국 단일 시장 트랙으로, USPTO 출원, specimen 운영,
      등록 후 유지관리, marketplace 및 분쟁 대응을 미국 연방 기준으로 빠르게 점검하는 용도에
      맞춰져 있습니다.
    </>
  ),
  chapterBadge: "USA",
  chapterEyebrow: "미국 심화 읽기"
});

export {
  UsaChapterPage,
  UsaHomePage,
  UsaReaderRoot,
  loadDocumentData,
  loadSearchEntries,
  usaProductMeta
};
