import { Send } from "lucide-react";

export const FooterSection = () => {
    return (
        <section id="contact" className="w-full py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-[#09090b] relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.05),transparent_60%)]" />
            <div className="max-w-4xl mx-auto relative text-center">
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-normal font-instrument-serif text-white tracking-tight mb-4 sm:mb-6">
                    Готовы запустить
                    <br />
                    <span className="text-[#10B981]">своё приложение?</span>
                </h2>
                <p className="text-sm sm:text-base text-white/60 max-w-lg mx-auto font-sans mb-8 sm:mb-10">
                    Напишите нам в Telegram — обсудим ваш проект и рассчитаем стоимость. Средний срок запуска — 14 дней.
                </p>
                <a
                    href="https://t.me/w4tg_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-[#10B981] hover:bg-[#059669] active:bg-[#047857] text-white font-medium rounded-full py-4 px-8 text-base sm:text-lg font-sans transition-colors min-h-[52px]"
                >
                    <Send className="w-5 h-5" />
                    Написать в Telegram
                </a>

                <div className="mt-16 sm:mt-20 pt-8 border-t border-white/[0.06]">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-[#10B981] font-bold text-base font-sans">WEB4TG</span>
                            <span className="text-white/50 font-medium text-base font-sans">STUDIO</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <a href="https://t.me/w4tg_bot" target="_blank" rel="noopener noreferrer" className="text-sm text-white/40 hover:text-white/70 font-sans transition-colors">
                                @w4tg_bot
                            </a>
                            <span className="text-sm text-white/40 font-sans">
                                Пн-Пт, 10:00 - 19:00 МСК
                            </span>
                        </div>
                        <p className="text-xs text-white/30 font-sans">
                            © 2025 WEB4TG Studio
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
