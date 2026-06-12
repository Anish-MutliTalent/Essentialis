import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Abandonment } from "../../../components/Abandonment";
import { FragileCustody } from "../../../components/FragileCustody";
import { TwelveWords } from "../../../components/TwelveWords";


const headingRows = [
  {
    lead: "Decentralization promised",
    accent: "freedom.",
    accentClassName:
      "[filter:url(#inner-shadow-purple)] bg-[linear-gradient(0deg,rgba(184,184,184,1)_0%,rgba(255,255,255,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent]",
  },
  {
    lead: "What it shipped was",
    accent: "friction.",
    accentClassName:
      "[filter:url(#inner-shadow-red)] bg-[linear-gradient(0deg,rgba(184,184,184,1)_0%,rgba(255,255,255,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent]",
  },
];


export const ProblemSection = (): JSX.Element => {
  const twelveWordsRef = useRef<HTMLDivElement>(null);
  const twelveWordsInView = useInView(twelveWordsRef, { once: true, margin: "-60px" });

  return (
    <>
      {/* Inner-shadow SVG filters — positioned off-screen so they don't affect layout */}
      <svg width="0" height="0" className="absolute overflow-hidden">
        <defs>
          {/* Inner shadow: invert alpha → blur → offset → clip back inside text → colorize */}
          <filter id="inner-shadow-purple" x="-20%" y="-20%" width="140%" height="140%">
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
          <filter id="inner-shadow-red" x="-20%" y="-20%" width="140%" height="140%">
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
      aria-labelledby="pain-points-section-heading"
      className="relative z-10 w-full max-w-[1400px] mx-auto mt-16 lg:mt-[108px] px-4 sm:px-6 lg:px-0"
    >
      {/* Two-column layout at md+: left = heading/desc/cards, right = TwelveWords tower.
          items-stretch (default) makes both columns equal height, so the tower's
          wrapper always matches the left column. The SVG inside is absolute bottom-0
          so its base aligns with the bottom of the cards regardless of viewport. */}
      <div className="flex flex-col md:flex-row md:gap-8">

        {/* Left column */}
        <div className="flex flex-col gap-[29px] [flex:1112] min-w-0">
          <motion.div
            style={{ willChange: 'transform' }}
            initial={{ y: 28, opacity: 0.001 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="flex flex-col items-start gap-[7px]">
              <div className="flex flex-col items-start">
                {headingRows.map((row, index) => (
                  <div
                    key={row.accent}
                    className="flex flex-wrap items-baseline gap-x-2.5"
                  >
                    <h2
                      id={index === 0 ? "pain-points-section-heading" : undefined}
                      className="m-0 [font-family:'Inter',Helvetica] font-normal text-white text-4xl sm:text-5xl lg:text-7xl tracking-[-0.01em] leading-tight lg:leading-[79.2px] [text-shadow:-2px_2px_3.4px_#bf459333]"
                    >
                      {row.lead}
                    </h2>
                    <span
                      className={`whitespace-nowrap [font-family:'Inter',Helvetica] font-light italic text-transparent text-4xl sm:text-5xl lg:text-7xl tracking-[-0.01em] leading-tight lg:leading-[79.2px] ${row.accentClassName}`}
                    >
                      {row.accent}
                    </span>
                  </div>
                ))}
              </div>
            </header>
          </motion.div>

          <motion.div
            style={{ willChange: 'transform' }}
            initial={{ y: 28, opacity: 0.001 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="[font-family:'Inter',Helvetica] text-lg sm:text-xl lg:text-2xl font-light leading-relaxed lg:leading-[38px] tracking-[0.35px] text-white max-w-[876px]">
              Twelve-word seed phrases. RPC endpoints. Gas. Bridges.
              <br />
              Tech is useless when no one can use it.
            </p>
          </motion.div>

          {/* Bottom cards: hidden on mobile, side by side on md+ */}
          <motion.div
            className="hidden md:flex flex-row gap-[36px] mt-[50px]"
            style={{ willChange: 'transform' }}
            initial={{ y: 24 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="[flex:598] min-w-0" aria-hidden="true">
              <Abandonment className="w-full h-auto" />
            </div>
            <div className="[flex:441] min-w-0" aria-hidden="true">
              <FragileCustody className="w-full h-auto" />
            </div>
          </motion.div>
        </div>

        {/* TwelveWords tower: wrapper stretches to left column height (items-stretch default).
            SVG is absolute bottom-0 so its base sits flush with the bottom of the cards;
            anything taller than the left column overflows above and is hidden.
            The ref is on the static outer div so useInView uses the layout rect
            (unaffected by the inner transform), fixing the animation at narrow viewports
            where x:290 would push the element outside the intersection observer's view. */}
        <div
          ref={twelveWordsRef}
          className="hidden md:block [flex:288] min-w-0 relative overflow-hidden"
          aria-hidden="true"
        >
          <motion.div
            className="w-full h-full"
            style={{ willChange: 'transform' }}
            animate={twelveWordsInView ? { x: 0 } : { x: 290 }}
            transition={{ duration: 0.75, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <TwelveWords className="absolute bottom-0 left-0 w-full h-auto" />
          </motion.div>
        </div>

      </div>
    </section>
    </>
  );
};
