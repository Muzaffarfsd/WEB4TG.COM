import { Check } from "lucide-react";

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
    return (
        <section id="process" className="relative w-full py-24 sm:py-32 md:py-40 px-5 sm:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="max-w-xl mb-14 sm:mb-20">
                    <span className="inline-flex items-center text-[11px] font-semibold text-[#10B981] uppercase tracking-[0.15em] font-sans mb-5">
                        <span className="w-8 h-px bg-[#10B981]/40 mr-3" />
                        Процесс
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-[3.5rem] font-normal font-instrument-serif gradient-text-white tracking-[-0.02em] leading-[1.1]">
                        Три шага до
                        <br />
                        <span className="italic gradient-text">вашего приложения</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-20 sm:mb-28">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="glow-card rounded-2xl p-7 sm:p-8 relative overflow-hidden group"
                        >
                            <div className="absolute top-6 right-6 text-[4rem] sm:text-[5rem] font-bold text-white/[0.02] font-sans leading-none select-none group-hover:text-[#10B981]/[0.04] transition-colors duration-500">
                                {step.number}
                            </div>

                            <div className="relative">
                                <div className="flex items-baseline gap-3 mb-1">
                                    <h3 className="text-xl sm:text-2xl font-normal text-white/90 font-instrument-serif tracking-tight">
                                        {step.title}
                                    </h3>
                                </div>
                                <span className="text-[11px] text-[#10B981]/70 font-sans font-medium uppercase tracking-wider">
                                    {step.payment}
                                </span>

                                <ul className="mt-6 space-y-3">
                                    {step.items.map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-[14px] text-white/40 font-sans font-light">
                                            <Check className="w-4 h-4 text-[#10B981]/60 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-6 pt-5 border-t border-white/[0.04]">
                                    <span className="text-[11px] text-white/20 font-sans uppercase tracking-wider">{step.duration}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="relative overflow-hidden">
                    <div className="section-divider mb-10" />
                    <p className="text-[11px] text-white/20 font-sans uppercase tracking-[0.15em] mb-6 text-center">
                        Технологический стек
                    </p>
                    <div className="relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />
                        <div className="flex animate-marquee whitespace-nowrap">
                            {[...techItems, ...techItems].map((tech, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-5 py-2.5 mx-2 text-[13px] font-medium text-white/25 bg-white/[0.02] border border-white/[0.04] rounded-full font-sans whitespace-nowrap"
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
