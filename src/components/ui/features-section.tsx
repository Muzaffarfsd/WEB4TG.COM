import { CreditCard, BarChart3, MessageSquare, Bell, Heart, Star, Truck, Shield } from "lucide-react";
import { useScrollReveal } from '../../hooks/use-animations';

const features = [
    { icon: CreditCard, title: "Платежи", desc: "Stripe, ЮKassa, Apple Pay, Google Pay, СБП" },
    { icon: BarChart3, title: "Аналитика", desc: "Воронки, конверсии, LTV, когорты" },
    { icon: MessageSquare, title: "Чат", desc: "Встроенный чат, автоответы, шаблоны" },
    { icon: Bell, title: "Push", desc: "Telegram-уведомления, 95% открываемость" },
    { icon: Heart, title: "Избранное", desc: "Вишлисты, сравнение, AI-подборки" },
    { icon: Star, title: "Отзывы", desc: "Рейтинги, фото, верификация покупок" },
    { icon: Truck, title: "Доставка", desc: "Трекинг, интеграция со службами" },
    { icon: Shield, title: "PWA", desc: "Офлайн, установка на экран" },
];

export const FeaturesSection = () => {
    const revealRef = useScrollReveal({ stagger: 0.05 });

    return (
        <section className="relative w-full py-20 sm:py-28 md:py-36 px-5 sm:px-8">
            <div className="absolute w-[500px] h-[500px] rounded-full bg-[#8B5CF6]/[0.015] blur-[120px] top-[30%] left-[5%] pointer-events-none" />

            <div ref={revealRef} className="max-w-6xl mx-auto relative">
                <div data-reveal className="text-center mb-12 sm:mb-16">
                    <span className="section-label justify-center">
                        <span className="w-8 h-px bg-[#8B5CF6]/40 mr-3" />
                        Возможности
                        <span className="w-8 h-px bg-[#8B5CF6]/40 ml-3" />
                    </span>
                    <h2 className="text-[clamp(1.75rem,4.5vw,3.5rem)] font-normal font-instrument-serif gradient-text-white tracking-[-0.02em] leading-[1.1]">
                        Всё для продаж —
                        <br />
                        <span className="italic gradient-text">из коробки</span>
                    </h2>
                </div>

                <div data-reveal className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-white/[0.08] glass-panel">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white/[0.01] p-5 sm:p-6 md:p-7 group hover:bg-[#8B5CF6]/[0.03] transition-all duration-500 backdrop-blur-sm"
                        >
                            <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#8B5CF6]/40 mb-4 sm:mb-5 group-hover:text-[#8B5CF6] transition-colors duration-500" />
                            <h3 className="text-[13px] sm:text-[14px] font-medium text-white/75 font-sans mb-1.5 tracking-tight">
                                {feature.title}
                            </h3>
                            <p className="text-[11px] sm:text-[12px] text-white/20 font-sans leading-relaxed font-light">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
