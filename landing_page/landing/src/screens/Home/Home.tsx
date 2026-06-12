import { FinalCtaSection } from "./sections/FinalCtaSection";
import { HeroSection } from "./sections/HeroSection";
import { SolutionSection } from "./sections/SolutionSection";
import { ProblemSection } from "./sections/ProblemSection.tsx";
import { ProductsSection } from "./sections/ProductsSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";
import { ValuesGridSection } from "./sections/ValuesGridSection";

export const Home = (): JSX.Element => {
  return (
    <main className="overflow-x-hidden w-full min-h-screen relative">
      <HeroSection />
      <div className="relative w-full">
        <ProblemSection />
        <SolutionSection />
        <TestimonialsSection />
        <ValuesGridSection />
        <ProductsSection />
        <FinalCtaSection />
      </div>
    </main>
  );
};
