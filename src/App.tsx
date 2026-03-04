import { useEffect, lazy, Suspense, ComponentType } from 'react';
import Lenis from 'lenis';
import { TubesBackground } from './components/ui/tubes-background';
import ResponsiveHeroBanner from './components/ui/responsive-hero-banner';
import { TelegramFab } from './components/ui/telegram-fab';

const ClientLogos = lazy(() => import('./components/ui/client-logos'));
const ServicesSection = lazy(() => import('./components/ui/services-section').then(m => ({ default: m.ServicesSection })));
const AiAgentSection = lazy(() => import('./components/ui/ai-agent-section').then(m => ({ default: m.AiAgentSection })));
const IphoneCarousel = lazy(() => import('./components/ui/iphone-carousel').then(m => ({ default: m.IphoneCarousel })));
const ProcessSection = lazy(() => import('./components/ui/process-section').then(m => ({ default: m.ProcessSection })));
const FeaturesSection = lazy(() => import('./components/ui/features-section').then(m => ({ default: m.FeaturesSection })));
const CaseStudies = lazy(() => import('./components/ui/case-studies'));
const TestimonialsSection = lazy(() => import('./components/ui/testimonials-section').then(m => ({ default: m.TestimonialsSection })));
const ComparisonTable = lazy(() => import('./components/ui/comparison-table'));
const PricingSection = lazy(() => import('./components/ui/pricing-section').then(m => ({ default: m.PricingSection })));
const GuaranteesSection = lazy(() => import('./components/ui/guarantees-section'));
const FaqSection = lazy(() => import('./components/ui/faq-section').then(m => ({ default: m.FaqSection })));
const IntegrationsMarquee = lazy(() => import('./components/ui/integrations-marquee'));
const CtaBanner = lazy(() => import('./components/ui/cta-banner'));
const FooterSection = lazy(() => import('./components/ui/footer-section').then(m => ({ default: m.FooterSection })));

const SectionSkeleton = () => (
    <div className="min-h-[20vh] px-5 sm:px-8 py-16">
        <div className="max-w-6xl mx-auto space-y-4">
            <div className="skeleton-shimmer h-3 w-24 rounded-full" />
            <div className="skeleton-shimmer h-8 w-64 rounded-lg" />
            <div className="skeleton-shimmer h-4 w-96 max-w-full rounded-lg" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8">
                <div className="skeleton-shimmer h-32 rounded-2xl" />
                <div className="skeleton-shimmer h-32 rounded-2xl" />
                <div className="skeleton-shimmer h-32 rounded-2xl hidden sm:block" />
            </div>
        </div>
    </div>
);

const LazySection = ({ component: Component }: { component: ComponentType }) => (
    <Suspense fallback={<SectionSkeleton />}>
        <Component />
    </Suspense>
);

const App = () => {
    useEffect(() => {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const lenis = new Lenis({
            duration: prefersReduced ? 0 : 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 1.5,
            autoRaf: true,
        });

        return () => lenis.destroy();
    }, []);

    return (
        <>
            <a href="#main-content" className="skip-link">
                Перейти к содержимому
            </a>
            <TubesBackground />
            <div className="noise-overlay" />
            <main id="main-content" className="relative z-[2]">
                <ResponsiveHeroBanner />
                <LazySection component={ClientLogos} />
                <LazySection component={ServicesSection} />
                <LazySection component={AiAgentSection} />
                <LazySection component={IphoneCarousel} />
                <LazySection component={ProcessSection} />
                <LazySection component={FeaturesSection} />
                <LazySection component={CaseStudies} />
                <LazySection component={TestimonialsSection} />
                <LazySection component={ComparisonTable} />
                <LazySection component={PricingSection} />
                <LazySection component={GuaranteesSection} />
                <LazySection component={FaqSection} />
                <LazySection component={IntegrationsMarquee} />
                <LazySection component={CtaBanner} />
                <LazySection component={FooterSection} />
            </main>
            <TelegramFab />
        </>
    );
};

export default App;
