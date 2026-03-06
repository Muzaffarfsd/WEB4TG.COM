import { Star, BadgeCheck, Globe } from "lucide-react";
import { useScrollReveal, useFlipReveal } from '../../hooks/use-animations';
import { testimonials } from '../../data/testimonials';

export const TestimonialsSection = () => {
    const revealRef = useFlipReveal({ stagger: 0.12 });

    return (
        <section className="relative w-full py-20 sm:py-28 md:py-36 px-5 sm:px-8">
            <div ref={revealRef} className="max-w-6xl mx-auto relative">
                <div data-reveal className="max-w-xl mb-12 sm:mb-16">
                    <span className="section-label">
                        <span className="w-8 h-px bg-[#8B5CF6]/40 mr-3" />
                        Отзывы
                    </span>
                    <h2 className="text-[clamp(1.75rem,4.5vw,3.5rem)] font-normal font-instrument-serif gradient-text-white tracking-[-0.02em] leading-[1.1]">
                        Нам доверяют
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                    {testimonials.map((t, index) => (
                        <div key={index} data-reveal className="glow-card rounded-2xl p-6 sm:p-7 md:p-8 relative">
                            <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide"
                                style={{ background: `linear-gradient(135deg, ${t.gradientFrom}22, ${t.gradientTo}33)`, border: `1px solid ${t.gradientFrom}44` }}>
                                <span className="text-[#A78BFA]">{t.metric}</span>
                            </div>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white text-sm sm:text-base font-semibold shrink-0"
                                    style={{ background: `linear-gradient(135deg, ${t.gradientFrom}, ${t.gradientTo})` }}>
                                    {t.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <p className="text-[14px] sm:text-[15px] font-medium text-white font-sans tracking-tight">
                                            {t.name}
                                        </p>
                                        <BadgeCheck className="w-3.5 h-3.5 text-[#8B5CF6]" />
                                    </div>
                                    <p className="text-[12px] sm:text-[13px] text-white/50 font-sans font-light">
                                        {t.role}, {t.company}
                                    </p>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <Globe className="w-2.5 h-2.5 text-white/30" />
                                        <span className="text-[11px] text-white/30 font-sans">{t.companyUrl}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-0.5 mb-3">
                                {Array.from({ length: t.rating }).map((_, i) => (
                                    <Star key={i} className="w-3.5 h-3.5 fill-[#8B5CF6] text-[#8B5CF6]" />
                                ))}
                            </div>
                            <p className="text-[13px] sm:text-[14px] text-white/70 font-sans leading-relaxed font-light">
                                "{t.text}"
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
