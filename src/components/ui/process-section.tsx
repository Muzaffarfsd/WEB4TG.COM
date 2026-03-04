const steps = [
    {
        number: "01",
        title: "Заявка",
        payment: "Предоплата 35%",
        items: ["Дизайн интерфейса", "Структура приложения", "Первая демо-версия"],
        duration: "1-3 дня"
    },
    {
        number: "02",
        title: "Разработка",
        payment: "65% после сдачи",
        items: ["Полностью готовое приложение", "Все правки учтены", "Публикация в Telegram"],
        duration: "7-14 дней"
    },
    {
        number: "03",
        title: "Поддержка",
        payment: "Ежемесячная подписка",
        items: ["Хостинг и обновления", "Техническая поддержка", "Бэкапы и мониторинг"],
        duration: "Постоянно"
    }
];

const techStack = [
    "React 19", "TypeScript", "Tailwind CSS", "Telegram Bot API", "Stripe", "ЮKassa", "AI-бот", "PWA"
];

export const ProcessSection = () => {
    return (
        <section id="process" className="w-full py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-[#09090b] relative">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10 sm:mb-16">
                    <span className="inline-flex items-center text-xs font-medium text-[#10B981] bg-[#10B981]/10 rounded-full py-1 px-3 font-sans mb-4 ring-1 ring-[#10B981]/20">
                        Процесс
                    </span>
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-normal font-instrument-serif text-white tracking-tight">
                        Как мы работаем
                    </h2>
                    <p className="text-sm sm:text-base text-white/60 mt-3 sm:mt-4 max-w-xl mx-auto font-sans">
                        От заявки до запуска — 3 простых этапа
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="relative p-6 sm:p-8 rounded-2xl bg-white/[0.03] ring-1 ring-white/[0.06] hover:ring-[#10B981]/20 transition-all duration-300"
                        >
                            <div className="text-5xl sm:text-6xl font-bold text-[#10B981]/10 font-sans absolute top-4 right-6">
                                {step.number}
                            </div>
                            <div className="relative">
                                <h3 className="text-xl sm:text-2xl font-medium text-white font-sans mb-1">
                                    {step.title}
                                </h3>
                                <span className="text-xs text-[#10B981] font-sans font-medium">
                                    {step.payment}
                                </span>
                                <ul className="mt-4 space-y-2.5">
                                    {step.items.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2.5 text-sm text-white/60 font-sans">
                                            <svg className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-5 pt-4 border-t border-white/[0.06]">
                                    <span className="text-xs text-white/40 font-sans">Срок: {step.duration}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <p className="text-xs sm:text-sm text-white/40 font-sans mb-4">Технологии</p>
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                        {techStack.map((tech, index) => (
                            <span
                                key={index}
                                className="px-3 py-1.5 text-xs sm:text-sm font-medium text-white/60 bg-white/[0.03] ring-1 ring-white/[0.06] rounded-full font-sans"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
