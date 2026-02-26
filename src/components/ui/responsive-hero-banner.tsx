"use client";

import React, { useState } from 'react';

interface NavLink {
    label: string;
    href: string;
    isActive?: boolean;
}

interface Partner {
    logoUrl: string;
    href: string;
}

interface ResponsiveHeroBannerProps {
    logoUrl?: string;
    backgroundImageUrl?: string;
    navLinks?: NavLink[];
    ctaButtonText?: string;
    ctaButtonHref?: string;
    badgeText?: string;
    badgeLabel?: string;
    title?: string;
    titleLine2?: string;
    description?: string;
    primaryButtonText?: string;
    primaryButtonHref?: string;
    secondaryButtonText?: string;
    secondaryButtonHref?: string;
    partnersTitle?: string;
    partners?: Partner[];
}

const ResponsiveHeroBanner: React.FC<ResponsiveHeroBannerProps> = ({
    backgroundImageUrl = "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/0e2dbea0-c0a9-413f-a57b-af279633c0df_3840w.jpg",
    navLinks = [
        { label: "Home", href: "#", isActive: true },
        { label: "Missions", href: "#" },
        { label: "Destinations", href: "#" },
        { label: "Technology", href: "#" },
        { label: "Book Flight", href: "#" }
    ],
    ctaButtonText = "Reserve Seat",
    ctaButtonHref = "#",
    badgeLabel = "New",
    badgeText = "First Commercial Flight to Mars 2026",
    title = "Journey Beyond Earth",
    titleLine2 = "Into the Cosmos",
    description = "Experience the cosmos like never before. Our advanced spacecraft and cutting-edge technology make interplanetary travel accessible, safe, and unforgettable.",
    primaryButtonText = "Book Your Journey",
    primaryButtonHref = "#",
    secondaryButtonText = "Watch Launch",
    secondaryButtonHref = "#",
    partnersTitle = "Partnering with leading space agencies worldwide",
    partners = [
        { logoUrl: "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/f7466370-2832-4fdd-84c2-0932bb0dd850_800w.png", href: "#" },
        { logoUrl: "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/0a9a71ec-268b-4689-a510-56f57e9d4f13_1600w.png", href: "#" },
        { logoUrl: "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/a9ed4369-748a-49f8-9995-55d6c876bbff_1600w.png", href: "#" },
        { logoUrl: "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/0d8966a4-8525-4e11-9d5d-2d7390b2c798_1600w.png", href: "#" },
        { logoUrl: "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/2ed33c8b-b8b2-4176-967f-3d785fed07d8_1600w.png", href: "#" }
    ]
}) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <section className="w-full isolate min-h-[100svh] overflow-hidden relative">
            <img
                src={backgroundImageUrl}
                alt=""
                className="w-full h-full object-cover absolute top-0 right-0 bottom-0 left-0"
            />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-black/30" />

            <header className="z-10 xl:top-4 relative">
                <div className="mx-4 sm:mx-6">
                    <div className="flex items-center justify-between pt-safe-top">
                        <a
                            href="#"
                            className="inline-flex items-center justify-center h-[44px] rounded text-white font-bold text-base sm:text-lg tracking-wide font-sans"
                        >
                            WEB4TG STUDIO
                        </a>

                        <nav className="hidden md:flex items-center gap-2">
                            <div className="flex items-center gap-1 rounded-full bg-white/5 px-1 py-1 ring-1 ring-white/10 backdrop-blur">
                                {navLinks.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.href}
                                        className={`px-3 py-2 text-sm font-medium hover:text-white font-sans transition-colors ${link.isActive ? 'text-white/90' : 'text-white/80'}`}
                                    >
                                        {link.label}
                                    </a>
                                ))}
                                <a
                                    href={ctaButtonHref}
                                    className="ml-1 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm font-medium text-neutral-900 hover:bg-white/90 font-sans transition-colors"
                                >
                                    {ctaButtonText}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                        <path d="M7 7h10v10" />
                                        <path d="M7 17 17 7" />
                                    </svg>
                                </a>
                            </div>
                        </nav>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur active:bg-white/20 transition-colors"
                            aria-expanded={mobileMenuOpen}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-white/90">
                                    <path d="M18 6 6 18" />
                                    <path d="m6 6 12 12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-white/90">
                                    <path d="M4 5h16" />
                                    <path d="M4 12h16" />
                                    <path d="M4 19h16" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {mobileMenuOpen && (
                        <div className="md:hidden mt-3 rounded-2xl bg-black/70 ring-1 ring-white/10 backdrop-blur-xl p-4 animate-fade-slide-in-1">
                            <nav className="flex flex-col gap-1">
                                {navLinks.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.href}
                                        className={`px-4 py-3 text-base font-medium rounded-xl font-sans transition-colors active:bg-white/10 ${link.isActive ? 'text-white bg-white/5' : 'text-white/80'}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {link.label}
                                    </a>
                                ))}
                                <a
                                    href={ctaButtonHref}
                                    className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-base font-medium text-neutral-900 active:bg-white/90 font-sans transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {ctaButtonText}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                        <path d="M7 7h10v10" />
                                        <path d="M7 17 17 7" />
                                    </svg>
                                </a>
                            </nav>
                        </div>
                    )}
                </div>
            </header>

            <div className="z-10 relative">
                <div className="pt-16 sm:pt-28 md:pt-32 lg:pt-40 max-w-7xl mx-auto px-4 sm:px-6 pb-10 sm:pb-16">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 sm:gap-3 rounded-full bg-white/10 px-2 sm:px-2.5 py-1.5 sm:py-2 ring-1 ring-white/15 backdrop-blur animate-fade-slide-in-1">
                            <span className="inline-flex items-center text-xs font-medium text-neutral-900 bg-white/90 rounded-full py-0.5 px-2 font-sans shrink-0">
                                {badgeLabel}
                            </span>
                            <span className="text-xs sm:text-sm font-medium text-white/90 font-sans">
                                {badgeText}
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight text-white tracking-tight font-instrument-serif font-normal animate-fade-slide-in-2">
                            {title}
                            <br />
                            {titleLine2}
                        </h1>

                        <p className="text-sm sm:text-base md:text-lg animate-fade-slide-in-3 text-white/80 max-w-2xl mt-4 sm:mt-6 mx-auto px-2">
                            {description}
                        </p>

                        <div className="flex flex-col sm:flex-row sm:gap-4 mt-6 sm:mt-10 gap-3 items-center justify-center animate-fade-slide-in-4">
                            <a
                                href={primaryButtonHref}
                                className="inline-flex items-center gap-2 hover:bg-white/15 active:bg-white/20 text-sm font-medium text-white bg-white/10 ring-white/15 ring-1 rounded-full py-3 px-5 font-sans transition-colors min-h-[44px]"
                            >
                                {primaryButtonText}
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                    <path d="M5 12h14" />
                                    <path d="m12 5 7 7-7 7" />
                                </svg>
                            </a>
                            <a
                                href={secondaryButtonHref}
                                className="inline-flex items-center gap-2 rounded-full bg-transparent px-5 py-3 text-sm font-medium text-white/90 hover:text-white active:text-white font-sans transition-colors min-h-[44px]"
                            >
                                {secondaryButtonText}
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                    <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div className="mx-auto mt-12 sm:mt-20 max-w-5xl">
                        <p className="animate-fade-slide-in-1 text-xs sm:text-sm text-white/70 text-center">
                            {partnersTitle}
                        </p>
                        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 animate-fade-slide-in-2 text-white/70 mt-4 sm:mt-6 items-center justify-items-center gap-3 sm:gap-4">
                            {partners.map((partner, index) => (
                                <a
                                    key={index}
                                    href={partner.href}
                                    className="inline-flex items-center justify-center bg-center w-[80px] h-[28px] sm:w-[120px] sm:h-[36px] bg-cover rounded-full opacity-80 hover:opacity-100 transition-opacity"
                                    style={{ backgroundImage: `url(${partner.logoUrl})` }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ResponsiveHeroBanner;
