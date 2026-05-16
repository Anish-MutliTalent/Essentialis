import { useRef, useState } from "react";
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
import { GlassContainer } from "../../../components/GlassContainer"
import { FadeIn } from '../../../components/FadeIn';


const FEEDBACK = [
    { name: "Selvakumar S.", role: "Blockchain Developer", feedback: "Essentialis Cloud is great. Love the idea of user-owned data without the crypto friction.", pfp: "" },
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
    useAnimationFrame((_t, delta) => {
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
        <div 
            className="overflow-hidden m-0 flex flex-nowrap w-full"
            style={{ 
                maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', 
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' 
            }}
        >
            <motion.div className="flex flex-nowrap gap-6 pr-6" style={{ x }}>
                {children}
                {children}
                {children}
                {children}
            </motion.div>
        </div>
    );
}

const FeedbackCard = ({ name, feedback, role, pfp }: { name: string, feedback: string, role: string, pfp?: string }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [hovered, setHovered] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <GlassContainer
          cornerRadius={16}
          edgeBrightness={2}
          softness={15}
        >
          <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className="flex h-full flex-col flex-shrink-0 w-[300px] sm:w-[350px] p-8 rounded-[16px] relative overflow-hidden
              group border border-[#ffffff15] bg-white/5 backdrop-blur-md transition-colors duration-500 hover:bg-[#ffffff08]
              shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),inset_1px_1px_0_0_rgba(255,255,255,0.25),inset_-1px_-1px_0_0_rgba(255,255,255,0.15)]"
          >
              {/* Cursor spotlight */}
              <div 
                  className="absolute inset-0 z-0 transition-opacity duration-300 pointer-events-none"
                  style={{
                      opacity: hovered ? 1 : 0,
                      background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.06), transparent 40%)`
                  }}
              />
              
              <div className="relative z-10 flex flex-col h-full">
                  <div className="flex gap-1 mb-5">
                      {[1, 2, 3, 4, 5].map((_, i) => (
                          <Star key={i} className="w-[14px] h-[14px] text-yellow-400 fill-yellow-400" />
                      ))}
                  </div>
                  <p className="text-[#d4d4d4] text-[15px] leading-relaxed mb-8 flex-grow">
                      "{feedback}"
                  </p>
                  <div className="flex items-center gap-3 mt-auto">
                      {pfp ? (
                          <img src={pfp} alt={name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                      ) : (
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/90 text-sm border border-white/10 font-medium">
                              {name.substring(0, 1)}
                          </div>
                      )}
                      <div className="flex flex-col">
                          <span className="text-white font-medium text-sm tracking-wide">{name}</span>
                          <span className="text-xs text-[#747474] mt-0.5">{role}</span>
                      </div>
                  </div>
              </div>
          </div>
        </GlassContainer>
    );
};



const testimonialsHeading = [
  {
    text: "Trusted by",
    className:
      "flex w-fit mt-[-1.00px] [text-shadow:-2px_2px_3.4px_#bf459333] [font-family:'Inter',Helvetica] font-normal text-white text-2xl sm:text-3xl md:text-[40px] tracking-[-0.01em] leading-tight md:leading-[79.2px] whitespace-nowrap relative items-center",
  },
  {
    text: "builders",
    className:
      "relative flex items-center w-fit mt-[-1.00px] [filter:url(#ts-inner-shadow-purple)] bg-[linear-gradient(0deg,rgba(184,184,184,1)_0%,rgba(255,255,255,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Inter',Helvetica] font-light italic text-transparent text-2xl sm:text-3xl md:text-[40px] tracking-[-0.01em] leading-tight md:leading-[79.2px] whitespace-nowrap",
  },
  {
    text: "and",
    className:
      "flex w-fit mt-[-1.00px] [text-shadow:-2px_2px_3.4px_#bf459333] [font-family:'Inter',Helvetica] font-normal text-white text-2xl sm:text-3xl md:text-[40px] tracking-[-0.01em] leading-tight md:leading-[79.2px] whitespace-nowrap relative items-center",
  },
  {
    text: "believers",
    className:
      "relative flex items-center w-fit mt-[-1.00px] [filter:url(#ts-inner-shadow-red)] bg-[linear-gradient(0deg,rgba(184,184,184,1)_0%,rgba(255,255,255,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Inter',Helvetica] font-light italic text-transparent text-2xl sm:text-3xl md:text-[40px] tracking-[-0.01em] leading-tight md:leading-[79.2px] whitespace-nowrap",
  },
];

export const TestimonialsSection = (): JSX.Element => {
  return (
    <>
      <svg width="0" height="0" className="absolute overflow-hidden">
        <defs>
          <filter id="ts-inner-shadow-purple" x="-20%" y="-20%" width="140%" height="140%">
            <feComponentTransfer in="SourceAlpha" result="invertedAlpha">
              <feFuncA type="linear" slope="-1" intercept="1" />
            </feComponentTransfer>
            <feGaussianBlur in="invertedAlpha" stdDeviation="3.9" result="blurredInverted" />
            <feOffset in="blurredInverted" dx="-2" dy="3" result="offsetBlurred" />
            <feComposite in="offsetBlurred" in2="SourceAlpha" operator="in" result="innerShadow" />
            <feFlood floodColor="#b61da2ff" result="shadowColor" />
            <feComposite in="shadowColor" in2="innerShadow" operator="in" result="coloredShadow" />
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="coloredShadow" />
            </feMerge>
          </filter>
          <filter id="ts-inner-shadow-red" x="-20%" y="-20%" width="140%" height="140%">
            <feComponentTransfer in="SourceAlpha" result="invertedAlpha">
              <feFuncA type="linear" slope="-1" intercept="1" />
            </feComponentTransfer>
            <feGaussianBlur in="invertedAlpha" stdDeviation="3.9" result="blurredInverted" />
            <feOffset in="blurredInverted" dx="-2" dy="3" result="offsetBlurred" />
            <feComposite in="offsetBlurred" in2="SourceAlpha" operator="in" result="innerShadow" />
            <feFlood floodColor="#b83f36ff" result="shadowColor" />
            <feComposite in="shadowColor" in2="innerShadow" operator="in" result="coloredShadow" />
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="coloredShadow" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    <section
      aria-labelledby="trustless-vision-section-heading"
      className="relative mx-auto mt-[100px] md:mt-[300px] lg:mt-[521px] w-full max-w-[1740px] min-h-[606px] overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 mx-auto w-full max-w-[1571px] h-full min-h-[606px] bg-[#ffffff03] md:rounded-[297px] blur-[2.15px] backdrop-blur-[0.05px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(0.05px)_brightness(100%)]"
      />
      <div className="relative z-10 w-full flex flex-col gap-[11px] pt-[81px] pb-10">
        <FadeIn>
          <h2
            id="trustless-vision-section-heading"
            className="flex h-auto min-h-20 w-full justify-center gap-2 sm:gap-2.5 relative items-center m-0 flex-wrap px-4 mb-8"
          >
            {testimonialsHeading.map((part) => (
              <span key={part.text} className={part.className}>
                {part.text}
              </span>
            ))}
          </h2>
        </FadeIn>
        <FadeIn delay={0.2} className="w-full overflow-hidden">
          <ParallaxMarquee baseVelocity={-1}>
              {FEEDBACK.map((item, i) => (
                  <FeedbackCard key={i} {...item} />
              ))}
          </ParallaxMarquee>
        </FadeIn>
      </div>
    </section>
    </>
  );
};
