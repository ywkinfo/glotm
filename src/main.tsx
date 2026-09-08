import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./app/App";
import { syncScrollRestorationForLocation } from "./app/scrollRestoration";
import "./styles.css";

// React가 마운트되기 전에 정한다. 브라우저의 스크롤 복원은 문서가 아직 짧은 부팅 초기에
// 대상 오프셋을 잡으므로, effect까지 기다리면 이미 늦다.
syncScrollRestorationForLocation(window.location.hash);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
