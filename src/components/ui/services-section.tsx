'use client';

import { ArrowUpRight } from "lucide-react";
import { useScrubReveal, useWordReveal } from '../../hooks/use-animations';
import { services } from '../../data/services';

export const ServicesSection = () => {
    const revealRef = useScrubReveal({ y: 60, blur: 12 });
    const charRevealRef = useWordReveal({ stagger: 0.04 });

    const heroCards = services.filter(s => s.large);
    const smallCards = services.filter(s => !s.large);

    return (
        <section id="services" className="relative w-full py-20 sm:py-28 md:py-36 px-5 sm:px-8">
            <div ref={revealRef} className="max-w-6xl mx-auto relative">
                <div data-reveal className="max-w-xl mb-12 sm:mb-16">
                    <span className="section-label">
                        <span className="w-8 h-px bg-[#8B5CF6]/40 mr-3" />
                        Услуги
                    </span>
                    <h2 ref={charRevealRef as React.RefObject<HTMLHeadingElement>} className="text-[clamp(1.75rem,4.5vw,3.5rem)] font-normal font-instrument-serif gradient-text-white tracking-[-0.02em] leading-[1.1]">
                        Для любого
                        <br />
                        <span className="italic gradient-text">бизнеса</span>
                    </h2>
                    <p className="text-[clamp(0.875rem,1.5vw,1.05rem)] text-white/70 mt-4 sm:mt-5 font-sans font-light leading-relaxed">
                        Приложения премиум-класса, которые выглядят как нативные — но без скачивания из App Store.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                    {heroCards.map((service, index) => (
                        <a
                            key={index}
                            href={service.href}
                            className="no-underline"
                        >
                            <div
                                data-reveal
                                className="glow-card rounded-2xl p-7 sm:p-8 md:p-10 cursor-pointer h-full group min-h-[200px] sm:min-h-[240px] flex flex-col justify-between"
                            >
                                <div className="flex items-start justify-between mb-8 sm:mb-12">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#8B5CF6]/25 to-[#8B5CF6]/5 flex items-center justify-center border border-[#8B5CF6]/15 group-hover:border-[#8B5CF6]/30 transition-colors duration-500">
                                        <service.icon className="w-7 h-7 sm:w-8 sm:h-8 text-[#8B5CF6]" />
                                    </div>
                                    <ArrowUpRight className="w-5 h-5 text-white/0 group-hover:text-[#8B5CF6]/60 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </div>
                                <div>
                                    <h3 className="text-[18px] sm:text-[20px] md:text-[22px] font-medium text-white font-sans mb-2 tracking-tight">
                                        {service.title}
                                    </h3>
                                    <p className="text-[14px] sm:text-[15px] text-white/60 font-sans leading-relaxed font-light max-w-sm">
                                        {service.desc}
                                    </p>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                    {smallCards.map((service, index) => (
                        <a
                            key={index}
                            href={service.href}
                            className="no-underline"
                        >
                            <div
                                data-reveal
                                className="glow-card rounded-2xl p-5 sm:p-6 cursor-pointer h-full group"
                            >
                                <div className="flex items-start justify-between mb-5 sm:mb-6">
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6]/20 to-[#8B5CF6]/5 flex items-center justify-center border border-[#8B5CF6]/10 group-hover:border-[#8B5CF6]/25 transition-colors duration-500">
                                        <service.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#8B5CF6]" />
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-white/0 group-hover:text-[#8B5CF6]/60 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </div>
                                <h3 className="text-[14px] sm:text-[15px] font-medium text-white font-sans mb-1.5 tracking-tight">
                                    {service.title}
                                </h3>
                                <p className="text-[12px] sm:text-[13px] text-white/70 font-sans leading-relaxed font-light">
                                    {service.desc}
                                </p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};
