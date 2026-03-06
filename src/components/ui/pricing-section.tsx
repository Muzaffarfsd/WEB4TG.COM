import { Check, ArrowRight, Sparkles, Bot, Smartphone, Brain } from "lucide-react";
import { useScrollReveal } from '../../hooks/use-animations';
import { appDevelopmentFeatures, subscriptionPlans, aiAgentFeatures, aiAgentStats } from '../../data/pricing';

const SectionDivider = ({ number, title, subtitle }: { number: string; title: string; subtitle: string }) => (
    <div data-reveal className="flex items-center gap-4 mb-5 sm:mb-6">
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-semibold text-white/40 font-sans flex-shrink-0">
            {number}
        </span>
        <div>
            <h3 className="text-[14px] sm:text-base font-medium text-white/90 font-sans tracking-tight m-0 leading-tight">
                {title}
            </h3>
            <p className="text-[11px] sm:text-[12px] text-white/40 font-sans font-light m-0 mt-0.5">
                {subtitle}
            </p>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-white/[0.06] to-transparent ml-2" />
    </div>
);

export const PricingSection = () => {
    const revealRef = useScrollReveal({ stagger: 0.1 });

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
                        Прозрачные цены —
                        <br />
                        <span className="italic gradient-text">без сюрпризов</span>
                    </h2>
                    <p className="text-[clamp(0.8125rem,1.3vw,0.95rem)] text-white/50 mt-4 sm:mt-5 font-sans font-light max-w-xl mx-auto">
                        Три понятных блока: разработка, подписка на поддержку и мультиагентная AI-система
                    </p>
                </div>

                {/* ═══════════════════════════════════════════════════ */}
                {/* GROUP 1: РАЗРАБОТКА ПРИЛОЖЕНИЯ */}
                {/* ═══════════════════════════════════════════════════ */}
                <SectionDivider number="01" title="Разработка приложения" subtitle="Telegram Mini App под ключ" />

                <div data-reveal className="relative overflow-hidden rounded-2xl glow-card border-[#8B5CF6]/20 shadow-[0_0_60px_-15px_rgba(139,92,246,0.15)] mb-14 sm:mb-20">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8B5CF6]/40 to-transparent" />
                    <div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 h-full w-full" style={{ maskImage: 'linear-gradient(white, transparent)' }}>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/[0.03] to-[#8B5CF6]/[0.01]" style={{ maskImage: 'radial-gradient(farthest-side at top, white, transparent)' }} />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 p-4 sm:p-6">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-white bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] rounded-full py-1 px-3 font-sans uppercase tracking-wider">
                            <Smartphone className="w-3 h-3" />
                            Telegram Mini App
                        </span>
                        <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-medium text-white/60 border border-white/[0.08] rounded-full py-1 px-2.5 font-sans">
                            <Sparkles className="w-3 h-3 text-[#8B5CF6]" />
                            Полный цикл
                        </span>
                        <div className="ml-auto">
                            <a href="https://t.me/w4tg_bot" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] sm:text-[13px] font-medium font-sans bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white hover:from-[#7C3AED] hover:to-[#6D28D9] transition-all duration-300 shadow-lg shadow-[#8B5CF6]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]">
                                Обсудить проект
                                <ArrowRight className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row p-4 sm:p-6 pt-2 gap-6">
                        <div className="pb-2 lg:w-[30%] lg:pr-6">
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-4xl sm:text-5xl md:text-6xl font-semibold gradient-text font-sans tracking-tight">от 150К</span>
                                <span className="text-sm sm:text-base text-white/40 font-sans">₽</span>
                            </div>
                            <p className="text-[11px] sm:text-[12px] text-white/40 mt-3 font-sans leading-relaxed">
                                7-14 дней • предоплата 35%
                                <br />остаток после сдачи проекта
                            </p>
                            <p className="text-[11px] text-white/30 mt-2 font-sans">
                                Финальная стоимость зависит от сложности. Рассчитаем за 15 минут.
                            </p>
                        </div>
                        <ul className="grid sm:grid-cols-2 gap-3 text-[12px] sm:text-[13px] lg:w-[70%]">
                            {appDevelopmentFeatures.map((f, i) => (
                                <li key={i} className="flex items-center gap-2.5 text-white/70 font-sans font-light">
                                    <div className="w-[18px] h-[18px] rounded-full bg-[#8B5CF6] flex items-center justify-center flex-shrink-0">
                                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                    </div>
                                    <span className="leading-relaxed">{f}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════ */}
                {/* GROUP 2: ПОДПИСКИ НА ПОДДЕРЖКУ */}
                {/* ═══════════════════════════════════════════════════ */}
                <SectionDivider number="02" title="Подписка на поддержку" subtitle="Ежемесячное обслуживание после запуска" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-14 sm:mb-20">
                    {subscriptionPlans.map((plan, idx) => (
                        <div key={idx} data-reveal className={`relative overflow-hidden rounded-2xl glow-card ${plan.popular ? 'border-[#8B5CF6]/20 shadow-[0_0_40px_-12px_rgba(139,92,246,0.12)]' : ''}`}>
                            {plan.popular && (
                                <div className="absolute -top-px inset-x-0 h-px bg-gradient-to-r from-transparent via-[#8B5CF6]/40 to-transparent" />
                            )}
                            <div className="flex items-center gap-3 p-4 sm:p-5">
                                <h4 className={`inline-flex items-center gap-1.5 text-[10px] font-semibold rounded-full py-1 px-3 font-sans uppercase tracking-wider m-0 ${
                                    plan.popular
                                        ? 'text-white bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED]'
                                        : 'text-white/70 bg-white/[0.06] border border-white/[0.08]'
                                }`}>
                                    {plan.popular && <Sparkles className="w-3 h-3" />}
                                    {plan.name}
                                </h4>
                                {plan.popular && (
                                    <span className="hidden sm:inline-flex text-[9px] font-medium text-[#8B5CF6]/80 border border-[#8B5CF6]/20 bg-[#8B5CF6]/[0.06] rounded-full py-0.5 px-2 font-sans uppercase tracking-wider">
                                        Популярный
                                    </span>
                                )}
                                <div className="ml-auto">
                                    <a href="https://t.me/w4tg_bot" target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 rounded-full font-medium font-sans transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] ${
                                        plan.popular
                                            ? 'px-4 py-2 text-[12px] sm:text-[13px] bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white hover:from-[#7C3AED] hover:to-[#6D28D9] shadow-lg shadow-[#8B5CF6]/15'
                                            : 'px-3.5 py-1.5 text-[11px] sm:text-[12px] border border-white/[0.1] text-white/70 hover:text-white hover:border-white/20'
                                    }`}>
                                        Выбрать
                                        {plan.popular && <ArrowRight className="w-3.5 h-3.5" />}
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-1 px-4 sm:px-5 pb-2">
                                <span className="text-3xl sm:text-4xl font-semibold gradient-text-white font-sans tracking-tight">{plan.price}</span>
                                <span className="text-[12px] text-white/40 font-sans">₽/мес</span>
                            </div>
                            <ul className="grid gap-3 p-4 sm:p-5 pt-2 text-[12px] sm:text-[13px]">
                                {plan.features.map((f, i) => (
                                    <li key={i} className={`flex items-center gap-2.5 font-sans font-light ${plan.popular ? 'text-white/70' : 'text-white/60'}`}>
                                        <div className={`w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0 ${plan.popular ? 'bg-[#8B5CF6]' : 'bg-white/[0.08]'}`}>
                                            <Check className={`w-2.5 h-2.5 ${plan.popular ? 'text-white' : 'text-white/50'}`} strokeWidth={3} />
                                        </div>
                                        <span>{f}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* ═══════════════════════════════════════════════════ */}
                {/* GROUP 3: AI-АГЕНТ */}
                {/* ═══════════════════════════════════════════════════ */}
                <SectionDivider number="03" title="Мультиагентная AI-система" subtitle="До 20 специализированных агентов для вашего бизнеса" />

                <div data-reveal className="relative overflow-hidden rounded-2xl glow-card border-[#22c55e]/10">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#22c55e]/30 to-transparent" />
                    <div className="pointer-events-none absolute top-0 right-0 h-full w-1/2" style={{ maskImage: 'linear-gradient(to left, white, transparent)' }}>
                        <div className="absolute inset-0 bg-gradient-to-l from-[#22c55e]/[0.02] to-transparent" />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 p-4 sm:p-6">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-white bg-gradient-to-r from-[#22c55e] to-[#16a34a] rounded-full py-1 px-3 font-sans uppercase tracking-wider">
                            <Bot className="w-3 h-3" />
                            Мультиагентный AI
                        </span>
                        <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-medium text-white/60 border border-white/[0.08] rounded-full py-1 px-2.5 font-sans">
                            <Brain className="w-3 h-3 text-[#22c55e]/60" />
                            До 20 агентов · Gemini 2.5 Pro · ElevenLabs
                        </span>
                        <div className="ml-auto">
                            <a href="https://t.me/w4tg_bot" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] sm:text-[13px] font-medium font-sans bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white hover:from-[#16a34a] hover:to-[#15803d] transition-all duration-300 shadow-lg shadow-[#22c55e]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]">
                                Запустить систему
                                <ArrowRight className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row p-4 sm:p-6 pt-2 gap-6">
                        <div className="lg:w-[30%]">
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-4xl sm:text-5xl md:text-6xl font-semibold font-sans tracking-tight" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>от 200К</span>
                                <span className="text-sm sm:text-base text-white/40 font-sans">₽</span>
                            </div>
                            <p className="text-[11px] sm:text-[12px] text-white/40 mt-3 font-sans leading-relaxed">
                                Разработка 14-21 день
                                <br />+ подписка от 19 900₽/мес
                            </p>
                        </div>
                        <div className="lg:w-[70%]">
                            <div className="grid sm:grid-cols-2 gap-3 text-[12px] sm:text-[13px]">
                                {aiAgentFeatures.map((f, i) => (
                                    <div key={i} className="flex items-start gap-2.5 text-white/70 font-sans font-light">
                                        <div className="w-[18px] h-[18px] rounded-full bg-[#22c55e] flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <f.icon className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />
                                        </div>
                                        <span className="leading-relaxed">{f.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 px-4 sm:px-6 pb-5 sm:pb-6">
                        {aiAgentStats.map((s, i) => (
                            <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#22c55e]/[0.06] border border-[#22c55e]/10">
                                <span className="text-[12px] sm:text-[13px] font-semibold font-sans" style={{ color: '#22c55e' }}>{s.value}</span>
                                <span className="text-[10px] sm:text-[11px] text-white/40 font-sans">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <p data-reveal className="text-[11px] sm:text-[12px] text-white/30 text-center mt-8 font-sans">
                    Все цены указаны без НДС. Годовая оплата подписки — скидка 20%.
                </p>
            </div>
        </section>
    );
};
