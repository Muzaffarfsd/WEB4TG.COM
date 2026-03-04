import { useState } from 'react';
import { ArrowRight, Menu, X, Sparkles } from 'lucide-react';

const navLinks = [
    { label: "Услуги", href: "#services" },
    { label: "Портфолио", href: "#highlights" },
    { label: "Процесс", href: "#process" },
    { label: "Тарифы", href: "#pricing" },
    { label: "Контакты", href: "#contact" },
];

const stats = [
    { value: "50+", label: "проектов запущено" },
    { value: "127%", label: "средний рост продаж" },
    { value: "<2с", label: "время ответа AI-бота" },
    { value: "4.9", label: "рейтинг клиентов" },
];

const ResponsiveHeroBanner = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <section className="relative w-full min-h-[100svh] flex flex-col overflow-hidden isolate">
            <div className="absolute inset-0 bg-[#050505]" />

            <div className="hero-glow w-[600px] h-[600px] -top-[200px] -right-[100px] bg-[#10B981]/[0.07] animate-float" />
            <div className="hero-glow w-[500px] h-[500px] -bottom-[150px] -left-[100px] bg-[#10B981]/[0.04] animate-float-delay" />
            <div className="hero-glow w-[300px] h-[300px] top-[40%] left-[60%] bg-[#059669]/[0.03] animate-pulse-glow" />

            <header className="relative z-20">
                <div className="max-w-7xl mx-auto px-5 sm:px-8">
                    <div className="flex items-center justify-between pt-safe-top h-[72px]">
                        <a href="#" className="flex items-center gap-1.5 group">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center">
                                <span className="text-white font-bold text-xs font-sans">W4</span>
                            </div>
                            <span className="text-white font-semibold text-[15px] tracking-tight font-sans">
                                WEB4TG
                            </span>
                        </a>

                        <nav className="hidden lg:flex items-center gap-1">
                            <div className="flex items-center gap-0.5 rounded-full bg-white/[0.03] px-1.5 py-1.5 border border-white/[0.04] backdrop-blur-xl">
                                {navLinks.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.href}
                                        className="px-4 py-2 text-[13px] font-medium text-white/60 hover:text-white rounded-full hover:bg-white/[0.05] transition-all duration-300 font-sans"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                            <a
                                href="https://t.me/w4tg_bot"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-3 btn-primary !py-2.5 !px-5 !text-[13px] !min-h-[40px] !gap-1.5"
                            >
                                Начать проект
                                <ArrowRight className="w-3.5 h-3.5" />
                            </a>
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

                    {mobileMenuOpen && (
                        <div className="lg:hidden mt-2 rounded-2xl bg-[#0a0a0a]/95 border border-white/[0.06] backdrop-blur-2xl p-3 animate-fade-slide-in-1">
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
                    )}
                </div>
            </header>

            <div className="relative z-10 flex-1 flex items-center">
                <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-0">
                    <div className="max-w-[820px] mx-auto text-center">
                        <div className="mb-6 sm:mb-8 inline-flex items-center gap-2.5 rounded-full bg-white/[0.03] px-1.5 py-1.5 pr-4 border border-white/[0.06] backdrop-blur-sm animate-fade-slide-in-1">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full py-1 px-2.5 font-sans uppercase tracking-wider">
                                <Sparkles className="w-3 h-3" />
                                24-48ч
                            </span>
                            <span className="text-[13px] font-medium text-white/50 font-sans">
                                от заявки до запуска в Telegram
                            </span>
                        </div>

                        <h1 className="animate-fade-slide-in-2">
                            <span className="block text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] font-normal font-instrument-serif tracking-[-0.03em] gradient-text-white">
                                Хватит кормить
                            </span>
                            <span className="block text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] font-normal font-instrument-serif tracking-[-0.03em] mt-1 sm:mt-2 gradient-text italic">
                                посредников
                            </span>
                        </h1>

                        <p className="text-[clamp(0.9rem,1.8vw,1.2rem)] leading-relaxed animate-fade-slide-in-3 text-white/40 max-w-[560px] mt-6 sm:mt-8 mx-auto font-sans font-light">
                            Создаём Telegram Mini Apps мирового уровня. Ваш бренд, ваши продажи, ваши клиенты — <span className="text-white/60">без комиссий и посредников.</span>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-12 items-center justify-center animate-fade-slide-in-4">
                            <a
                                href="https://t.me/w4tg_bot"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary font-sans"
                            >
                                Обсудить проект
                                <ArrowRight className="w-4 h-4" />
                            </a>
                            <a
                                href="#highlights"
                                className="btn-secondary font-sans"
                            >
                                Смотреть работы
                            </a>
                        </div>
                    </div>

                    <div className="mt-16 sm:mt-24 max-w-3xl mx-auto animate-fade-slide-in-5">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/[0.04] rounded-2xl overflow-hidden border border-white/[0.04]">
                            {stats.map((stat, index) => (
                                <div key={index} className="bg-[#050505] p-5 sm:p-6 text-center">
                                    <div className="text-2xl sm:text-3xl font-semibold gradient-text font-sans tracking-tight">
                                        {stat.value}
                                    </div>
                                    <div className="text-[11px] sm:text-xs text-white/30 font-sans mt-1.5 uppercase tracking-wider">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 pb-8">
                <div className="section-divider max-w-7xl mx-auto" />
            </div>
        </section>
    );
};

export default ResponsiveHeroBanner;
