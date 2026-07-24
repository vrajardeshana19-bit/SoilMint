import { Navbar } from '../layout/Navbar';
import { HeroSection } from '../sections/HeroSection';
import { TrustedPartnersSection } from '../sections/TrustedPartnersSection';
import { HowItWorksSection } from '../sections/HowItWorksSection';
import { FeaturesSection } from '../sections/FeaturesSection';
import { MarketplacePreviewSection } from '../sections/MarketplacePreviewSection';
import { AiRecommendationsSection } from '../sections/AiRecommendationsSection';
import { TestimonialsSection } from '../sections/TestimonialsSection';
import { CtaSection } from '../sections/CtaSection';
import { FooterSection } from '../sections/FooterSection';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main>
        <HeroSection />
        <TrustedPartnersSection />
        <HowItWorksSection />
        <FeaturesSection />
        <MarketplacePreviewSection />
        <AiRecommendationsSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <FooterSection />
    </div>
  );
}
