import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

        gsap.set(targets, { opacity: 0, y: options?.y ?? 40 });

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
    const displayRef = useRef('0');

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
        const el = ref.current;

        const trigger = ScrollTrigger.create({
            trigger: el,
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
                        const next = `${prefix}${formatted}${suffix}`;
                        if (displayRef.current !== next) {
                            displayRef.current = next;
                            const target = el?.querySelector('[data-count]');
                            if (target) target.textContent = next;
                        }
                    },
                    onComplete: () => {
                        const final = hasDecimal
                            ? numericEnd.toFixed(decimalPlaces)
                            : Math.round(numericEnd).toLocaleString('ru-RU');
                        const finalStr = `${prefix}${final}${suffix}`;
                        setDisplay(finalStr);
                    },
                });
            },
        });

        return () => trigger.kill();
    }, [end, duration]);

    return { ref, display };
};

export const useParallax = (speed: number = 0.2) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current || prefersReducedMotion()) return;

        const tl = gsap.to(ref.current, {
            y: () => speed * 100,
            ease: 'none',
            scrollTrigger: {
                trigger: ref.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
            },
        });

        return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
        };
    }, [speed]);

    return ref;
};

export const useTextReveal = (options?: { delay?: number; useScroll?: boolean }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        if (prefersReducedMotion()) {
            gsap.set(ref.current, { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)' });
            return;
        }

        gsap.set(ref.current, {
            opacity: 0,
            y: 50,
            clipPath: 'inset(100% 0% 0% 0%)',
        });

        const animConfig: gsap.TweenVars = {
            opacity: 1,
            y: 0,
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.2,
            delay: options?.delay ?? 0.3,
            ease: 'power4.out',
        };

        if (options?.useScroll) {
            animConfig.scrollTrigger = {
                trigger: ref.current,
                start: 'top 85%',
                once: true,
            };
        }

        gsap.to(ref.current, animConfig);
    }, []);

    return ref;
};

export const useSlideReveal = (direction: 'left' | 'right' = 'left', options?: { duration?: number; stagger?: number }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const children = ref.current.querySelectorAll('[data-reveal]');
        const targets = children.length > 0 ? children : [ref.current];

        if (prefersReducedMotion()) {
            gsap.set(targets, { opacity: 1, x: 0 });
            return;
        }

        const xVal = direction === 'left' ? -60 : 60;
        gsap.set(targets, { opacity: 0, x: xVal });

        gsap.to(targets, {
            opacity: 1,
            x: 0,
            duration: options?.duration ?? 1,
            stagger: options?.stagger ?? 0.12,
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

export const useScaleReveal = (options?: { duration?: number; stagger?: number; scale?: number }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const children = ref.current.querySelectorAll('[data-reveal]');
        const targets = children.length > 0 ? children : [ref.current];

        if (prefersReducedMotion()) {
            gsap.set(targets, { opacity: 1, scale: 1 });
            return;
        }

        gsap.set(targets, { opacity: 0, scale: options?.scale ?? 0.85, y: 20 });

        gsap.to(targets, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: options?.duration ?? 0.8,
            stagger: options?.stagger ?? 0.08,
            ease: 'back.out(1.4)',
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

export const useStaggerGrid = (options?: { duration?: number; stagger?: number }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const children = ref.current.querySelectorAll('[data-reveal]');
        const targets = children.length > 0 ? children : [ref.current];

        if (prefersReducedMotion()) {
            gsap.set(targets, { opacity: 1, y: 0, scale: 1 });
            return;
        }

        gsap.set(targets, { opacity: 0, y: 30, scale: 0.92 });

        gsap.to(targets, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: options?.duration ?? 0.7,
            stagger: {
                each: options?.stagger ?? 0.06,
                from: 'start',
            },
            ease: 'power2.out',
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

export const useFlipReveal = (options?: { duration?: number; stagger?: number }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const children = ref.current.querySelectorAll('[data-reveal]');
        const targets = children.length > 0 ? children : [ref.current];

        if (prefersReducedMotion()) {
            gsap.set(targets, { opacity: 1, rotateX: 0, y: 0 });
            return;
        }

        gsap.set(targets, { opacity: 0, rotateX: -15, y: 40, transformPerspective: 800 });

        gsap.to(targets, {
            opacity: 1,
            rotateX: 0,
            y: 0,
            duration: options?.duration ?? 1,
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

export const useStickyNav = () => {
    const [scrolled, setScrolled] = useState(false);
    const scrolledRef = useRef(false);

    useEffect(() => {
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(() => {
                    const isScrolled = window.scrollY > 80;
                    if (scrolledRef.current !== isScrolled) {
                        scrolledRef.current = isScrolled;
                        setScrolled(isScrolled);
                    }
                    ticking = false;
                });
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return scrolled;
};
