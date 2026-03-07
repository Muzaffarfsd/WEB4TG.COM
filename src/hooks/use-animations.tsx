'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const killTriggers = (el: Element | null) => {
    ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === el) t.kill();
    });
};

const getTargets = (container: HTMLElement) => {
    const children = container.querySelectorAll('[data-reveal]');
    return children.length > 0 ? children : [container];
};

export const useScrollReveal = (options?: {
    delay?: number;
    y?: number;
    duration?: number;
    stagger?: number;
    blur?: number;
    scrub?: boolean;
}) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const targets = getTargets(ref.current);

        if (prefersReducedMotion()) {
            gsap.set(targets, { opacity: 1, y: 0, filter: 'blur(0px)' });
            return;
        }

        const blurAmount = options?.blur ?? 12;

        gsap.set(targets, {
            opacity: 0,
            y: options?.y ?? 60,
            filter: `blur(${blurAmount}px)`,
            willChange: 'transform, opacity, filter',
        });

        if (options?.scrub) {
            gsap.to(targets, {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                stagger: options?.stagger ?? 0.05,
                ease: 'none',
                scrollTrigger: {
                    trigger: ref.current,
                    start: 'top 90%',
                    end: 'top 40%',
                    scrub: 1.2,
                },
            });
        } else {
            gsap.to(targets, {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: options?.duration ?? 0.8,
                delay: options?.delay ?? 0,
                stagger: options?.stagger ?? 0.1,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: ref.current,
                    start: 'top 85%',
                    once: true,
                },
            });
        }

        return () => killTriggers(ref.current);
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
            duration: 0.8,
            delay: options?.delay ?? 0.3,
            ease: 'expo.out',
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
        const targets = getTargets(ref.current);

        if (prefersReducedMotion()) {
            gsap.set(targets, { opacity: 1, x: 0, filter: 'blur(0px)' });
            return;
        }

        const xVal = direction === 'left' ? -50 : 50;
        gsap.set(targets, {
            opacity: 0,
            x: xVal,
            filter: 'blur(6px)',
            willChange: 'transform, opacity, filter',
        });

        gsap.to(targets, {
            opacity: 1,
            x: 0,
            filter: 'blur(0px)',
            duration: options?.duration ?? 0.8,
            stagger: options?.stagger ?? 0.12,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: ref.current,
                start: 'top 85%',
                once: true,
            },
        });

        return () => killTriggers(ref.current);
    }, []);

    return ref;
};

export const useScaleReveal = (options?: { duration?: number; stagger?: number; scale?: number }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const targets = getTargets(ref.current);

        if (prefersReducedMotion()) {
            gsap.set(targets, { opacity: 1, scale: 1, filter: 'blur(0px)' });
            return;
        }

        gsap.set(targets, {
            opacity: 0,
            scale: options?.scale ?? 0.9,
            y: 20,
            filter: 'blur(6px)',
            willChange: 'transform, opacity, filter',
        });

        gsap.to(targets, {
            opacity: 1,
            scale: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: options?.duration ?? 0.8,
            stagger: options?.stagger ?? 0.08,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: ref.current,
                start: 'top 85%',
                once: true,
            },
        });

        return () => killTriggers(ref.current);
    }, []);

    return ref;
};

export const useStaggerGrid = (options?: { duration?: number; stagger?: number }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const targets = getTargets(ref.current);

        if (prefersReducedMotion()) {
            gsap.set(targets, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' });
            return;
        }

        gsap.set(targets, {
            opacity: 0,
            y: 40,
            scale: 0.9,
            filter: 'blur(8px)',
            willChange: 'transform, opacity, filter',
        });

        gsap.to(targets, {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: options?.duration ?? 0.8,
            stagger: {
                each: options?.stagger ?? 0.06,
                from: 'center',
            },
            ease: 'expo.out',
            scrollTrigger: {
                trigger: ref.current,
                start: 'top 85%',
                once: true,
            },
        });

        return () => killTriggers(ref.current);
    }, []);

    return ref;
};

