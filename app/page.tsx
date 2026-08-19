import Hero from "@/components/landing/Hero";
import ProblemSection from "@/components/landing/ProblemSection";
import TransformationSection from "@/components/landing/TransformationSection";
import CraftCatalogueSection from "@/components/landing/CraftCatalogueSection";
import FairPricingWidget from "@/components/landing/FairPricingWidget";
import AuthenticityFeatureSection from "@/components/landing/AuthenticityFeatureSection";
import VoiceAccessibilitySection from "@/components/landing/VoiceAccessibilitySection";
import ArtisanStoriesSection from "@/components/landing/ArtisanStoriesSection";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section with Interactive Craft Switcher */}
      <Hero />

      {/* 2. The 3-Step Artisan Flow */}
      <ProblemSection />

      {/* 3. AI Transformation Side-by-Side */}
      <TransformationSection />

      {/* 4. Live Masterworks Craft Catalogue */}
      <CraftCatalogueSection />

      {/* 5. Interactive Fair Pricing Simulator */}
      <FairPricingWidget />

      {/* 6. AI Authenticity & Anti-Counterfeit Guard */}
      <AuthenticityFeatureSection />

      {/* 7. Voice & Multilingual Accessibility Showcase */}
      <VoiceAccessibilitySection />

      {/* 8. Master Artisan Testimonials & Impact */}
      <ArtisanStoriesSection />

      {/* 9. Interactive FAQ Accordion */}
      <FAQSection />

      {/* 10. High-Impact Closing CTA */}
      <CTASection />
    </div>
  );
}
