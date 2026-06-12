import { motion } from "framer-motion";
import { GlassContainer } from "../../../components/GlassContainer";
import DynamicGradientEllipse from "../../../components/DynamicGradientEllipse";
import { Parallax } from "../../../components/Parallax";
import { FadeIn } from "../../../components/FadeIn";

const principles = [
  {
    number: "01",
    title: "Fewer surfaces, sharper edges.",
    description:
      "Two products. Not twelve. We’d rather finish two things well than ship a dozen half-formed ideas.",
    filterId: "ap-s-01",
    filterColor: "#bb4622ff",
  },
  {
    number: "02",
    title: "Users teach us, not architecture.",
    description:
      "Every release is shaped by the people actually using it. The whitepaper is a starting point, not a destination.",
    filterId: "ap-s-02",
    filterColor: "#911d76ff",
  },
  {
    number: "03",
    title: "Polish beats novelty.",
    description:
      "Boring things done excellently win. A great login flow matters more than the next protocol of the week.",
    filterId: "ap-s-03",
    filterColor: "#a16d46ff",
  },
  {
    number: "04",
    title: "Ship when your parents could use it.",
    description:
      "Our usability bar isn’t developer-grade. If someone outside crypto can’t pick it up in a minute, it’s not done.",
    filterId: "ap-s-04",
    filterColor: "#914c14ff",
  },
];

