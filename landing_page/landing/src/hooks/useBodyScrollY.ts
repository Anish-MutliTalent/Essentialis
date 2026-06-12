import { useEffect } from "react";
import { motionValue, MotionValue } from "framer-motion";

/**
 * Shared MotionValue that mirrors the page's scroll position.
 *
 * Why this exists: index.html has `html { overflow: hidden }` and
 * `body { overflow-y: auto }`, so the actual scroll container is
 * `document.body`, not window. `window.scrollY` stays at 0 in this layout,
 * which is why framer-motion's default `useScroll()` (and anything built
 * on it) silently returns 0. We attach native listeners directly to body
 * and surface the value via a single shared MotionValue so every consumer
 * pays the cost once.
 */
const bodyScrollY: MotionValue<number> = motionValue(0);
let listenerAttached = false;

function attach() {
  if (listenerAttached || typeof window === "undefined") return;
  listenerAttached = true;

  const update = () => {
    bodyScrollY.set(
      document.body.scrollTop ||
        document.documentElement.scrollTop ||
        window.scrollY ||
        0,
    );
  };

  document.body.addEventListener("scroll", update, { passive: true });
  window.addEventListener("scroll", update, { passive: true });
  update();
}

export function useBodyScrollY(): MotionValue<number> {
  useEffect(() => {
    attach();
  }, []);
  return bodyScrollY;
}
