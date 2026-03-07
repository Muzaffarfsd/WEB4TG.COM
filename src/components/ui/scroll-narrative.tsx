'use client';

import { useEffect, useRef, useState } from 'react';

const SECTION_COUNT = 16;

export const ScrollNarrative = () => {
  const lineRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let ticking = false;
    let showTimeout: ReturnType<typeof setTimeout>;

    showTimeout = setTimeout(() => setVisible(true), 1500);

    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;

      if (lineRef.current) {
        lineRef.current.style.height = `${progress * 100}%`;
      }

      if (glowRef.current) {
        const viewportY = progress * 100;
        glowRef.current.style.top = `${viewportY}%`;
      }

      nodesRef.current.forEach((node, i) => {
        if (!node) return;
        const nodeProgress = (i + 1) / (SECTION_COUNT + 1);
        const dist = Math.abs(progress - nodeProgress);
        const active = dist < 0.03;
        const near = dist < 0.08;

        if (active) {
          node.style.transform = 'translateX(-50%) scale(1.8)';
          node.style.opacity = '1';
          node.style.boxShadow = '0 0 20px 4px rgba(139, 92, 246, 0.6)';
        } else if (near) {
          const scale = 1 + (1 - dist / 0.08) * 0.5;
          node.style.transform = `translateX(-50%) scale(${scale})`;
          node.style.opacity = '0.8';
          node.style.boxShadow = '0 0 10px 2px rgba(139, 92, 246, 0.3)';
        } else if (progress > nodeProgress) {
          node.style.transform = 'translateX(-50%) scale(1)';
          node.style.opacity = '0.6';
          node.style.boxShadow = '0 0 6px 1px rgba(139, 92, 246, 0.2)';
        } else {
          node.style.transform = 'translateX(-50%) scale(0.7)';
          node.style.opacity = '0.2';
          node.style.boxShadow = 'none';
        }
      });

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(showTimeout);
    };
  }, []);

  return (
    <div
      className="scroll-narrative-container"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease' }}
      aria-hidden="true"
    >
      <div className="scroll-narrative-track">
        <div ref={lineRef} className="scroll-narrative-line" />
        <div ref={glowRef} className="scroll-narrative-glow" />
        {Array.from({ length: SECTION_COUNT }).map((_, i) => (
          <div
            key={i}
            ref={el => { nodesRef.current[i] = el; }}
            className="scroll-narrative-node"
            style={{ top: `${((i + 1) / (SECTION_COUNT + 1)) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
};
