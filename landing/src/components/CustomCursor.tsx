import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

const CustomCursor = () => {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    
    // Smooth trailing spring for the outer ring
    const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Hide default cursor
        document.body.style.cursor = 'none';

        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isClickable = 
                window.getComputedStyle(target).cursor === 'pointer' || 
                target.tagName.toLowerCase() === 'a' || 
                target.tagName.toLowerCase() === 'button' ||
                target.closest('a') || 
                target.closest('button');

            setIsHovering(!!isClickable);
        };

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mouseover", handleMouseOver);
        
        return () => {
            document.body.style.cursor = 'auto';
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] overflow-visible mix-blend-difference">
            {/* The Outer Trailing Ring */}
            <motion.div
                className="absolute w-8 h-8 rounded-full border border-yellow-400/80 -translate-x-1/2 -translate-y-1/2 will-change-transform"
                style={{ x: cursorXSpring, y: cursorYSpring }}
                animate={{
                    scale: isHovering ? 1.5 : 1,
                    backgroundColor: isHovering ? 'rgba(250, 204, 21, 0.1)' : 'transparent',
                }}
                transition={{ duration: 0.15 }}
            />
            {/* The inner instantaneous dot */}
            <motion.div
                className="absolute w-1.5 h-1.5 rounded-full bg-yellow-400 -translate-x-1/2 -translate-y-1/2 will-change-transform"
                style={{ x: cursorX, y: cursorY }}
                animate={{
                    scale: isHovering ? 0 : 1,
                }}
                transition={{ duration: 0.15 }}
            />
        </div>
    );
};

export default CustomCursor;