export const useFlipReveal = (options?: { duration?: number; stagger?: number }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const targets = getTargets(ref.current);

        if (prefersReducedMotion()) {
            gsap.set(targets, { opacity: 1, rotateX: 0, y: 0, filter: 'blur(0px)' });
            return;
        }

        gsap.set(targets, {
            opacity: 0,
            rotateX: -20,
            y: 60,
            filter: 'blur(6px)',
            transformPerspective: 1000,
            transformOrigin: 'center bottom',
            willChange: 'transform, opacity, filter',
        });

        gsap.to(targets, {
            opacity: 1,
            rotateX: 0,
            y: 0,
            filter: 'blur(0px)',
            duration: options?.duration ?? 0.8,
            stagger: options?.stagger ?? 0.1,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: ref.current,
                start: 'top 85%',
                once: true,
            },
        });

        return () => killTriggers(ref.current);
    }, []);

    return ref;
};

export const useCharReveal = (options?: { duration?: number; stagger?: number; start?: string }) => {
    const ref = useRef<HTMLElement>(null);
    const savedHTML = useRef<string>('');

    useEffect(() => {
        if (!ref.current) return;

        const el = ref.current;
        savedHTML.current = el.innerHTML;

        if (prefersReducedMotion()) {
            el.style.opacity = '1';
            return;
        }

        const originalHTML = el.innerHTML;

        el.innerHTML = '';
        el.style.opacity = '1';

        const chars: HTMLSpanElement[] = [];

        const processNode = (node: Node, parent: HTMLElement) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent || '';
                for (let i = 0; i < text.length; i++) {
                    const span = document.createElement('span');
                    span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
                    span.style.display = 'inline-block';
                    span.style.opacity = '0';
                    span.style.transform = 'translateY(30px) rotateX(-40deg)';
                    span.style.filter = 'blur(4px)';
                    span.style.willChange = 'transform, opacity, filter';
                    if (text[i] === ' ') {
                        span.style.width = '0.3em';
                    }
                    parent.appendChild(span);
                    chars.push(span);
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const clone = (node as HTMLElement).cloneNode(false) as HTMLElement;
                parent.appendChild(clone);
                node.childNodes.forEach(child => processNode(child, clone));
            }
        };

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = originalHTML;
        tempDiv.childNodes.forEach(child => processNode(child, el));

        if (chars.length === 0) return;

        gsap.to(chars, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            filter: 'blur(0px)',
            duration: options?.duration ?? 0.8,
            stagger: options?.stagger ?? 0.02,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: el,
                start: options?.start ?? 'top 85%',
                once: true,
            },
        });

        return () => {
            killTriggers(el);
            if (savedHTML.current && el) {
                el.innerHTML = savedHTML.current;
            }
        };
    }, []);

    return ref;
};

export const useDirectionalReveal = (options?: { duration?: number; stagger?: number; distance?: number }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const children = ref.current.querySelectorAll('[data-reveal]');
        const targets = children.length > 0 ? Array.from(children) : [ref.current];

        if (prefersReducedMotion()) {
            gsap.set(targets, { opacity: 1, x: 0, y: 0, filter: 'blur(0px)' });
            return;
        }

        const dist = options?.distance ?? 60;
        targets.forEach((el, i) => {
            const fromLeft = i % 2 === 0;
            gsap.set(el, {
                opacity: 0,
                x: fromLeft ? -dist : dist,
                y: 16,
                rotate: fromLeft ? -1.5 : 1.5,
                filter: 'blur(6px)',
                willChange: 'transform, opacity, filter',
            });
        });

        targets.forEach((el, i) => {
            gsap.to(el, {
                opacity: 1,
                x: 0,
                y: 0,
                rotate: 0,
                filter: 'blur(0px)',
                duration: options?.duration ?? 0.8,
                delay: i * (options?.stagger ?? 0.12),
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: ref.current,
                    start: 'top 82%',
                    once: true,
                },
            });
        });

        return () => killTriggers(ref.current);
    }, []);

    return ref;
};

