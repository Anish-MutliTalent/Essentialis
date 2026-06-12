import { HeroSection } from "./sections/HeroSection";
import { MissionSection } from "./sections/MissionSection";
import { JourneySection } from "./sections/JourneySection";
import { PrinciplesSection } from "./sections/PrinciplesSection";
import { BuildersSection } from "./sections/BuildersSection";
import { FinalCtaSection } from "../Home/sections/FinalCtaSection";

export const About = (): JSX.Element => {
  return (
    <main className="overflow-x-hidden w-full min-h-screen relative">
      <HeroSection />
      <div className="relative w-full">
        <MissionSection />
        <JourneySection />
        <PrinciplesSection />
        <BuildersSection />
        <FinalCtaSection />
      </div>
    </main>
  );
};
