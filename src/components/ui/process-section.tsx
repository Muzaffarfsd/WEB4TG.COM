import { Check } from "lucide-react";
import { useScrollReveal } from '../../hooks/use-animations';

const steps = [
    {
        number: "01",
        title: "Заявка",
        payment: "предоплата 35%",
        items: ["Дизайн интерфейса", "Структура приложения", "Первая демо-версия"],
        duration: "1-3 дня"
    },
    {
        number: "02",
        title: "Разработка",
        payment: "65% после сдачи",
        items: ["Готовое приложение", "Все правки учтены", "Публикация в Telegram"],
        duration: "7-14 дней"
    },
    {
        number: "03",
        title: "Поддержка",
        payment: "подписка",
        items: ["Хостинг и обновления", "Техническая поддержка", "Мониторинг и бэкапы"],
        duration: "Постоянно"
    }
];

const techItems = [
    "React 19", "TypeScript", "Vite", "Tailwind CSS", "Telegram Bot API", "Stripe", "ЮKassa", "AI-бот", "PWA", "PostgreSQL", "Redis", "framer-motion"
];

export const ProcessSection = () => {
    const revealRef = useScrollReveal({ stagger: 0.08 });
    const marqueeRef = useScrollReveal({ delay: 0.3 });

    return (
        <section id="process" className="relative w-full py-20 sm:py-28 md:py-36 px-5 sm:px-8">
            <div ref={revealRef} className="max-w-6xl mx-auto">
                <div data-reveal className="max-w-xl mb-12 sm:mb-16">
                    <span className="section-label">
                        <span className="w-8 h-px bg-[#8B5CF6]/40 mr-3" />
                        Процесс
                    </span>
                    <h2 className="text-[clamp(1.75rem,4.5vw,3.5rem)] font-normal font-instrument-serif gradient-text-white tracking-[-0.02em] leading-[1.1]">
                        Три шага до
                        <br />
                        <span className="italic gradient-text">вашего приложения</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 mb-16 sm:mb-24">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            data-reveal
                            className="glow-card rounded-2xl p-6 sm:p-7 md:p-8 relative overflow-hidden group"
                        >
                            <div className="absolute top-5 right-5 sm:top-6 sm:right-6 text-[3.5rem] sm:text-[5rem] font-bold text-white/[0.015] font-sans leading-none select-none group-hover:text-[#8B5CF6]/[0.04] transition-colors duration-700">
                                {step.number}
                            </div>

                            <div className="relative">
                                <h3 className="text-lg sm:text-xl font-normal text-white font-instrument-serif tracking-tight">
                                    {step.title}
                                </h3>
                                <span className="text-[10px] sm:text-[11px] text-[#8B5CF6]/60 font-sans font-medium uppercase tracking-wider">
                                    {step.payment}
                                </span>

                                <ul className="mt-5 sm:mt-6 space-y-2.5 sm:space-y-3">
                                    {step.items.map((item, i) => (
                                        <li key={i} className="flex items-center gap-2.5 text-[13px] sm:text-[14px] text-white/80 font-sans font-light">
                                            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8B5CF6]/50 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-white/[0.03]">
                                    <span className="text-[10px] sm:text-[11px] text-white/60 font-sans uppercase tracking-wider">{step.duration}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div ref={marqueeRef} className="relative overflow-hidden">
                    <div data-reveal className="section-divider mb-8 sm:mb-10" />
                    <p data-reveal className="text-[10px] sm:text-[11px] text-white/60 font-sans uppercase tracking-[0.15em] mb-5 sm:mb-6 text-center">
                        Стек технологий
                    </p>
                    <div data-reveal className="relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-[#050505]/90 to-transparent z-10 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-[#050505]/90 to-transparent z-10 pointer-events-none" />
                        <div className="flex animate-marquee whitespace-nowrap">
                            {[...techItems, ...techItems].map((tech, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-4 py-2 mx-1.5 text-[12px] sm:text-[13px] font-medium text-white/70 bg-[#0a0a10]/80 border border-white/[0.06] rounded-full font-sans whitespace-nowrap"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
