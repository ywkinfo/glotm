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
  topbarKicker: "JapTm Beta",
  loadingMessage: "일본 상표 가이드 콘텐츠를 불러오는 중입니다.",
  homeHeroKicker: "일본 단일국가 beta guide",
  homeSummary: (
    <>
      일본 단일 시장 상표 실무를 beta lighter-track으로 빠르게 점검하기 위한 단일국가
      가이드입니다. 권역 단위 구조를 먼저 잡고 싶다면 <Link to={latamPath}>LatTm</Link>에서
      큰 흐름을 본 뒤, 일본 출원·유지·분쟁 쟁점을 확인할 때 이 트랙으로 내려오는 구성이
      자연스럽습니다. 현재는 대형 확장보다 route memo, maintenance owner map, evidence
      hygiene quick check를 더 빨리 다시 찾는 lighter-track reader utility와 standard QA
      refresh 유지에 초점을 둡니다.
    </>
  ),
  positioningKicker: "JapTm Positioning",
  positioningTitle: "일본 단일 시장 실무를 beta lighter-track으로 유지하는 incubate guide",
  positioningNote: (
    <>
      현재 JapTm은 JPO 출원, 일본어 표기 설계, 등록 후 유지관리, 세관·분쟁 대응을 일본 단일 시장
      기준으로 빠르게 점검하는 용도에 맞춰져 있습니다. 지금 라운드에서는 대형 확장보다 경로 선택
      메모, 유지관리 owner map, evidence hygiene quick check를 반복 검증하며 lighter track을
      안정적으로 유지하되, beta / standard QA 기준에서 이어 읽기와 search handoff가 흔들리지
      않게 다듬는 쪽이 우선입니다.
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
