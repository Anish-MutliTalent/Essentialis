import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

const LivingBlueprint = () => {
    // track cursor
    const mouseX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
    const mouseY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0);
    const smoothMouseX = useSpring(mouseX, { stiffness: 40, damping: 15 });
    const smoothMouseY = useSpring(mouseY, { stiffness: 40, damping: 15 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#030308]">
            {/* Deep Black Foundation */}
            <div className="absolute inset-0 bg-[#030308]" />

            {/* ---- Vibrant Rainbow Orbs on Deep Black ---- */}
            
            {/* Electric Blue / Cyan — top-left */}
            <motion.div
                animate={{
                    scale: [1, 1.25, 1],
                    x: [0, 80, -40, 0],
                    y: [0, -60, 50, 0],
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute top-[5%] left-[10%] w-[600px] h-[600px] rounded-full mix-blend-screen opacity-50"
                style={{ background: "radial-gradient(circle, rgba(0,180,255,0.35) 0%, rgba(80,50,255,0.15) 40%, transparent 60%)", filter: "blur(90px)" }}
            />
            
            {/* Magenta / Violet — bottom-right */}
            <motion.div
                animate={{
                    scale: [1, 1.4, 1],
                    x: [0, -80, 60, 0],
                    y: [0, 80, -30, 0],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[2%] right-[5%] w-[800px] h-[800px] rounded-full mix-blend-screen opacity-55"
                style={{ background: "radial-gradient(circle, rgba(200,50,200,0.30) 0%, rgba(100,20,255,0.20) 40%, transparent 70%)", filter: "blur(110px)" }}
            />

            {/* Warm Amber / Orange — center-right, slower orbit */}
            <motion.div
                animate={{
                    scale: [1, 1.15, 0.95, 1],
                    x: [0, -60, 40, 0],
                    y: [0, 40, -60, 0],
                }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                className="absolute top-[40%] right-[15%] w-[500px] h-[500px] rounded-full mix-blend-screen opacity-40"
                style={{ background: "radial-gradient(circle, rgba(255,140,30,0.25) 0%, rgba(255,60,100,0.12) 50%, transparent 70%)", filter: "blur(100px)" }}
            />

            {/* Emerald / Teal — bottom-left */}
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    x: [0, 50, -30, 0],
                    y: [0, -40, 70, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[15%] left-[8%] w-[450px] h-[450px] rounded-full mix-blend-screen opacity-35"
                style={{ background: "radial-gradient(circle, rgba(16,220,130,0.25) 0%, rgba(0,180,255,0.10) 50%, transparent 70%)", filter: "blur(95px)" }}
            />

            {/* Cursor Interaction Glow — subtle rainbow-tint following cursor */}
            <motion.div
                className="absolute mix-blend-screen opacity-100 z-10"
                style={{
                    x: smoothMouseX,
                    y: smoothMouseY,
                    width: "500px",
                    height: "500px",
                    translateX: "-50%",
                    translateY: "-50%",
                    background: "radial-gradient(circle, rgba(255,255,255,0.10) 0%, rgba(140,80,255,0.06) 30%, transparent 60%)",
                    filter: "blur(50px)",
                }}
            />

            {/* High-Volume Static Grain Noise */}
            <div className="absolute inset-[-20%] w-[140%] h-[140%] opacity-[0.50] pointer-events-none">
                <svg className="w-full h-full text-transparent" preserveAspectRatio="none">
                    <filter id="noiseFilter">
                        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                        <feColorMatrix type="saturate" values="0" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
                </svg>
            </div>
            
            {/* Deep Edge Vignette — stronger for contrast on the deep black */}
            <div className="absolute inset-0 z-20 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 25%, #030308 90%)", opacity: 0.9 }} />
        </div>
    );
};

export default LivingBlueprint;
