import { memo, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface CinemaVideoProps {
    src?: string;
    title?: string;
    subtext?: string;
}

const CinemaVideo = memo(({
    src = "/demovideo/MainDemo.mp4",
    title = "Watch the future of privacy.",
    subtext = "Cinema Mode"
}: CinemaVideoProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 0]);
    const glowOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 0.6, 0]);

    return (
        <div ref={containerRef} className="py-32 relative min-h-[80vh] flex items-center justify-center perspective-[1000px]">
            {/* Ambient Glow */}
            <motion.div
                style={{ opacity: glowOpacity }}
                className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-purple-500/10 to-blue-500/20 blur-[100px] pointer-events-none"
            />

            <motion.div
                style={{ scale, opacity }}
                className="w-full max-w-6xl mx-auto px-4 relative z-10"
            >
                <div className="group relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black/40 backdrop-blur-sm aspect-video">
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        src={src}
                        playsInline
                        loop
                        muted
                        autoPlay
                    />
                </div>

                <div className="text-center mt-8">
                    <h3 className="text-gray-400 text-sm tracking-[0.2em] font-medium uppercase">{subtext}</h3>
                    <p className="text-white text-2xl font-bold mt-2">{title}</p>
                </div>
            </motion.div>
        </div>
    );
});

export default CinemaVideo;
