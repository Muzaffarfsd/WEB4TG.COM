import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';

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
            className={`fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] shadow-[0_0_20px_-5px_rgba(139,92,246,0.5)] transition-all duration-500 hover:scale-110 hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.7)] w-12 h-12 sm:w-14 sm:h-14 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        >
            <span className="absolute inset-0 rounded-full bg-[#8B5CF6]/20 animate-pulse-glow" />
            <Send className="w-5 h-5 sm:w-6 sm:h-6 text-white relative z-10" />
        </a>
    );
};