export const useClipReveal = (direction: 'up' | 'down' | 'left' | 'right' = 'up', options?: { duration?: number; stagger?: number }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const targets = getTargets(ref.current);

        if (prefersReducedMotion()) {
            gsap.set(targets, { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' });
            return;
        }

        const clipStart =
            direction === 'up' ? 'inset(100% 0% 0% 0%)' :
            direction === 'down' ? 'inset(0% 0% 100% 0%)' :
            direction === 'left' ? 'inset(0% 100% 0% 0%)' :
            'inset(0% 0% 0% 100%)';

        gsap.set(targets, {
            opacity: 0,
            clipPath: clipStart,
            willChange: 'clip-path, opacity',
        });

        gsap.to(targets, {
            opacity: 1,
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: options?.duration ?? 0.8,
            stagger: options?.stagger ?? 0.1,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: ref.current,
                start: 'top 82%',
                once: true,
            },
        });

        return () => killTriggers(ref.current);
    }, []);

    return ref;
};

export const useRotateReveal = (options?: { duration?: number; stagger?: number }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const targets = getTargets(ref.current);

        if (prefersReducedMotion()) {
            gsap.set(targets, { opacity: 1, rotate: 0, y: 0, scale: 1, filter: 'blur(0px)' });
            return;
        }

        gsap.set(targets, {
            opacity: 0,
            rotate: -1.5,
            y: 40,
            scale: 0.96,
            filter: 'blur(6px)',
            transformOrigin: 'left bottom',
            willChange: 'transform, opacity, filter',
        });

        gsap.to(targets, {
            opacity: 1,
            rotate: 0,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: options?.duration ?? 0.8,
            stagger: options?.stagger ?? 0.1,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: ref.current,
                start: 'top 82%',
                once: true,
            },
        });

        return () => killTriggers(ref.current);
    }, []);

    return ref;
};

export const useScrubReveal = (options?: { 
    y?: number;
    scale?: number;
    blur?: number;
    rotate?: number;
    start?: string;
    end?: string;
}) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const targets = getTargets(ref.current);

        if (prefersReducedMotion()) {
            gsap.set(targets, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', rotate: 0 });
            return;
        }

        gsap.set(targets, {
            opacity: 0,
            y: options?.y ?? 50,
            scale: options?.scale ?? 0.95,
            filter: `blur(${options?.blur ?? 8}px)`,
            rotate: options?.rotate ?? 0,
            willChange: 'transform, opacity, filter',
        });

        gsap.to(targets, {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            rotate: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: ref.current,
                start: options?.start ?? 'top 95%',
                end: options?.end ?? 'top 35%',
                scrub: 1.5,
            },
        });

        return () => killTriggers(ref.current);
    }, []);

    return ref;
};

export const useWordReveal = (options?: { stagger?: number; start?: string }) => {
    const ref = useRef<HTMLElement>(null);
    const originalHTML = useRef<string>('');

    useEffect(() => {
        if (!ref.current) return;
        const el = ref.current;
        originalHTML.current = el.innerHTML;

        if (prefersReducedMotion()) {
            el.style.opacity = '1';
            return;
        }

        const text = el.textContent || '';
        const words = text.split(/\s+/).filter(Boolean);
        el.innerHTML = '';
        el.style.opacity = '1';

        const spans: HTMLSpanElement[] = [];
        words.forEach((word, i) => {
            const wrapper = document.createElement('span');
            wrapper.style.display = 'inline-block';
            wrapper.style.overflow = 'hidden';
            wrapper.style.verticalAlign = 'top';

            const inner = document.createElement('span');
            inner.textContent = word;
            inner.style.display = 'inline-block';
            inner.style.opacity = '0';
            inner.style.transform = 'translateY(110%)';
            inner.style.filter = 'blur(4px)';
            inner.style.willChange = 'transform, opacity, filter';

            wrapper.appendChild(inner);
            el.appendChild(wrapper);
            spans.push(inner);

            if (i < words.length - 1) {
                el.appendChild(document.createTextNode(' '));
            }
        });

        gsap.to(spans, {
            opacity: 1,
            y: '0%',
            filter: 'blur(0px)',
            duration: 0.8,
            stagger: options?.stagger ?? 0.04,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: el,
                start: options?.start ?? 'top 85%',
                once: true,
            },
        });

        return () => {
            killTriggers(el);
            if (originalHTML.current && el) {
                el.innerHTML = originalHTML.current;
            }
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