export const PrinciplesSection = (): JSX.Element => {
  return (
    <>
      <svg width="0" height="0" className="absolute overflow-hidden">
        <defs>
          {principles.map((p) => (
            <filter key={p.filterId} id={p.filterId} x="-20%" y="-20%" width="140%" height="140%">
              <feComponentTransfer in="SourceAlpha" result="invertedAlpha">
                <feFuncA type="linear" slope="-1" intercept="1" />
              </feComponentTransfer>
              <feGaussianBlur in="invertedAlpha" stdDeviation="2.4" result="blurredInverted" />
              <feOffset in="blurredInverted" dx="-1" dy="2" result="offsetBlurred" />
              <feComposite in="offsetBlurred" in2="SourceAlpha" operator="in" result="innerShadow" />
              <feFlood floodColor={p.filterColor} result="shadowColor" />
              <feComposite in="shadowColor" in2="innerShadow" operator="in" result="coloredShadow" />
              <feMerge>
                <feMergeNode in="SourceGraphic" />
                <feMergeNode in="coloredShadow" />
              </feMerge>
            </filter>
          ))}
          <filter id="ap-heading-inner-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feComponentTransfer in="SourceAlpha" result="invertedAlpha">
              <feFuncA type="linear" slope="-1" intercept="1" />
            </feComponentTransfer>
            <feGaussianBlur in="invertedAlpha" stdDeviation="3.9" result="blurredInverted" />
            <feOffset in="blurredInverted" dx="-2" dy="3" result="offsetBlurred" />
            <feComposite in="offsetBlurred" in2="SourceAlpha" operator="in" result="innerShadow" />
            <feFlood floodColor="#8a3736" floodOpacity="0.65" result="shadowColor" />
            <feComposite in="shadowColor" in2="innerShadow" operator="in" result="coloredShadow" />
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="coloredShadow" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <section
        id="principles"
        aria-labelledby="about-principles-heading"
        className="relative w-full mt-32 lg:mt-[260px] px-4 sm:px-6 lg:px-0"
      >
        {/* Central cluster — exact ValuesGridSection positioning */}
        <Parallax strength={0.3} className="absolute top-0 left-0 w-[1414px] h-[1132px] pointer-events-none">
          <div aria-hidden="true" className="absolute inset-0">
            <div className="absolute top-[357px] left-[353px] w-[642px] h-[658px] rounded-[321px/329px] blur-[117.6px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0.84)_34%,rgba(255,255,255,0.84)_100%)]" />
            <div className="top-[343px] left-[338px] absolute w-[642px] h-[658px] rounded-[321px/329px] blur-[117.6px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0.84)_34%,rgba(255,255,255,0.84)_100%)]" />
            <div className="absolute overflow-hidden" style={{ top: '147px', left: '408px', width: '642px', height: '658px', borderRadius: '321px / 329px', filter: 'blur(48.1px)', mixBlendMode: 'overlay' }}>
              <DynamicGradientEllipse color="#9F3491" opacity={1} phaseOffset={1.167} multiLobe linearRotation />
            </div>
            <div className="absolute overflow-hidden" style={{ top: '476px', left: '329px', width: '934px', height: '957px', borderRadius: '467px / 478.5px', filter: 'blur(38.65px)', mixBlendMode: 'overlay' }}>
              <DynamicGradientEllipse color="#FA8500" opacity={1} phaseOffset={-1.496} multiLobe linearRotation />
            </div>
            <div className="absolute overflow-hidden" style={{ top: '439px', left: '-50px', width: '640px', height: '658px', borderRadius: '320px / 329px', filter: 'blur(48.1px)', mixBlendMode: 'overlay' }}>
              <DynamicGradientEllipse color="#FA8500" opacity={1} phaseOffset={-0.162} multiLobe linearRotation />
            </div>
          </div>
        </Parallax>

        <div className="relative max-w-[1225px] mx-auto">
          <FadeIn>
            <header className="flex flex-col items-start mb-12 lg:mb-16">
              <h2
                id="about-principles-heading"
                className="m-0 [font-family:'Inter',Helvetica] font-normal text-white text-4xl sm:text-5xl lg:text-7xl tracking-[-0.01em] leading-tight lg:leading-[79.2px] [text-shadow:-2px_2px_3.4px_#bf459333]"
              >
                Four rules
              </h2>
              <div className="[filter:url(#ap-heading-inner-shadow)] bg-[linear-gradient(0deg,rgba(184,184,184,1)_0%,rgba(255,255,255,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Inter',Helvetica] font-light italic text-transparent text-4xl sm:text-5xl lg:text-7xl tracking-[-0.01em] leading-tight lg:leading-[79.2px]">
                we never break.
              </div>
              <p className="mt-6 max-w-[640px] [font-family:'Inter',Helvetica] font-light text-neutral-300 text-base sm:text-lg lg:text-xl tracking-[0.35px] leading-relaxed">
                The Six Things on the home page are what we believe.
                These are how we actually work.
              </p>
            </header>
          </FadeIn>

          <div
            className="relative rounded-[14px]
            after:content-[''] after:absolute after:inset-0 after:p-px after:rounded-[14px]
            after:[background:linear-gradient(135deg,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0.28)_5%,rgba(255,255,255,0)_18%,rgba(255,255,255,0)_82%,rgba(255,255,255,0.12)_95%,rgba(255,255,255,0.18)_100%)]
            after:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] after:[-webkit-mask-composite:xor] after:[mask-composite:exclude]
            after:pointer-events-none after:z-[3]"
          >
            <div
              role="list"
              aria-label="How we build"
              className="grid grid-cols-1 sm:grid-cols-2 w-full bg-transparent rounded-[14px] overflow-hidden"
            >
              {principles.map((p, i) => (
                <motion.div
                  key={p.number}
                  initial={{ y: 16, opacity: 0.001 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ scale: 1.02, zIndex: 10 }}
                  style={{ position: "relative" }}
                >
                  <GlassContainer
                    cornerRadius={0}
                    baseStrength={14}
                    softness={5}
                    edgeContrast={2.5}
                    shadowContrast={2.5}
                    reflectionPresence={0.8}
                    bevelSaturation={1.2}
                    edgeBrightness={1.1}
                    brightness={1.2}
                  >
                    <article
                      role="listitem"
                      className="relative flex flex-col gap-3 p-7 lg:p-10 w-full h-full min-h-[220px] bg-transparent"
                    >
                      <span
                        className="[font-family:'Cinzel',serif] font-bold text-white/10 text-4xl lg:text-5xl leading-none"
                        aria-hidden="true"
                      >
                        {p.number}
                      </span>
                      <h3
                        className="[font-family:'Inter',Helvetica] font-normal text-white text-xl sm:text-2xl lg:text-[28px] tracking-[-0.005em] leading-snug mt-1"
                        style={{ filter: `url(#${p.filterId})` }}
                      >
                        {p.title}
                      </h3>
                      <p className="[font-family:'Inter',Helvetica] font-light text-neutral-300 text-sm sm:text-base tracking-[0.35px] leading-relaxed">
                        {p.description}
                      </p>
                    </article>
                  </GlassContainer>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
