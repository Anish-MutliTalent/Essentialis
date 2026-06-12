import { motion } from "framer-motion";
import { GlassContainer } from "../../../components/GlassContainer";
import DynamicGradientEllipse from "../../../components/DynamicGradientEllipse";
import { Parallax } from "../../../components/Parallax";
import { FadeIn } from "../../../components/FadeIn";

type Step = {
  number: string;
  title: string;
  description: string;
  hint: string;
};

const steps: Step[] = [
  {
    number: "01",
    title: "Drop a file",
    description:
      "Drag, drop, paste, upload — exactly like every cloud app you already use.",
    hint: "you.local",
  },
  {
    number: "02",
    title: "Sealed on your device",
    description:
      "Your file is encrypted in the browser, in milliseconds, with a key only you control.",
    hint: "encrypt()",
  },
  {
    number: "03",
    title: "Spread across the network",
    description:
      "Encrypted pieces go to many storage nodes. No single host has a complete copy of anything.",
    hint: "shards × N",
  },
  {
    number: "04",
    title: "Only you can put it back",
    description:
      "Without your key the pieces are meaningless — to anyone watching, to the network, to us.",
    hint: "you.local",
  },
];

export const HowItWorksSection = (): JSX.Element => {
  return (
    <>
      <svg width="0" height="0" className="absolute overflow-hidden">
        <defs>
          <filter id="cloud-how-inner-shadow" x="-20%" y="-20%" width="140%" height="140%">
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
        id="how-it-works"
        aria-labelledby="cloud-how-heading"
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
              <DynamicGradientEllipse color="#E89700" opacity={1} phaseOffset={-0.162} multiLobe linearRotation timeOffset={7.5} />
            </div>
          </div>
        </Parallax>

        {/* Bottom-left cluster */}
        <Parallax strength={0.3} className="absolute left-[-274px] w-[1414px] h-[1132px] pointer-events-none">
          <div aria-hidden="true" className="absolute top-[600px] left-0 right-0 bottom-0">
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

        <div className="relative max-w-[1225px] mx-auto">
          <FadeIn>
            <header className="flex flex-col items-center text-center mb-14 lg:mb-20">
              <h2
                id="cloud-how-heading"
                className="m-0 [font-family:'Inter',Helvetica] font-normal text-white text-4xl sm:text-5xl lg:text-7xl tracking-[-0.01em] leading-tight lg:leading-[79.2px] [text-shadow:-2px_2px_3.4px_#bf459333]"
              >
                Four steps,
              </h2>
              <div className="[filter:url(#cloud-how-inner-shadow)] bg-[linear-gradient(0deg,rgba(184,184,184,1)_0%,rgba(255,255,255,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Inter',Helvetica] font-light italic text-transparent text-4xl sm:text-5xl lg:text-7xl tracking-[-0.01em] leading-tight lg:leading-[79.2px]">
                start to sealed.
              </div>
              <p className="mt-6 max-w-[560px] [font-family:'Inter',Helvetica] font-light text-neutral-300 text-base sm:text-lg tracking-[0.35px] leading-relaxed">
                The path a file takes from your screen to long-term safety —
                without any of it leaving your control.
              </p>
            </header>
          </FadeIn>

          <div className="relative">
            {/* Connector rail — horizontal on lg, vertical on mobile */}
            <div
              aria-hidden="true"
              className="absolute top-[18px] left-3 right-3 hidden lg:block h-px bg-gradient-to-r from-white/0 via-white/25 to-white/0"
            />
            <div
              aria-hidden="true"
              className="absolute top-0 bottom-0 left-[18px] lg:hidden w-px bg-gradient-to-b from-white/0 via-white/25 to-white/0"
            />

            <ol className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-5">
              {steps.map((step, i) => (
                <motion.li
                  key={step.number}
                  className="relative pl-12 lg:pl-0 lg:pt-12"
                  initial={{ y: 24, opacity: 0.001 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Step dot — on the rail */}
                  <span
                    aria-hidden="true"
                    className="absolute top-2 left-3 lg:top-3 lg:left-3 w-3.5 h-3.5 rounded-full border-[2px] border-white/30 bg-black z-10"
                  >
                    <span className="absolute inset-[2px] rounded-full bg-white/70" />
                  </span>

                  <GlassContainer
                    cornerRadius={16}
                    baseStrength={14}
                    softness={12}
                    edgeContrast={2.2}
                    shadowContrast={2.2}
                    reflectionPresence={0.95}
                    edgeBrightness={1.05}
                    brightness={1.02}
                    className="w-full h-full"
                  >
                    <article
                      className="relative flex flex-col gap-4 w-full h-full bg-[#00000020] rounded-[16px] p-6 lg:p-7
                      shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),inset_1px_1px_0_0_rgba(255,255,255,0.22),inset_-1px_-1px_0_0_rgba(255,255,255,0.06)]"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="[font-family:'Cinzel',serif] font-bold text-white/20 text-3xl leading-none"
                          aria-hidden="true"
                        >
                          {step.number}
                        </span>
                        <span className="[font-family:'Roboto_Mono',monospace] text-[10px] tracking-[0.2em] uppercase text-neutral-500 px-2 py-1 rounded border border-white/10 bg-white/[0.03]">
                          {step.hint}
                        </span>
                      </div>
                      <h3 className="[font-family:'Inter',Helvetica] font-normal text-white text-lg sm:text-xl tracking-[-0.005em] leading-snug">
                        {step.title}
                      </h3>
                      <p className="[font-family:'Inter',Helvetica] font-light text-neutral-300 text-sm sm:text-[15px] tracking-[0.35px] leading-relaxed flex-grow">
                        {step.description}
                      </p>
                    </article>
                  </GlassContainer>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
};
