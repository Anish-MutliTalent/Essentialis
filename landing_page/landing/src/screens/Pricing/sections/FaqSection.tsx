import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GlassContainer } from "../../../components/GlassContainer";
import DynamicGradientEllipse from "../../../components/DynamicGradientEllipse";
import { Parallax } from "../../../components/Parallax";
import { FadeIn } from "../../../components/FadeIn";

const faqs = [
  {
    question: "Is everything really free right now?",
    answer:
      "Yes. While Essentialis Cloud is in beta, every feature across every tier is free to use. The prices on this page are what plans will cost at launch — shown early so nothing surprises you later.",
  },
  {
    question: "Is my data really private?",
    answer:
      "Your files are encrypted in your browser before they ever leave your device, then spread across the network. We only ever hold ciphertext — we can't read your files, and neither can anyone else without your key.",
  },
  {
    question: "Can I change plans later?",
    answer:
      "Any time. Upgrades take effect immediately. Downgrades apply at your next billing cycle. We'll never delete your files — if you go over a limit you simply can't upload more until you're back under it.",
  },
  {
    question: "What happens to my files if I hit my storage limit?",
    answer:
      "We notify you well before you get there. Your existing files stay safe and accessible; you just pause new uploads until you free up space or move to a larger plan.",
  },
  {
    question: "Do you offer refunds once paid plans launch?",
    answer:
      "Yes — a 30-day money-back guarantee on every paid plan. If it isn't for you, contact us and we'll refund you in full.",
  },
  {
    question: "Can I share with people who don't have an account?",
    answer:
      "Yes. You can create secure share links that work for anyone, with optional passwords, expiry dates, and view-only access.",
  },
];

const FaqItem = ({
  question,
  answer,
  isOpen,
  onToggle,
  index,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}): JSX.Element => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0.001 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <GlassContainer
        cornerRadius={16}
        baseStrength={13}
        softness={12}
        edgeContrast={2.2}
        shadowContrast={2.2}
        reflectionPresence={0.95}
        edgeBrightness={1.05}
        brightness={1.02}
        className="w-full"
      >
        <div
          className="relative w-full bg-[#00000020] rounded-[16px]
          shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),inset_1px_1px_0_0_rgba(255,255,255,0.22),inset_-1px_-1px_0_0_rgba(255,255,255,0.06)]"
        >
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isOpen}
            className="flex items-center justify-between w-full gap-4 px-6 py-5 text-left cursor-pointer"
          >
            <span className="[font-family:'Inter',Helvetica] font-normal text-white text-base sm:text-lg tracking-[-0.005em]">
              {question}
            </span>
            <motion.span
              animate={{ rotate: isOpen ? 45 : 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex-shrink-0 text-neutral-400"
              aria-hidden="true"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 3.5V14.5M3.5 9H14.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <p className="px-6 pb-5 [font-family:'Inter',Helvetica] font-light text-neutral-300 text-sm sm:text-base leading-relaxed tracking-[0.35px]">
                  {answer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </GlassContainer>
    </motion.div>
  );
};

export const FaqSection = (): JSX.Element => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      <svg width="0" height="0" className="absolute overflow-hidden">
        <defs>
          <filter id="pricing-faq-inner-shadow" x="-20%" y="-20%" width="140%" height="140%">
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
        id="faq"
        aria-labelledby="pricing-faq-heading"
        className="relative w-full mt-32 lg:mt-[260px] px-4 sm:px-6 lg:px-0"
      >
        {/* Right-side gradient cluster */}
        <Parallax strength={0.3} className="absolute right-[-795px] w-[1414px] h-[1132px] pointer-events-none">
          <div aria-hidden="true" className="absolute top-[-200px] left-0 right-0 bottom-0">
            <div className="absolute top-[357px] left-[503px] w-[642px] h-[658px] rounded-[321px/329px] blur-[117.6px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0.84)_34%,rgba(255,255,255,0.84)_100%)]" />
            <div className="top-[343px] left-[488px] absolute w-[642px] h-[658px] rounded-[321px/329px] blur-[117.6px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0.84)_34%,rgba(255,255,255,0.84)_100%)]" />
            <div className="absolute overflow-hidden" style={{ top: '147px', left: '408px', width: '642px', height: '658px', borderRadius: '321px / 329px', filter: 'blur(48.1px)', mixBlendMode: 'overlay' }}>
              <DynamicGradientEllipse color="#9F3491" opacity={1} phaseOffset={1.167} multiLobe linearRotation />
            </div>
            <div className="absolute overflow-hidden" style={{ top: '476px', left: '329px', width: '934px', height: '957px', borderRadius: '467px / 478.5px', filter: 'blur(38.65px)', mixBlendMode: 'overlay' }}>
              <DynamicGradientEllipse color="#E89700" opacity={1} phaseOffset={-1.496} multiLobe linearRotation />
            </div>
            <div className="absolute overflow-hidden" style={{ top: '439px', left: '-50px', width: '640px', height: '658px', borderRadius: '320px / 329px', filter: 'blur(48.1px)', mixBlendMode: 'overlay' }}>
              <DynamicGradientEllipse color="#E89700" opacity={1} phaseOffset={-0.162} multiLobe linearRotation timeOffset={11} />
            </div>
          </div>
        </Parallax>

        <div className="relative z-10 max-w-[820px] mx-auto">
          <FadeIn>
            <header className="flex flex-col items-center text-center mb-12 lg:mb-16">
              <h2
                id="pricing-faq-heading"
                className="m-0 [font-family:'Inter',Helvetica] font-normal text-white text-4xl sm:text-5xl lg:text-6xl tracking-[-0.01em] leading-tight [text-shadow:-2px_2px_3.4px_#bf459333]"
              >
                Questions,
              </h2>
              <div className="[filter:url(#pricing-faq-inner-shadow)] bg-[linear-gradient(0deg,rgba(184,184,184,1)_0%,rgba(255,255,255,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Inter',Helvetica] font-light italic text-transparent text-4xl sm:text-5xl lg:text-6xl tracking-[-0.01em] leading-tight">
                answered.
              </div>
            </header>
          </FadeIn>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <FaqItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
