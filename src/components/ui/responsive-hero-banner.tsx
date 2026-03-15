'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useStickyNav } from '../../hooks/use-animations';
import { MagneticButton } from './magnetic-button';

const TelegramIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
);

const YouTubeIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
);

const navLinks = [
    { label: "Услуги", href: "#services" },
    { label: "Портфолио", href: "#highlights" },
    { label: "Процесс", href: "#process" },
    { label: "Цены", href: "#pricing" },
    { label: "Контакты", href: "#contact" },
];

const socialLinks = [
    { href: "https://t.me/w4tg_bot", label: "Telegram", icon: TelegramIcon },
    { href: "https://instagram.com/web4tg", label: "Instagram", icon: InstagramIcon },
    { href: "https://tiktok.com/@web4tg", label: "TikTok", icon: TikTokIcon },
    { href: "https://youtube.com/@WEB4TG", label: "YouTube", icon: YouTubeIcon },
];

const BurgerIcon = ({ open }: { open: boolean }) => (
    <div className="w-5 h-4 relative flex flex-col justify-between">
        <span
            className="block h-[1.5px] w-full bg-white/80 rounded-full origin-center transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
            style={{
                transform: open ? 'translateY(7px) rotate(45deg)' : 'none',
            }}
        />
        <span
            className="block h-[1.5px] w-full bg-white/80 rounded-full transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
            style={{
                opacity: open ? 0 : 1,
                transform: open ? 'scaleX(0)' : 'scaleX(1)',
            }}
        />
        <span
            className="block h-[1.5px] w-full bg-white/80 rounded-full origin-center transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
            style={{
                transform: open ? 'translateY(-7px) rotate(-45deg)' : 'none',
            }}
        />
    </div>
);

