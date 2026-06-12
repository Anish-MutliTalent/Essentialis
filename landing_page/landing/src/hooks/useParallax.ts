import { useTransform, MotionValue } from "framer-motion";
import { useBodyScrollY } from "./useBodyScrollY";

/**
 * Scroll-driven parallax offset.
 *
 * `strength` is the fraction of scroll the element lags by:
 *   0    → moves with content (no parallax)
 *   0.15 → decorative images (lock, shield) — subtly slower
 *   0.3  → gradient clusters / globes — clearly slower
 *
 * Positive strength shifts the element DOWN as the page scrolls down,
 * so it appears to scroll slower than its surrounding content.
 *
 * Reads from `useBodyScrollY` rather than framer-motion's `useScroll`,
 * because this project's actual scroll container is `document.body`,
 * not window — see useBodyScrollY for the explanation.
 */
export function useParallax(strength: number): MotionValue<number> {
  const scrollY = useBodyScrollY();
  return useTransform(scrollY, (v) => v * strength);
}
