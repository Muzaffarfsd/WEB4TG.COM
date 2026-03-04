import { useEffect } from 'react';
import Lenis from 'lenis';
import { TubesBackground } from './components/ui/tubes-background';
import ResponsiveHeroBanner from './components/ui/responsive-hero-banner';
import { ServicesSection } from './components/ui/services-section';
import { IphoneCarousel } from './components/ui/iphone-carousel';
import { ProcessSection } from './components/ui/process-section';
import { FeaturesSection } from './components/ui/features-section';
import { PricingSection } from './components/ui/pricing-section';
import { FooterSection } from './components/ui/footer-section';

const App = () => {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 1.5,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        return () => lenis.destroy();
    }, []);

    return (
        <>
            <TubesBackground />
            <div className="noise-overlay" />
            <div className="relative z-[2]">
                <ResponsiveHeroBanner />
                <ServicesSection />
                <IphoneCarousel />
                <ProcessSection />
                <FeaturesSection />
                <PricingSection />
                <FooterSection />
            </div>
        </>
    );
};

export default App;
