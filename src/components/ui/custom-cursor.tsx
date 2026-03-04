import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const CustomCursor = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const followerRef = useRef<HTMLDivElement>(null);
    const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

    useEffect(() => {
        if (isTouch || !cursorRef.current || !followerRef.current) return;

        const cursor = cursorRef.current;
        const follower = followerRef.current;
        let mouseX = -100;
        let mouseY = -100;

        const moveCursor = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.15, ease: 'power2.out' });
            gsap.to(follower, { x: mouseX, y: mouseY, duration: 0.5, ease: 'power3.out' });
        };

        const handleEnter = () => {
            gsap.to(cursor, { scale: 0.5, opacity: 0.5, duration: 0.3 });
            gsap.to(follower, { scale: 1.8, opacity: 0.15, duration: 0.3 });
        };

        const handleLeave = () => {
            gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3 });
            gsap.to(follower, { scale: 1, opacity: 0.08, duration: 0.3 });
        };

        const handleHide = () => {
            gsap.to(cursor, { opacity: 0, duration: 0.2 });
            gsap.to(follower, { opacity: 0, duration: 0.2 });
        };

        const handleShow = () => {
            gsap.to(cursor, { opacity: 1, duration: 0.2 });
            gsap.to(follower, { opacity: 0.08, duration: 0.2 });
        };

        window.addEventListener('mousemove', moveCursor);
        document.addEventListener('mouseleave', handleHide);
        document.addEventListener('mouseenter', handleShow);

        const interactiveElements = document.querySelectorAll('a, button, [data-cursor-hover]');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', handleEnter);
            el.addEventListener('mouseleave', handleLeave);
        });

        const observer = new MutationObserver(() => {
            const newElements = document.querySelectorAll('a, button, [data-cursor-hover]');
            newElements.forEach(el => {
                el.removeEventListener('mouseenter', handleEnter);
                el.removeEventListener('mouseleave', handleLeave);
                el.addEventListener('mouseenter', handleEnter);
                el.addEventListener('mouseleave', handleLeave);
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.removeEventListener('mouseleave', handleHide);
            document.removeEventListener('mouseenter', handleShow);
            interactiveElements.forEach(el => {
                el.removeEventListener('mouseenter', handleEnter);
                el.removeEventListener('mouseleave', handleLeave);
            });
            observer.disconnect();
        };
    }, [isTouch]);

    if (isTouch) return null;

    return (
        <>
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-[#10B981] pointer-events-none z-[9999] mix-blend-difference"
                style={{ willChange: 'transform' }}
            />
            <div
                ref={followerRef}
                className="fixed top-0 left-0 w-10 h-10 -ml-5 -mt-5 rounded-full border border-[#10B981]/30 pointer-events-none z-[9998] opacity-[0.08]"
                style={{ willChange: 'transform' }}
            />
        </>
    );
};
