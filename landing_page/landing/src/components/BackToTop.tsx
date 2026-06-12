import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { lenisScrollY, lenisScrollTo } from '../hooks/useLenis';

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        let rafId: number;
        const check = () => {
            setIsVisible(lenisScrollY > 300);
            rafId = requestAnimationFrame(check);
        };
        rafId = requestAnimationFrame(check);
        return () => cancelAnimationFrame(rafId);
    }, []);

    const scrollToTop = () => {
        lenisScrollTo(0);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed bottom-8 left-8 z-50 flex items-center gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                >
                    <motion.button
                        onHoverStart={() => setIsHovered(true)}
                        onHoverEnd={() => setIsHovered(false)}
                        onClick={scrollToTop}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="h-10 px-0 flex items-center rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10 transition-colors overflow-hidden"
                        animate={{ width: isHovered ? 'auto' : '2.5rem' }}
                    >
                        <div className="flex items-center">
                            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                                <ArrowUp className="w-4 h-4" />
                            </div>
                            <AnimatePresence>
                                {isHovered && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: 'auto' }}
                                        exit={{ opacity: 0, width: 0 }}
                                        className="whitespace-nowrap pr-4 text-xs font-medium"
                                    >
                                        Back to top
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BackToTop;
