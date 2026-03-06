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

export const MagneticButton = ({ children, className, href, target, rel, onClick, strength = 0.35 }: MagneticButtonProps) => {
    const ref = useRef<HTMLElement>(null);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * strength;
        const dy = (e.clientY - cy) * strength;

        gsap.to(ref.current, {
            x: dx,
            y: dy,
            duration: 0.4,
            ease: 'power2.out',
        });
    }, [strength]);

    const handleMouseLeave = useCallback(() => {
        if (!ref.current) return;
        gsap.to(ref.current, {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: 'elastic.out(1, 0.3)',
        });
    }, []);

    const props = {
        ref: ref as any,
        className,
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseLeave,
        onClick,
        style: { willChange: 'transform' } as React.CSSProperties,
    };

    if (href) {
        return <a {...props} href={href} target={target} rel={rel}>{children}</a>;
    }
    return <button {...props}>{children}</button>;
};
