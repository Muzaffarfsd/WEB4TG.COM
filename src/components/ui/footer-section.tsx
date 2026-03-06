import { ArrowRight, Send } from "lucide-react";
import { useScrollReveal } from '../../hooks/use-animations';
import { MagneticButton } from './magnetic-button';

export const FooterSection = () => {
    const revealRef = useScrollReveal({ y: 30 });

    return (
        <footer id="contact" className="relative w-full px-5 sm:px-8">
            <div className="section-divider max-w-6xl mx-auto" />

            <div className="max-w-6xl mx-auto pt-20 sm:pt-28 md:pt-36 pb-8 sm:pb-12 relative">
                <div className="absolute w-[400px] h-[400px] rounded-full bg-[#8B5CF6]/[0.035] blur-[80px] top-[25%] left-[35%] pointer-events-none" />

                <div ref={revealRef} className="relative text-center mb-20 sm:mb-28">
                    <h2 data-reveal className="text-[clamp(2rem,6vw,4.5rem)] font-normal font-instrument-serif tracking-[-0.03em] leading-[0.95]">
                        <span className="gradient-text-white">Готовы</span>
                        <br />
                        <span className="italic gradient-text">запустить?</span>
                    </h2>

                    <p data-reveal className="text-[clamp(0.8125rem,1.5vw,1rem)] text-white/70 max-w-sm mx-auto font-sans font-light mt-5 sm:mt-7 leading-relaxed">
                        Напишите — обсудим проект и рассчитаем стоимость.
                        <br className="hidden sm:block" />
                        Средний срок запуска — 14 дней.
                    </p>

                    <div data-reveal>
                        <MagneticButton
                            href="https://t.me/w4tg_bot"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary font-sans mt-7 sm:mt-9 !py-3.5 sm:!py-4 !px-7 sm:!px-8 !text-[14px] sm:!text-base"
                            strength={0.35}
                        >
                            <Send className="w-4 h-4" />
                            Написать в Telegram
                            <ArrowRight className="w-4 h-4" />
                        </MagneticButton>
                    </div>
                </div>

                <div className="section-divider" />

                <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                    <div className="flex items-center">
                        <span className="text-white/80 text-[12px] sm:text-[13px] font-medium tracking-tight" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            WEB4TG <span className="font-normal text-white/70">STUDIO</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                        <a href="https://t.me/w4tg_bot" target="_blank" rel="noopener noreferrer" className="text-[11px] sm:text-[12px] text-white/60 hover:text-white font-sans transition-colors duration-300">
                            @w4tg_bot
                        </a>
                        <span className="text-[11px] sm:text-[12px] text-white/70 font-sans">
                            Пн-Пт 10:00-19:00
                        </span>
                    </div>

                    <p className="text-[10px] sm:text-[11px] text-white/70 font-sans">
                        © {new Date().getFullYear()} WEB4TG Studio
                    </p>
                </div>
            </div>
        </footer>
    );
};
