import { CtaSection } from '@/components/landing/cta-section';
import { HeroSection } from '@/components/landing/hero-section';
import { ServicesOverview } from '@/components/landing/services-overview';

const LandingPage = () => {
  return (
    <main>
      <HeroSection />
      <ServicesOverview />
      <CtaSection />
    </main>
  );
};
export default LandingPage;
