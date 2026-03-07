import { ArrowRight, Send, Mail, ExternalLink } from "lucide-react";
import { useClipReveal } from '../../hooks/use-animations';
import { MagneticButton } from './magnetic-button';

const TelegramIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.43 0-2.59-1.16-2.59-2.59a2.59 2.59 0 0 1 2.59-2.59c.28 0 .55.04.8.13V9.73a5.62 5.62 0 0 0-.8-.06C6.73 9.67 4 12.4 4 15.72A6.09 6.09 0 0 0 9.86 21c3.32 0 5.86-2.73 5.86-6.08V9.01a7.32 7.32 0 0 0 4.28 1.38V7.3a4.28 4.28 0 0 1-3.4-1.48Z" />
    </svg>
);

const YouTubeIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81ZM9.75 15.02V8.98L15.5 12l-5.75 3.02Z" />
    </svg>
);

const socialLinks = [
    { href: "https://t.me/w4tg_bot", label: "Telegram", icon: TelegramIcon },
    { href: "https://instagram.com/web4tg", label: "Instagram", icon: InstagramIcon },
    { href: "https://tiktok.com/@web4tg", label: "TikTok", icon: TikTokIcon },
    { href: "https://youtube.com/@WEB4TG", label: "YouTube", icon: YouTubeIcon },
];

const navColumns = [
    {
        title: "Навигация",
        links: [
            { label: "Услуги", href: "#services" },
            { label: "AI-агенты", href: "#ai-agent" },
            { label: "Портфолио", href: "#highlights" },
            { label: "Процесс", href: "#process" },
            { label: "Цены", href: "#pricing" },
        ],
    },
    {
        title: "Компания",
        links: [
            { label: "Гарантии", href: "#guarantees" },
            { label: "Отзывы", href: "#testimonials" },
            { label: "FAQ", href: "#faq" },
            { label: "Контакты", href: "#contact" },
        ],
    },
];

const techStack = ["React 19", "TypeScript", "Telegram API", "AI / ML", "PostgreSQL", "Node.js"];

export const FooterSection = () => {
    const revealRef = useClipReveal('up', { stagger: 0.1 });

    return (
        <footer id="footer" className="relative w-full px-5 sm:px-8">
            <div className="section-divider max-w-6xl mx-auto" />

            <div className="max-w-6xl mx-auto pt-20 sm:pt-28 md:pt-36 pb-0 relative">
                <div className="absolute w-[500px] h-[500px] rounded-full bg-[#8B5CF6]/[0.03] blur-[100px] top-[10%] left-[30%] pointer-events-none" />
                <div className="absolute w-[300px] h-[300px] rounded-full bg-[#8B5CF6]/[0.02] blur-[80px] bottom-[20%] right-[10%] pointer-events-none" />

                <div ref={revealRef} className="relative text-center mb-16 sm:mb-20 md:mb-24">
                    <h2 data-reveal className="text-[clamp(2rem,6vw,4.5rem)] font-normal font-instrument-serif tracking-[-0.03em] leading-[0.95]">
                        <span className="gradient-text-white">Готовы</span>
                        <br />
                        <span className="italic gradient-text">запустить?</span>
                    </h2>

                    <p data-reveal className="text-[clamp(0.8125rem,1.5vw,1rem)] text-white/70 max-w-sm mx-auto font-sans font-light mt-5 sm:mt-7 leading-relaxed text-wrap-pretty">
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

                <div className="pt-12 sm:pt-16 pb-12 sm:pb-16">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 sm:gap-8 lg:gap-6">

                        <div className="lg:col-span-4 space-y-6">
                            <div className="inline-flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] flex items-center justify-center shrink-0">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="3" width="20" height="14" rx="2" />
                                        <path d="M8 21h8" />
                                        <path d="M12 17v4" />
                                    </svg>
                                </div>
                                <span className="text-white font-semibold text-[16px] tracking-tight" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                    WEB4TG <span className="font-normal text-white/60">STUDIO</span>
                                </span>
                            </div>

                            <p className="text-[13px] sm:text-[14px] text-white/50 leading-relaxed max-w-xs text-wrap-pretty">
                                Разрабатываем премиальные Telegram Mini Apps и AI-системы автоматизации бизнеса. Полный цикл — от аналитики до поддержки.
                            </p>

                            <div className="flex items-center gap-2.5">
                                {socialLinks.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={link.label}
                                        className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-white/50 hover:text-white hover:bg-[#8B5CF6]/15 hover:border-[#8B5CF6]/30 hover:scale-110 transition-all duration-300"
                                    >
                                        <link.icon className="w-[16px] h-[16px]" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {navColumns.map((col) => (
                            <div key={col.title} className="lg:col-span-2">
                                <h4 className="text-[11px] sm:text-[12px] uppercase tracking-[0.12em] text-white/40 font-medium mb-4 sm:mb-5">
                                    {col.title}
                                </h4>
                                <ul className="space-y-2.5">
                                    {col.links.map((link) => (
                                        <li key={link.label}>
                                            <a
                                                href={link.href}
                                                className="text-[13px] sm:text-[14px] text-white/60 hover:text-white transition-colors duration-300 inline-flex items-center gap-1 group"
                                            >
                                                <span className="relative">
                                                    {link.label}
                                                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#8B5CF6]/50 group-hover:w-full transition-all duration-300" />
                                                </span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                        <div className="lg:col-span-4">
                            <h4 className="text-[11px] sm:text-[12px] uppercase tracking-[0.12em] text-white/40 font-medium mb-4 sm:mb-5">
                                Контакты
                            </h4>
                            <ul className="space-y-3.5">
                                <li>
                                    <a
                                        href="https://t.me/w4tg_bot"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-start gap-3 text-[13px] sm:text-[14px] text-white/60 hover:text-white transition-colors duration-300 group"
                                    >
                                        <Send className="w-4 h-4 mt-0.5 shrink-0 text-[#8B5CF6]/60 group-hover:text-[#8B5CF6] transition-colors duration-300" />
                                        <span>@w4tg_bot</span>
                                        <ExternalLink className="w-3 h-3 mt-0.5 opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="mailto:hello@web4tg.com"
                                        className="flex items-start gap-3 text-[13px] sm:text-[14px] text-white/60 hover:text-white transition-colors duration-300 group"
                                    >
                                        <Mail className="w-4 h-4 mt-0.5 shrink-0 text-[#8B5CF6]/60 group-hover:text-[#8B5CF6] transition-colors duration-300" />
                                        <span>hello@web4tg.com</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/[0.06] py-5 sm:py-6">
                    <div className="flex flex-wrap items-center gap-2 mb-5 sm:mb-6">
                        {techStack.map((tech) => (
                            <span
                                key={tech}
                                className="text-[10px] sm:text-[11px] px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-white/40 font-medium"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                        <p className="text-[11px] sm:text-[12px] text-white/40 font-sans">
                            © {new Date().getFullYear()} WEB4TG Studio. Все права защищены.
                        </p>

                        <div className="flex items-center gap-4 sm:gap-5">
                            <span className="text-[11px] sm:text-[12px] text-white/30 font-sans">
                                Политика конфиденциальности
                            </span>
                            <span className="text-[11px] sm:text-[12px] text-white/30 font-sans">
                                Оферта
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
