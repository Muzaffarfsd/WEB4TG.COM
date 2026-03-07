'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader = ({ onComplete }: PreloaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setVisible(false);
      onComplete?.();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setVisible(false);
        onComplete?.();
      },
    });

    const chars = textRef.current?.querySelectorAll('.preloader-char');

    gsap.set(logoRef.current, { opacity: 0, scale: 0.8 });
    if (chars) gsap.set(chars, { opacity: 0, y: 20, rotateX: -90 });

    tl.to(logoRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: 'power3.out',
    })
      .to(
        chars || [],
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.5,
          stagger: 0.03,
          ease: 'power3.out',
        },
        '-=0.2'
      )
      .to({}, { duration: 0.4 })
      .to(containerRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
      });

    return () => {
      tl.kill();
    };
  }, []);

  if (!visible) return null;

  const text = 'WEB4TG STUDIO';

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505]"
    >
      <div ref={logoRef} className="mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" fillOpacity="0.9" />
            <path d="M2 17L12 22L22 17" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="white" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div ref={textRef} className="flex" style={{ perspective: '400px' }}>
        {text.split('').map((char, i) => (
          <span
            key={i}
            className="preloader-char text-white/90 text-sm font-semibold tracking-[0.2em] font-sans"
            style={{
              display: 'inline-block',
              minWidth: char === ' ' ? '0.5em' : undefined,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>
    </div>
  );
};
