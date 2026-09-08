type ScrollRestorationMode = "auto" | "manual";

// 해시가 붙은 주소에서는 앵커 위치를 **앱이 소유한다**. 브라우저의 자동 스크롤 복원을 켜 둔 채로는
// 새로고침 시 다음이 벌어진다:
//
//   1. 새로고침 직후 SPA가 부팅하는 동안 문서가 짧다(실측 373~533px).
//   2. 브라우저가 그 시점 기준의 오프셋을 복원 대상으로 잡는다.
//   3. 앱이 문서 데이터를 받아 앵커로 정확히 이동한다(예: scrollY 3474).
//   4. 브라우저의 지연된 스크롤 복원이 뒤늦게 적용되며 2번의 낡은 오프셋으로 되돌린다.
//
// `/glotm/` 배포 경로에서 부하를 준 실측: 자동 복원 12/30 실패, 수동 전환 0/30 실패.
// 사용자에게는 "딥링크를 새로고침하면 문서 맨 위 근처로 튕긴다"로 보인다.
//
// 해시가 없는 주소에서는 브라우저 복원이 정상적인 기능이므로 다시 켠다.
function setScrollRestoration(mode: ScrollRestorationMode) {
  if (typeof window === "undefined" || !window.history) {
    return;
  }

  if (!("scrollRestoration" in window.history)) {
    return;
  }

  try {
    window.history.scrollRestoration = mode;
  } catch {
    // 일부 환경에서 쓰기가 막혀 있어도 읽기 흐름을 막지 않는다.
  }
}

export function syncScrollRestorationForLocation(hash: string) {
  setScrollRestoration(hash ? "manual" : "auto");
}
