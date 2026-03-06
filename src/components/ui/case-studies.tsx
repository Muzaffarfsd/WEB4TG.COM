import { useRef, useState, useEffect } from 'react';
import { useScrollReveal } from '../../hooks/use-animations';
import { ShoppingBag, Dumbbell, Truck } from 'lucide-react';
import gsap from 'gsap';

const caseStudies = [
  {
    num: '01',
    category: 'E-commerce',
    title: 'Flowershop.tg',
    description: 'Магазин цветов с каталогом, корзиной и доставкой по Москве',
    metrics: ['Конверсия +40%', 'Запуск за 10 дней'],
    roiMetrics: [
      { label: 'Рост выручки', value: '+320%', sublabel: 'за 3 месяца' },
      { label: 'Средний чек', value: '+25%', sublabel: '₽4 200 → ₽5 250' },
      { label: 'ROI', value: '780%', sublabel: 'за первый квартал' },
    ],
    icon: ShoppingBag,
    gradient: 'from-[#8B5CF6]/20 via-[#A78BFA]/10 to-transparent',
    accentColor: '#A78BFA',
    techStack: ['React', 'Stripe', 'YooKassa'],
    mockupColors: ['#8B5CF6', '#A78BFA', '#C4B5FD'],
  },
  {
    num: '02',
    category: 'Фитнес',
    title: 'FitLife App',
    description: 'Приложение для фитнес-студии: абонементы, расписание, онлайн-запись',
    metrics: ['Записи +65%', 'Отток −30%'],
    roiMetrics: [
      { label: 'Онлайн-записи', value: '+65%', sublabel: 'vs оффлайн' },
      { label: 'Удержание', value: '+30%', sublabel: 'отток снижен' },
      { label: 'Экономия', value: '15ч', sublabel: 'в неделю на админ' },
    ],
    icon: Dumbbell,
    gradient: 'from-emerald-500/20 via-emerald-400/10 to-transparent',
    accentColor: '#34D399',
    techStack: ['React', 'Calendar API', 'Push'],
    mockupColors: ['#059669', '#34D399', '#6EE7B7'],
  },
  {
    num: '03',
    category: 'Доставка',
    title: 'DeliveryBot',
    description: 'Сервис доставки еды с трекингом, оплатой и AI-поддержкой',
    metrics: ['Заказы +120%', 'NPS 92'],
    roiMetrics: [
      { label: 'Заказы/день', value: '+120%', sublabel: '80 → 176' },
      { label: 'Время доставки', value: '−18%', sublabel: 'AI-маршруты' },
      { label: 'NPS', value: '92', sublabel: 'из 100' },
    ],
    icon: Truck,
    gradient: 'from-amber-500/20 via-amber-400/10 to-transparent',
    accentColor: '#FBBF24',
    techStack: ['React', 'Maps API', 'AI Chat'],
    mockupColors: ['#D97706', '#FBBF24', '#FDE68A'],
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

function PhoneMockup({ colors }: { colors: string[] }) {
  return (
    <div className="relative w-full aspect-[9/16] max-w-[120px] mx-auto">
      <div className="absolute inset-0 rounded-[16px] border border-white/10 bg-[#0a0a0a] overflow-hidden shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-5 bg-[#0a0a0a] z-10 flex items-center justify-center">
          <div className="w-8 h-2 rounded-full bg-white/10" />
        </div>
        <div className="absolute inset-0 top-5 p-2 flex flex-col gap-1.5">
          <div className="h-3 rounded-full w-3/4" style={{ background: colors[0], opacity: 0.6 }} />
          <div className="h-2 rounded-full w-1/2" style={{ background: colors[1], opacity: 0.3 }} />
          <div className="flex-1 mt-2 rounded-lg" style={{ background: `linear-gradient(135deg, ${colors[0]}15, ${colors[1]}10)` }}>
            <div className="grid grid-cols-2 gap-1 p-1.5">
              {[0,1,2,3].map(i => (
                <div key={i} className="aspect-square rounded-md" style={{ background: `linear-gradient(135deg, ${colors[i % 3]}20, ${colors[(i+1) % 3]}10)` }} />
              ))}
            </div>
          </div>
          <div className="h-6 rounded-lg mt-auto" style={{ background: colors[0], opacity: 0.8 }} />
        </div>
      </div>
    </div>
  );
}

function TiltCard({ children, study }: { children: React.ReactNode; study: typeof caseStudies[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(card, {
      rotateY: x * 8,
      rotateX: -y * 8,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)',
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="glow-card rounded-2xl relative flex flex-col group transition-colors duration-300 hover:border-white/10 overflow-hidden"
      style={{ perspective: '800px', transformStyle: 'preserve-3d' }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${study.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none blur-[60px]"
        style={{ background: study.accentColor }}
      />

      {children}
    </div>
  );
}

export default function CaseStudies() {
  const sectionRef = useScrollReveal({ stagger: 0.15 });
  const [visible, setVisible] = useState(false);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardsContainerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0]?.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 sm:py-28 md:py-36 px-5 sm:px-8 relative">
      <div className="max-w-6xl mx-auto">
        <div data-reveal>
          <div className="section-label">
            <span className="w-8 h-px bg-[var(--accent)]/40 mr-3" />
            Кейсы
          </div>
          <h2
            className="font-instrument-serif gradient-text-white leading-[1.1] mb-4 sm:mb-5"
            style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3.5rem)' }}
          >
            Реальные <em className="gradient-text italic">результаты</em>
          </h2>
          <p className="text-[13px] sm:text-[14px] text-white/70 max-w-lg leading-relaxed mb-12 sm:mb-16">
            Каждый проект — это рост метрик клиента. Вот несколько примеров из нашего портфолио.
          </p>
        </div>

        <div ref={cardsContainerRef} className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {caseStudies.map((study) => (
            <TiltCard key={study.num} study={study}>
              <div className="p-6 sm:p-7 flex flex-col h-full relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/[0.06]"
                      style={{ background: `${study.accentColor}15` }}
                    >
                      <study.icon className="w-5 h-5" style={{ color: study.accentColor }} />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.15em] block" style={{ color: study.accentColor }}>
                        {study.category}
                      </span>
                      <h3 className="font-instrument-serif text-lg text-white leading-tight">
                        {study.title}
                      </h3>
                    </div>
                  </div>
                  <span className="text-[40px] font-instrument-serif text-white/[0.04] leading-none select-none">
                    {study.num}
                  </span>
                </div>

                <div className="mb-6 relative">
                  <PhoneMockup colors={study.mockupColors} />
                </div>

                <p className="text-[13px] text-white/70 leading-relaxed mb-5 flex-1">
                  {study.description}
                </p>

                <div className="grid grid-cols-3 gap-2 mb-5 p-3 rounded-xl border border-white/[0.04] bg-white/[0.02]">
                  {study.roiMetrics.map((roi) => (
                    <div key={roi.label} className="text-center">
                      <div className="text-[15px] sm:text-[16px] font-bold leading-tight" style={{ color: study.accentColor }}>
                        <AnimatedMetric text={roi.value} animate={visible} />
                      </div>
                      <div className="text-[10px] text-white/70 font-medium mt-0.5 leading-tight">{roi.label}</div>
                      <div className="text-[9px] text-white/60 mt-0.5 leading-tight">{roi.sublabel}</div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {study.techStack.map(tech => (
                    <span key={tech} className="text-[10px] px-2 py-0.5 rounded-full border border-white/[0.06] text-white/60 font-medium">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {study.metrics.map((metric) => (
                    <span
                      key={metric}
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-[12px] sm:text-[13px] font-semibold transition-all duration-300 group-hover:scale-105"
                      style={{
                        background: `${study.accentColor}15`,
                        color: study.accentColor,
                        border: `1px solid ${study.accentColor}25`,
                      }}
                    >
                      <AnimatedMetric text={metric} animate={visible} />
                    </span>
                  ))}
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
