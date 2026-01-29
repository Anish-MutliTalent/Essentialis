import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Show button when page is scrolled
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
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
                        animate={{
                            width: isHovered ? 'auto' : '2.5rem', // 2.5rem is w-10 (40px)
                        }}
                    >
                        {/* Container for Icon + Text */}
                        <div className="flex items-center">
                            {/* Icon Wrapper - always visible but needs to stay fixed width until expanded? 
                                Actually, if we flex row, we can keep the icon at the start.
                            */}
                            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                                <ArrowUp className="w-4 h-4" />
                            </div>

                            {/* Text - only visible when hovered/expanded */}
                            <AnimatePresence>
                                {isHovered && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: "auto" }}
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
