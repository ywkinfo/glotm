import { defineConfig } from "@playwright/test";

// `/glotm/` 배포 경로 검증은 별도 빌드(`build:pages:glotm`)를 소비하므로 기본 실행과 섞지 않는다.
// 두 모드가 같은 `dist/`를 쓰기 때문에 동시에 돌리면 서로의 산출물을 덮어쓴다.
const isPagesSubpathRun = process.env.PLAYWRIGHT_PAGES_SUBPATH === "1";

const rootPreviewCommand =
  "env -u NO_COLOR npm run build && env -u NO_COLOR npm run preview -- --host 127.0.0.1 --port 4273 --strictPort";

// subpath 모드는 `npm run e2e:subpath`가 직전에 만든 `/glotm/` 산출물을 그대로 서빙한다
// (같은 dist를 두 번 빌드하지 않는다).
const pagesSubpathPreviewCommand =
  "env -u NO_COLOR PAGES_BASE_PATH=/glotm/ npm run preview -- --host 127.0.0.1 --port 4274 --strictPort";

// 실행 환경에 이미 있는 chromium을 가리키기 위한 opt-in 탈출구다. 원격 에이전트 컨테이너처럼 이미지가
// 굽어 나온 뒤 playwright 버전이 올라간 환경에서는 설치된 리비전과 이 저장소가 고정한 버전이 어긋나
// e2e 스텝이 **코드와 무관한 이유로** 붉어진다(브라우저를 새로 내려받을 수 없는 환경이 많다).
// 변수를 두지 않으면 아무것도 바뀌지 않는다 — CI는 `playwright install`이 놓은 기본 경로를 그대로 쓴다.
const chromiumExecutablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;

export default defineConfig({
  testDir: "./e2e",
  testIgnore: isPagesSubpathRun ? undefined : "subpath/**",
  timeout: 30_000,
  fullyParallel: true,
  retries: 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [["line"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  outputDir: "test-results/playwright",
  use: {
    baseURL: isPagesSubpathRun ? "http://127.0.0.1:4274/glotm/" : "http://127.0.0.1:4273",
    headless: true,
    viewport: {
      width: 1280,
      height: 720
    },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    ...(chromiumExecutablePath
      ? { launchOptions: { executablePath: chromiumExecutablePath } }
      : {})
  },
  webServer: {
    command: isPagesSubpathRun ? pagesSubpathPreviewCommand : rootPreviewCommand,
    url: isPagesSubpathRun ? "http://127.0.0.1:4274/glotm/" : "http://127.0.0.1:4273",
    reuseExistingServer: true,
    timeout: 120_000
  }
});
