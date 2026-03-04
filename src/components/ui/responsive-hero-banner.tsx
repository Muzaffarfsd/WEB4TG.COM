"use client";

import { useState } from 'react';

const navLinks = [
    { label: "Услуги", href: "#services", isActive: false },
    { label: "Как мы работаем", href: "#process", isActive: false },
    { label: "Тарифы", href: "#pricing", isActive: false },
    { label: "Портфолио", href: "#highlights", isActive: false },
    { label: "Контакты", href: "#contact", isActive: false }
];

const stats = [
    { value: "50+", label: "Проектов" },
    { value: "127%", label: "Рост продаж" },
    { value: "24/7", label: "Поддержка" },
    { value: "4.9", label: "Рейтинг" },
];

const ResponsiveHeroBanner = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <section className="w-full isolate min-h-[100svh] overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#09090b] via-[#0a1a14] to-[#09090b]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.08),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.05),transparent_60%)]" />

            <header className="z-10 xl:top-4 relative">
                <div className="mx-4 sm:mx-6">
                    <div className="flex items-center justify-between pt-safe-top">
                        <a
                            href="#"
                            className="inline-flex items-center justify-center h-[44px] rounded gap-2"
                        >
                            <span className="text-[#10B981] font-bold text-base sm:text-lg tracking-wide font-sans">WEB4TG</span>
                            <span className="text-white/70 font-medium text-base sm:text-lg font-sans">STUDIO</span>
                        </a>

                        <nav className="hidden md:flex items-center gap-2">
                            <div className="flex items-center gap-1 rounded-full bg-white/5 px-1 py-1 ring-1 ring-white/10 backdrop-blur">
                                {navLinks.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.href}
                                        className="px-3 py-2 text-sm font-medium hover:text-white text-white/80 font-sans transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                                <a
                                    href="https://t.me/w4tg_bot"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-1 inline-flex items-center gap-2 rounded-full bg-[#10B981] px-3.5 py-2 text-sm font-medium text-white hover:bg-[#059669] font-sans transition-colors"
                                >
                                    Заказать
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
                                        className="px-4 py-3 text-base font-medium rounded-xl font-sans transition-colors active:bg-white/10 text-white/80"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {link.label}
                                    </a>
                                ))}
                                <a
                                    href="https://t.me/w4tg_bot"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#10B981] px-4 py-3 text-base font-medium text-white active:bg-[#059669] font-sans transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Заказать приложение
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
                <div className="pt-16 sm:pt-24 md:pt-28 lg:pt-36 max-w-7xl mx-auto px-4 sm:px-6 pb-10 sm:pb-16">
                    <div className="mx-auto max-w-4xl text-center">
                        <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 sm:gap-3 rounded-full bg-[#10B981]/10 px-2 sm:px-3 py-1.5 sm:py-2 ring-1 ring-[#10B981]/20 backdrop-blur animate-fade-slide-in-1">
                            <span className="inline-flex items-center text-xs font-medium text-white bg-[#10B981] rounded-full py-0.5 px-2 font-sans shrink-0">
                                24-48ч
                            </span>
                            <span className="text-xs sm:text-sm font-medium text-[#10B981] font-sans">
                                Запуск вашего приложения в Telegram
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight text-white tracking-tight font-instrument-serif font-normal animate-fade-slide-in-2">
                            Хватит кормить
                            <br />
                            <span className="text-[#10B981]">посредников</span>
                        </h1>

                        <p className="text-sm sm:text-base md:text-lg animate-fade-slide-in-3 text-white/70 max-w-2xl mt-4 sm:mt-6 mx-auto px-2">
                            Создаём премиальные Telegram Mini Apps для бизнеса. Ваш собственный интернет-магазин, сервис бронирования или доставка — без комиссий маркетплейсов.
                        </p>

                        <div className="flex flex-col sm:flex-row sm:gap-4 mt-6 sm:mt-10 gap-3 items-center justify-center animate-fade-slide-in-4">
                            <a
                                href="https://t.me/w4tg_bot"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-medium text-white bg-[#10B981] hover:bg-[#059669] active:bg-[#047857] rounded-full py-3 px-6 font-sans transition-colors min-h-[44px]"
                            >
                                Заказать приложение
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                    <path d="M5 12h14" />
                                    <path d="m12 5 7 7-7 7" />
                                </svg>
                            </a>
                            <a
                                href="#highlights"
                                className="inline-flex items-center gap-2 rounded-full bg-white/5 ring-1 ring-white/10 px-6 py-3 text-sm font-medium text-white/90 hover:bg-white/10 font-sans transition-colors min-h-[44px]"
                            >
                                Смотреть портфолио
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                    <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div className="mx-auto mt-14 sm:mt-20 max-w-3xl animate-fade-slide-in-5">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center p-3 sm:p-4 rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur">
                                    <div className="text-2xl sm:text-3xl font-bold text-[#10B981] font-sans">{stat.value}</div>
                                    <div className="text-xs sm:text-sm text-white/60 font-sans mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ResponsiveHeroBanner;
