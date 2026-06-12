import { motion } from "framer-motion";
import { GlassContainer } from "../../../components/GlassContainer";
import DynamicGradientEllipse from "../../../components/DynamicGradientEllipse";
import { Parallax } from "../../../components/Parallax";
import { FadeIn } from "../../../components/FadeIn";

type Founder = {
  name: string;
  role: string;
  age: string;
  bio: string;
  focus: string[];
  pfp: string;
  linkedin: string;
  linkedinHandle: string;
  followers: string;
  accentColor: string;
  accentGradient: string;
};

const founders: Founder[] = [
  {
    name: "Lakshmi Pavan Kumaar",
    role: "Founder & CEO",
    age: "16",
    bio: "Visionary turning early sparks into shipped products. Pulls direction from real users, not roadmaps.",
    focus: ["Product strategy", "Smart contracts", "Engineering"],
    pfp: "https://media.licdn.com/dms/image/v2/D5603AQFuw0MHXRFGKA/profile-displayphoto-shrink_400_400/B56ZPsvvIpGQAg-/0/1734843757912?e=1770854400&v=beta&t=kG_USCPtL2e10txa7M18olZRjqXHIYyShC0UsgzJ8rU",
    linkedin: "https://www.linkedin.com/in/pavankumaar009/",
    linkedinHandle: "in/pavankumaar009",
    followers: "1K",
    accentColor: "#FFB01F",
    accentGradient: "from-[#FFB01F] via-[#E89700] to-[#FFB01F]",
  },
  {
    name: "Anish Bhattacharya",
    role: "Founder & COO",
    age: "15",
    bio: "Owns the surfaces people actually touch. Believes the product is the protocol — the rest is plumbing.",
    focus: ["UI/UX", "Web3 & Solidity", "Full-stack"],
    pfp: "https://media.licdn.com/dms/image/v2/D4E03AQFV8iDS3yGHYg/profile-displayphoto-scale_400_400/B4EZorj1SvHUAg-/0/1761667406215?e=1770854400&v=beta&t=CpOmNuC4iLg_yAJGRgauhaLrwnQCaZAcopySB8vPqpA",
    linkedin: "https://www.linkedin.com/in/anishbhattacharya1120/",
    linkedinHandle: "in/anishbhattacharya1120",
    followers: "1.2K",
    accentColor: "#9F3491",
    accentGradient: "from-[#9F3491] via-[#b61da2] to-[#9F3491]",
  },
];

