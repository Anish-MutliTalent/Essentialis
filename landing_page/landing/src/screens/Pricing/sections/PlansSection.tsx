import { motion } from "framer-motion";
import { GlassContainer } from "../../../components/GlassContainer";
import DynamicGradientEllipse from "../../../components/DynamicGradientEllipse";
import { Parallax } from "../../../components/Parallax";
import { FadeIn } from "../../../components/FadeIn";
import { useWaitlist } from "../../../components/waitlist/WaitlistContext";

type Plan = {
  name: string;
  tagline: string;
  monthly: number | null; // null = custom / contact
  annual: number | null;
  storage: string;
  highlights: string[];
  cta: string;
  ctaHref: string;
  featured?: boolean;
};

const plans: Plan[] = [
  {
    name: "Free",
    tagline: "For your passwords, keys, and the documents you can't lose.",
    monthly: 0,
    annual: 0,
    storage: "1 GB · 3,000 credits",
    highlights: [
      "Browser-side encryption",
      "Mobile + web access",
      "Document preview",
      "Basic authentication",
    ],
    cta: "Join Waitlist",
    ctaHref: "",
    featured: true,
  },
  {
    name: "Personal",
    tagline: "For everything personal — records, contracts, the lot.",
    monthly: 1.99,
    annual: 19.99,
    storage: "20 GB · 50,000 credits",
    highlights: [
      "Everything in Free, plus —",
      "All file types, folders & sharing",
      "Two-factor auth + audit logs",
      "Version history & guaranteed integrity",
    ],
    cta: "Join Waitlist",
    ctaHref: "",
  },
  {
    name: "Professional",
    tagline: "For professionals and small teams with sensitive work.",
    monthly: 10.99,
    annual: 109.99,
    storage: "250 GB · 200,000 credits",
    highlights: [
      "Everything in Personal, plus —",
      "Advanced access control",
      "Team collaboration",
      "Data tables + API access (soon)",
    ],
    cta: "Join Waitlist",
    ctaHref: "",
  },
  {
    name: "Enterprise",
    tagline: "For organisations that need the maximum, and a human to call.",
    monthly: null,
    annual: null,
    storage: "1 TB → unlimited",
    highlights: [
      "Everything in Professional, plus —",
      "Dedicated account management",
      "24/7 support + custom integrations",
      "Custom branding & admin controls",
    ],
    cta: "Contact Sales",
    ctaHref: "mailto:founders@essentialis.cloud",
  },
];

const formatPrice = (value: number): string =>
  Number.isInteger(value) ? `$${value}` : `$${value.toFixed(2)}`;

