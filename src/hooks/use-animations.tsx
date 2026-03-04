import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = () => window.matchMedia('(pointer: coarse)').matches;

export const useScrollReveal = (options?: { delay?: number; y?: number; duration?: number; stagger?: number }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const children = ref.current.querySelectorAll('[data-reveal]');
        const targets = children.length > 0 ? children : [ref.current];

        if (prefersReducedMotion()) {
            gsap.set(targets, { opacity: 1, y: 0 });
            return;
        }

        gsap.set(targets, {
            opacity: 0,
            y: options?.y ?? 40,
        });

        gsap.to(targets, {
            opacity: 1,
            y: 0,
            duration: options?.duration ?? 1,
            delay: options?.delay ?? 0,
            stagger: options?.stagger ?? 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: ref.current,
                start: 'top 85%',
                once: true,
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => {
                if (t.trigger === ref.current) t.kill();
            });
        };
    }, []);

    return ref;
};

export const useCountUp = (end: number | string, duration: number = 2) => {
    const [display, setDisplay] = useState('0');
    const ref = useRef<HTMLDivElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!ref.current) return;

        const endStr = String(end);
        const numericMatch = endStr.match(/[\d.]+/);
        if (!numericMatch) {
            setDisplay(endStr);
            return;
        }

        const numericEnd = parseFloat(numericMatch[0]);
        const prefix = endStr.slice(0, endStr.indexOf(numericMatch[0]));
        const suffix = endStr.slice(endStr.indexOf(numericMatch[0]) + numericMatch[0].length);
        const hasDecimal = numericMatch[0].includes('.');
        const decimalPlaces = hasDecimal ? numericMatch[0].split('.')[1].length : 0;

        const trigger = ScrollTrigger.create({
            trigger: ref.current,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                if (hasAnimated.current) return;
                hasAnimated.current = true;

                const obj = { val: 0 };
                gsap.to(obj, {
                    val: numericEnd,
                    duration,
                    ease: 'power2.out',
                    onUpdate: () => {
                        const formatted = hasDecimal
                            ? obj.val.toFixed(decimalPlaces)
                            : Math.round(obj.val).toLocaleString('ru-RU');
                        setDisplay(`${prefix}${formatted}${suffix}`);
                    },
                });
            },
        });

        return () => trigger.kill();
    }, [end, duration]);

    return { ref, display };
};

export const useTilt = (intensity: number = 10) => {
    const ref = useRef<HTMLDivElement>(null);

    const handleMove = useCallback((e: MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(ref.current, {
            rotateY: x * intensity,
            rotateX: -y * intensity,
            duration: 0.4,
            ease: 'power2.out',
            transformPerspective: 800,
        });
    }, [intensity]);

    const handleLeave = useCallback(() => {
        if (!ref.current) return;
        gsap.to(ref.current, {
            rotateY: 0,
            rotateX: 0,
            duration: 0.6,
            ease: 'power3.out',
        });
    }, []);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        el.addEventListener('mousemove', handleMove);
        el.addEventListener('mouseleave', handleLeave);

        return () => {
            el.removeEventListener('mousemove', handleMove);
            el.removeEventListener('mouseleave', handleLeave);
        };
    }, [handleMove, handleLeave]);

    return ref;
};

export const useStickyNav = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 80);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return scrolled;
};
