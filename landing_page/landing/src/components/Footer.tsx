import { Link } from "react-router-dom";
import { FadeIn, FadeInStagger, FadeInItem } from "./FadeIn";
import { useWaitlist } from "./waitlist/WaitlistContext";

type FooterItem = { label: string; to?: string; href?: string; action?: "waitlist" };

const footerSections: { title: string; items: FooterItem[] }[] = [
  {
    title: "Cloud",
    items: [
      { label: "Overview", to: "/cloud" },
      { label: "What it is", to: "/cloud#what-it-is" },
      { label: "Capabilities", to: "/cloud#capabilities" },
      { label: "How it works", to: "/cloud#how-it-works" },
      { label: "Request access", action: "waitlist" },
    ],
  },
  {
    title: "Pricing",
    items: [
      { label: "Plans", to: "/pricing#plans" },
      { label: "Free tier", to: "/pricing#plans" },
      { label: "FAQ", to: "/pricing#faq" },
      { label: "Join waitlist", action: "waitlist" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About", to: "/about" },
      { label: "Our mission", to: "/about#mission" },
      { label: "Journey", to: "/about#journey" },
      { label: "Our principles", to: "/about#principles" },
      { label: "The founders", to: "/about#builders" },
      { label: "Blog", href: "https://old.essentialis.cloud/blog" },
      { label: "Contact", href: "mailto:founders@essentialis.cloud" },
    ],
  },
  // {
  //   title: "Legal",
  //   items: [
  //     { label: "Privacy Policy", href: "https://old.essentialis.cloud/privacy-policy" },
  //     { label: "Terms of Service", href: "https://old.essentialis.cloud/terms-of-service" },
  //     { label: "Cookie Policy", href: "https://old.essentialis.cloud/cookie-policy" },
  //   ],
  // },
];

export const Footer = (): JSX.Element => {
  const { open: openWaitlist } = useWaitlist();

  return (
    <footer className="relative z-10 flex flex-col w-full items-center px-4 sm:px-6 lg:px-8 pt-16 pb-8 lg:pb-16 bg-black">
      <div className="flex flex-col w-full max-w-7xl mx-auto gap-12 lg:gap-16">

        {/* Top row — brand + columns */}
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">

          {/* Brand block */}
          <FadeIn className="flex flex-col items-start gap-5 lg:w-[300px] shrink-0">
            <img
              className="w-[211px] h-[47px] object-contain"
              alt="Essentialis"
              src="https://c.animaapp.com/UXoQJ2zg/img/essentialisbrandnbg-1-1@2x.png"
            />
            <p className="[font-family:'Inter',Helvetica] font-light text-neutral-400 text-base leading-[26px] max-w-[280px]">
              Private, decentralized document storage. Built for people who actually own their data.
            </p>
            <a
              href="mailto:founders@essentialis.cloud"
              className="[font-family:'Roboto_Mono',monospace] text-xs text-neutral-500 hover:text-white transition-colors tracking-[0.05em]"
            >
              founders@essentialis.cloud
            </a>

            {/* Social row */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com/company/essentialis-cloud/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.05] border border-white/10 text-neutral-400 hover:text-white hover:bg-white/[0.1] transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
                </svg>
              </a>
              <a
                href="https://chat.whatsapp.com/GjCN1H5X4k22ZqXp1u4y5x"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp community"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.05] border border-white/10 text-neutral-400 hover:text-[#25d366] hover:bg-white/[0.1] transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17.47 14.38c-.3-.15-1.74-.86-2-.96-.27-.1-.47-.15-.66.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.9-2.18-.24-.57-.48-.5-.66-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.74-.71 1.98-1.4.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35zM12.02 2C6.58 2 2.16 6.42 2.16 11.86c0 1.74.46 3.44 1.32 4.94L2 22l5.34-1.4a9.86 9.86 0 0 0 4.68 1.19h.01c5.44 0 9.86-4.42 9.86-9.86 0-2.64-1.03-5.12-2.9-6.99A9.8 9.8 0 0 0 12.02 2z" />
                </svg>
              </a>
            </div>
          </FadeIn>

          {/* Link columns */}
          <FadeInStagger
            delay={0.15}
            className="grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-10 flex-1 lg:justify-end"
          >
            {footerSections.map((section) => (
              <FadeInItem key={section.title} direction="up" className="flex flex-col gap-5">
                <nav aria-label={section.title} className="flex flex-col gap-5">
                  <span className="[font-family:'Inter',Helvetica] font-semibold text-white text-sm tracking-[0] leading-5">
                    {section.title}
                  </span>
                  <ul className="flex flex-col gap-3">
                    {section.items.map((item) => {
                      const cls =
                        "w-fit [font-family:'Inter',Helvetica] font-normal text-neutral-400 text-sm tracking-[0.35px] leading-5 hover:text-white transition-colors";
                      return (
                        <li key={item.label}>
                          {item.action === "waitlist" ? (
                            <button
                              type="button"
                              onClick={() => openWaitlist("footer")}
                              className={cls}
                            >
                              {item.label}
                            </button>
                          ) : item.to ? (
                            <Link to={item.to} className={cls}>
                              {item.label}
                            </Link>
                          ) : (
                            <a href={item.href} className={cls}>
                              {item.label}
                            </a>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </div>

        {/* Bottom bar */}
        <FadeIn
          delay={0.3}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-8 border-t border-white/[0.06]"
        >
          <p className="[font-family:'Inter',Helvetica] font-normal text-neutral-500 text-sm tracking-[0.35px] leading-5">
            © 2026 Essentialis Inc. All rights reserved.
          </p>
          <p className="[font-family:'Inter',Helvetica] font-normal text-neutral-500 text-sm tracking-[0.35px] leading-5">
            Designed with precision.
          </p>
        </FadeIn>

      </div>
    </footer>
  );
};
