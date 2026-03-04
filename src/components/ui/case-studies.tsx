import { useScrollReveal } from '../../hooks/use-animations';
import { useEffect, useRef, useState, useCallback } from 'react';

const caseStudies = [
  {
    num: '01',
    category: 'E-commerce',
    title: 'Flowershop.tg',
    description: 'Магазин цветов с каталогом, корзиной и доставкой по Москве',
    metrics: ['Конверсия +40%', 'Запуск за 10 дней'],
  },
  {
    num: '02',
    category: 'Фитнес',
    title: 'FitLife App',
    description: 'Приложение для фитнес-студии: абонементы, расписание, онлайн-запись',
    metrics: ['Записи +65%', 'Отток −30%'],
  },
  {
    num: '03',
    category: 'Доставка',
    title: 'DeliveryBot',
    description: 'Сервис доставки еды с трекингом, оплатой и AI-поддержкой',
    metrics: ['Заказы +120%', 'NPS 92'],
  },
];

function AnimatedMetric({ text, animate }: { text: string; animate: boolean }) {
  const match = text.match(/([+−\-]?)(\d+)(%?)/);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!animate || !match) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const target = parseInt(match[2], 10);
    if (prefersReduced) { setCount(target); return; }
    const duration = 1200;
    const startTime = performance.now();

    let raf: number;
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [animate]);

  if (!match) return <>{text}</>;

  const prefix = text.slice(0, match.index);
  const sign = match[1];
  const percent = match[3];
  const suffix = text.slice((match.index ?? 0) + match[0].length);

  return (
    <>
      {prefix}{sign}{animate ? count : match[2]}{percent}{suffix}
    </>
  );
}

export default function CaseStudies() {
  const sectionRef = useScrollReveal({ stagger: 0.15 });
  const cardsRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setVisible(true);
      }
    });
  }, []);

  useEffect(() => {
    const el = cardsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(observerCallback, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [observerCallback]);

  return (
    <section ref={sectionRef} className="py-20 sm:py-28 md:py-36 px-5 sm:px-8 relative">
      <div className="max-w-6xl mx-auto">
        <div data-reveal>
          <div className="section-label">
            <span className="w-8 h-px bg-[#8B5CF6]/40 mr-3" />
            Кейсы
          </div>
          <h2
            className="font-instrument-serif gradient-text-white leading-[1.1] mb-12 sm:mb-16"
            style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3.5rem)' }}
          >
            Реальные <em className="gradient-text italic">результаты</em>
          </h2>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {caseStudies.map((study) => (
            <div
              key={study.num}
              data-reveal
              className="glow-card rounded-2xl p-6 sm:p-7 relative flex flex-col group transition-all duration-300 hover:border-[#8B5CF6]/30"
              style={{
                backgroundClip: 'padding-box',
              }}
            >
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(139,92,246,0.02))',
                }}
              />
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  boxShadow: '0 0 30px rgba(139,92,246,0.08), inset 0 0 30px rgba(139,92,246,0.03)',
                }}
              />

              <span className="absolute top-5 right-6 text-[13px] font-instrument-serif text-white/15 select-none">
                {study.num}
              </span>

              <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8B5CF6] mb-4 relative z-10">
                {study.category}
              </span>

              <h3 className="font-instrument-serif text-xl sm:text-2xl text-white mb-2 relative z-10">
                {study.title}
              </h3>

              <p className="text-[13px] sm:text-[14px] text-white/50 leading-relaxed mb-6 flex-1 relative z-10">
                {study.description}
              </p>

              <div className="flex flex-wrap gap-2 relative z-10">
                {study.metrics.map((metric) => (
                  <span
                    key={metric}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-[12px] sm:text-[13px] font-medium bg-[#8B5CF6]/10 text-[#A78BFA] border border-[#8B5CF6]/15 transition-all duration-300 group-hover:scale-105 group-hover:bg-[#8B5CF6]/15 group-hover:border-[#8B5CF6]/25 group-hover:shadow-[0_0_12px_rgba(139,92,246,0.15)]"
                  >
                    <AnimatedMetric text={metric} animate={visible} />
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
