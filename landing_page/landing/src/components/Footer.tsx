import { FadeIn, FadeInStagger, FadeInItem } from "./FadeIn";

const footerSections = [
  {
    title: "Product",
    items: ["Features", "Security", "Pricing", "Roadmap"],
  },
  {
    title: "Company",
    items: ["About Us", "Builders", "Blog", "Contact"],
  },
  {
    title: "Legal",
    items: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
  },
];

export const Footer = (): JSX.Element => {
  return (
    <footer className="flex flex-col w-full justify-end items-center px-4 sm:px-6 lg:px-8 pb-8 lg:pb-16 bg-black h-[100vh] md:h-auto">
      <div className="flex flex-col w-full max-w-7xl mx-auto gap-8 lg:gap-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between self-stretch w-full">
          <FadeIn className="flex flex-col w-full lg:w-[483.19px] items-start gap-[23.1px]">
            <div className="flex items-center gap-2 self-stretch w-full">
              <img
                className="w-[211px] h-[47px] aspect-[4.44] object-cover"
                alt="Essentialis"
                src="https://c.animaapp.com/UXoQJ2zg/img/essentialisbrandnbg-1-1@2x.png"
              />
            </div>
            <div className="flex flex-col w-full max-w-sm items-start">
              <p className="[font-family:'Inter',Helvetica] font-light text-neutral-400 text-base tracking-[0] leading-[25.6px]">
                The new standard for private, decentralized
                <br />
                document storage. Built for people who value their
                <br />
                data.
              </p>
            </div>
            <img
              className="self-stretch w-full mb-[-15.01px] object-cover"
              alt=""
              aria-hidden="true"
              src="https://c.animaapp.com/UXoQJ2zg/img/container-5.svg"
            />
          </FadeIn>
        <FadeInStagger delay={0.2} className="flex flex-col gap-8 lg:flex-row lg:items-start w-full lg:w-auto flex-1 justify-end">
          {footerSections.map((section) => (
            <FadeInItem key={section.title} direction="up" className="flex flex-col w-full lg:w-[217.6px] items-start gap-[24.01px]">
              <nav
                aria-label={section.title}
                className="w-full flex flex-col items-start gap-[24.01px]"
              >
                <div className="self-stretch w-full flex flex-col items-start">
                  <div className="flex items-center self-stretch [font-family:'Inter',Helvetica] font-semibold text-white text-base tracking-[0] leading-[25.6px]">
                    {section.title}
                  </div>
                </div>
                <ul className="flex flex-col items-start gap-4 self-stretch w-full">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="flex flex-col items-start self-stretch w-full"
                    >
                      <div className="flex items-start self-stretch w-full">
                        <span className="flex items-center flex-1 [font-family:'Inter',Helvetica] font-normal text-neutral-400 text-sm tracking-[0.35px] leading-5 hover:text-white transition-colors cursor-pointer">
                          {item}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </nav>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
      <FadeIn delay={0.4} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 pt-8 self-stretch w-full border-t [border-top-style:solid] border-[#ffffff0d]">
        <p className="[font-family:'Inter',Helvetica] font-normal text-neutral-500 text-sm tracking-[0.35px] leading-5 whitespace-nowrap">
          © 2026 Essentialis Inc. All rights reserved.
        </p>
        <p className="[font-family:'Inter',Helvetica] font-normal text-neutral-500 text-sm tracking-[0.35px] leading-5 whitespace-nowrap">
          Designed with precision.
        </p>
      </FadeIn>
      </div>
    </footer>
  );
};
