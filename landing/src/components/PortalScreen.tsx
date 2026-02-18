import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ShieldCheck, Database, Fingerprint, Activity } from "lucide-react";

interface PortalScreenProps {
    onEnter: () => void;
    onAppReady: boolean;
}

const PortalScreen = ({ onEnter, onAppReady }: PortalScreenProps) => {
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [ready, setReady] = useState(false);
    const [showStory, setShowStory] = useState(0);

    const storyline = [
        "In an era of total digital surveillance...",
        "Welcome to the Essentialis Archive."
    ];

    useEffect(() => {
        // We only progress the visual loader to 90% until the app is ACTUALLY ready
        const interval = setInterval(() => {
            setLoadingProgress((prev) => {
                if (prev >= 90 && !onAppReady) {
                    return 90; // Stall at 90% if app not ready
                }
                if (prev >= 100) {
                    clearInterval(interval);
                    setReady(true);
                    return 100;
                }
                // If app IS ready, we can jump to 100 fast
                const jump = onAppReady ? 10 : 2;
                return prev + Math.random() * jump;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [onAppReady]);

    useEffect(() => {
        if (showStory < storyline.length) {
            const timer = setTimeout(() => {
                setShowStory(prev => prev + 1);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [showStory]);

    const isFullyReady = ready && showStory >= storyline.length - 1 && onAppReady;

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="fixed inset-0 z-[100] bg-[#020202] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden"
        >
            {/* 1. Cinematic Frame Elements */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Scanning Line */}
                <motion.div
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent z-10"
                />

                {/* Grid Overlay */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(234, 179, 8, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(234, 179, 8, 0.5) 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
            </div>

            {/* 2. BRIGHTER Corner HUD Graphics (Reveal when ready) */}
            <AnimatePresence>
                {isFullyReady && (
                    <>
                        {/* Top-Left */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: -20, y: -20 }}
                            animate={{ opacity: 0.6, scale: 1, x: 0, y: 0 }}
                            className="absolute top-12 left-12 text-yellow-500 hidden lg:block"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 border border-yellow-500/30 rounded-lg bg-yellow-500/5">
                                    <Database className="w-8 h-8" />
                                </div>
                                <div className="text-left">
                                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-yellow-500/50">System_Node</div>
                                    <div className="font-mono text-xs font-bold text-yellow-500">VAULT_01::CONNECTED</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Top-Right */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: 20, y: -20 }}
                            animate={{ opacity: 0.6, scale: 1, x: 0, y: 0 }}
                            className="absolute top-12 right-12 text-yellow-500 text-right hidden lg:block"
                        >
                            <div className="flex items-center gap-4 justify-end">
                                <div className="text-right">
                                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-yellow-500/50">Pulse_Monitor</div>
                                    <div className="font-mono text-xs font-bold text-yellow-500">LNCY::0.42ms</div>
                                </div>
                                <div className="p-3 border border-yellow-500/30 rounded-lg bg-yellow-500/5">
                                    <Activity className="w-8 h-8" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Bottom-Left */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: -20, y: 20 }}
                            animate={{ opacity: 0.6, scale: 1, x: 0, y: 0 }}
                            className="absolute bottom-12 left-12 text-yellow-500 hidden lg:block"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 border border-yellow-500/30 rounded-lg bg-yellow-500/5">
                                    <Fingerprint className="w-8 h-8" />
                                </div>
                                <div className="text-left">
                                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-yellow-500/50">Access_Key</div>
                                    <div className="font-mono text-xs font-bold text-yellow-500">SIG::VERIFIED_ZK</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Bottom-Right */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: 20, y: 20 }}
                            animate={{ opacity: 0.6, scale: 1, x: 0, y: 0 }}
                            className="absolute bottom-12 right-12 text-yellow-500 text-right hidden lg:block"
                        >
                            <div className="flex items-center gap-4 justify-end">
                                <div className="text-right">
                                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-yellow-500/50">Protocols</div>
                                    <div className="font-mono text-xs font-bold text-yellow-500">AES_256::ACTIVE</div>
                                </div>
                                <div className="p-3 border border-yellow-500/30 rounded-lg bg-yellow-500/5">
                                    <ShieldCheck className="w-8 h-8" />
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* 3. Main Content Container */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl gap-8">
                {/* Storyline - Shifted Up */}
                <div className="h-20 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={showStory}
                            initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
                            transition={{ duration: 0.7 }}
                            className="text-lg md:text-2xl text-yellow-500/60 font-medium tracking-[0.15em] uppercase font-mono"
                        >
                            {storyline[showStory] || ""}
                        </motion.p>
                    </AnimatePresence>
                </div>

                {/* Logo Area - Centered & Large */}
                <div className="relative flex flex-col items-center justify-center min-h-[300px]">
                    {/* Render immediately for LCP */}
                    <motion.div
                        initial={{ opacity: 0.01, scale: 0.95, filter: 'brightness(0.5)' }}
                        animate={{
                            opacity: showStory >= storyline.length - 1 ? 1 : 0.3,
                            scale: showStory >= storyline.length - 1 ? 1 : 0.98,
                            filter: showStory >= storyline.length - 1 ? 'brightness(1)' : 'brightness(0.5)'
                        }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="relative group cursor-pointer"
                    >
                        {/* Logo Inner Glow */}
                        <div className="absolute inset-0 bg-yellow-500/20 blur-[60px] rounded-full scale-75 animate-pulse" />

                        <img
                            src="/essentialis.svg"
                            alt="Essentialis Logo"
                            className="w-48 h-48 md:w-64 md:h-64 relative z-10 drop-shadow-[0_0_45px_rgba(234,179,8,0.4)] transition-transform duration-700 group-hover:scale-105"
                            fetchpriority="high"
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: showStory >= storyline.length - 1 ? 0.7 : 0, y: showStory >= storyline.length - 1 ? 0 : 10 }}
                            transition={{ delay: 0.2, duration: 1 }}
                            className="mt-8 text-center"
                        >
                            <div className="text-yellow-500 tracking-[0.8em] uppercase font-black text-xs">Essentialis</div>
                            <div className="mt-2 text-white/30 tracking-[0.3em] uppercase font-bold text-[9px]">Sovereign Archive Ecosystem</div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Interaction Area - Anchored Bottom */}
                <div className="mt-4 flex flex-col items-center min-h-[100px] w-full max-w-md">
                    {!isFullyReady ? (
                        <div className="w-64 relative">
                            <div className="flex justify-between mb-2 font-mono text-[9px] text-yellow-500/40 uppercase tracking-widest">
                                <span>Initializing_Vault</span>
                                <span>{Math.round(loadingProgress)}%</span>
                            </div>
                            <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-yellow-500/80"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${loadingProgress}%` }}
                                    transition={{ type: "spring", stiffness: 50, damping: 20 }}
                                />
                            </div>
                        </div>
                    ) : (
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.02, backgroundColor: "rgba(234, 179, 8, 0.15)" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onEnter}
                            className="group relative px-12 py-4 rounded-xl border border-yellow-500/40 bg-yellow-500/5 text-yellow-500 font-black text-sm tracking-[0.3em] backdrop-blur-xl transition-all duration-500 hover:border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.1)] overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-yellow-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            <span className="relative z-10 flex items-center gap-4">
                                DECRYPT & ENTER
                                <Zap className="w-5 h-5 fill-yellow-500 animate-pulse" />
                            </span>
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Background Blur Blobs */}
            <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-yellow-500/[0.02] blur-[150px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-yellow-500/[0.02] blur-[150px] translate-y-1/2 -translate-x-1/2" />
        </motion.div>
    );
};

export default PortalScreen;
