import { CreditCard, BarChart3, MessageSquare, Bell, Heart, Star, Truck, Shield } from "lucide-react";

const features = [
    { icon: CreditCard, title: "Платежи", desc: "Stripe, ЮKassa, Apple Pay, Google Pay, СБП — всё из коробки" },
    { icon: BarChart3, title: "Аналитика", desc: "Воронки продаж, конверсии, LTV, когорты — полная картина бизнеса" },
    { icon: MessageSquare, title: "Чат", desc: "Встроенный чат с клиентами, автоответы, шаблоны быстрых ответов" },
    { icon: Bell, title: "Push", desc: "Уведомления через Telegram — бесплатно и с 95% открываемостью" },
    { icon: Heart, title: "Избранное", desc: "Вишлисты, сравнение товаров, персональные подборки от AI" },
    { icon: Star, title: "Отзывы", desc: "Рейтинги, фото-отзывы, верификация покупок, модерация" },
    { icon: Truck, title: "Доставка", desc: "Интеграция со службами доставки, отслеживание в реальном времени" },
    { icon: Shield, title: "PWA", desc: "Работает офлайн, устанавливается на экран — как нативное приложение" },
];

export const FeaturesSection = () => {
    return (
        <section className="relative w-full py-24 sm:py-32 md:py-40 px-5 sm:px-8">
            <div className="hero-glow w-[500px] h-[500px] top-[30%] left-[5%] bg-[#10B981]/[0.02]" />

            <div className="max-w-6xl mx-auto relative">
                <div className="text-center mb-14 sm:mb-20">
                    <span className="inline-flex items-center text-[11px] font-semibold text-[#10B981] uppercase tracking-[0.15em] font-sans mb-5">
                        <span className="w-8 h-px bg-[#10B981]/40 mr-3" />
                        Возможности
                        <span className="w-8 h-px bg-[#10B981]/40 ml-3" />
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-[3.5rem] font-normal font-instrument-serif gradient-text-white tracking-[-0.02em] leading-[1.1]">
                        Всё для продаж —
                        <br />
                        <span className="italic gradient-text">из коробки</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.03] rounded-2xl overflow-hidden border border-white/[0.03]">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-[#050505] p-6 sm:p-7 group hover:bg-[#10B981]/[0.02] transition-colors duration-500"
                        >
                            <feature.icon className="w-5 h-5 text-[#10B981]/50 mb-5 group-hover:text-[#10B981] transition-colors duration-500" />
                            <h3 className="text-[14px] font-medium text-white/80 font-sans mb-2 tracking-tight">
                                {feature.title}
                            </h3>
                            <p className="text-[12px] sm:text-[13px] text-white/25 font-sans leading-relaxed font-light">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
