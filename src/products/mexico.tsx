import { Link } from "react-router-dom";

import { createConfiguredReader } from "./configuredReader";
import { getProductPathBySlug } from "./registry";
import documentDataUrl from "../../MexTm/content/generated/document-data.json?url";
import searchEntriesUrl from "../../MexTm/content/generated/search-index.json?url";

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
  topbarKicker: "MexTm Beta",
  loadingMessage: "멕시코 심화 가이드 콘텐츠를 불러오는 중입니다.",
  homeHeroKicker: "멕시코 심화 트랙",
  homeSummary: (
    <>
      멕시코 IMPI 절차와 실무 쟁점을 더 깊게 탐색하기 위한 심화 가이드입니다.
      권역 단위 구조를 먼저 잡고 싶다면 <Link to={latamPath}>LatTm</Link>에서 큰 흐름을 본 뒤
      이 트랙으로 내려오는 구성이 가장 자연스럽습니다.
    </>
  ),
  homeStatusLabel: "Beta 상태의 멕시코 단일 시장 심화 가이드",
  positioningKicker: "MexTm Positioning",
  positioningTitle: "LatTm 다음 단계의 심화 탐색",
  positioningNote: (
    <>
      현재 MexTm은 독립 제품이기보다 라틴아메리카 파일럿 안에서 멕시코를 우선 시장으로 깊게
      다루는 심화 레이어입니다. 출원 경로, IMPI 대응, 사후 유지관리, 집행 이슈를 멕시코 단일
      시장 기준으로 더 세밀하게 훑는 용도에 맞춰져 있습니다.
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
