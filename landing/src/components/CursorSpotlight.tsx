import { useEffect } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

const CursorSpotlight = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Softer, slower spring for a "torch" feel
    const springConfig = { damping: 30, stiffness: 300 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);

            // Also update CSS vars for other components to use
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            document.documentElement.style.setProperty('--mouse-x', `${x}px`);
            document.documentElement.style.setProperty('--mouse-y', `${y}px`);
        };

        window.addEventListener("mousemove", moveCursor);
        return () => {
            window.removeEventListener("mousemove", moveCursor);
        };
    }, [mouseX, mouseY]);

    return (
        <motion.div
            className="pointer-events-none fixed inset-0 z-30 overflow-hidden mix-blend-screen"
            aria-hidden="true"
        >
            {/* The "Spotlight" - Large ambient glow */}
            <motion.div
                className="absolute w-[600px] h-[600px] bg-gradient-radial from-yellow-400/15 to-transparent blur-[80px]"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: -300,
                    translateY: -300,
                    opacity: 0.8
                }}
            />
        </motion.div>
    );
};

export default CursorSpotlight;
