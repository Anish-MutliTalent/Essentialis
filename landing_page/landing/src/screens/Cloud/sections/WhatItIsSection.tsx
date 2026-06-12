import { motion } from "framer-motion";
import { GlassContainer } from "../../../components/GlassContainer";
import DynamicGradientEllipse from "../../../components/DynamicGradientEllipse";
import { Parallax } from "../../../components/Parallax";
import { FadeIn, FadeInStagger, FadeInItem } from "../../../components/FadeIn";

type ComparisonRow = {
  topic: string;
  bigtech: string;
  cloud: string;
};

const comparisons: ComparisonRow[] = [
  {
    topic: "Your files",
    bigtech: "Readable by the host",
    cloud: "Encrypted before they leave you",
  },
  {
    topic: "Infrastructure",
    bigtech: "One company owns it all",
    cloud: "Distributed across a network",
  },
  {
    topic: "Your account",
    bigtech: "Tied to a real-world identity",
    cloud: "No wallet, no seed phrase, no tracking",
  },
  {
    topic: "The business model",
    bigtech: "You pay with your data",
    cloud: "Honest pricing, no ads",
  },
];

export const WhatItIsSection = (): JSX.Element => {
  return (
    <>
      <svg width="0" height="0" className="absolute overflow-hidden">
        <defs>
          <filter id="cloud-whatitis-inner-shadow" x="-20%" y="-20%" width="140%" height="140%">
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
        id="what-it-is"
        aria-labelledby="cloud-whatitis-heading"
        className="relative w-full mt-16 lg:mt-[140px] px-4 sm:px-6 lg:px-0"
      >
        {/* Left cluster */}
        <Parallax strength={0.3} className="absolute left-[-300px] w-[1414px] h-[1132px] pointer-events-none">
          <div aria-hidden="true" className="absolute top-[-400px] left-0 right-0 bottom-0">
            <div className="absolute top-[357px] left-[353px] w-[642px] h-[658px] rounded-[321px/329px] blur-[117.6px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0.84)_34%,rgba(255,255,255,0.84)_100%)]" />
            <div className="top-[343px] left-[338px] absolute w-[642px] h-[658px] rounded-[321px/329px] blur-[117.6px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0.84)_34%,rgba(255,255,255,0.84)_100%)]" />
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

        <div className="relative z-10 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-start">
          {/* Left — heading + story */}
          <div className="flex flex-col gap-8">
            <motion.header
              initial={{ y: 28, opacity: 0.001 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2
                id="cloud-whatitis-heading"
                className="m-0 [font-family:'Inter',Helvetica] font-normal text-white text-4xl sm:text-5xl lg:text-7xl tracking-[-0.01em] leading-tight lg:leading-[79.2px] [text-shadow:-2px_2px_3.4px_#bf459333]"
              >
                The cloud you know,
              </h2>
              <div className="[filter:url(#cloud-whatitis-inner-shadow)] bg-[linear-gradient(0deg,rgba(184,184,184,1)_0%,rgba(255,255,255,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Inter',Helvetica] font-light italic text-transparent text-4xl sm:text-5xl lg:text-7xl tracking-[-0.01em] leading-tight lg:leading-[79.2px]">
                without the trade.
              </div>
            </motion.header>

            <FadeInStagger delay={0.1} className="flex flex-col gap-5">
              <FadeInItem>
                <p className="[font-family:'Inter',Helvetica] font-light text-white text-lg sm:text-xl lg:text-2xl leading-relaxed lg:leading-[38px] tracking-[0.35px]">
                  Cloud storage has a trade baked in: convenience in
                  exchange for ownership. You hand a company your most
                  important files and trust they won&apos;t read them,
                  lose them, or hand them over to someone else.
                </p>
              </FadeInItem>
              <FadeInItem>
                <p className="[font-family:'Inter',Helvetica] font-light text-neutral-300 text-base sm:text-lg lg:text-xl leading-relaxed lg:leading-[32px] tracking-[0.35px]">
                  Essentialis Cloud takes that trade off the table. Your
                  files are sealed before they leave your device,
                  distributed across the network, and recoverable only
                  with a key only you control. We never see what&apos;s
                  inside. Neither does anyone else.
                </p>
              </FadeInItem>
              <FadeInItem>
                <p className="[font-family:'Inter',Helvetica] font-light text-neutral-300 text-base sm:text-lg lg:text-xl leading-relaxed lg:leading-[32px] tracking-[0.35px]">
                  And the experience is the same one you already know
                  — drag, drop, share, search. No crypto setup, no
                  twelve words to memorise.
                </p>
              </FadeInItem>
            </FadeInStagger>
          </div>

          {/* Right — comparison glass card */}
          <FadeIn delay={0.2} direction="up" className="w-full">
            <GlassContainer
              cornerRadius={20}
              baseStrength={14}
              softness={14}
              edgeContrast={2.3}
              shadowContrast={2.3}
              reflectionPresence={1}
              edgeBrightness={1.1}
              brightness={1.05}
              className="w-full"
            >
              <article
                className="relative w-full bg-[#00000020] rounded-[20px] p-7 lg:p-9
                shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),inset_1px_1px_0_0_rgba(255,255,255,0.25),inset_-1px_-1px_0_0_rgba(255,255,255,0.08)]"
              >
                <div className="flex items-center gap-2 mb-7">
                  <span className="w-2 h-2 bg-[#ebc541] rounded-full shadow-[0px_0px_10px_#facc15]" aria-hidden="true" />
                  <span className="[font-family:'Roboto_Mono',monospace] font-normal text-neutral-400 text-xs tracking-[0.2em] uppercase">
                    Quick comparison
                  </span>
                </div>

                <ul aria-label="Comparison with big-tech cloud" className="flex flex-col gap-5">
                  {comparisons.map((row) => (
                    <FadeInItem key={row.topic} direction="left">
                      <li className="flex flex-col gap-1.5 pb-5 last:pb-0 border-b border-white/10 last:border-0">
                        <span className="[font-family:'Roboto_Mono',monospace] font-normal text-neutral-500 text-[11px] tracking-[0.25em] uppercase">
                          {row.topic}
                        </span>
                        <div className="grid grid-cols-[1fr_auto_1fr] items-baseline gap-3">
                          <span className="[font-family:'Inter',Helvetica] font-light text-neutral-500 text-sm sm:text-base line-through decoration-neutral-600/60">
                            {row.bigtech}
                          </span>
                          <span aria-hidden="true" className="text-neutral-600 text-xs">→</span>
                          <span className="[font-family:'Inter',Helvetica] font-light text-white text-sm sm:text-base">
                            {row.cloud}
                          </span>
                        </div>
                      </li>
                    </FadeInItem>
                  ))}
                </ul>
              </article>
            </GlassContainer>
          </FadeIn>
        </div>
      </section>
    </>
  );
};
