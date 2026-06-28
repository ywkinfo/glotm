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
  topbarKicker: "UsaTm Mature",
  loadingMessage: "미국 연방 상표 가이드 콘텐츠를 불러오는 중입니다.",
  homeHeroKicker: "미국 단일국가 mature guide",
  homeSummary: (
    <>
      USPTO 중심의 미국 연방 상표 실무를 full QA로 점검하는 growth 단일국가 가이드입니다.
      권역 단위 구조를 먼저 잡고 싶다면 <Link to={latamPath}>LatTm</Link>에서 큰 흐름을 본 뒤,
      미국 단일 시장 쟁점을 확인할 때 이 트랙으로 내려오는 구성이 자연스럽습니다. 현재는 filing basis,
      specimen, maintenance, TTAB·법원·플랫폼·CBP 집행 흐름을 하나의 운영 플레이북으로 잇는 데 초점을 둡니다.
    </>
  ),
  positioningKicker: "UsaTm Positioning",
  positioningTitle: "미국 연방 실무를 growth mature lane으로 운영하는 full-QA guide",
  positioningNote: (
    <>
      현재 UsaTm은 USPTO 출원, specimen 운영, 등록 후 유지관리, marketplace 및 분쟁 대응을
      미국 연방 기준으로 연결하는 mature 트랙입니다. 15장 체계와 구조화 claim-map을 기준으로,
      reader가 filing basis부터 집행 포럼 선택까지 이어서 판단할 수 있게 유지합니다.
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
