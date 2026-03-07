import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useCountUp, useStickyNav } from '../../hooks/use-animations';
import { MagneticButton } from './magnetic-button';

const techItems = [
    "React 19", "TypeScript", "Vite", "Tailwind CSS", "Telegram Bot API", "Stripe", "ЮKassa", "AI-бот", "PWA", "PostgreSQL", "Redis", "framer-motion"
];

const navLinks = [
    { label: "Услуги", href: "#services" },
    { label: "Портфолио", href: "#highlights" },
    { label: "Процесс", href: "#process" },
    { label: "Цены", href: "#pricing" },
    { label: "Контакты", href: "#contact" },
];

const socialLinks = [
    { href: "https://t.me/w4tg_bot", label: "Telegram" },
    { href: "https://instagram.com/web4tg", label: "Instagram" },
    { href: "https://tiktok.com/@web4tg", label: "TikTok" },
    { href: "https://youtube.com/@WEB4TG", label: "YouTube" },
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
                    className="lg:hidden fixed inset-0 z-50 flex flex-col"
                    style={{
                        pointerEvents: menuVisible ? 'auto' : 'none',
                    }}
                >
                    <div
                        className="absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]"
                        style={{
                            backgroundColor: menuVisible ? 'rgba(5, 5, 5, 0.97)' : 'rgba(5, 5, 5, 0)',
                            backdropFilter: menuVisible ? 'blur(40px) saturate(1.8)' : 'blur(0px)',
                            WebkitBackdropFilter: menuVisible ? 'blur(40px) saturate(1.8)' : 'blur(0px)',
                        }}
                        onClick={closeMenu}
                        aria-hidden="true"
                    />

                    <div
                        className="absolute top-0 left-0 right-0 h-[200px] pointer-events-none transition-opacity duration-700"
                        style={{ opacity: menuVisible ? 1 : 0 }}
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full bg-[#8B5CF6]/[0.06] blur-[80px]" />
                    </div>

                    <div className="relative z-10 flex flex-col h-full pt-[80px] pb-safe-bottom">
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

                            <div className="flex items-center justify-center gap-5">
                                {socialLinks.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[12px] text-white/40 hover:text-white/80 font-sans transition-colors duration-300"
                                        onClick={handleNavClick}
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

const StatItem = ({ value, label }: { value: string; label: string }) => {
    const { ref, display } = useCountUp(value);
    return (
        <div ref={ref} className="text-center py-5 sm:py-6 px-3">
            <div data-count className="text-xl sm:text-2xl md:text-3xl font-semibold gradient-text font-sans tracking-tight tabular-nums">
                {display}
            </div>
            <div className="text-[10px] sm:text-[11px] text-white/60 font-sans mt-1.5 uppercase tracking-[0.12em] leading-tight">
                {label}
            </div>
        </div>
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

const stats = [
    { value: "50+", label: "проектов" },
    { value: "127%", label: "рост продаж" },
    { value: "<2с", label: "ответ AI" },
    { value: "4.9", label: "рейтинг" },
];

const DemandIndicator = () => {
    const daysOut = useMemo(() => {
        const now = new Date();
        const weekStart = new Date(now.getFullYear(), 0, 1);
        const weekNum = Math.floor((now.getTime() - weekStart.getTime()) / (7 * 86400000));
        const seed = weekNum * 2654435761;
        return ((seed >>> 0) % 3) + 3;
    }, []);

    return (
        <div className="mb-5 sm:mb-8 inline-flex items-center gap-2 sm:gap-2.5 rounded-full bg-white/[0.03] px-1.5 py-1.5 pr-3 sm:pr-4 border border-white/[0.06] backdrop-blur-sm animate-fade-slide-in-1">
            <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-semibold text-white bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] rounded-full py-1 px-2 sm:px-2.5 font-sans uppercase tracking-[0.12em]">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/60 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white/90" />
                </span>
                Live
            </span>
            <span className="text-[11px] sm:text-[13px] font-medium text-white/80 font-sans">
                Ближайший старт: через {daysOut} дн
            </span>
        </div>
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

            <section ref={heroRef} className="relative w-full min-h-[100svh] flex flex-col overflow-hidden isolate">
                <GradientMesh />

                <div className="relative z-10 flex-1 flex items-center pt-[64px] sm:pt-[72px]">
                    <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 py-8 sm:py-0">
                        <div className="max-w-[820px] mx-auto text-center">
                            <DemandIndicator />

                            <h1 className="animate-fade-slide-in-1">
                                <span className="block text-[clamp(2.2rem,8vw,5.5rem)] leading-[0.92] font-normal font-instrument-serif tracking-[-0.035em] gradient-text-white">
                                    Хватит кормить
                                </span>
                                <span className="block text-[clamp(2.2rem,8vw,5.5rem)] leading-[0.92] font-normal font-instrument-serif tracking-[-0.035em] mt-1 gradient-text italic">
                                    посредников
                                </span>
                            </h1>

                            <p className="text-[clamp(0.875rem,2vw,1.15rem)] leading-[1.6] animate-fade-slide-in-3 text-white/70 max-w-[500px] mt-5 sm:mt-8 mx-auto font-sans font-light">
                                Telegram Mini Apps мирового класса.
                                <span className="text-white/90"> Ваш бренд, ваши продажи — без комиссий.</span>
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-7 sm:mt-10 items-center justify-center animate-fade-slide-in-4">
                                <MagneticButton
                                    href="https://t.me/w4tg_bot"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary font-sans w-full sm:w-auto justify-center"
                                >
                                    Обсудить проект
                                    <ArrowRight className="w-4 h-4" />
                                </MagneticButton>
                                <MagneticButton
                                    href="#highlights"
                                    className="btn-secondary font-sans w-full sm:w-auto justify-center"
                                >
                                    Смотреть работы
                                </MagneticButton>
                            </div>

                            <div className="mt-8 sm:mt-12 animate-fade-slide-in-5 relative overflow-hidden max-w-[600px] mx-auto">
                                <p className="text-[10px] sm:text-[11px] text-white/70 font-sans uppercase tracking-[0.12em] mb-3 sm:mb-4 text-center">
                                    Стек технологий
                                </p>
                                <div className="relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-16 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
                                    <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-16 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />
                                    <div className="flex animate-marquee whitespace-nowrap">
                                        {[...techItems, ...techItems].map((tech, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-3 py-1.5 mx-1 text-[11px] sm:text-[12px] font-medium text-white/60 bg-[#0a0a10]/80 border border-white/[0.06] rounded-full font-sans whitespace-nowrap"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 sm:mt-20 max-w-2xl mx-auto animate-fade-slide-in-5">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-white/[0.08] glass-panel">
                                {stats.map((stat, index) => (
                                    <StatItem key={index} value={stat.value} label={stat.label} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {!scrolledPastHero && (
                    <div className="relative z-10 flex justify-center pb-2 sm:pb-3 animate-fade-slide-in-5">
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
