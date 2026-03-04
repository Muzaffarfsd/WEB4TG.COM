import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Menu, X, Sparkles } from 'lucide-react';
import { useCountUp, useStickyNav, useTextReveal } from '../../hooks/use-animations';
import { MagneticButton } from './magnetic-button';

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
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? 'bg-white/[0.03] backdrop-blur-2xl border-b border-white/[0.08]' : ''}`}>
            <div className="max-w-7xl mx-auto px-5 sm:px-8">
                <div className="flex items-center justify-between pt-safe-top h-[64px] sm:h-[72px]">
                    <a href="#" className="flex items-center gap-1.5 group shrink-0">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] flex items-center justify-center">
                            <span className="text-white font-bold text-[10px] sm:text-xs font-sans">W4</span>
                        </div>
                        <span className="text-white font-semibold text-[14px] sm:text-[15px] tracking-tight font-sans">
                            WEB4TG
                        </span>
                    </a>

                    <nav className="hidden lg:flex items-center gap-1">
                        <div className="flex items-center gap-0.5 rounded-full bg-white/[0.04] px-1.5 py-1.5 border border-white/[0.08] backdrop-blur-2xl">
                            {navLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.href}
                                    className="px-4 py-2 text-[13px] font-medium text-white/50 hover:text-white rounded-full hover:bg-white/[0.05] transition-all duration-300 font-sans"
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
                                    className="px-4 py-3.5 text-[15px] font-medium rounded-xl font-sans transition-colors active:bg-white/[0.05] text-white/70"
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
            <div className="text-xl sm:text-2xl md:text-3xl font-semibold gradient-text font-sans tracking-tight">
                {display}
            </div>
            <div className="text-[10px] sm:text-[11px] text-white/25 font-sans mt-1.5 uppercase tracking-[0.12em] leading-tight">
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

const HeroMouseGlow = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

    useEffect(() => {
        if (isTouch || !containerRef.current) return;
        const el = containerRef.current;
        const handleMouse = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            el.style.setProperty('--mx', `${x}%`);
            el.style.setProperty('--my', `${y}%`);
        };
        window.addEventListener('mousemove', handleMouse, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouse);
    }, [isTouch]);

    if (isTouch) return null;

    return (
        <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute w-[400px] h-[400px] rounded-full bg-[#8B5CF6]/[0.03] blur-[100px] transition-all duration-[2s] ease-out" style={{ left: 'var(--mx, 50%)', top: 'var(--my, 50%)', transform: 'translate(-50%, -50%)' }} />
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
                <HeroMouseGlow />

                <div className="relative z-10 flex-1 flex items-center pt-[64px] sm:pt-[72px]">
                    <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 py-8 sm:py-0">
                        <div className="max-w-[820px] mx-auto text-center">
                            <div className="mb-5 sm:mb-8 inline-flex items-center gap-2 sm:gap-2.5 rounded-full bg-white/[0.03] px-1.5 py-1.5 pr-3 sm:pr-4 border border-white/[0.06] backdrop-blur-sm animate-fade-slide-in-1">
                                <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-semibold text-white bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] rounded-full py-1 px-2 sm:px-2.5 font-sans uppercase tracking-wider">
                                    <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                    24-48ч
                                </span>
                                <span className="text-[11px] sm:text-[13px] font-medium text-white/40 font-sans">
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

                            <p className="text-[clamp(0.875rem,2vw,1.15rem)] leading-[1.6] animate-fade-slide-in-3 text-white/35 max-w-[500px] mt-5 sm:mt-8 mx-auto font-sans font-light">
                                Telegram Mini Apps мирового класса.
                                <span className="text-white/55"> Ваш бренд, ваши продажи — без комиссий.</span>
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
