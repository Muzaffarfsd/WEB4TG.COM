import { useEffect, lazy, Suspense, ComponentType } from 'react';
import Lenis from 'lenis';
import { TubesBackground } from './components/ui/tubes-background';
import ResponsiveHeroBanner from './components/ui/responsive-hero-banner';
import { TelegramFab } from './components/ui/telegram-fab';
import { ScrollProgress } from './components/ui/scroll-progress';
import { ScrollNarrative } from './components/ui/scroll-narrative';
import { ErrorBoundary } from './components/ui/error-boundary';
import { Preloader } from './components/ui/preloader';
import { SoundProvider } from './hooks/use-sound';
import { SoundToggle } from './components/ui/sound-toggle';

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
const ContactForm = lazy(() => import('./components/ui/contact-form'));
const FooterSection = lazy(() => import('./components/ui/footer-section').then(m => ({ default: m.FooterSection })));

const DefaultSkeleton = () => (
    <div className="min-h-[20vh] px-5 sm:px-8 py-16">
        <div className="max-w-6xl mx-auto space-y-4">
            <div className="skeleton-shimmer h-3 w-24 rounded-full" />
            <div className="skeleton-shimmer h-8 w-64 rounded-lg" />
            <div className="skeleton-shimmer h-4 w-96 max-w-full rounded-lg" />
        </div>
    </div>
);

const CardsSkeleton = () => (
    <div className="min-h-[20vh] px-5 sm:px-8 py-16">
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="skeleton-shimmer h-3 w-20 rounded-full" />
            <div className="skeleton-shimmer h-8 w-72 rounded-lg" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="skeleton-shimmer h-40 rounded-2xl" />
                ))}
            </div>
        </div>
    </div>
);

const TableSkeleton = () => (
    <div className="min-h-[20vh] px-5 sm:px-8 py-16">
        <div className="max-w-6xl mx-auto space-y-4">
            <div className="skeleton-shimmer h-3 w-28 rounded-full" />
            <div className="skeleton-shimmer h-8 w-56 rounded-lg" />
            <div className="mt-8 space-y-2">
                <div className="skeleton-shimmer h-12 w-full rounded-xl" />
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="skeleton-shimmer h-14 w-full rounded-xl" />
                ))}
            </div>
        </div>
    </div>
);

const AccordionSkeleton = () => (
    <div className="min-h-[20vh] px-5 sm:px-8 py-16">
        <div className="max-w-3xl mx-auto space-y-4">
            <div className="skeleton-shimmer h-3 w-16 rounded-full mx-auto" />
            <div className="skeleton-shimmer h-8 w-48 rounded-lg mx-auto" />
            <div className="mt-8 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="skeleton-shimmer h-16 w-full rounded-2xl" />
                ))}
            </div>
        </div>
    </div>
);

const MarqueeSkeleton = () => (
    <div className="min-h-[8vh] px-5 sm:px-8 py-8">
        <div className="max-w-6xl mx-auto">
            <div className="flex gap-3 overflow-hidden">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="skeleton-shimmer h-10 w-28 rounded-full shrink-0" />
                ))}
            </div>
        </div>
    </div>
);

const PricingSkeleton = () => (
    <div className="min-h-[20vh] px-5 sm:px-8 py-16">
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="skeleton-shimmer h-3 w-16 rounded-full" />
            <div className="skeleton-shimmer h-8 w-48 rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="skeleton-shimmer h-72 rounded-2xl" />
                ))}
            </div>
        </div>
    </div>
);

type SkeletonType = 'default' | 'cards' | 'table' | 'accordion' | 'marquee' | 'pricing';

const skeletonMap: Record<SkeletonType, () => JSX.Element> = {
    default: DefaultSkeleton,
    cards: CardsSkeleton,
    table: TableSkeleton,
    accordion: AccordionSkeleton,
    marquee: MarqueeSkeleton,
    pricing: PricingSkeleton,
};

const LazySection = ({ component: Component, skeleton = 'default' }: { component: ComponentType; skeleton?: SkeletonType }) => {
    const Skeleton = skeletonMap[skeleton];
    return (
        <ErrorBoundary>
            <Suspense fallback={<Skeleton />}>
                <Component />
            </Suspense>
        </ErrorBoundary>
    );
};

const App = () => {
    useEffect(() => {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReduced) return;

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 1.5,
            autoRaf: true,
        });

        return () => lenis.destroy();
    }, []);

    return (
        <SoundProvider>
            <Preloader />
            <ScrollProgress />
            <ScrollNarrative />
            <a href="#main-content" className="skip-link">
                Перейти к содержимому
            </a>
            <TubesBackground />
            <div className="noise-overlay" />
            <main id="main-content" className="relative z-[2]">
                <ResponsiveHeroBanner />
                <div className="mesh-divider" aria-hidden="true" />
                <LazySection component={ClientLogos} skeleton="marquee" />
                <LazySection component={ServicesSection} skeleton="cards" />
                <div className="mesh-divider mesh-divider-alt" aria-hidden="true" />
                <LazySection component={AiAgentSection} skeleton="cards" />
                <div className="mesh-divider mesh-divider-conic" aria-hidden="true" />
                <LazySection component={IphoneCarousel} skeleton="default" />
                <LazySection component={ProcessSection} skeleton="cards" />
                <div className="mesh-divider" aria-hidden="true" />
                <LazySection component={FeaturesSection} skeleton="cards" />
                <div className="mesh-divider mesh-divider-alt" aria-hidden="true" />
                <LazySection component={CaseStudies} skeleton="cards" />
                <LazySection component={TestimonialsSection} skeleton="cards" />
                <div className="mesh-divider mesh-divider-conic" aria-hidden="true" />
                <LazySection component={ComparisonTable} skeleton="table" />
                <LazySection component={PricingSection} skeleton="pricing" />
                <div className="mesh-divider" aria-hidden="true" />
                <LazySection component={GuaranteesSection} skeleton="cards" />
                <div className="mesh-divider mesh-divider-alt" aria-hidden="true" />
                <LazySection component={FaqSection} skeleton="accordion" />
                <LazySection component={IntegrationsMarquee} skeleton="marquee" />
                <div className="mesh-divider mesh-divider-conic" aria-hidden="true" />
                <LazySection component={CtaBanner} skeleton="default" />
                <LazySection component={ContactForm} skeleton="default" />
                <LazySection component={FooterSection} skeleton="default" />
            </main>
            <TelegramFab />
            <SoundToggle />
        </SoundProvider>
    );
};

export default App;
