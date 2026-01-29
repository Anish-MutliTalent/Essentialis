import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AudioPlayer = () => {
    const [isMuted, setIsMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const audioSrc = "/main.mp3";

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
            // If it wasn't playing due to browser block, this interaction will start it
            if (!isPlaying) {
                audioRef.current.play()
                    .then(() => setIsPlaying(true))
                    .catch(() => { });
            }
        }
    };

    // Auto-play on mount or first interaction
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.volume = 1.0; // Max volume

        const attemptPlay = () => {
            audio.play()
                .then(() => {
                    setIsPlaying(true);
                    stopListeners();
                })
                .catch(() => {
                    console.log("Autoplay waiting for user interaction...");
                });
        };

        const stopListeners = () => {
            window.removeEventListener('click', attemptPlay);
            window.removeEventListener('touchstart', attemptPlay);
            window.removeEventListener('scroll', attemptPlay);
        };

        // 1. Try playing immediately
        attemptPlay();

        // 2. Add listeners for first interaction (unlocks audio context)
        window.addEventListener('click', attemptPlay);
        window.addEventListener('touchstart', attemptPlay);
        window.addEventListener('scroll', attemptPlay); // Some browsers allow scroll to unlock if it's considered interaction

        return () => stopListeners();
    }, []);

    return (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3">
            <audio ref={audioRef} src={audioSrc} loop />

            {/* Audio Visualizer Bars (show when playing) */}
            <AnimatePresence>
                {isPlaying && !isMuted && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "auto", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="flex items-center gap-1 overflow-hidden h-4"
                    >
                        {[1, 2, 3, 4].map((i) => (
                            <motion.div
                                key={i}
                                className="w-1 bg-yellow-400/50 rounded-full"
                                animate={{
                                    height: [4, 12, 4],
                                }}
                                transition={{
                                    duration: 0.5 + Math.random() * 0.5,
                                    repeat: Infinity,
                                    delay: i * 0.1
                                }}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mute/Unmute Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMute}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10 transition-colors"
            >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </motion.button>
        </div>
    );
};

export default AudioPlayer;
