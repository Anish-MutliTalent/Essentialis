import { motion } from "framer-motion";
import { GlassContainer } from "../../../components/GlassContainer";
import DynamicGradientEllipse from "../../../components/DynamicGradientEllipse";
import { Parallax } from "../../../components/Parallax";
import { FadeIn } from "../../../components/FadeIn";

const capabilities = [
  {
    number: "01",
    title: "Browser-side encryption",
    description:
      "Every file is sealed on your device before it ever leaves your network. We receive only ciphertext.",
    filterId: "cap-s-01",
    filterColor: "#bb4622ff",
  },
  {
    number: "02",
    title: "No central server",
    description:
      "Encrypted pieces of your files are spread across a network of storage nodes. No single host can lose or leak it all.",
    filterId: "cap-s-02",
    filterColor: "#911d76ff",
  },
  {
    number: "03",
    title: "Wallet-less account",
    description:
      "Sign in like any other app — email, passkey, or social. The cryptography happens quietly underneath.",
    filterId: "cap-s-03",
    filterColor: "#bd4423ff",
  },
  {
    number: "04",
    title: "Granular sharing",
    description:
      "Share a single file with one person, or a folder with a team. Revoke access any time — the cryptography catches up immediately.",
    filterId: "cap-s-04",
    filterColor: "#a16d46ff",
  },
  {
    number: "05",
    title: "Public audit trail",
    description:
      "Every access — by you, by anyone you shared with — is recorded on a public ledger you can read. No mystery actors.",
    filterId: "cap-s-05",
    filterColor: "#914c14ff",
  },
  {
    number: "06",
    title: "Cross-device, key in your hand",
    description:
      "Open on phone, laptop, tablet — your keys travel with you, recoverable only by you, never by us.",
    filterId: "cap-s-06",
    filterColor: "#48320d",
  },
];

export const CapabilitiesSection = (): JSX.Element => {
  return (
    <>
      <svg width="0" height="0" className="absolute overflow-hidden">
        <defs>
          {capabilities.map((c) => (
            <filter key={c.filterId} id={c.filterId} x="-20%" y="-20%" width="140%" height="140%">
              <feComponentTransfer in="SourceAlpha" result="invertedAlpha">
                <feFuncA type="linear" slope="-1" intercept="1" />
              </feComponentTransfer>
              <feGaussianBlur in="invertedAlpha" stdDeviation="2.4" result="blurredInverted" />
              <feOffset in="blurredInverted" dx="-1" dy="2" result="offsetBlurred" />
              <feComposite in="offsetBlurred" in2="SourceAlpha" operator="in" result="innerShadow" />
              <feFlood floodColor={c.filterColor} result="shadowColor" />
              <feComposite in="shadowColor" in2="innerShadow" operator="in" result="coloredShadow" />
              <feMerge>
                <feMergeNode in="SourceGraphic" />
                <feMergeNode in="coloredShadow" />
              </feMerge>
            </filter>
          ))}
          <filter id="cap-heading-inner-shadow" x="-20%" y="-20%" width="140%" height="140%">
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
        id="capabilities"
        aria-labelledby="cloud-capabilities-heading"
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
                id="cloud-capabilities-heading"
                className="m-0 [font-family:'Inter',Helvetica] font-normal text-white text-4xl sm:text-5xl lg:text-7xl tracking-[-0.01em] leading-tight lg:leading-[79.2px] [text-shadow:-2px_2px_3.4px_#bf459333]"
              >
                Six things it does
              </h2>
              <div className="[filter:url(#cap-heading-inner-shadow)] bg-[linear-gradient(0deg,rgba(184,184,184,1)_0%,rgba(255,255,255,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Inter',Helvetica] font-light italic text-transparent text-4xl sm:text-5xl lg:text-7xl tracking-[-0.01em] leading-tight lg:leading-[79.2px]">
                that the others can&apos;t.
              </div>
              <p className="mt-6 max-w-[640px] [font-family:'Inter',Helvetica] font-light text-neutral-300 text-base sm:text-lg lg:text-xl tracking-[0.35px] leading-relaxed">
                The features that change because the foundations changed.
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
              aria-label="Cloud capabilities"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full bg-transparent rounded-[14px] overflow-hidden"
            >
              {capabilities.map((c, i) => (
                <motion.div
                  key={c.number}
                  initial={{ y: 16, opacity: 0.001 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.55, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
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
                      className="relative flex flex-col gap-3 p-7 lg:p-9 w-full h-full min-h-[240px] bg-transparent"
                    >
                      <span
                        className="[font-family:'Cinzel',serif] font-bold text-white/10 text-4xl lg:text-5xl leading-none"
                        aria-hidden="true"
                      >
                        {c.number}
                      </span>
                      <h3
                        className="[font-family:'Inter',Helvetica] font-normal text-white text-lg sm:text-xl lg:text-[22px] tracking-[-0.005em] leading-snug mt-1"
                        style={{ filter: `url(#${c.filterId})` }}
                      >
                        {c.title}
                      </h3>
                      <p className="[font-family:'Inter',Helvetica] font-light text-neutral-300 text-sm sm:text-base tracking-[0.35px] leading-relaxed">
                        {c.description}
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
