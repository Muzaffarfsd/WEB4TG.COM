import ResponsiveHeroBanner from './components/ui/responsive-hero-banner';
import { ServicesSection } from './components/ui/services-section';
import { IphoneCarousel } from './components/ui/iphone-carousel';
import { ProcessSection } from './components/ui/process-section';
import { FeaturesSection } from './components/ui/features-section';
import { PricingSection } from './components/ui/pricing-section';
import { FooterSection } from './components/ui/footer-section';

const App = () => {
    return (
        <>
            <div className="noise-overlay" />
            <ResponsiveHeroBanner />
            <ServicesSection />
            <IphoneCarousel />
            <ProcessSection />
            <FeaturesSection />
            <PricingSection />
            <FooterSection />
        </>
    );
};

export default App;
