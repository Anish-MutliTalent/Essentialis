import GradientGlobe from "../../../components/GradientGlobe";
import { FadeIn } from '../../../components/FadeIn';


export const FinalCtaSection = (): JSX.Element => {
  return (
    <section
      aria-labelledby="final-cta-heading"
      className="relative w-full  mx-auto mt-[150px] lg:mt-[510px] lg:px-0 overflow-hidden"
    >
      {/* CTA copy + button */}
      <div className="relative z-10 flex flex-col items-center gap-[29px] w-full max-w-[789px] mx-auto pt-8 lg:pt-12">
        <FadeIn>
          <div className="flex flex-col items-center gap-2">
            <h2
              id="final-cta-heading"
              className="m-0 [font-family:'Inter',Helvetica] font-normal text-white text-4xl sm:text-5xl lg:text-7xl tracking-[-0.01em] leading-tight lg:leading-[79.2px] text-center [text-shadow:-2px_2px_3.4px_#bf459333]"
            >
              Decentralisation,
            </h2>
            <div className="[font-family:'Inter',Helvetica] font-light italic text-transparent text-4xl sm:text-5xl lg:text-7xl tracking-[-0.01em] leading-tight lg:leading-[79.2px] text-center [text-shadow:-2px_3px_7.8px_#f43a7e36] bg-[linear-gradient(0deg,rgba(184,184,184,1)_0%,rgba(255,255,255,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent]">
              finally for everyone
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="w-full max-w-[602px] [font-family:'Inter',Helvetica] font-normal text-neutral-300 text-lg sm:text-xl lg:text-2xl text-center tracking-[0.35px] leading-relaxed">
            We open access to Cloud and Dev in small batches.
            <br />
            Get an invite when your slot is ready.
          </p>
        </FadeIn>

        <FadeIn delay={0.2} className="relative">
          <div className="absolute inset-0 bg-[#ffc473] rounded-[48px] blur-xl opacity-40 animate-pulse pointer-events-none" />
          <button
            type="button"
            aria-label="Join waitlist"
            className="relative flex items-center justify-center w-[187px] h-[54px] bg-white rounded-[48px] shadow-[inset_0px_4px_23.8px_-6px_#ffc473,inset_-1px_1px_2px_#ffffff] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="[font-family:'Inter',Helvetica] font-semibold text-black text-xl tracking-[0] leading-[25.6px] whitespace-nowrap">
              <a href="https://old.essentialis.cloud/join-waitlist">Join Waitlist</a>
            </span>
          </button>
        </FadeIn>

        <FadeIn delay={0.3}>
          <p className="w-full max-w-[602px] mix-blend-difference [font-family:'Inter',Helvetica] font-medium text-[#696969] text-base sm:text-lg lg:text-xl text-center tracking-[0.35px] leading-[22.8px]">
            No spam. No tracking. We barely email.
          </p>
        </FadeIn>
      </div>

      <div className="relative w-full aspect-[1739/843]">
        <GradientGlobe
          aria-hidden="true"
          className="absolute left-1/2 -translate-x-1/2  w-[136vw] aspect-square pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -bottom-2 text-center mix-blend-overlay [font-family:'Cinzel_Decorative',Helvetica] font-bold text-white tracking-[0.35px] leading-none [font-size:14.8vw]"
        >
          essENtialiS
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent via-80% to-black pointer-events-none z-10"></div>
      </div>
    </section>
  );
};
