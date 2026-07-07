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
  topbarKicker: "UKTm Mature",
  loadingMessage: "영국 상표 가이드 콘텐츠를 불러오는 중입니다.",
  homeHeroKicker: "영국 단일국가 mature guide",
  homeSummary: (
    <>
      UKIPO 중심의 영국 단일 시장 상표 실무를 full QA로 점검하는 growth 단일국가 가이드입니다. EU 공통 프레임과 병행해
      읽고 싶다면 <Link to={europePath}>EuTm</Link>으로 큰 구조를 먼저 잡은 뒤, 영국 단일국가
      판단이 필요한 순간 이 트랙으로 내려오는 구성이 자연스럽습니다. 현재는 filing 전략, 사용증거와 non-use 방어,
      플랫폼·도메인·세관·법원 집행을 다중 포럼 오케스트레이션으로 잇는 데 초점을 둡니다.
    </>
  ),
  positioningKicker: "UKTm Positioning",
  positioningTitle: "영국 단일 시장 실무를 growth mature lane으로 운영하는 full-QA guide",
  positioningNote: (
    <>
      현재 UKTm은 UKIPO 중심 출원 흐름, 사용증거와 non-use cancellation, 영국 온라인 침해와
      분쟁 대응을 단일 시장 기준으로 연결하는 mature 트랙입니다. 15장 체계와 구조화 claim-map을 기준으로,
      reader가 filing 판단부터 다중 포럼 집행 오케스트레이션까지 이어서 볼 수 있게 유지합니다.
    </>
  ),
  chapterBadge: "UK",
  chapterEyebrow: "영국 심화 읽기"
});

export {
  UkChapterPage,
  UkChapterRoot as UkReaderRoot,
  UkHomePage,
  loadDocumentData,
  loadSearchEntries,
  ukProductMeta
};
