import { useRef, useState, useEffect } from 'react';
import { useScrollReveal } from '../../hooks/use-animations';

const companies = [
  'Flowershop.tg',
  'FitLife',
  'DeliveryBot',
  'YumYum',
  'TicketPro',
  'MedLink',
  'StyleBox',
  'EduPlatform',
];

const LogoPill = ({ name }: { name: string }) => (
  <span className="inline-flex items-center px-5 py-2 rounded-full border border-white/[0.06] bg-white/[0.03] text-white/40 text-[13px] font-medium whitespace-nowrap select-none">
    {name}
  </span>
);

const MarqueeRow = ({ reverse, paused }: { reverse?: boolean; paused: boolean }) => {
  const items = [...companies, ...companies];
  return (
    <div className="relative overflow-hidden">
      <div
        className="flex gap-4 w-max"
        style={{
          animation: `marquee ${reverse ? '35s' : '30s'} linear infinite${reverse ? ' reverse' : ''}`,
          animationPlayState: paused ? 'paused' : 'running',
        }}
      >
        {items.map((name, i) => (
          <LogoPill key={`${name}-${i}`} name={name} />
        ))}
        {items.map((name, i) => (
          <LogoPill key={`${name}-dup-${i}`} name={name} />
        ))}
      </div>
    </div>
  );
};

export default function ClientLogos() {
  const sectionRef = useScrollReveal();
  const observerRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setPaused(!e.isIntersecting), { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-16 sm:py-20 px-5 sm:px-8 overflow-hidden">
      <div ref={observerRef} className="max-w-6xl mx-auto">
        <div data-reveal className="text-center mb-10 sm:mb-12">
          <span className="section-label justify-center">
            <span className="w-8 h-px bg-[#8B5CF6]/40 mr-3" />
            Клиенты
            <span className="w-8 h-px bg-[#8B5CF6]/40 ml-3" />
          </span>
          <h2 className="text-[clamp(1.75rem,4.5vw,3.5rem)] font-normal font-instrument-serif gradient-text-white tracking-[-0.02em] leading-[1.1]">
            Нам
            <br />
            <span className="italic gradient-text">доверяют</span>
          </h2>
        </div>

        <div data-reveal className="relative flex flex-col gap-4">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-24 z-10 bg-gradient-to-r from-[#050505] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-24 z-10 bg-gradient-to-l from-[#050505] to-transparent" />

          <MarqueeRow paused={paused} />
          <MarqueeRow reverse paused={paused} />
        </div>
      </div>
    </section>
  );
}
