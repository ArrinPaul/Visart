import Hero from "@/components/landing/Hero";
import ProblemSection from "@/components/landing/ProblemSection";
import TransformationSection from "@/components/landing/TransformationSection";
import CTASection from "@/components/landing/CTASection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <ProblemSection />
      <TransformationSection />
      <CTASection />
    </div>
  );
}
