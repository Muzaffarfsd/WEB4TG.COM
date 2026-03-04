import { useRef, useCallback } from 'react';
import gsap from 'gsap';

interface MagneticButtonProps {
    children: React.ReactNode;
    className?: string;
    href?: string;
    target?: string;
    rel?: string;
    onClick?: () => void;
    strength?: number;
}

const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

export const MagneticButton = ({ children, className, href, target, rel, onClick, strength = 0.3 }: MagneticButtonProps) => {
    const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

    const handleMove = useCallback((e: React.MouseEvent) => {
        if (!ref.current || isTouch) return;
        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(ref.current, {
            x: x * strength,
            y: y * strength,
            duration: 0.3,
            ease: 'power2.out',
        });
    }, [strength]);

    const handleLeave = useCallback(() => {
        if (!ref.current || isTouch) return;
        gsap.to(ref.current, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    }, []);

    const props = {
        ref: ref as any,
        onMouseMove: handleMove,
        onMouseLeave: handleLeave,
        className,
        onClick,
    };

    if (href) {
        return <a {...props} href={href} target={target} rel={rel}>{children}</a>;
    }
    return <button {...props}>{children}</button>;
};
