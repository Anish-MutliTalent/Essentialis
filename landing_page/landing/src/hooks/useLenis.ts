import { useEffect } from "react";
import Lenis from "lenis";

export let lenisScrollY = 0;
let lenisInstance: InstanceType<typeof Lenis> | null = null;

export function lenisScrollTo(target: number) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { duration: 1.2 });
  } else {
    document.body.scrollTo({ top: target, behavior: "smooth" });
  }
}

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

    lenisInstance = lenis;

    lenis.on("scroll", ({ scroll }: { scroll: number }) => {
      lenisScrollY = scroll;
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
      lenisInstance = null;
    };
  }, []);
}
