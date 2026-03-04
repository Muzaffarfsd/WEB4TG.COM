import { Check, ArrowRight, Sparkles } from "lucide-react";

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

export const PricingSection = () => {
    return (
        <section id="pricing" className="relative w-full py-24 sm:py-32 md:py-40 px-5 sm:px-8">
            <div className="hero-glow w-[500px] h-[500px] bottom-[10%] right-[10%] bg-[#10B981]/[0.03]" />

            <div className="max-w-5xl mx-auto relative">
                <div className="text-center mb-14 sm:mb-20">
                    <span className="inline-flex items-center text-[11px] font-semibold text-[#10B981] uppercase tracking-[0.15em] font-sans mb-5">
                        <span className="w-8 h-px bg-[#10B981]/40 mr-3" />
                        Тарифы
                        <span className="w-8 h-px bg-[#10B981]/40 ml-3" />
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-[3.5rem] font-normal font-instrument-serif gradient-text-white tracking-[-0.02em] leading-[1.1]">
                        Подписки после
                        <br />
                        <span className="italic gradient-text">запуска</span>
                    </h2>
                    <p className="text-sm sm:text-base text-white/30 mt-5 font-sans font-light">
                        Годовая оплата — скидка 20%
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative rounded-2xl p-7 sm:p-8 transition-all duration-500 ${
                                plan.popular
                                    ? 'bg-gradient-to-b from-[#10B981]/[0.06] to-[#10B981]/[0.01] border border-[#10B981]/20 shadow-[0_0_60px_-15px_rgba(16,185,129,0.15)]'
                                    : 'glow-card'
                            }`}
                        >
                            {plan.popular && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 text-[10px] font-semibold text-white bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full py-1 px-3 font-sans uppercase tracking-wider">
                                    <Sparkles className="w-3 h-3" />
                                    Популярный
                                </span>
                            )}

                            <h3 className="text-base sm:text-lg font-medium text-white/70 font-sans tracking-tight">
                                {plan.name}
                            </h3>

                            <div className="mt-5 mb-7">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl sm:text-4xl font-semibold gradient-text-white font-sans tracking-tight">{plan.price}</span>
                                    <span className="text-sm text-white/20 font-sans font-light">₽/мес</span>
                                </div>
                            </div>

                            <ul className="space-y-3.5 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-[13px] text-white/40 font-sans font-light">
                                        <Check className="w-4 h-4 text-[#10B981]/50 shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <a
                                href="https://t.me/w4tg_bot"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center justify-center gap-2 py-3 px-5 rounded-full text-[13px] font-medium font-sans transition-all duration-300 min-h-[44px] ${
                                    plan.popular
                                        ? 'btn-primary w-full !justify-center'
                                        : 'btn-secondary w-full !justify-center'
                                }`}
                            >
                                Выбрать
                                <ArrowRight className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
