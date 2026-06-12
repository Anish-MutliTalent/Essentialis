import { useRef, ReactNode, CSSProperties, RefObject } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

interface ParallaxProps {
  /** 0 = no parallax, 0.15 = subtle (decorative images), 0.3 = clear (gradients) */
  strength: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/**
 * Shared container ref pointing at `document.body`, which is this site's actual
 * scroll container (because index.html has `html { overflow: hidden }`, `body
 * { overflow-y: auto }`). Without this, framer-motion defaults to window —
 * which never reports any scroll in this layout.
 */
const bodyContainerRef: { current: HTMLElement | null } = {
  current: typeof document !== "undefined" ? document.body : null,
};

/**
 * Section-progress parallax curve applied to a single element's own ref.
 *
 * Returns a MotionValue<number> suitable for `style={{ y }}`. The curve is:
 *
 *   • At entry (p=0):   -amount  → element sits above its natural position
 *   • Middle (p≈0.4–0.6):    0   → at the designed home position
 *   • At exit (p=1):    +amount  → element drifts below natural, lingering
 *
 * Use this directly on `<motion.img>` / `<motion.div>` when the element has
 * `mix-blend-mode` and is alone (no white-base sibling inside the same
 * wrapper). Applying the transform to the element itself doesn't break its
 * blend, because the blend group composites against the *parent stacking
 * context's* backdrop, which is unaffected by the element's own transform.
 */
export function useElementParallaxY(
  ref: RefObject<HTMLElement>,
  strength: number,
): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target: ref,
    container: bodyContainerRef,
    offset: ["start end", "end start"],
  });
  const amount = strength * 800;
  return useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    [-amount, 0, 0, amount],
  );
}

/**
 * Section-progress parallax wrapper for gradient clusters etc.
 *
 * IMPORTANT — this animates `top`/`bottom`, NOT `transform`.
 *
 * Why: CSS `transform: translate*` on the wrapper creates a stacking context.
 * Children with `mix-blend-mode` inside that stacking context render
 * differently than they do without one — in particular, blending against
 * sibling white-base ellipses gets visually neutered during scroll (the
 * blend mode appears "off"). Animating `top`/`bottom` instead shifts the
 * wrapper without forming a stacking context, so `mix-blend-mode` keeps
 * blending against the white siblings exactly as it does at rest.
 *
 * Performance note: `top`/`bottom` cause layout reflow each frame, where
 * `transform` is GPU-cheap. For ~5 wrappers on the home page this is fine;
 * if it becomes a bottleneck, the alternative is restructuring sections so
 * each blend element gets the parallax transform applied to *itself* (the
 * `useElementParallaxY` pattern), which preserves blend even with transform.
 *
 * Caveat — slight convergence wobble: the wrapper itself is the
 * `useScroll(target)`, and shifting it via `top` changes its rect, which
 * feeds back into `scrollYProgress`. The system settles to a fixed point
 * within a couple of frames, so the parallax magnitude is ~70–80% of the
 * configured `strength × 800`. Bumped accordingly to compensate.
 */
export const Parallax = ({
  strength,
  className,
  style,
  children,
}: ParallaxProps): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    container: bodyContainerRef,
    offset: ["start end", "end start"],
  });

  const amount = strength * 800;

  // top and bottom move together so the wrapper shifts without resizing
  // (for wrappers with `inset-0` className). For wrappers with explicit
  // width/height, the browser ignores the bottom value and only top
  // shifts the box — also fine.
  const top = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    [-amount, 0, 0, amount],
  );
  const bottom = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    [amount, 0, 0, -amount],
  );

  return (
    <motion.div ref={ref} className={className} style={{ ...style, top, bottom }}>
      {children}
    </motion.div>
  );
};
