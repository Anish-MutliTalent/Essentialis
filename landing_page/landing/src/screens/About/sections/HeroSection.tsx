import { motion } from "framer-motion";
import { GlassContainer } from "../../../components/GlassContainer";
import DynamicGradientEllipse from "../../../components/DynamicGradientEllipse";
import { Parallax } from "../../../components/Parallax";
import { FadeIn } from "../../../components/FadeIn";

export const HeroSection = (): JSX.Element => {
  return (
    <>
      <svg width="0" height="0" className="absolute overflow-hidden">
        <defs>
          <filter id="about-hero-inner-shadow" x="-20%" y="-20%" width="140%" height="140%">
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
        aria-labelledby="about-hero-heading"
        className="relative w-full min-h-[100vh] flex items-center justify-center pt-40 pb-24 px-4 sm:px-6"
      >
        {/* Left cluster — bright spot upper-left */}
        <Parallax strength={0.3} className="absolute left-[-274px] w-[1414px] h-[1132px] pointer-events-none">
          <div aria-hidden="true" className="absolute top-[-236px] left-0 right-0 bottom-0">
            <div className="absolute top-[357px] left-[353px] w-[642px] h-[658px] rounded-[321px/329px] blur-[117.6px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0.84)_34%,rgba(255,255,255,0.84)_100%)]" />
            <div className="top-[343px] left-[338px] absolute w-[642px] h-[658px] rounded-[321px/329px] blur-[117.6px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0.84)_34%,rgba(255,255,255,0.84)_100%)]" />
            <div className="absolute overflow-hidden" style={{ top: '147px', left: '408px', width: '642px', height: '658px', borderRadius: '321px / 329px', filter: 'blur(48.1px)', mixBlendMode: 'overlay' }}>
              <DynamicGradientEllipse color="#9F3491" opacity={1} phaseOffset={1.167} multiLobe linearRotation />
            </div>
            <div className="absolute overflow-hidden" style={{ top: '476px', left: '329px', width: '934px', height: '957px', borderRadius: '467px / 478.5px', filter: 'blur(38.65px)', mixBlendMode: 'overlay' }}>
              <DynamicGradientEllipse color="#E89700" opacity={1} phaseOffset={-1.496} multiLobe linearRotation />
            </div>
            <div className="absolute overflow-hidden" style={{ top: '439px', left: '-50px', width: '640px', height: '658px', borderRadius: '320px / 329px', filter: 'blur(48.1px)', mixBlendMode: 'overlay' }}>
              <DynamicGradientEllipse color="#E89700" opacity={1} phaseOffset={-0.162} multiLobe linearRotation />
            </div>
          </div>
        </Parallax>

        {/* Right cluster — matching SolutionSection right-side positioning */}
        <Parallax strength={0.3} className="absolute right-[-795px] w-[1414px] h-[1132px] pointer-events-none">
          <div aria-hidden="true" className="absolute top-[-235px] left-0 right-0 bottom-0">
            <div className="absolute top-[357px] left-[503px] w-[642px] h-[658px] rounded-[321px/329px] blur-[117.6px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0.84)_34%,rgba(255,255,255,0.84)_100%)]" />
            <div className="top-[343px] left-[488px] absolute w-[642px] h-[658px] rounded-[321px/329px] blur-[117.6px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0.84)_34%,rgba(255,255,255,0.84)_100%)]" />
            <div className="absolute overflow-hidden" style={{ top: '147px', left: '408px', width: '642px', height: '658px', borderRadius: '321px / 329px', filter: 'blur(48.1px)', mixBlendMode: 'overlay' }}>
              <DynamicGradientEllipse color="#9F3491" opacity={1} phaseOffset={1.167} multiLobe linearRotation timeOffset={9} />
            </div>
            <div className="absolute overflow-hidden" style={{ top: '476px', left: '329px', width: '934px', height: '957px', borderRadius: '467px / 478.5px', filter: 'blur(38.65px)', mixBlendMode: 'overlay' }}>
              <DynamicGradientEllipse color="#E89700" opacity={1} phaseOffset={-1.496} multiLobe linearRotation timeOffset={9} />
            </div>
            <div className="absolute overflow-hidden" style={{ top: '439px', left: '-50px', width: '640px', height: '658px', borderRadius: '320px / 329px', filter: 'blur(48.1px)', mixBlendMode: 'overlay' }}>
              <DynamicGradientEllipse color="#E89700" opacity={1} phaseOffset={-0.162} multiLobe linearRotation timeOffset={9} />
            </div>
          </div>
        </Parallax>

        <div className="relative z-10 flex flex-col items-center text-center max-w-[1100px] mx-auto gap-9">
          <FadeIn>
            <GlassContainer cornerRadius={48} baseStrength={20} softness={20} edgeBrightness={1.2}>
              <div
                className="flex items-center gap-3 px-5 py-2.5 rounded-full
                shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),inset_1px_1px_0_0_rgba(255,255,255,0.25),inset_-1px_-1px_0_0_rgba(255,255,255,0.15)]"
                role="status"
              >
                <span className="w-2 h-2 bg-[#ebc541] rounded-full shadow-[0px_0px_10px_#facc15]" aria-hidden="true" />
                <span className="[font-family:'Inter',Helvetica] font-medium text-white text-sm tracking-[0.35px] uppercase">
                  Our Story
                </span>
              </div>
            </GlassContainer>
          </FadeIn>

          <motion.h1
            id="about-hero-heading"
            className="m-0 [font-family:'Inter',Helvetica] font-normal text-white text-5xl sm:text-6xl lg:text-[96px] tracking-[-0.01em] leading-[1.05] [text-shadow:-2px_2px_3.4px_#bf459333] max-w-[900px]"
            initial={{ y: 28, opacity: 0.001 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            Built for people,
            <br />
            <span className="[filter:url(#about-hero-inner-shadow)] bg-[linear-gradient(0deg,rgba(184,184,184,1)_0%,rgba(255,255,255,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] font-light italic">
              not protocols.
            </span>
          </motion.h1>

          <FadeIn delay={0.15}>
            <p className="max-w-[760px] [font-family:'Inter',Helvetica] font-light text-white text-lg sm:text-xl lg:text-2xl leading-relaxed lg:leading-[38px] tracking-[0.35px]">
              We&#39;re a small team building the layer that makes
              decentralisation usable. No seed phrases. No glue code.
              Just the parts of the future that actually work today.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex items-center gap-3 text-neutral-400 [font-family:'Roboto_Mono',monospace] text-xs sm:text-sm tracking-[0.2em] uppercase">
              <span>Est. 2024</span>
              <span aria-hidden="true" className="w-1 h-1 rounded-full bg-neutral-600" />
              <span>Two founders</span>
              <span aria-hidden="true" className="w-1 h-1 rounded-full bg-neutral-600" />
              <span>One mission</span>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
};
