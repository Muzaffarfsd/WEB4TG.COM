import { CreditCard, BarChart3, MessageSquare, Bell, Heart, Star, Truck, Shield } from "lucide-react";

const features = [
    { icon: CreditCard, title: "Оплата", desc: "Stripe, ЮKassa, Apple Pay, Google Pay, СБП" },
    { icon: BarChart3, title: "Аналитика", desc: "Полная статистика продаж и трафика" },
    { icon: MessageSquare, title: "Чат-поддержка", desc: "Общение с клиентами прямо в приложении" },
    { icon: Bell, title: "Push-уведомления", desc: "Вовлечение и возврат клиентов" },
    { icon: Heart, title: "Избранное", desc: "Сохранение и сравнение товаров" },
    { icon: Star, title: "Отзывы", desc: "Рейтинги и обратная связь" },
    { icon: Truck, title: "Доставка", desc: "Стандартная, экспресс, пункты выдачи" },
    { icon: Shield, title: "PWA", desc: "Работает офлайн, как нативное приложение" },
];

export const FeaturesSection = () => {
    return (
        <section className="w-full py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-[#09090b] relative">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10 sm:mb-16">
                    <span className="inline-flex items-center text-xs font-medium text-[#10B981] bg-[#10B981]/10 rounded-full py-1 px-3 font-sans mb-4 ring-1 ring-[#10B981]/20">
                        Включено
                    </span>
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-normal font-instrument-serif text-white tracking-tight">
                        В каждом приложении
                    </h2>
                    <p className="text-sm sm:text-base text-white/60 mt-3 sm:mt-4 max-w-xl mx-auto font-sans">
                        Всё необходимое для успешных продаж — из коробки
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] ring-1 ring-white/[0.05] text-center"
                        >
                            <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-[#10B981] mx-auto mb-3" />
                            <h3 className="text-sm sm:text-base font-medium text-white font-sans mb-1">
                                {feature.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-white/40 font-sans">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
