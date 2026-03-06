import { CreditCard, BarChart3, MessageSquare, Bell, Heart, Star, Truck, Shield } from "lucide-react";
import { useScrollReveal, useStaggerGrid } from '../../hooks/use-animations';

const features = [
    { icon: CreditCard, title: "Платежи", desc: "SDK Stripe, ЮKassa, Apple Pay, Google Pay, СБП — PCI DSS Level 1, токенизация карт" },
    { icon: BarChart3, title: "Аналитика", desc: "Real-time дашборды: воронки, LTV, когорты, A/B-тесты через собственный event-трекинг" },
    { icon: MessageSquare, title: "Чат-модуль", desc: "WebSocket-чат с автоответами, NLP-классификация сообщений, шаблоны на Handlebars" },
    { icon: Bell, title: "Push-система", desc: "Telegram Bot API + Firebase FCM, сегментация аудитории, 95% deliverability" },
    { icon: Heart, title: "Рекомендации", desc: "Collaborative filtering, персональные AI-подборки, вишлисты с синхронизацией" },
    { icon: Star, title: "UGC-модуль", desc: "Рейтинги, фото-отзывы, верификация покупок через хэш заказа" },
    { icon: Truck, title: "Логистика", desc: "REST API интеграции с СДЭК, Boxberry, DPD — live-трекинг и webhook-статусы" },
    { icon: Shield, title: "PWA-движок", desc: "Service Worker, офлайн-кэш, установка на экран — Lighthouse 95+" },
];

export const FeaturesSection = () => {
    const headerRef = useScrollReveal({ stagger: 0.05 });
    const gridRef = useStaggerGrid({ stagger: 0.06 });

    return (
        <section className="relative w-full py-20 sm:py-28 md:py-36 px-5 sm:px-8">
            <div className="absolute w-[400px] h-[400px] rounded-full bg-[#8B5CF6]/[0.02] blur-[80px] top-[30%] left-[5%] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative">
                <div ref={headerRef} data-reveal className="text-center mb-12 sm:mb-16">
                    <span className="section-label justify-center">
                        <span className="w-8 h-px bg-[#8B5CF6]/40 mr-3" />
                        Под капотом
                        <span className="w-8 h-px bg-[#8B5CF6]/40 ml-3" />
                    </span>
                    <h2 className="text-[clamp(1.75rem,4.5vw,3.5rem)] font-normal font-instrument-serif gradient-text-white tracking-[-0.02em] leading-[1.1]">
                        Технологии —
                        <br />
                        <span className="italic gradient-text">встроенные в каждый проект</span>
                    </h2>
                </div>

                <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-white/[0.06] glass-panel">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            data-reveal
                            className="bg-[#08080c]/80 p-5 sm:p-6 md:p-7 group hover:bg-[#0c0a14]/85 transition-colors duration-500"
                        >
                            <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#8B5CF6]/40 mb-4 sm:mb-5 group-hover:text-[#8B5CF6] transition-colors duration-500" />
                            <h3 className="text-[13px] sm:text-[14px] font-medium text-white font-sans mb-1.5 tracking-tight">
                                {feature.title}
                            </h3>
                            <p className="text-[11px] sm:text-[12px] text-white/70 font-sans leading-relaxed font-light">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
