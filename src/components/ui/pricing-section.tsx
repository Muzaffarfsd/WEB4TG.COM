import { Check } from "lucide-react";

const plans = [
    {
        name: "Минимальный",
        price: "9 900",
        popular: false,
        features: [
            "Хостинг (99.9% uptime)",
            "Мелкие правки",
            "Поддержка по email",
            "Бэкапы раз в месяц"
        ]
    },
    {
        name: "Стандартный",
        price: "14 900",
        popular: true,
        features: [
            "Приоритетная поддержка (ответ за 2ч)",
            "Бесплатные обновления",
            "Бэкапы раз в неделю",
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
        <section id="pricing" className="w-full py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-[#09090b] relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.04),transparent_70%)]" />
            <div className="max-w-5xl mx-auto relative">
                <div className="text-center mb-10 sm:mb-16">
                    <span className="inline-flex items-center text-xs font-medium text-[#10B981] bg-[#10B981]/10 rounded-full py-1 px-3 font-sans mb-4 ring-1 ring-[#10B981]/20">
                        Тарифы
                    </span>
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-normal font-instrument-serif text-white tracking-tight">
                        Подписки после запуска
                    </h2>
                    <p className="text-sm sm:text-base text-white/60 mt-3 sm:mt-4 max-w-xl mx-auto font-sans">
                        Годовая оплата — скидка 20%
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative p-6 sm:p-8 rounded-2xl transition-all duration-300 ${
                                plan.popular
                                    ? 'bg-[#10B981]/[0.06] ring-2 ring-[#10B981]/30'
                                    : 'bg-white/[0.03] ring-1 ring-white/[0.06] hover:ring-white/10'
                            }`}
                        >
                            {plan.popular && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-medium text-white bg-[#10B981] rounded-full py-1 px-3 font-sans">
                                    Популярный
                                </span>
                            )}
                            <h3 className="text-lg sm:text-xl font-medium text-white font-sans">
                                {plan.name}
                            </h3>
                            <div className="mt-4 mb-6">
                                <span className="text-3xl sm:text-4xl font-bold text-white font-sans">{plan.price}</span>
                                <span className="text-sm text-white/40 font-sans"> ₽/мес</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-2.5 text-sm text-white/60 font-sans">
                                        <Check className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <a
                                href="https://t.me/w4tg_bot"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`block text-center py-3 px-5 rounded-full text-sm font-medium font-sans transition-colors min-h-[44px] leading-[26px] ${
                                    plan.popular
                                        ? 'bg-[#10B981] text-white hover:bg-[#059669]'
                                        : 'bg-white/5 text-white/80 ring-1 ring-white/10 hover:bg-white/10'
                                }`}
                            >
                                Выбрать тариф
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
