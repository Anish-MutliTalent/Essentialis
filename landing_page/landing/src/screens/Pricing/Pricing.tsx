import { useState } from "react";
import { HeroSection } from "./sections/HeroSection";
import { PlansSection } from "./sections/PlansSection";
import { FaqSection } from "./sections/FaqSection";
import { FinalCtaSection } from "../Home/sections/FinalCtaSection";

export const Pricing = (): JSX.Element => {
  const [annual, setAnnual] = useState(false);

  return (
    <main className="overflow-x-hidden w-full min-h-screen relative">
      <HeroSection annual={annual} onToggle={setAnnual} />
      <div className="relative w-full">
        <PlansSection annual={annual} />
        <FaqSection />
        <FinalCtaSection />
      </div>
    </main>
  );
};
