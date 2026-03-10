import { HeroSection } from '../components/landing/hero-section';
import { ServicesOverview } from '../components/landing/services-overview';
import { CtaSection } from '../components/landing/cta-section';

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <ServicesOverview />
      <CtaSection />
    </main>
  );
}