export const BuildersSection = (): JSX.Element => {
  return (
    <>
      <svg width="0" height="0" className="absolute overflow-hidden">
        <defs>
          <filter id="about-builders-inner-shadow" x="-20%" y="-20%" width="140%" height="140%">
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
        id="builders"
        aria-labelledby="about-builders-heading"
        className="relative w-full mt-32 lg:mt-[260px] px-4 sm:px-6 lg:px-0"
      >
        {/* Left cluster — warm orange focal under left founder card */}
        <Parallax strength={0.3} className="absolute left-[-274px] w-[1414px] h-[1132px] pointer-events-none">
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
              <DynamicGradientEllipse color="#E89700" opacity={1} phaseOffset={-0.162} multiLobe linearRotation />
            </div>
          </div>
        </Parallax>

        {/* Right cluster — purple focal under right founder card */}
        <Parallax strength={0.3} className="absolute right-[-795px] w-[1414px] h-[1132px] pointer-events-none">
          <div aria-hidden="true" className="absolute top-[-235px] left-0 right-0 bottom-0">
            <div className="absolute top-[357px] left-[503px] w-[642px] h-[658px] rounded-[321px/329px] blur-[117.6px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0.84)_34%,rgba(255,255,255,0.84)_100%)]" />
            <div className="top-[343px] left-[488px] absolute w-[642px] h-[658px] rounded-[321px/329px] blur-[117.6px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0.84)_34%,rgba(255,255,255,0.84)_100%)]" />
            <div className="absolute overflow-hidden" style={{ top: '147px', left: '408px', width: '642px', height: '658px', borderRadius: '321px / 329px', filter: 'blur(48.1px)', mixBlendMode: 'overlay' }}>
              <DynamicGradientEllipse color="#9F3491" opacity={1} phaseOffset={1.167} multiLobe linearRotation timeOffset={6.8} />
            </div>
            <div className="absolute overflow-hidden" style={{ top: '476px', left: '329px', width: '934px', height: '957px', borderRadius: '467px / 478.5px', filter: 'blur(38.65px)', mixBlendMode: 'overlay' }}>
              <DynamicGradientEllipse color="#E89700" opacity={1} phaseOffset={-1.496} multiLobe linearRotation timeOffset={17.5} />
            </div>
            <div className="absolute overflow-hidden" style={{ top: '439px', left: '-50px', width: '640px', height: '658px', borderRadius: '320px / 329px', filter: 'blur(48.1px)', mixBlendMode: 'overlay' }}>
              <DynamicGradientEllipse color="#9F3491" opacity={1} phaseOffset={-0.162} multiLobe linearRotation timeOffset={13.4} />
            </div>
          </div>
        </Parallax>

        <div className="relative max-w-[1225px] mx-auto">
          <FadeIn>
            <header className="flex flex-col items-center text-center mb-14 lg:mb-20">
              <h2
                id="about-builders-heading"
                className="m-0 [font-family:'Inter',Helvetica] font-normal text-white text-4xl sm:text-5xl lg:text-7xl tracking-[-0.01em] leading-tight lg:leading-[79.2px] [text-shadow:-2px_2px_3.4px_#bf459333]"
              >
                Two founders.
              </h2>
              <div className="[filter:url(#about-builders-inner-shadow)] bg-[linear-gradient(0deg,rgba(184,184,184,1)_0%,rgba(255,255,255,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Inter',Helvetica] font-light italic text-transparent text-4xl sm:text-5xl lg:text-7xl tracking-[-0.01em] leading-tight lg:leading-[79.2px]">
                One bet.
              </div>
              <p className="mt-6 max-w-[600px] [font-family:'Inter',Helvetica] font-light text-neutral-300 text-base sm:text-lg lg:text-xl tracking-[0.35px] leading-relaxed">
                The team is small on purpose. Less rooms in the building means
                fewer places the user gets lost.
              </p>
            </header>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
            {founders.map((person, i) => (
              <motion.div
                key={person.name}
                initial={{ y: 28, opacity: 0.001 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <GlassContainer
                  cornerRadius={20}
                  baseStrength={16}
                  softness={14}
                  edgeContrast={2.3}
                  shadowContrast={2.3}
                  reflectionPresence={1}
                  edgeBrightness={1.1}
                  brightness={1.05}
                  className="w-full"
                >
                  <article
                    className="relative w-full bg-[#00000025] rounded-[20px] overflow-hidden p-7 lg:p-9
                    shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),inset_1px_1px_0_0_rgba(255,255,255,0.25),inset_-1px_-1px_0_0_rgba(255,255,255,0.08)]"
                  >
                    {/* Accent stripe on top */}
                    <div
                      className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${person.accentGradient} opacity-80`}
                      aria-hidden="true"
                    />

                    <div className="flex flex-col sm:flex-row items-start gap-6">
                      {/* Avatar with gradient ring */}
                      <a
                        href={person.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 group/avatar block relative"
                        aria-label={`${person.name} on LinkedIn`}
                      >
                        <div
                          className="absolute -inset-[2px] rounded-full opacity-70 group-hover/avatar:opacity-100 transition-opacity"
                          style={{
                            background: `conic-gradient(from 0deg at 50% 50%, ${person.accentColor} 0%, transparent 40%, ${person.accentColor} 100%)`,
                            filter: "blur(2px)",
                          }}
                          aria-hidden="true"
                        />
                        <div className="relative w-[88px] h-[88px] rounded-full overflow-hidden border border-white/15 bg-black/60">
                          <img
                            src={person.pfp}
                            alt={person.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/avatar:scale-105"
                          />
                        </div>
                      </a>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="[font-family:'Roboto_Mono',monospace] text-xs tracking-[0.25em] uppercase text-neutral-400">
                            {person.role}
                          </span>
                          <span
                            className="inline-flex items-center px-1.5 py-0.5 rounded border [font-family:'Roboto_Mono',monospace] text-[10px] tracking-[0.2em] uppercase"
                            style={{
                              borderColor: `${person.accentColor}55`,
                              color: person.accentColor,
                              background: `${person.accentColor}11`,
                            }}
                          >
                            Age {person.age}
                          </span>
                        </div>
                        <h3 className="[font-family:'Inter',Helvetica] font-normal text-white text-2xl lg:text-3xl tracking-[-0.005em] leading-snug">
                          <a
                            href={person.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white transition-colors"
                          >
                            {person.name}
                          </a>
                        </h3>
                        <p className="mt-1 [font-family:'Roboto_Mono',monospace] text-xs tracking-[0.15em] text-neutral-500">
                          {person.linkedinHandle}
                          <span className="mx-2">·</span>
                          {person.followers} followers
                        </p>
                      </div>
                    </div>

                    <p className="mt-7 [font-family:'Inter',Helvetica] font-light text-white text-base sm:text-lg tracking-[0.35px] leading-relaxed">
                      {person.bio}
                    </p>

                    <div className="mt-6 pt-6 border-t border-white/10">
                      <span className="[font-family:'Roboto_Mono',monospace] text-[11px] tracking-[0.25em] uppercase text-neutral-500">
                        Focus
                      </span>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {person.focus.map((tag) => (
                          <li
                            key={tag}
                            className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 [font-family:'Inter',Helvetica] text-xs sm:text-sm text-neutral-300 tracking-[0.2px]"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <a
                      href={person.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-7 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0077b5]/10 border border-[#0077b5]/30 text-[#7fb6dd] hover:text-white hover:bg-[#0077b5]/25 transition-colors [font-family:'Inter',Helvetica] text-xs sm:text-sm font-medium"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="w-3.5 h-3.5"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.852 3.37-1.852 3.601 0 4.267 2.37 4.267 5.455v6.288zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      <span>Connect on LinkedIn</span>
                    </a>
                  </article>
                </GlassContainer>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
