import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Initialises Lenis smooth scroll.
 *
 * The project's index.html sets `html { overflow: hidden; height: 100% }` and
 * `body { overflow-y: auto }`, so `body` is the actual scroll container.
 * We must pass `wrapper: body, content: body's first child` so Lenis attaches
 * to the right element instead of window.
 *
 * Uses a `stopped` flag so the recursive RAF chain fully terminates
 * on cleanup (important for React StrictMode double-invoke).
 */
export function useLenis() {
  useEffect(() => {
    const wrapper = document.body;
    const content = document.getElementById("app");

    if (!content) return;

    const lenis = new Lenis({
      wrapper,
      content,
      duration: 1.2,
      smoothWheel: true,
      touchMultiplier: 1.8,
    });

    let rafId: number;
    let stopped = false;

    function raf(time: number) {
      if (stopped) return;
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      stopped = true;
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
}
