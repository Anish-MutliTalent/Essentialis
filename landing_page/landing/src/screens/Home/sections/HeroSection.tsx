import { motion } from "framer-motion"
import GradientGlobe from "../../../components/GradientGlobe"
import { GlassContainer } from "../../../components/GlassContainer"

const trustedTeams = [
  {
    src: "./partners/kroniq.png",
    alt: "KroniQ",
    className: "relative h-[46px] w-auto object-contain opacity-60 hover:opacity-100 transition-opacity duration-300",
  },
  {
    src: "./partners/elevana.png",
    alt: "Elevana",
    className: "relative h-[38px] w-auto object-contain opacity-60 hover:opacity-100 transition-opacity duration-300",
  },
  {
    src: "./partners/scalora.png",
    alt: "Scalora",
    className: "relative h-[50px] w-auto object-contain opacity-60 hover:opacity-100 transition-opacity duration-300",
  },
];

// Duplicate for seamless loop
const marqueeLogos = [...trustedTeams, ...trustedTeams, ...trustedTeams];

const Partners = (): JSX.Element => {
  return (
    <motion.div
      className="w-full flex flex-col items-center gap-8 py-28"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <h2 className="opacity-[0.45] [font-family:'Inter',Helvetica] font-normal text-white text-[14px] uppercase tracking-[0.2em] text-center leading-none whitespace-nowrap">
        Trusted by teams at
      </h2>
      {/* Marquee container */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
        }}
      >
        <div
          className="flex gap-16 items-center"
          style={{
            animation: 'partners-scroll 28s linear infinite',
            width: 'max-content',
          }}
        >
          {marqueeLogos.map((logo, index) => (
            <img
              key={`${logo.src}-${index}`}
              className={logo.className}
              alt={logo.alt}
              src={logo.src}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}


export const HeroSection = (): JSX.Element => {


  return (
    <div className="relative w-full">
    <div className="relative w-full h-screen">
      {/* <img 
      className="absolute left-[6vw] h-[235vh] w-auto object-cover bottom-[-22vh] object-left"
      src="./ico-sphere-globe-bright.png"/> */}
      <GradientGlobe className="absolute left-[6vw] h-[235vh] w-[235vh] bottom-[-22vh]"/>
      <img
        className="absolute top-0 left-1/2 -translate-x-[calc(50%-30px)] h-[100vh] w-auto mix-blend-overlay pointer-events-none select-none object-cover"
        src="./lock.png"
      />
      <div className="absolute bottom-8 inset-x-0 flex flex-col items-start gap-12 px-6 lg:contents">
      <div className="lg:absolute lg:bottom-32 lg:left-1/2 lg:-translate-x-[calc(50%+24vw)]">
      <section
        className="flex flex-col w-[min(609px,90vw)] items-start justify-end gap-[29px] relative origin-bottom-left xl:scale-[1.08] 2xl:scale-[1.15]"
        aria-label="Hero section"
      >
        <div className="flex items-center gap-4 relative self-stretch w-full flex-[0_0_auto]">
          <GlassContainer
            baseStrength={30}
            softness={30}
            edgeBrightness={1.2}
          >
            <div
              className="flex w-60 h-[62px] items-center gap-[22px] px-4 py-1.5 relative rounded-full
              shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),inset_1px_1px_0_0_rgba(255,255,255,0.25),inset_-1px_-1px_0_0_rgba(255,255,255,0.15)]"
            >
              <img
                className="relative w-[92px] h-9"
                src="https://c.animaapp.com/UXoQJ2zg/img/container.svg"
              />
              <div className="inline-flex flex-col items-start gap-1.5 relative flex-[0_0_auto]">
                <div className="flex flex-col items-start pt-0.5 pb-0 px-0 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                    <div className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Inter',Helvetica] font-medium text-white text-[13px] tracking-[0] leading-[10px]">
                      Top Rated
                    </div>
                  </div>
                </div>
                <img
                  className="relative self-stretch w-full flex-[0_0_auto] object-cover"
                  src='./5stars.svg'
                />
              </div>
            </div>
          </GlassContainer>
        </div>
        <header className="justify-center gap-[7px] self-stretch w-full flex-[0_0_auto] flex flex-col items-start relative">
          <div className="inline-flex flex-col items-start justify-center relative flex-[0_0_auto]">
            <h1 className="m-0 relative flex items-center w-fit mt-[-1.00px] [text-shadow:-2px_2px_3.4px_#bf459333] [font-family:'Inter',Helvetica] font-normal text-white text-[clamp(3rem,100vw,4.5rem)] tracking-[-0.01em] leading-[1.1] whitespace-nowrap">
              Decentralisation,
            </h1>
            <p className="m-0 relative flex items-center w-fit [text-shadow:-2px_3px_7.8px_#f43a7e36] bg-[linear-gradient(0deg,rgba(184,184,184,1)_0%,rgba(255,255,255,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Inter',Helvetica] font-light italic text-transparent text-[clamp(3rem,100vw,4.5rem)] tracking-[-0.01em] leading-[1.1] whitespace-nowrap">
              made usable
            </p>
          </div>
        </header>
        <div className="inline-flex items-center gap-[30px] relative flex-[0_0_auto]">
          <button
            type="button"
            className="relative w-[187px] h-[54px] bg-white rounded-[48px] shadow-[inset_0px_4px_23.8px_-6px_#ffc473,inset_-1px_1px_2px_#ffffff] transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label="Join Waitlist"
          >
            <span className="absolute top-3.5 left-[34px] h-[26px] flex items-center justify-center [font-family:'Inter',Helvetica] font-semibold text-black text-xl text-center tracking-[0] leading-[25.6px] whitespace-nowrap">
              Join Waitlist
            </span>
          </button>
          <GlassContainer
            baseStrength={30}
            softness={30}
            edgeBrightness={1.2}
          >
            <div
              className="w-[214px] h-14 flex items-center px-4 py-2 relative rounded-full
              shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),inset_1px_1px_0_0_rgba(255,255,255,0.25),inset_-1px_-1px_0_0_rgba(255,255,255,0.15)]"
              role="status"
              aria-live="polite"
            >
              <div
                className="relative w-2 h-2 bg-[#ebc541] rounded-full shadow-[0px_0px_10px_#facc15]"
                aria-hidden="true"
              />
              <div className="inline-flex flex-col items-start pl-2 pr-0 py-0 relative flex-[0_0_auto]">
                <div className="relative flex items-center w-fit mt-[-1.00px] [font-family:'Inter',Helvetica] font-medium text-white text-base tracking-[0.35px] leading-5 whitespace-nowrap">
                  PRIVATE BY DESIGN
                </div>
              </div>
            </div>
          </GlassContainer>
        </div>
      </section>
      </div>
      <div className="lg:absolute lg:bottom-32 lg:left-1/2 lg:-translate-x-[calc(50%-24vw-75px)]">
      <GlassContainer
        className="origin-bottom-right xl:scale-[1.08] 2xl:scale-[1.15]"
        cornerRadius={38}
        baseStrength={20}
        softness={20}
      >
      <section
        className="flex flex-col w-[min(465px,90vw)] lg:w-[min(465px,38vw)] h-auto items-center justify-center gap-[13px] px-0 py-5
        relative bg-[#00000001] rounded-[38px]
        shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),inset_1px_1px_0_0_rgba(255,255,255,0.25),inset_-1px_-1px_0_0_rgba(255,255,255,0.15)]"
        aria-label="Community statistics and social links"
      >
        <div className="flex w-[399px] h-[107px] items-center gap-5 relative">
          <img
            className="relative w-[103px] h-[105px] ml-[-15.00px] pointer-events-none select-none"
            alt="Background border"
            src="https://c.animaapp.com/UXoQJ2zg/img/background-border-shadow.svg"
          />
          <div className="inline-flex flex-col items-start gap-1.5 relative flex-[0_0_auto]">
            <div className="flex w-[231px] h-[29px] items-center gap-3.5 relative">
              <div className="relative flex items-center w-fit [font-family:'Roboto_Mono',monospace] font-normal text-neutral-400 text-base tracking-[1.20px] leading-4 whitespace-nowrap">
                TOTAL MEMBERS
              </div>
              <div className="flex flex-col w-[54px] h-[23px] items-center justify-center px-1.5 py-0.5 relative bg-[#4ade801a] rounded border border-solid border-[#4ade8033]">
                <div className="relative flex items-center w-fit [font-family:'Roboto_Mono',monospace] font-normal text-green-400 text-[13px] tracking-[1.20px] leading-4 whitespace-nowrap">
                  LIVE
                </div>
              </div>
            </div>
            <div className="flex h-[47px] items-baseline relative self-stretch w-full">
              <div className="relative flex items-center w-[194px] h-[53px] mt-[-1.00px] mb-[-5.00px] [font-family:'Inter',Helvetica] font-bold text-white text-[54px] tracking-[-0.01em] leading-10">
                65
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-[400px] h-[74px] items-center gap-2 relative">
          <button
            type="button"
            className="flex w-[181px] h-[50px] items-center justify-center gap-2 px-2 py-3 relative bg-[#fa9e001a] rounded-[50px] shadow-[inset_0_1px_0_rgba(255,255,255,0.40),inset_1px_0_0_rgba(255,255,255,0.32),inset_0_-1px_1px_rgba(0,0,0,0.13),inset_-1px_0_1px_rgba(0,0,0,0.11)] cursor-pointer"
            aria-label="Learn more"
          >
            <div className="relative flex items-center justify-center w-fit [font-family:'Inter',Helvetica] font-bold text-white text-base text-center tracking-[0.35px] leading-5 whitespace-nowrap">
              Learn More
            </div>
            <img
              className="relative w-4 h-4 pointer-events-none select-none"
              alt=""
              aria-hidden="true"
              src="https://c.animaapp.com/UXoQJ2zg/img/component-1.svg"
            />
          </button>
          <button
            type="button"
            className="flex w-[154px] h-[50px] items-center justify-center gap-2 p-3 relative bg-[#ffffff0d] rounded-[50px] border border-solid border-[#ffffff1a] cursor-pointer"
            aria-label="Follow us"
          >
            <img
              className="relative w-5 h-5 pointer-events-none select-none"
              alt=""
              aria-hidden="true"
              src="https://c.animaapp.com/UXoQJ2zg/img/component-1-1.svg"
            />
            <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
              <div className="relative flex items-center w-fit mt-[-1.00px] [font-family:'Inter',Helvetica] font-semibold text-neutral-400 text-base tracking-[0.35px] leading-5 whitespace-nowrap">
                Follow us
              </div>
            </div>
          </button>
          <button
            type="button"
            className="relative w-[49px] h-[50px] cursor-pointer"
            aria-label="Open social link"
          >
            <img
              className="relative w-[49px] h-[50px] pointer-events-none select-none"
              alt=""
              aria-hidden="true"
              src="https://c.animaapp.com/UXoQJ2zg/img/component-9.svg"
            />
          </button>
        </div>
      </section>
      </GlassContainer>
      </div>
    </div>
    </div>
    <Partners/>
    </div>
  );
};
