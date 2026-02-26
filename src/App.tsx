import ResponsiveHeroBanner from './components/ui/responsive-hero-banner';
import { IphoneCarousel } from './components/ui/iphone-carousel';

const App = () => {
    return (
        <>
            <ResponsiveHeroBanner
                badgeLabel="New"
                badgeText="First Commercial Flight to Mars 2026"
                title="Journey Beyond Earth"
                titleLine2="Into the Cosmos"
                description="Experience the cosmos like never before. Our advanced spacecraft and cutting-edge technology make interplanetary travel accessible, safe, and unforgettable."
                primaryButtonText="Book Your Journey"
                secondaryButtonText="Watch Launch"
                ctaButtonText="Reserve Seat"
                partnersTitle="Partnering with leading space agencies worldwide"
            />
            <IphoneCarousel />
        </>
    );
};

export default App;