const PlanCard = ({ plan, annual, index }: { plan: Plan; annual: boolean; index: number }): JSX.Element => {
  const isFree = plan.monthly === 0;
  const isCustom = plan.monthly === null;
  const price = annual ? plan.annual : plan.monthly;
  const { open: openWaitlist } = useWaitlist();
  const isContact = plan.ctaHref.startsWith("mailto:");

  return (
    <motion.div
      initial={{ y: 24, opacity: 0.001 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className="h-full"
    >
      <GlassContainer
        cornerRadius={20}
        baseStrength={plan.featured ? 18 : 14}
        softness={14}
        edgeContrast={2.3}
        shadowContrast={2.3}
        reflectionPresence={1}
        edgeBrightness={plan.featured ? 1.3 : 1.1}
        brightness={plan.featured ? 1.12 : 1.05}
        className="h-full"
      >
        <article
          className={`relative flex flex-col h-full rounded-[20px] p-7 lg:p-8
          ${plan.featured ? "bg-[#00000030]" : "bg-[#00000020]"}
          shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),inset_1px_1px_0_0_rgba(255,255,255,0.25),inset_-1px_-1px_0_0_rgba(255,255,255,0.08)]`}
        >
          {/* Featured ribbon */}
          {plan.featured && (
            <div className="absolute -top-px left-1/2 -translate-x-1/2 px-3 py-1 rounded-b-lg bg-gradient-to-r from-[#ffb01f] to-[#e89700] [font-family:'Roboto_Mono',monospace] text-[10px] tracking-[0.2em] uppercase text-black font-bold">
              Live in beta
            </div>
          )}

          <header className="flex flex-col gap-2 mb-6">
            <h3 className="[font-family:'Inter',Helvetica] font-normal text-white text-2xl tracking-[-0.005em]">
              {plan.name}
            </h3>
            <p className="[font-family:'Inter',Helvetica] font-light text-neutral-400 text-sm leading-relaxed min-h-[40px]">
              {plan.tagline}
            </p>
          </header>

          {/* Price */}
          <div className="mb-6 pb-6 border-b border-white/10">
            {isFree ? (
              <div className="flex items-baseline gap-1.5">
                <span className="[font-family:'Inter',Helvetica] font-semibold text-white text-4xl tracking-[-0.01em]">
                  Free
                </span>
                <span className="[font-family:'Inter',Helvetica] font-light text-neutral-500 text-sm">
                  forever
                </span>
              </div>
            ) : isCustom ? (
              <div className="flex flex-col gap-1">
                <span className="[font-family:'Inter',Helvetica] font-semibold text-white text-3xl tracking-[-0.01em]">
                  Custom
                </span>
                <span className="[font-family:'Inter',Helvetica] font-light text-neutral-500 text-sm">
                  let&#39;s talk
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <span className="inline-flex w-fit items-center px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 [font-family:'Roboto_Mono',monospace] text-[10px] tracking-[0.15em] uppercase text-neutral-400">
                  At launch
                </span>
                <div className="flex items-baseline gap-1.5 opacity-70">
                  <span className="[font-family:'Inter',Helvetica] font-semibold text-white text-4xl tracking-[-0.01em]">
                    {formatPrice(price as number)}
                  </span>
                  <span className="[font-family:'Inter',Helvetica] font-light text-neutral-400 text-sm">
                    {annual ? "/yr" : "/mo"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Storage line */}
          <div className="flex items-center gap-2 mb-5">
            <span className="[font-family:'Roboto_Mono',monospace] text-[11px] tracking-[0.2em] uppercase text-neutral-500">
              {plan.storage}
            </span>
          </div>

          {/* Highlights */}
          <ul className="flex flex-col gap-3 flex-grow mb-7">
            {plan.highlights.map((item) => {
              const isHeader = item.endsWith("—");
              return (
                <li key={item} className="flex items-start gap-3">
                  {!isHeader && (
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-400" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M13 4L6 11L3 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  <span
                    className={`[font-family:'Inter',Helvetica] text-sm leading-snug ${
                      isHeader
                        ? "font-medium text-neutral-500 text-xs uppercase tracking-[0.1em] mt-1"
                        : "font-light text-neutral-200"
                    }`}
                  >
                    {item}
                  </span>
                </li>
              );
            })}
          </ul>

          {/* CTA — Contact Sales is a mailto anchor; everything else opens the waitlist modal */}
          {plan.featured ? (
            isContact ? (
              <a
                href={plan.ctaHref}
                className="relative flex items-center justify-center w-full h-[50px] bg-white rounded-[48px] shadow-[inset_0px_4px_23.8px_-6px_#ffc473,inset_-1px_1px_2px_#ffffff] transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99] [font-family:'Inter',Helvetica] font-semibold text-black text-base"
              >
                {plan.cta}
              </a>
            ) : (
              <button
                type="button"
                onClick={() => openWaitlist(`pricing-${plan.name.toLowerCase()}`)}
                className="relative flex items-center justify-center w-full h-[50px] bg-white rounded-[48px] shadow-[inset_0px_4px_23.8px_-6px_#ffc473,inset_-1px_1px_2px_#ffffff] transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99] [font-family:'Inter',Helvetica] font-semibold text-black text-base"
              >
                {plan.cta}
              </button>
            )
          ) : isContact ? (
            <a
              href={plan.ctaHref}
              className="relative flex items-center justify-center w-full h-[50px] rounded-[48px] bg-white/[0.05] border border-white/10 hover:bg-white/[0.1] transition-colors [font-family:'Inter',Helvetica] font-semibold text-white text-base
              shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
            >
              {plan.cta}
            </a>
          ) : (
            <button
              type="button"
              onClick={() => openWaitlist(`pricing-${plan.name.toLowerCase()}`)}
              className="relative flex items-center justify-center w-full h-[50px] rounded-[48px] bg-white/[0.05] border border-white/10 hover:bg-white/[0.1] transition-colors [font-family:'Inter',Helvetica] font-semibold text-white text-base
              shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
            >
              {plan.cta}
            </button>
          )}

          {!isFree && (
            <div className="flex items-center justify-center gap-1.5 mt-3 opacity-60">
              <svg className="w-3 h-3 text-neutral-400" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="3.5" y="7" width="9" height="6.5" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
                <path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <span className="[font-family:'Roboto_Mono',monospace] text-[10px] tracking-[0.15em] uppercase text-neutral-400">
                Locked until launch
              </span>
            </div>
          )}
        </article>
      </GlassContainer>
    </motion.div>
  );
};

interface PlansSectionProps {
  annual: boolean;
}

export const PlansSection = ({ annual }: PlansSectionProps): JSX.Element => {
  return (
    <section
      id="plans"
      aria-label="Pricing plans"
      className="relative w-full mt-4 lg:mt-12 px-4 sm:px-6 lg:px-0"
    >
      {/* Central gradient cluster — centered via calc (no transform, so mix-blend stays intact) */}
      <Parallax strength={0.3} className="absolute left-[calc(50%-707px)] w-[1414px] h-[1132px] pointer-events-none">
        <div aria-hidden="true" className="absolute top-[-200px] left-0 right-0 bottom-0">
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

      <div className="relative z-10 max-w-[1285px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan, i) => (
          <PlanCard key={plan.name} plan={plan} annual={annual} index={i} />
        ))}
      </div>

      <FadeIn delay={0.2}>
        <p className="relative z-10 mt-10 text-center [font-family:'Inter',Helvetica] font-light text-neutral-500 text-sm tracking-[0.35px]">
          Every paid feature is free to use right now. We&#39;ll give you plenty of notice before any plan goes live.
        </p>
      </FadeIn>
    </section>
  );
};
