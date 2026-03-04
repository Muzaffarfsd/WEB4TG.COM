import { ArrowRight, Send } from "lucide-react";

export const FooterSection = () => {
    return (
        <footer id="contact" className="relative w-full px-5 sm:px-8">
            <div className="section-divider max-w-6xl mx-auto" />

            <div className="max-w-6xl mx-auto pt-24 sm:pt-32 md:pt-40 pb-10 sm:pb-16 relative">
                <div className="hero-glow w-[600px] h-[600px] top-[20%] left-[30%] bg-[#10B981]/[0.04]" />

                <div className="relative text-center mb-24 sm:mb-32">
                    <h2 className="text-4xl sm:text-5xl md:text-[4.5rem] font-normal font-instrument-serif tracking-[-0.03em] leading-[1]">
                        <span className="gradient-text-white">Готовы</span>
                        <br />
                        <span className="italic gradient-text">запустить?</span>
                    </h2>

                    <p className="text-sm sm:text-base text-white/30 max-w-md mx-auto font-sans font-light mt-6 sm:mt-8 leading-relaxed">
                        Напишите нам — обсудим проект и рассчитаем стоимость.
                        <br className="hidden sm:block" />
                        Средний срок запуска — 14 дней.
                    </p>

                    <a
                        href="https://t.me/w4tg_bot"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary font-sans mt-8 sm:mt-10 !py-4 !px-8 !text-base"
                    >
                        <Send className="w-4 h-4" />
                        Написать в Telegram
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </div>

                <div className="section-divider" />

                <div className="pt-8 sm:pt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center">
                            <span className="text-white font-bold text-[9px] font-sans">W4</span>
                        </div>
                        <span className="text-white/50 text-[13px] font-sans font-medium">WEB4TG Studio</span>
                    </div>

                    <div className="flex items-center gap-6 sm:gap-8">
                        <a href="https://t.me/w4tg_bot" target="_blank" rel="noopener noreferrer" className="text-[12px] text-white/25 hover:text-white/50 font-sans transition-colors duration-300">
                            @w4tg_bot
                        </a>
                        <span className="text-[12px] text-white/15 font-sans">
                            Пн-Пт 10:00-19:00
                        </span>
                    </div>

                    <p className="text-[11px] text-white/15 font-sans">
                        © 2025 WEB4TG Studio
                    </p>
                </div>
            </div>
        </footer>
    );
};
