import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Menu, X, Sparkles } from 'lucide-react';
import { useCountUp, useStickyNav, useTextReveal } from '../../hooks/use-animations';
import { MagneticButton } from './magnetic-button';

const techItems = [
    "React 19", "TypeScript", "Vite", "Tailwind CSS", "Telegram Bot API", "Stripe", "ЮKassa", "AI-бот", "PWA", "PostgreSQL", "Redis", "framer-motion"
];

const navLinks = [
    { label: "Услуги", href: "#services" },
    { label: "Портфолио", href: "#highlights" },
    { label: "Процесс", href: "#process" },
    { label: "Тарифы", href: "#pricing" },
    { label: "Контакты", href: "#contact" },
];

const StickyHeader = () => {
    const scrolled = useStickyNav();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileMenuOpen]);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? 'bg-[#08080c]/80 backdrop-blur-xl border-b border-white/[0.06]' : ''}`}>
            <div className="max-w-7xl mx-auto px-5 sm:px-8">
                <div className="flex items-center justify-between pt-safe-top h-[64px] sm:h-[72px]">
                    <a href="#" className="flex items-center shrink-0">
                        <span className="text-white font-bold text-[15px] sm:text-[17px] tracking-tight" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            WEB4TG <span className="font-medium text-white/70">STUDIO</span>
                        </span>
                    </a>

                    <nav className="hidden lg:flex items-center gap-1">
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
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.06] active:bg-white/[0.08] transition-colors"
                        aria-expanded={mobileMenuOpen}
                        aria-label="Меню"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-5 h-5 text-white/80" />
                        ) : (
                            <Menu className="w-5 h-5 text-white/80" />
                        )}
                    </button>
                </div>
            </div>

            {mobileMenuOpen && (
                <>
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
                    <div className="lg:hidden relative z-50 mx-5 mt-2 rounded-2xl bg-[#0a0a0a]/98 border border-white/[0.06] backdrop-blur-2xl p-3 animate-fade-slide-in-1">
                        <nav className="flex flex-col gap-0.5">
                            {navLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.href}
                                    className="px-4 py-3.5 text-[15px] font-medium rounded-xl font-sans transition-colors active:bg-white/[0.05] text-white/90"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </a>
                            ))}
                            <a
                                href="https://t.me/w4tg_bot"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 btn-primary justify-center !text-[15px]"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Начать проект
                                <ArrowRight className="w-4 h-4" />
                            </a>
                        </nav>
                    </div>
                </>
            )}
        </header>
    );
};

const StatItem = ({ value, label }: { value: string; label: string }) => {
    const { ref, display } = useCountUp(value);
    return (
        <div ref={ref} className="text-center py-5 sm:py-6 px-3">
            <div data-count className="text-xl sm:text-2xl md:text-3xl font-semibold gradient-text font-sans tracking-tight">
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

const ResponsiveHeroBanner = () => {
    const titleRef1 = useTextReveal({ delay: 0.2 });
    const titleRef2 = useTextReveal({ delay: 0.5 });

    return (
        <>
            <StickyHeader />

            <section className="relative w-full min-h-[100svh] flex flex-col overflow-hidden isolate">
                <GradientMesh />

                <div className="relative z-10 flex-1 flex items-center pt-[64px] sm:pt-[72px]">
                    <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 py-8 sm:py-0">
                        <div className="max-w-[820px] mx-auto text-center">
                            <div className="mb-5 sm:mb-8 inline-flex items-center gap-2 sm:gap-2.5 rounded-full bg-white/[0.03] px-1.5 py-1.5 pr-3 sm:pr-4 border border-white/[0.06] backdrop-blur-sm animate-fade-slide-in-1">
                                <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-semibold text-white bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] rounded-full py-1 px-2 sm:px-2.5 font-sans uppercase tracking-wider">
                                    <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                    24-48ч
                                </span>
                                <span className="text-[11px] sm:text-[13px] font-medium text-white/80 font-sans">
                                    от заявки до запуска
                                </span>
                            </div>

                            <h1>
                                <div
                                    ref={titleRef1}
                                    className="text-[clamp(2.2rem,8vw,5.5rem)] leading-[0.92] font-normal font-instrument-serif tracking-[-0.035em] gradient-text-white"
                                >
                                    Хватит кормить
                                </div>
                                <div
                                    ref={titleRef2}
                                    className="text-[clamp(2.2rem,8vw,5.5rem)] leading-[0.92] font-normal font-instrument-serif tracking-[-0.035em] mt-1 gradient-text italic"
                                >
                                    посредников
                                </div>
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
                                <p className="text-[10px] sm:text-[11px] text-white/50 font-sans uppercase tracking-[0.15em] mb-3 sm:mb-4 text-center">
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
                            <div className="grid grid-cols-4 gap-px rounded-2xl overflow-hidden border border-white/[0.08] glass-panel">
                                {stats.map((stat, index) => (
                                    <StatItem key={index} value={stat.value} label={stat.label} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 pb-6 sm:pb-8">
                    <div className="section-divider max-w-7xl mx-auto" />
                </div>
            </section>
        </>
    );
};

export default ResponsiveHeroBanner;
