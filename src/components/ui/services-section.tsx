import { ShoppingBag, UtensilsCrossed, Scissors, Stethoscope, Dumbbell, GraduationCap, Car, Bot, ArrowUpRight } from "lucide-react";
import { useScrollReveal } from '../../hooks/use-animations';
import { useRef, useCallback } from 'react';
import gsap from 'gsap';

const services = [
    { icon: ShoppingBag, title: "Интернет-магазины", desc: "Каталог, корзина, оплата, доставка — полноценный e-commerce внутри Telegram", large: true },
    { icon: UtensilsCrossed, title: "Рестораны", desc: "Меню, заказы, отслеживание курьера" },
    { icon: Scissors, title: "Бьюти", desc: "Онлайн-запись, каталог мастеров" },
    { icon: Stethoscope, title: "Медицина", desc: "Запись к врачу, телемедицина" },
    { icon: Dumbbell, title: "Фитнес", desc: "Абонементы, расписание, трекинг" },
    { icon: GraduationCap, title: "Образование", desc: "Курсы, прогресс, сертификаты" },
    { icon: Car, title: "Сервисы", desc: "Аренда, бронирование, такси" },
    { icon: Bot, title: "AI-агент 24/7", desc: "Автоматическая поддержка, продажи и аналитика на 150+ языках — работает без выходных", large: true },
];

const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

const TiltCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    const ref = useRef<HTMLDivElement>(null);

    const handleMove = useCallback((e: React.MouseEvent) => {
        if (!ref.current || isTouch) return;
        const rect = ref.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(ref.current, {
            rotateY: x * 8,
            rotateX: -y * 8,
            duration: 0.4,
            ease: 'power2.out',
            transformPerspective: 800,
        });
    }, []);

    const handleLeave = useCallback(() => {
        if (!ref.current || isTouch) return;
        gsap.to(ref.current, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power3.out' });
    }, []);

    return (
        <div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave} className={className} style={{ transformStyle: isTouch ? undefined : 'preserve-3d' }}>
            {children}
        </div>
    );
};

export const ServicesSection = () => {
    const revealRef = useScrollReveal({ stagger: 0.06 });

    return (
        <section id="services" className="relative w-full py-20 sm:py-28 md:py-36 px-5 sm:px-8">
            <div className="absolute w-[400px] h-[400px] rounded-full bg-[#8B5CF6]/[0.025] blur-[120px] top-[20%] right-[5%] pointer-events-none" />

            <div ref={revealRef} className="max-w-6xl mx-auto relative">
                <div data-reveal className="max-w-xl mb-12 sm:mb-16">
                    <span className="section-label">
                        <span className="w-8 h-px bg-[#8B5CF6]/40 mr-3" />
                        Услуги
                    </span>
                    <h2 className="text-[clamp(1.75rem,4.5vw,3.5rem)] font-normal font-instrument-serif gradient-text-white tracking-[-0.02em] leading-[1.1]">
                        Telegram Mini Apps
                        <br />
                        <span className="italic gradient-text">для любого бизнеса</span>
                    </h2>
                    <p className="text-[clamp(0.875rem,1.5vw,1.05rem)] text-white/30 mt-4 sm:mt-5 font-sans font-light leading-relaxed">
                        Приложения премиум-класса, которые выглядят как нативные — но без скачивания из App Store.
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                    {services.map((service, index) => (
                        <TiltCard
                            key={index}
                            className={`${service.large ? 'col-span-2' : 'col-span-1'}`}
                        >
                            <div
                                data-reveal
                                className="glow-card rounded-2xl p-5 sm:p-6 md:p-7 cursor-default h-full group"
                            >
                                <div className="flex items-start justify-between mb-6 sm:mb-8">
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6]/20 to-[#8B5CF6]/5 flex items-center justify-center border border-[#8B5CF6]/10 group-hover:border-[#8B5CF6]/25 transition-colors duration-500">
                                        <service.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#8B5CF6]" />
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-white/[0.06] group-hover:text-[#8B5CF6]/40 transition-colors duration-500" />
                                </div>
                                <h3 className="text-[14px] sm:text-[15px] font-medium text-white/85 font-sans mb-1.5 tracking-tight">
                                    {service.title}
                                </h3>
                                <p className="text-[12px] sm:text-[13px] text-white/25 font-sans leading-relaxed font-light">
                                    {service.desc}
                                </p>
                            </div>
                        </TiltCard>
                    ))}
                </div>
            </div>
        </section>
    );
};
