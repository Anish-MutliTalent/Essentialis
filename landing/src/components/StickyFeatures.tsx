import { useRef } from "react";
import { motion, useTransform, useScroll, MotionValue } from "framer-motion";
import { Shield, Globe, Zap, Cpu, LucideIcon } from "lucide-react";

interface Feature {
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
    image: string;
}

const features: Feature[] = [
    {
        title: "Zero Knowledge",
        description: "We literally cannot see your files. Encryption happens before upload.",
        icon: Shield,
        color: "from-yellow-400 to-orange-500",
        image: "/images/features/zero_knowledge.png",
    },
    {
        title: "Global Nodes",
        description: "Files are sharded and stored across a decentralized network.",
        icon: Globe,
        color: "from-blue-400 to-cyan-500",
        image: "/images/features/global_nodes.png",
    },
    {
        title: "Instant Sync",
        description: "Changes propagate instantly across all your authorized devices.",
        icon: Zap,
        color: "from-green-400 to-emerald-500",
        image: "/images/features/instant_sync.png",
    },
    {
        title: "AI Processing",
        description: "Local-first AI processing for document insights without privacy compromise.",
        icon: Cpu,
        color: "from-purple-400 to-pink-500",
        image: "/images/features/ai_processing.png",
    },
];

const FeatureCard = ({ feature, index, scrollXProgress }: { feature: Feature, index: number, scrollXProgress: MotionValue<number> }) => {
    // Each card occupies a specific part of the horizontal scroll progress [0, 1]
    // Total 4 cards + 1 header = 5 segments.
    // However, the header is wide. Let's approximate based on indices.
    // Header is card 0 in the flex container, features are 1, 2, 3, 4.

    // We can calculate a "local" center for each card in the scroll range.
    // Since x goes from 1% to -75%, we can map scrollYProgress to see when a card is centered.
    const centerPoint = 0.15 + (index * 0.22);

    const scale = useTransform(scrollXProgress, [centerPoint - 0.12, centerPoint, centerPoint + 0.12], [0.95, 1.05, 0.95]);
    const brightness = useTransform(scrollXProgress, [centerPoint - 0.12, centerPoint, centerPoint + 0.12], [0.5, 1, 0.5]);
    const imgOpacity = useTransform(scrollXProgress, [centerPoint - 0.12, centerPoint, centerPoint + 0.12], [0.2, 0.6, 0.2]);
    const glowOpacity = useTransform(scrollXProgress, [centerPoint - 0.12, centerPoint, centerPoint + 0.12], [0, 0.3, 0]);

    return (
        <motion.div
            style={{ scale, opacity: brightness }}
            className="group relative h-[450px] w-[85vw] md:w-[450px] flex-shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8"
        >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <motion.img
                    src={feature.image}
                    alt={feature.title}
                    style={{ opacity: imgOpacity }}
                    className="w-full h-full object-cover transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-black/50" />
            </div>

            <motion.div
                style={{ opacity: glowOpacity }}
                className={`absolute inset-0 z-0 bg-gradient-to-br ${feature.color}`}
            />

            <div className="relative z-10 h-full flex flex-col justify-between">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-black" />
                </div>

                <div>
                    <h3 className="text-3xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-gray-300 text-lg leading-relaxed font-light">{feature.description}</p>
                </div>

                <div className="text-8xl font-black text-white/5 absolute -right-4 -top-4 font-serif italic">
                    0{index + 1}
                </div>
            </div>
        </motion.div>
    );
};

const StickyFeatures = () => {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"]
    });

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-85%"]);

    return (
        <section ref={targetRef} id="features" className="relative h-[400vh]">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <motion.div style={{ x }} className="flex gap-8 md:gap-16 px-8 md:px-16 items-center">
                    {/* Header Card */}
                    <div className="flex-shrink-0 w-[85vw] md:w-[600px] flex flex-col justify-center">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="text-5xl md:text-7xl font-black mb-6 leading-tight"
                        >
                            Built for <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 drop-shadow-sm">
                                Scale & Security.
                            </span>
                        </motion.h2>
                        <p className="text-xl text-gray-400 font-light max-w-md">
                            Architecture that handles your most critical data without breaking a sweat.
                        </p>
                    </div>

                    {/* Feature Cards */}
                    {features.map((feature, i) => (
                        <FeatureCard
                            key={feature.title}
                            feature={feature}
                            index={i}
                            scrollXProgress={scrollYProgress}
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default StickyFeatures;
