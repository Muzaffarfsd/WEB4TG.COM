'use client';

import { Check, ArrowRight, Sparkles } from "lucide-react";
import { useDirectionalReveal } from '../../hooks/use-animations';
import { pricingPackages } from '../../data/pricing';

export const PricingSection = () => {
    const revealRef = useDirectionalReveal({ stagger: 0.1 });

    return (
        <section id="pricing" className="relative w-full py-20 sm:py-28 md:py-36 px-5 sm:px-8">
            <div ref={revealRef} className="max-w-6xl mx-auto relative">
                <div data-reveal className="text-center mb-14 sm:mb-20">
                    <span className="section-label justify-center">
                        <span className="w-8 h-px bg-[#8B5CF6]/40 mr-3" />
                        Цены
                        <span className="w-8 h-px bg-[#8B5CF6]/40 ml-3" />
                    </span>
                    <h2 className="text-[clamp(1.75rem,4.5vw,3.5rem)] font-normal font-instrument-serif gradient-text-white tracking-[-0.02em] leading-[1.1]">
                        Три пакета —
                        <br />
                        <span className="italic gradient-text">всё включено</span>
                    </h2>
                    <p className="text-[clamp(0.8125rem,1.3vw,0.95rem)] text-white/70 mt-4 sm:mt-5 font-sans font-light max-w-xl mx-auto">
                        Разработка + ежемесячная поддержка. Предоплата 35%, остаток после сдачи.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {pricingPackages.map((pkg, idx) => (
                        <div
                            key={idx}
                            data-reveal
                            className={`relative overflow-hidden rounded-2xl glow-card flex flex-col ${
                                pkg.popular
                                    ? 'border-[#8B5CF6]/20 shadow-[0_0_60px_-15px_rgba(139,92,246,0.15)] md:-mt-4 md:mb-[-16px]'
                                    : ''
                            }`}
                        >
                            {pkg.popular && (
                                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8B5CF6]/40 to-transparent" />
                            )}

                            {pkg.popular && (
                                <div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 h-full w-full" style={{ maskImage: 'linear-gradient(white, transparent)' }}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/[0.03] to-[#8B5CF6]/[0.01]" style={{ maskImage: 'radial-gradient(farthest-side at top, white, transparent)' }} />
                                </div>
                            )}

                            <div className="p-5 sm:p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold rounded-full py-1 px-3 font-sans uppercase tracking-[0.12em] ${
                                        pkg.popular
                                            ? 'text-white bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED]'
                                            : 'text-white/70 bg-white/[0.06] border border-white/[0.08]'
                                    }`}>
                                        {pkg.popular && <Sparkles className="w-3 h-3" />}
                                        {pkg.badge}
                                    </span>
                                </div>

                                <h3 className="text-xl sm:text-2xl font-medium font-sans text-white/90 tracking-tight">
                                    {pkg.name}
                                </h3>

                                <div className="flex items-baseline gap-1.5 mt-3">
                                    <span className={`text-3xl sm:text-4xl font-semibold font-sans tracking-tight tabular-nums ${
                                        pkg.popular ? 'gradient-text' : 'gradient-text-white'
                                    }`}>
                                        {pkg.price}
                                    </span>
                                    <span className="text-sm text-white/50 font-sans">{pkg.period}</span>
                                </div>

                                <p className="text-[12px] sm:text-[13px] text-white/60 mt-3 font-sans font-light leading-relaxed">
                                    {pkg.description}
                                </p>

                                <ul className="grid gap-2.5 mt-5 flex-1">
                                    {pkg.features.map((f, i) => (
                                        <li key={i} className={`flex items-start gap-2.5 text-[12px] sm:text-[13px] font-sans font-light ${
                                            pkg.popular ? 'text-white/75' : 'text-white/60'
                                        }`}>
                                            <div className={`w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                                pkg.popular ? 'bg-[#8B5CF6]' : 'bg-white/[0.08]'
                                            }`}>
                                                <Check className={`w-2.5 h-2.5 ${pkg.popular ? 'text-white' : 'text-white/70'}`} strokeWidth={3} />
                                            </div>
                                            <span className="leading-relaxed">{f}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-5 pt-4 border-t border-white/[0.06]">
                                    <p className="text-[11px] text-white/50 font-sans mb-4">
                                        {pkg.support}
                                    </p>
                                    <a
                                        href="https://t.me/w4tg_bot"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`w-full inline-flex items-center justify-center gap-2 rounded-full font-medium font-sans transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] ${
                                            pkg.popular
                                                ? 'px-5 py-3 text-[13px] sm:text-[14px] bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white hover:from-[#7C3AED] hover:to-[#6D28D9] shadow-lg shadow-[#8B5CF6]/20'
                                                : 'px-5 py-3 text-[13px] sm:text-[14px] border border-white/[0.1] text-white/70 hover:text-white hover:border-white/20'
                                        }`}
                                    >
                                        {pkg.cta}
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <p data-reveal className="text-[11px] sm:text-[12px] text-white/50 text-center mt-8 font-sans">
                    Все цены указаны без НДС. Годовая оплата подписки — скидка 20%.
                </p>
            </div>
        </section>
    );
};
