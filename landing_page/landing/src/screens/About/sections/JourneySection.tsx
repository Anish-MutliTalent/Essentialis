import { motion } from "framer-motion";
import { GlassContainer } from "../../../components/GlassContainer";
import DynamicGradientEllipse from "../../../components/DynamicGradientEllipse";
import { Parallax } from "../../../components/Parallax";
import { FadeIn } from "../../../components/FadeIn";

type Milestone = {
  marker: string;
  title: string;
  description: string;
  state: "shipped" | "live" | "next";
};

const milestones: Milestone[] = [
  {
    marker: "2024 · Q1",
    title: "The first thread",
    description:
      "Two teenagers, frustrated that nothing in crypto felt finished, started sketching out what a usable layer could look like.",
    state: "shipped",
  },
  {
    marker: "2024 · Q3",
    title: "Founding team",
    description:
      "Pavan and Anish team up — a shared belief that decentralisation only matters once it disappears into the product.",
    state: "shipped",
  },
  {
    marker: "2025 · Q1",
    title: "First working prototype",
    description:
      "Browser-side encryption, decentralised storage, account abstraction — all behind a single, ordinary login screen.",
    state: "shipped",
  },
  {
    marker: "2025 · Q3",
    title: "Closed beta of Essentialis Cloud",
    description:
      "Real families holding real documents. Their feedback shapes the product more than any whitepaper could.",
    state: "live",
  },
  {
    marker: "2026 · Q1",
    title: "Public invite batches",
    description:
      "Slots open up in small waves so we keep support quality high. Sixty-five members and growing.",
    state: "live",
  },
  {
    marker: "2026 · next",
    title: "Essentialis Dev for builders",
    description:
      "The same primitives, exposed as an agentic platform. Five prompts, not five protocols.",
    state: "next",
  },
];

const stateStyles: Record<
  Milestone["state"],
  { label: string; dot: string; ring: string; pill: string }
> = {
  shipped: {
    label: "SHIPPED",
    dot: "bg-neutral-300 shadow-[0px_0px_8px_#a3a3a3]",
    ring: "border-neutral-400/40",
    pill: "border-white/15 text-neutral-400 bg-white/[0.04]",
  },
  live: {
    label: "LIVE",
    dot: "bg-green-400 shadow-[0px_0px_10px_#4ade80]",
    ring: "border-green-400/40",
    pill: "border-green-400/30 text-green-400 bg-green-400/10",
  },
  next: {
    label: "UP NEXT",
    dot: "bg-[#ebc541] shadow-[0px_0px_10px_#facc15]",
    ring: "border-[#ebc541]/40",
    pill: "border-[#ebc541]/30 text-[#ebc541] bg-[#ebc541]/10",
  },
};

