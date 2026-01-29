import { motion, useScroll, useTransform, useTime } from "framer-motion";

const LivingBlueprint = () => {
    const { scrollYProgress } = useScroll();
    const time = useTime();
    
    // Multiple parallax layers at different speeds
    const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
    const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
    const y3 = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);
    
    // Continuous rotations at different speeds
    const rotateSlow = useTransform(time, [0, 120000], [0, 360]);
    const rotateMedium = useTransform(time, [0, 60000], [0, 360]);
    const rotateReverse = useTransform(time, [0, 80000], [0, -360]);
    
    // Pulsing effects
    const pulse1 = useTransform(time, (t) => 0.5 + Math.sin(t / 2000) * 0.3);
    const pulse2 = useTransform(time, (t) => 0.6 + Math.sin(t / 3000 + 1) * 0.25);

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {/* 1. Deep Dark Background */}
            <div className="absolute inset-0 bg-[#030303]" />

            {/* 2. Primary Node Grid */}
            <div 
                className="absolute inset-0 opacity-40"
                style={{ 
                    backgroundImage: 'radial-gradient(circle, rgba(234, 179, 8, 0.3) 1px, transparent 1px)',
                    backgroundSize: '50px 50px',
                }} 
            />
            
            {/* 3. Fine Grid Lines */}
            <div 
                className="absolute inset-0 opacity-15"
                style={{ 
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                    backgroundSize: '25px 25px',
                }} 
            />

            {/* ==================== SCATTERED ELEMENTS ==================== */}

            {/* Element 1: Top-Left Shield */}
            <motion.div 
                className="absolute w-[180px] h-[180px]"
                style={{ top: "10%", left: "8%", y: y2, rotate: rotateSlow }}
            >
                <div className="absolute inset-0 border-2 border-yellow-500/40 rounded-full" />
                <div className="absolute inset-6 border border-dashed border-white/20 rounded-full" />
                <motion.div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-500/70 rounded-full blur-sm shadow-[0_0_20px_rgba(234,179,8,0.8)]"
                    style={{ opacity: pulse1 }}
                />
            </motion.div>

            {/* Element 2: Top-Right Circuit Node */}
            <motion.div 
                className="absolute w-[160px] h-[160px]"
                style={{ top: "8%", right: "10%", y: y3 }}
            >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <rect x="15" y="15" width="70" height="70" fill="none" stroke="rgba(234, 179, 8, 0.5)" strokeWidth="1.5" />
                    <rect x="28" y="28" width="44" height="44" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
                    <circle cx="50" cy="50" r="12" fill="none" stroke="rgba(234, 179, 8, 0.6)" strokeWidth="1" />
                    <line x1="50" y1="0" x2="50" y2="15" stroke="rgba(234, 179, 8, 0.4)" strokeWidth="1" />
                    <line x1="50" y1="85" x2="50" y2="100" stroke="rgba(234, 179, 8, 0.4)" strokeWidth="1" />
                    <line x1="0" y1="50" x2="15" y2="50" stroke="rgba(234, 179, 8, 0.4)" strokeWidth="1" />
                    <line x1="85" y1="50" x2="100" y2="50" stroke="rgba(234, 179, 8, 0.4)" strokeWidth="1" />
                </svg>
            </motion.div>

            {/* Element 3: Left Side Hexagon */}
            <motion.div 
                className="absolute w-[220px] h-[220px]"
                style={{ top: "38%", left: "5%", y: y1, rotate: rotateReverse }}
            >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <polygon points="50 5, 88 27, 88 73, 50 95, 12 73, 12 27" fill="none" stroke="rgba(234, 179, 8, 0.6)" strokeWidth="1.2" />
                    <polygon points="50 18, 78 35, 78 65, 50 82, 22 65, 22 35" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.8" />
                    <polygon points="50 30, 68 42, 68 58, 50 70, 32 58, 32 42" fill="none" stroke="rgba(234, 179, 8, 0.4)" strokeWidth="0.6" />
                </svg>
            </motion.div>

            {/* Element 4: MAIN CENTER - The Vault Core (FIXED POSITION) */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[min(450px,65vw)] h-[min(450px,65vw)] relative">
                    {/* Outer Ring */}
                    <motion.div 
                        className="absolute inset-0 border-2 border-white/15 rounded-full"
                        style={{ rotate: rotateMedium }}
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-yellow-500 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.9)]" />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-yellow-500 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.9)]" />
                        <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-yellow-500 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.9)]" />
                        <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-yellow-500 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.9)]" />
                    </motion.div>

                    {/* Middle Dashed Ring */}
                    <motion.div 
                        className="absolute inset-[15%] border-2 border-dashed border-yellow-500/50 rounded-full"
                        style={{ rotate: rotateReverse }}
                    />

                    {/* Inner Hexagon */}
                    <div className="absolute inset-[28%] flex items-center justify-center">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                            <polygon points="50 5, 92 28, 92 72, 50 95, 8 72, 8 28" fill="none" stroke="rgba(234, 179, 8, 0.7)" strokeWidth="1.5" />
                            <polygon points="50 18, 80 35, 80 65, 50 82, 20 65, 20 35" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" />
                        </svg>
                    </div>
                    
                    {/* Core Pulse */}
                    <motion.div 
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-yellow-500 rounded-full blur-sm shadow-[0_0_40px_rgba(234,179,8,1)]"
                        style={{ opacity: pulse2 }}
                    />
                </div>
            </div>

            {/* Element 5: Right Side - Data Flow Lines */}
            <motion.div 
                className="absolute w-[140px] h-[280px]"
                style={{ top: "35%", right: "6%", y: y2 }}
            >
                <svg viewBox="0 0 70 140" className="w-full h-full">
                    <line x1="15" y1="0" x2="15" y2="140" stroke="rgba(234, 179, 8, 0.5)" strokeWidth="1" strokeDasharray="6 10" />
                    <line x1="35" y1="0" x2="35" y2="140" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="0.8" strokeDasharray="4 8" />
                    <line x1="55" y1="0" x2="55" y2="140" stroke="rgba(234, 179, 8, 0.4)" strokeWidth="1" strokeDasharray="8 12" />
                    <circle cx="15" cy="35" r="5" fill="rgba(234, 179, 8, 0.6)" />
                    <circle cx="55" cy="70" r="5" fill="rgba(234, 179, 8, 0.6)" />
                    <circle cx="35" cy="105" r="5" fill="rgba(234, 179, 8, 0.6)" />
                </svg>
            </motion.div>

            {/* Element 6: Bottom-Left - Lock Symbol */}
            <motion.div 
                className="absolute w-[150px] h-[150px]"
                style={{ bottom: "12%", left: "10%", y: y1, rotate: rotateSlow }}
            >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <rect x="20" y="45" width="60" height="45" rx="5" fill="none" stroke="rgba(234, 179, 8, 0.6)" strokeWidth="1.5" />
                    <path d="M32 45 V28 A18 18 0 0 1 68 28 V45" fill="none" stroke="rgba(234, 179, 8, 0.5)" strokeWidth="1.5" />
                    <circle cx="50" cy="65" r="8" fill="none" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1" />
                    <line x1="50" y1="73" x2="50" y2="82" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="3" />
                </svg>
            </motion.div>

            {/* Element 7: Bottom-Right - Blockchain */}
            <motion.div 
                className="absolute w-[200px] h-[100px]"
                style={{ bottom: "15%", right: "8%", y: y3 }}
            >
                <svg viewBox="0 0 100 50" className="w-full h-full">
                    <rect x="0" y="10" width="25" height="25" fill="none" stroke="rgba(234, 179, 8, 0.5)" strokeWidth="1" />
                    <line x1="25" y1="22" x2="37" y2="22" stroke="rgba(234, 179, 8, 0.4)" strokeWidth="1" />
                    <rect x="37" y="10" width="25" height="25" fill="none" stroke="rgba(234, 179, 8, 0.6)" strokeWidth="1.2" />
                    <line x1="62" y1="22" x2="74" y2="22" stroke="rgba(234, 179, 8, 0.4)" strokeWidth="1" />
                    <rect x="74" y="10" width="25" height="25" fill="none" stroke="rgba(234, 179, 8, 0.5)" strokeWidth="1" />
                    <line x1="5" y1="18" x2="20" y2="18" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="0.5" />
                    <line x1="5" y1="23" x2="15" y2="23" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.5" />
                    <line x1="42" y1="18" x2="57" y2="18" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="0.5" />
                    <line x1="42" y1="23" x2="52" y2="23" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.5" />
                    <line x1="79" y1="18" x2="94" y2="18" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="0.5" />
                    <line x1="79" y1="23" x2="89" y2="23" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.5" />
                </svg>
            </motion.div>

            {/* Element 8: Scattered Pulsing Nodes */}
            <motion.div className="absolute w-4 h-4 bg-yellow-500/60 rounded-full blur-[2px] shadow-[0_0_15px_rgba(234,179,8,0.7)]" style={{ top: "28%", left: "28%", opacity: pulse1, y: y1 }} />
            <motion.div className="absolute w-3 h-3 bg-yellow-500/50 rounded-full blur-[2px] shadow-[0_0_12px_rgba(234,179,8,0.6)]" style={{ top: "65%", left: "22%", opacity: pulse2, y: y2 }} />
            <motion.div className="absolute w-4 h-4 bg-yellow-500/55 rounded-full blur-[2px] shadow-[0_0_15px_rgba(234,179,8,0.7)]" style={{ top: "18%", right: "28%", opacity: pulse1, y: y3 }} />
            <motion.div className="absolute w-3 h-3 bg-yellow-500/50 rounded-full blur-[2px] shadow-[0_0_12px_rgba(234,179,8,0.6)]" style={{ top: "72%", right: "25%", opacity: pulse2, y: y1 }} />

            {/* ==================== DATA LABELS ==================== */}
            <motion.div className="absolute font-mono text-[11px] text-yellow-500/50 tracking-widest" style={{ top: "20%", left: "15%", y: y2 }}>
                NODE::0x7f3a
            </motion.div>
            <motion.div className="absolute font-mono text-[11px] text-yellow-500/40 tracking-widest" style={{ top: "25%", right: "18%", y: y3 }}>
                CHAIN::L2
            </motion.div>
            <motion.div className="absolute font-mono text-[11px] text-yellow-500/50 tracking-widest" style={{ bottom: "30%", left: "20%", y: y1 }}>
                ZK::VERIFIED
            </motion.div>
            <motion.div className="absolute font-mono text-[11px] text-yellow-500/40 tracking-widest" style={{ bottom: "25%", right: "20%", y: y2 }}>
                IPFS::Qm...
            </motion.div>
            <motion.div className="absolute font-mono text-[10px] text-white/25 tracking-widest" style={{ top: "52%", left: "12%", y: y1 }}>
                AES-256
            </motion.div>
            <motion.div className="absolute font-mono text-[10px] text-white/25 tracking-widest" style={{ top: "58%", right: "8%", y: y2 }}>
                RSA-4096
            </motion.div>

            {/* ==================== VIGNETTE ==================== */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,#030303_75%)] opacity-70" />
        </div>
    );
};

export default LivingBlueprint;
