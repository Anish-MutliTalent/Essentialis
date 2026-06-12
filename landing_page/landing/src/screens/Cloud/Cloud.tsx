import { HeroSection } from "./sections/HeroSection";
import { WhatItIsSection } from "./sections/WhatItIsSection";
import { CapabilitiesSection } from "./sections/CapabilitiesSection";
import { HowItWorksSection } from "./sections/HowItWorksSection";
import { FinalCtaSection } from "../Home/sections/FinalCtaSection";

export const Cloud = (): JSX.Element => {
  return (
    <main className="overflow-x-hidden w-full min-h-screen relative">
      <HeroSection />
      <div className="relative w-full">
        <WhatItIsSection />
        <CapabilitiesSection />
        <HowItWorksSection />
        <FinalCtaSection />
      </div>
    </main>
  );
};
