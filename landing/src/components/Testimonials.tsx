import { useRef, useState, useEffect } from "react";
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    useMotionValue,
    useVelocity,
    useAnimationFrame
} from "framer-motion";
import { wrap } from "@motionone/utils";
import { Star } from 'lucide-react';

const FEEDBACK = [
    { name: "Selvakumar S.", role: "Blockchain Developer", feedback: "Essentialis Cloud is great. Love the idea of user-owned data without the crypto friction." },
    { name: "Hasanur Rehman", role: "JEE Aspirant", feedback: "It'd be nice if users had more ownership instead of everything being tied to one big company" },
    { name: "Burman Nayak", role: "Design Head", feedback: "The project is really interesting. I'm a college student but I work in design and blockchain so I loved to try out the app." },
    { name: "Prisha Sasikumar", role: "Founder @ DanceVibes", feedback: "So cool! Privacy tech is highly underrated so it’s great that you’re bringing this to prominence" },
    { name: "Abraham Rajput", role: "Co-Founder @ Brix", feedback: "It was amazing getting to talk with you, best of luck with Essentialis Cloud" },
    { name: "Devesh Patwari", role: "Innovator", feedback: "If this product is marketed correctly it can go places. Let us see what we can do to make it reach the top" },
];

interface ParallaxProps {
    children: React.ReactNode;
    baseVelocity: number;
}

function ParallaxMarquee({ children, baseVelocity = 100 }: ParallaxProps) {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
        clamp: false
    });

    /**
     * wrapping logic adjusted for wider content (cards)
     * We wrap from 0 to -50% assuming we duplicate content enough to fill
     */
    const x = useTransform(baseX, (v) => `${wrap(0, -50, v)}%`);

    const directionFactor = useRef<number>(1);
    useAnimationFrame((t, delta) => {
        let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

        if (velocityFactor.get() < 0) {
            directionFactor.current = -1;
        } else if (velocityFactor.get() > 0) {
            directionFactor.current = 1;
        }

        moveBy += directionFactor.current * moveBy * velocityFactor.get();
        baseX.set(baseX.get() + moveBy);
    });

    return (
        <div className="overflow-hidden m-0 flex flex-nowrap w-full">
            <motion.div className="flex flex-nowrap gap-6 pr-6" style={{ x }}>
                {children}
                {children}
                {children}
                {children}
            </motion.div>
        </div>
    );
}

const FeedbackCard = ({ name, feedback, role }: { name: string, feedback: string, role: string }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [hovered, setHovered] = useState(false);
    const [hue, setHue] = useState(0);
    const cardRef = useRef<HTMLDivElement>(null);
    const animRef = useRef<number>(0);

    useEffect(() => {
        let start: number | null = null;
        const tick = (t: number) => {
            if (!start) start = t;
            setHue(((t - start) * 0.02) % 360);
            animRef.current = requestAnimationFrame(tick);
        };
        animRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(animRef.current);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="flex flex-col flex-shrink-0 w-[300px] sm:w-[350px] p-6 rounded-2xl transition-all duration-300 relative overflow-hidden group"
            style={{
                backgroundColor: 'rgba(255,255,255,0.02)',
                backdropFilter: 'blur(40px) saturate(180%)',
                WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            }}
        >
            {/* Rainbow border */}
            <div className="absolute inset-[-1px] rounded-2xl pointer-events-none z-[0]"
                style={{
                    background: `conic-gradient(from ${hue}deg, #ff0080, #7928ca, #0070f3, #00dfd8, #fff500, #ff0080)`,
                    opacity: hovered ? 0.5 : 0.06,
                    transition: 'opacity 0.4s ease',
                    filter: 'blur(2px)',
                }}
            />
            <div className="absolute inset-[1px] rounded-2xl z-[0]" style={{ background: 'rgba(4,4,10,0.93)' }} />
            {/* Cursor spotlight */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none z-[1]"
                style={{
                    background: hovered ? `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, rgba(120,80,255,0.1), transparent 60%)` : 'none',
                }}
            />
            <div className="relative z-10">
                <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6 flex-grow">"{feedback}"</p>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400/20 via-cyan-400/15 to-yellow-400/10 flex items-center justify-center font-bold text-yellow-400 text-sm border border-white/10">
                        {name.substring(0, 1)}
                    </div>
                    <div>
                        <div className="text-white font-medium text-sm">{name}</div>
                        <div className="text-xs text-gray-500">{role}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Testimonials() {
    return (
        <section className="py-24 relative z-10 overflow-hidden">

            <div className="mb-12 text-center px-4">
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Trusted by builders & believers
                </h2>
            </div>

            <ParallaxMarquee baseVelocity={-1}>
                {FEEDBACK.map((item, i) => (
                    <FeedbackCard key={i} {...item} />
                ))}
            </ParallaxMarquee>
        </section>
    );
}
