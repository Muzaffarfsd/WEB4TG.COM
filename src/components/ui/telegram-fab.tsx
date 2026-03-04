import { useState, useEffect, useRef } from 'react';

const TelegramIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M21.198 4.232c.26-.256.49-.06.38.246l-3.26 14.696c-.18.862-.72 1.072-1.46.668l-4.034-2.972-1.946 1.872c-.216.216-.396.396-.812.396l.29-4.108 7.48-6.762c.326-.29-.07-.45-.506-.16L8.236 13.97l-3.906-1.222c-.85-.266-.866-.85.176-1.258L20.14 4.38c.708-.256 1.328.16 1.058 1.042v-.002l-.002-.002v.002l.002-.002v-.186z" fill="currentColor"/>
    </svg>
);

export const TelegramFab = () => {
    const [visible, setVisible] = useState(false);
    const visibleRef = useRef(false);

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(() => {
                    const isVisible = window.scrollY > window.innerHeight * 0.8;
                    if (visibleRef.current !== isVisible) {
                        visibleRef.current = isVisible;
                        setVisible(isVisible);
                    }
                    ticking = false;
                });
            }
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <a
            href="https://t.me/w4tg_bot"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Написать в Telegram"
            className={`fixed z-50 flex items-center justify-center rounded-full bg-gradient-to-br from-[#2AABEE] to-[#229ED9] shadow-[0_0_20px_-5px_rgba(42,171,238,0.5)] transition-all duration-500 hover:scale-110 hover:shadow-[0_0_30px_-5px_rgba(42,171,238,0.7)] w-11 h-11 sm:w-14 sm:h-14 right-4 sm:right-6 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom))] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        >
            <span className="absolute inset-0 rounded-full bg-[#2AABEE]/20 animate-pulse-glow" />
            <TelegramIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white relative z-10" />
        </a>
    );
};
