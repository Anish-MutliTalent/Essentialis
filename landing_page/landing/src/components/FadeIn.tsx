import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  /** Delay before the animation starts (seconds) */
  delay?: number;
  /** Direction to slide from */
  direction?: "up" | "down" | "left" | "right" | "none";
  /** How far to slide (px) */
  distance?: number;
  /** Duration in seconds */
  duration?: number;
  /** Extra class names for the wrapper */
  className?: string;
  /** Margin before viewport trigger (e.g. "-100px") */
  margin?: string;
  /** Only animate once */
  once?: boolean;
}

const directionMap: Record<
  Exclude<FadeInProps["direction"], undefined>,
  { x?: number; y?: number }
> = {
  up: { y: 1 },
  down: { y: -1 },
  left: { x: 1 },
  right: { x: -1 },
  none: {},
};

export const FadeIn = ({
  children,
  delay = 0,
  direction = "up",
  distance = 28,
  duration = 0.75,
  className,
  margin = "-60px",
  once = true,
}: FadeInProps): JSX.Element => {
  const d = directionMap[direction];

  const variants: Variants = {
    hidden: {
      opacity: 0.001, // Prevent browser from culling rendering to force pre-rasterization
      x: d.x != null ? d.x * distance : 0,
      y: d.y != null ? d.y * distance : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // expo out
      },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

/** Staggered children: wrap individual items in <FadeIn.Item> */
export const FadeInStagger = ({
  children,
  stagger = 0.1,
  className,
  margin = "-60px",
  once = true,
  delay = 0,
}: {
  children: ReactNode;
  stagger?: number;
  className?: string;
  margin?: string;
  once?: boolean;
  delay?: number;
}) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0.001 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: stagger,
      },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin }}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
};

export const FadeInItem = ({
  children,
  direction = "up",
  distance = 24,
  duration = 0.65,
  className,
}: {
  children: ReactNode;
  direction?: FadeInProps["direction"];
  distance?: number;
  duration?: number;
  className?: string;
}) => {
  const d = directionMap[direction ?? "up"];

  const variants: Variants = {
    hidden: {
      opacity: 0.001,
      x: d.x != null ? d.x * distance : 0,
      y: d.y != null ? d.y * distance : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
};
