import { Check, ArrowRight, Sparkles } from "lucide-react";
import { useScrollReveal } from '../../hooks/use-animations';
import { MagneticButton } from './magnetic-button';
import { useRef, useCallback } from 'react';
import gsap from 'gsap';

const plans = [
    {
        name: "Минимальный",
        price: "9 900",
        popular: false,
        features: [
            "Хостинг (99.9% uptime)",
            "Мелкие правки",
            "Поддержка по email",
            "Бэкапы — раз в месяц"
        ]
    },
    {
        name: "Стандартный",
        price: "14 900",
        popular: true,
        features: [
            "Ответ за 2 часа",
            "Бесплатные обновления",
            "Бэкапы — раз в неделю",
            "Аналитика и отчёты"
        ]
    },
    {
        name: "Премиум",
        price: "24 900",
        popular: false,
        features: [
            "Персональный менеджер",
            "Бизнес-консалтинг",
            "Ежедневные бэкапы",
            "Приоритет в разработке"
        ]
    }
];

const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

const PricingCard = ({ plan }: { plan: typeof plans[0] }) => {
    const ref = useRef<HTMLDivElement>(null);

    const handleMove = useCallback((e: React.MouseEvent) => {
        if (!ref.current || isTouch) return;
        const rect = ref.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(ref.current, {
            rotateY: x * 6,
            rotateX: -y * 6,
            duration: 0.4,
            ease: 'power2.out',
            transformPerspective: 1000,
        });
    }, []);

    const handleLeave = useCallback(() => {
        if (!ref.current || isTouch) return;
        gsap.to(ref.current, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power3.out' });
    }, []);

    return (
        <div
            ref={ref}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            data-reveal
            style={{ transformStyle: isTouch ? undefined : 'preserve-3d' }}
            className={`relative rounded-2xl p-6 sm:p-7 md:p-8 transition-all duration-500 ${
                plan.popular
                    ? 'bg-gradient-to-b from-[#10B981]/[0.06] to-[#10B981]/[0.01] border border-[#10B981]/20 shadow-[0_0_60px_-15px_rgba(16,185,129,0.12)]'
                    : 'glow-card'
            }`}
        >
            {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 text-[10px] font-semibold text-white bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full py-1 px-3 font-sans uppercase tracking-wider whitespace-nowrap">
                    <Sparkles className="w-3 h-3" />
                    Популярный
                </span>
            )}

            <h3 className="text-[14px] sm:text-base font-medium text-white/60 font-sans tracking-tight">
                {plan.name}
            </h3>

            <div className="mt-4 sm:mt-5 mb-6 sm:mb-7">
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl md:text-4xl font-semibold gradient-text-white font-sans tracking-tight">{plan.price}</span>
                    <span className="text-[12px] sm:text-sm text-white/15 font-sans font-light">₽/мес</span>
                </div>
            </div>

            <ul className="space-y-3 mb-7 sm:mb-8">
                {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-[12px] sm:text-[13px] text-white/35 font-sans font-light">
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#10B981]/40 shrink-0" />
                        {feature}
                    </li>
                ))}
            </ul>

            <MagneticButton
                href="https://t.me/w4tg_bot"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 py-3 px-5 rounded-full text-[12px] sm:text-[13px] font-medium font-sans transition-all duration-300 min-h-[44px] w-full ${
                    plan.popular
                        ? 'btn-primary !justify-center !w-full'
                        : 'btn-secondary !justify-center !w-full'
                }`}
                strength={0.2}
            >
                Выбрать
                <ArrowRight className="w-3.5 h-3.5" />
            </MagneticButton>
        </div>
    );
};

export const PricingSection = () => {
    const revealRef = useScrollReveal({ stagger: 0.1 });

    return (
        <section id="pricing" className="relative w-full py-20 sm:py-28 md:py-36 px-5 sm:px-8">
            <div className="absolute w-[500px] h-[500px] rounded-full bg-[#10B981]/[0.02] blur-[120px] bottom-[10%] right-[10%] pointer-events-none" />

            <div ref={revealRef} className="max-w-5xl mx-auto relative">
                <div data-reveal className="text-center mb-12 sm:mb-16">
                    <span className="section-label justify-center">
                        <span className="w-8 h-px bg-[#10B981]/40 mr-3" />
                        Тарифы
                        <span className="w-8 h-px bg-[#10B981]/40 ml-3" />
                    </span>
                    <h2 className="text-[clamp(1.75rem,4.5vw,3.5rem)] font-normal font-instrument-serif gradient-text-white tracking-[-0.02em] leading-[1.1]">
                        Подписки после
                        <br />
                        <span className="italic gradient-text">запуска</span>
                    </h2>
                    <p className="text-[13px] sm:text-sm text-white/25 mt-4 sm:mt-5 font-sans font-light">
                        Годовая оплата — скидка 20%
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {plans.map((plan, index) => (
                        <PricingCard key={index} plan={plan} />
                    ))}
                </div>
            </div>
        </section>
    );
};