const StickyHeader = () => {
    const scrolled = useStickyNav();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [menuMounted, setMenuMounted] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);

    const openMenu = useCallback(() => {
        setMobileMenuOpen(true);
        setMenuMounted(true);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setMenuVisible(true);
            });
        });
    }, []);

    const closeMenu = useCallback(() => {
        setMenuVisible(false);
        setTimeout(() => {
            setMenuMounted(false);
            setMobileMenuOpen(false);
        }, 750);
    }, []);

    const toggleMenu = useCallback(() => {
        if (mobileMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }, [mobileMenuOpen, closeMenu, openMenu]);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileMenuOpen]);

    useEffect(() => {
        if (!mobileMenuOpen || !menuVisible) return;

        const menuEl = menuRef.current;
        if (!menuEl) return;

        const timer = setTimeout(() => {
            const focusables = menuEl.querySelectorAll<HTMLElement>('a, button, [tabindex]:not([tabindex="-1"])');
            if (focusables.length > 0) focusables[0].focus();
        }, 200);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeMenu();
                menuButtonRef.current?.focus();
                return;
            }
            if (e.key === 'Tab') {
                const focusables = menuEl.querySelectorAll<HTMLElement>('a, button, [tabindex]:not([tabindex="-1"])');
                if (focusables.length === 0) return;
                const first = focusables[0];
                const last = focusables[focusables.length - 1];
                const active = document.activeElement;
                const isInside = menuEl.contains(active);
                if (!isInside) {
                    e.preventDefault();
                    first.focus();
                    return;
                }
                if (e.shiftKey && active === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && active === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            clearTimeout(timer);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [mobileMenuOpen, menuVisible, closeMenu]);

    const handleNavClick = useCallback(() => {
        closeMenu();
    }, [closeMenu]);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? 'bg-[#08080c]/80 backdrop-blur-xl border-b border-white/[0.06]' : ''}`}>
            <div className="max-w-7xl mx-auto px-5 sm:px-8">
                <div className="flex items-center justify-between pt-safe-top h-[64px] sm:h-[72px]">
                    <a href="#" className="flex items-center shrink-0 relative z-[60]">
                        <span className="text-white font-bold text-[15px] sm:text-[17px] tracking-tight" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            WEB4TG <span className="font-medium text-white/70">STUDIO</span>
                        </span>
                    </a>

                    <nav className="hidden lg:flex items-center gap-1" aria-label="Основная навигация">
                        <div className="flex items-center gap-0.5 rounded-full bg-[#08080c]/80 backdrop-blur-xl px-1.5 py-1.5 border border-white/[0.06]">
                            {navLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.href}
                                    className="px-4 py-2 text-[13px] font-medium text-white/80 hover:text-white rounded-full hover:bg-white/[0.05] transition-all duration-300 font-sans"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                        <MagneticButton
                            href="https://t.me/w4tg_bot"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-3 btn-primary !py-2.5 !px-5 !text-[13px] !min-h-[40px] !gap-1.5"
                            strength={0.25}
                        >
                            Начать проект
                            <ArrowRight className="w-3.5 h-3.5" />
                        </MagneticButton>
                    </nav>

                    <button
                        ref={menuButtonRef}
                        onClick={toggleMenu}
                        className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.06] active:bg-white/[0.08] transition-colors relative z-[60]"
                        aria-expanded={mobileMenuOpen}
                        aria-controls="mobile-menu"
                        aria-label={mobileMenuOpen ? "Закрыть меню" : "Открыть меню навигации"}
                    >
                        <BurgerIcon open={mobileMenuOpen} />
                    </button>
                </div>
            </div>

            {menuMounted && (
                <div
                    ref={menuRef}
                    id="mobile-menu"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Меню навигации"
                    className="lg:hidden fixed inset-0 z-50 overflow-y-auto overscroll-contain"
                    style={{
                        pointerEvents: menuVisible ? 'auto' : 'none',
                    }}
                >
                    <div
                        className="fixed inset-0 transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]"
                        style={{
                            backgroundColor: menuVisible ? 'rgba(5, 5, 5, 0.97)' : 'rgba(5, 5, 5, 0)',
                            backdropFilter: menuVisible ? 'blur(40px) saturate(1.8)' : 'blur(0px)',
                            WebkitBackdropFilter: menuVisible ? 'blur(40px) saturate(1.8)' : 'blur(0px)',
                        }}
                        onClick={closeMenu}
                        aria-hidden="true"
                    />

                    <div
                        className="fixed top-0 left-0 right-0 h-[200px] pointer-events-none transition-opacity duration-700 z-[1]"
                        style={{ opacity: menuVisible ? 1 : 0 }}
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full bg-[#8B5CF6]/[0.06] blur-[80px]" />
                    </div>

                    <div className="relative z-10 flex flex-col min-h-full pt-[80px] pb-safe-bottom">
                        <nav className="flex-1 flex flex-col justify-center px-8 sm:px-12 -mt-8" aria-label="Мобильная навигация">
                            {navLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.href}
                                    className="group flex items-baseline gap-4 sm:gap-5 py-3.5 sm:py-4 border-b border-white/[0.04] transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] active:bg-white/[0.02]"
                                    onClick={handleNavClick}
                                    style={{
                                        opacity: menuVisible ? 1 : 0,
                                        transform: menuVisible ? 'translateX(0)' : 'translateX(-30px)',
                                        transitionDelay: menuVisible ? `${index * 60 + 150}ms` : `${(navLinks.length - index) * 30}ms`,
                                    }}
                                >
                                    <span className="text-[11px] sm:text-[12px] text-[#8B5CF6]/60 font-mono tabular-nums min-w-[20px]">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <span className="text-[clamp(1.75rem,5vw,2.5rem)] font-instrument-serif font-normal text-white/90 group-hover:text-white group-active:text-[#A78BFA] tracking-[-0.02em] transition-colors duration-300">
                                        {link.label}
                                    </span>
                                    <ArrowRight
                                        className="w-4 h-4 sm:w-5 sm:h-5 text-white/0 group-hover:text-white/40 ml-auto transition-all duration-300 translate-x-[-8px] group-hover:translate-x-0"
                                    />
                                </a>
                            ))}
                        </nav>

                        <div
                            className="px-8 sm:px-12 pb-6 sm:pb-8 space-y-6 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
                            style={{
                                opacity: menuVisible ? 1 : 0,
                                transform: menuVisible ? 'translateY(0)' : 'translateY(20px)',
                                transitionDelay: menuVisible ? `${navLinks.length * 60 + 200}ms` : '0ms',
                            }}
                        >
                            <a
                                href="https://t.me/w4tg_bot"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary justify-center w-full !text-[15px] !py-4 !rounded-2xl"
                                onClick={handleNavClick}
                            >
                                Начать проект
                                <ArrowRight className="w-4 h-4" />
                            </a>

                            <div className="flex items-center justify-center gap-4">
                                {socialLinks.map((link) => {
                                    const Icon = link.icon;
                                    return (
                                        <a
                                            key={link.label}
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white/90 hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-300"
                                            onClick={handleNavClick}
                                            aria-label={link.label}
                                        >
                                            <Icon className="w-[18px] h-[18px]" />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

const GradientMesh = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="gradient-mesh-blob gradient-mesh-1" />
            <div className="gradient-mesh-blob gradient-mesh-2" />
            <div className="gradient-mesh-blob gradient-mesh-3" />
        </div>
    );
};

const TrustBadge = ({ icon, text, className = '' }: { icon: 'shield' | 'refresh' | 'clock'; text: string; className?: string }) => {
    const icons = {
        shield: <svg className="w-3 h-3 text-[#8B5CF6]/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
        refresh: <svg className="w-3 h-3 text-[#8B5CF6]/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
        clock: <svg className="w-3 h-3 text-[#8B5CF6]/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    };
    return (
        <span className={`inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] text-white/50 font-sans tracking-wide ${className}`}>
            {icons[icon]}
            {text}
        </span>
    );
};


const ResponsiveHeroBanner = () => {
    const [scrolledPastHero, setScrolledPastHero] = useState(false);
    const heroRef = useRef<HTMLElement>(null);
    const scrolledRef = useRef(false);

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(() => {
                    if (heroRef.current) {
                        const past = heroRef.current.getBoundingClientRect().bottom < window.innerHeight * 0.5;
                        if (scrolledRef.current !== past) {
                            scrolledRef.current = past;
                            setScrolledPastHero(past);
                        }
                    }
                    ticking = false;
                });
            }
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <StickyHeader />

            <section ref={heroRef} className="relative z-[2] w-full min-h-[100svh] flex flex-col overflow-hidden isolate">
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: "url('/images/hero-bg.webp')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                    aria-hidden="true"
                />
                <GradientMesh />

                <div className="relative z-10 flex-1 flex items-center pt-[64px] sm:pt-[72px]">
                    <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 py-8 sm:py-0">
                        <div className="max-w-[820px] mx-auto text-center">
                            <h1>
                                <span className="block text-[clamp(3rem,10vw,7.5rem)] leading-[0.9] font-normal font-instrument-serif tracking-[-0.02em] gradient-text-white hero-entrance-headline">
                                    Хватит кормить
                                </span>
                                <span className="block text-[clamp(3rem,10vw,7.5rem)] leading-[0.9] font-normal font-instrument-serif tracking-[-0.02em] mt-1 gradient-text italic hero-entrance-headline-2">
                                    посредников
                                </span>
                            </h1>

                            <p className="text-[clamp(0.875rem,2vw,1.15rem)] leading-[1.6] hero-entrance-body text-white/70 max-w-[540px] mt-5 sm:mt-8 mx-auto font-sans font-light">
                                Ваш бизнес внутри Telegram —
                                <span className="text-white/90"> там, где уже есть ваши клиенты.</span>
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-7 sm:mt-10 items-center justify-center hero-entrance-cta">
                                <MagneticButton
                                    href="https://t.me/w4tg_bot"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary font-sans w-full sm:w-auto justify-center"
                                >
                                    Написать в Telegram
                                    <ArrowRight className="w-4 h-4" />
                                </MagneticButton>
                                <MagneticButton
                                    href="#highlights"
                                    className="btn-secondary font-sans w-full sm:w-auto justify-center"
                                >
                                    Смотреть кейсы
                                </MagneticButton>
                            </div>

                            <div className="mt-5 sm:mt-6 flex items-center justify-center gap-3 sm:gap-5 hero-entrance-meta">
                                <TrustBadge icon="shield" text="NDA по умолчанию" />
                                <span className="w-px h-3 bg-white/10" aria-hidden="true" />
                                <TrustBadge icon="refresh" text="Возврат предоплаты" />
                                <span className="w-px h-3 bg-white/10 hidden sm:block" aria-hidden="true" />
                                <TrustBadge icon="clock" text="Поддержка 24/7" className="hidden sm:flex" />
                            </div>
                        </div>

                    </div>
                </div>

                {!scrolledPastHero && (
                    <div className="relative z-10 flex justify-center pb-2 sm:pb-3 hero-entrance-meta">
                        <div className="scroll-indicator flex flex-col items-center gap-1 text-white/60">
                            <ChevronDown className="w-5 h-5 animate-bounce-slow" />
                        </div>
                    </div>
                )}

                <div className="relative z-10 pb-6 sm:pb-8">
                    <div className="section-divider max-w-7xl mx-auto" />
                </div>
            </section>
        </>
    );
};

export default ResponsiveHeroBanner;
