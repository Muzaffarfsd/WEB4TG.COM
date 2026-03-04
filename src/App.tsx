import { useEffect } from 'react';
import Lenis from 'lenis';
import { TubesBackground } from './components/ui/tubes-background';
import ResponsiveHeroBanner from './components/ui/responsive-hero-banner';
import ClientLogos from './components/ui/client-logos';
import { ServicesSection } from './components/ui/services-section';
import { IphoneCarousel } from './components/ui/iphone-carousel';
import { ProcessSection } from './components/ui/process-section';
import { FeaturesSection } from './components/ui/features-section';
import CaseStudies from './components/ui/case-studies';
import { TestimonialsSection } from './components/ui/testimonials-section';
import ComparisonTable from './components/ui/comparison-table';
import { PricingSection } from './components/ui/pricing-section';
import GuaranteesSection from './components/ui/guarantees-section';
import { FaqSection } from './components/ui/faq-section';
import IntegrationsMarquee from './components/ui/integrations-marquee';
import CtaBanner from './components/ui/cta-banner';
import { FooterSection } from './components/ui/footer-section';
import { AiAgentSection } from './components/ui/ai-agent-section';
import { TelegramFab } from './components/ui/telegram-fab';

const App = () => {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 1.5,
            autoRaf: true,
        });

        return () => lenis.destroy();
    }, []);

    return (
        <>
            <TubesBackground />
            <div className="noise-overlay" />
            <div className="relative z-[2]">
                <ResponsiveHeroBanner />
                <ClientLogos />
                <ServicesSection />
                <AiAgentSection />
                <IphoneCarousel />
                <ProcessSection />
                <FeaturesSection />
                <CaseStudies />
                <TestimonialsSection />
                <ComparisonTable />
                <PricingSection />
                <GuaranteesSection />
                <FaqSection />
                <IntegrationsMarquee />
                <CtaBanner />
                <FooterSection />
            </div>
            <TelegramFab />
        </>
    );
};

export default App;