const MilestoneCard = ({
  item,
  alignRight = false,
}: {
  item: Milestone;
  alignRight?: boolean;
}): JSX.Element => {
  const styles = stateStyles[item.state];
  return (
    <GlassContainer
      cornerRadius={16}
      baseStrength={14}
      softness={12}
      edgeContrast={2.2}
      shadowContrast={2.2}
      reflectionPresence={0.95}
      edgeBrightness={1.05}
      brightness={1.02}
      className="w-full"
    >
      <article
        className={`relative w-full bg-[#00000020] rounded-[16px] p-6 lg:p-7
        shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),inset_1px_1px_0_0_rgba(255,255,255,0.22),inset_-1px_-1px_0_0_rgba(255,255,255,0.06)] ${
          alignRight ? "md:text-right" : ""
        }`}
      >
        <div
          className={`flex items-center gap-3 mb-3 ${
            alignRight ? "md:flex-row-reverse" : ""
          }`}
        >
          <span className="[font-family:'Roboto_Mono',monospace] font-normal text-neutral-400 text-xs tracking-[0.25em] uppercase">
            {item.marker}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border [font-family:'Roboto_Mono',monospace] text-[10px] tracking-[0.2em] uppercase ${styles.pill}`}
          >
            {styles.label}
          </span>
        </div>
        <h3 className="[font-family:'Inter',Helvetica] font-normal text-white text-xl sm:text-2xl tracking-[-0.005em] leading-snug mb-3">
          {item.title}
        </h3>
        <p className="[font-family:'Inter',Helvetica] font-light text-neutral-300 text-sm sm:text-base tracking-[0.35px] leading-relaxed">
          {item.description}
        </p>
      </article>
    </GlassContainer>
  );
};

export const JourneySection = (): JSX.Element => {
  return (
    <>
      <svg width="0" height="0" className="absolute overflow-hidden">
        <defs>
          <filter id="about-journey-inner-shadow" x="-20%" y="-20%" width="140%" height="140%">
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
        </defs>
      </svg>

      <section
        id="journey"
        aria-labelledby="about-journey-heading"
        className="relative w-full mt-32 lg:mt-[260px] px-4 sm:px-6 lg:px-0"
      >
        {/* Top-right cluster */}
        <Parallax strength={0.3} className="absolute right-[-795px] w-[1414px] h-[1132px] pointer-events-none">
          <div aria-hidden="true" className="absolute top-[-235px] left-0 right-0 bottom-0">
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

        {/* Bottom-left cluster */}
        <Parallax strength={0.3} className="absolute left-[-274px] w-[1414px] h-[1132px] pointer-events-none">
          <div aria-hidden="true" className="absolute top-[800px] left-0 right-0 bottom-0">
            <div className="absolute top-[357px] left-[353px] w-[642px] h-[658px] rounded-[321px/329px] blur-[117.6px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0.84)_34%,rgba(255,255,255,0.84)_100%)]" />
            <div className="top-[343px] left-[338px] absolute w-[642px] h-[658px] rounded-[321px/329px] blur-[117.6px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0.84)_34%,rgba(255,255,255,0.84)_100%)]" />
            <div className="absolute overflow-hidden" style={{ top: '147px', left: '408px', width: '642px', height: '658px', borderRadius: '321px / 329px', filter: 'blur(48.1px)', mixBlendMode: 'overlay' }}>
              <DynamicGradientEllipse color="#9F3491" opacity={1} phaseOffset={1.167} multiLobe linearRotation timeOffset={17.5} />
            </div>
            <div className="absolute overflow-hidden" style={{ top: '476px', left: '329px', width: '934px', height: '957px', borderRadius: '467px / 478.5px', filter: 'blur(38.65px)', mixBlendMode: 'overlay' }}>
              <DynamicGradientEllipse color="#E89700" opacity={1} phaseOffset={-1.496} multiLobe linearRotation timeOffset={17.5} />
            </div>
            <div className="absolute overflow-hidden" style={{ top: '439px', left: '-50px', width: '640px', height: '658px', borderRadius: '320px / 329px', filter: 'blur(48.1px)', mixBlendMode: 'overlay' }}>
              <DynamicGradientEllipse color="#FA8500" opacity={1} phaseOffset={-0.162} multiLobe linearRotation timeOffset={6.8} />
            </div>
          </div>
        </Parallax>

        <div className="relative max-w-[1100px] mx-auto">
          <FadeIn>
            <header className="flex flex-col items-center text-center mb-16 lg:mb-24">
              <h2
                id="about-journey-heading"
                className="m-0 [font-family:'Inter',Helvetica] font-normal text-white text-4xl sm:text-5xl lg:text-7xl tracking-[-0.01em] leading-tight lg:leading-[79.2px] [text-shadow:-2px_2px_3.4px_#bf459333]"
              >
                A short walk
              </h2>
              <div className="[filter:url(#about-journey-inner-shadow)] bg-[linear-gradient(0deg,rgba(184,184,184,1)_0%,rgba(255,255,255,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Inter',Helvetica] font-light italic text-transparent text-4xl sm:text-5xl lg:text-7xl tracking-[-0.01em] leading-tight lg:leading-[79.2px]">
                so far.
              </div>
              <p className="mt-6 max-w-[560px] [font-family:'Inter',Helvetica] font-light text-neutral-300 text-base sm:text-lg tracking-[0.35px] leading-relaxed">
                Two years, one direction. Every milestone here exists because
                a real person needed it to.
              </p>
            </header>
          </FadeIn>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical rail */}
            <div
              aria-hidden="true"
              className="absolute top-0 bottom-0 left-[18px] md:left-1/2 md:-translate-x-px w-px bg-gradient-to-b from-white/0 via-white/25 to-white/0"
            />

            <ol className="flex flex-col gap-10 lg:gap-14">
              {milestones.map((item, index) => {
                const isLeft = index % 2 === 0;
                const styles = stateStyles[item.state];
                return (
                  <li key={item.title} className="relative pl-12 md:pl-0">
                    {/* Dot — center on desktop, left rail on mobile */}
                    <span
                      aria-hidden="true"
                      className={`absolute top-2 left-[12px] md:left-1/2 md:-translate-x-1/2 w-3.5 h-3.5 rounded-full border-[2px] ${styles.ring} bg-black z-10`}
                    >
                      <span className={`absolute inset-[2px] rounded-full ${styles.dot}`} />
                    </span>

                    <motion.div
                      className="md:grid md:grid-cols-2 md:gap-12"
                      initial={{ y: 28, opacity: 0.001 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{
                        duration: 0.65,
                        delay: index * 0.06,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      {isLeft ? (
                        <>
                          <div className="md:pr-2">
                            <MilestoneCard item={item} alignRight />
                          </div>
                          <div className="hidden md:block" aria-hidden="true" />
                        </>
                      ) : (
                        <>
                          <div className="hidden md:block" aria-hidden="true" />
                          <div className="md:pl-2">
                            <MilestoneCard item={item} />
                          </div>
                        </>
                      )}
                    </motion.div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
};
