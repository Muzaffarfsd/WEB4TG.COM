import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Check, X, Minus, ChevronLeft, ChevronRight, Play, Pause, Crown, Trophy } from 'lucide-react';
import { useScrollReveal } from '../../hooks/use-animations';

type Status = 'good' | 'neutral' | 'bad';

interface Competitor {
  name: string;
  icon: string;
  score: number;
}

interface Slide {
  criterion: string;
  subtitle: string;
  icon: string;
  web4tg: { text: string; status: Status; detail: string; score: number };
  competitors: [
    { text: string; status: Status; score: number },
    { text: string; status: Status; score: number },
    { text: string; status: Status; score: number },
  ];
}

const competitors: Competitor[] = [
  { name: 'Фрилансер', icon: '👤', score: 0 },
  { name: 'No-code', icon: '🧩', score: 0 },
  { name: 'Другие студии', icon: '🏢', score: 0 },
];

const slides: Slide[] = [
  {
    criterion: 'Скорость запуска',
    subtitle: 'От идеи до рабочего продукта',
    icon: '⚡',
    web4tg: { text: '7–14 дней', status: 'good', detail: 'Отлаженный процесс, готовые модули, параллельная разработка', score: 85 },
    competitors: [
      { text: '14–60 дней', status: 'neutral', score: 45 },
      { text: '1–3 дня', status: 'good', score: 95 },
      { text: '30–90 дней', status: 'bad', score: 20 },
    ],
  },
  {
    criterion: 'Качество дизайна',
    subtitle: 'Визуальное впечатление и UX',
    icon: '🎨',
    web4tg: { text: 'Premium', status: 'good', detail: 'Уникальный дизайн под бренд, анимации, micro-interactions', score: 98 },
    competitors: [
      { text: 'Средний', status: 'neutral', score: 50 },
      { text: 'Шаблонный', status: 'bad', score: 30 },
      { text: 'Высокий', status: 'good', score: 75 },
    ],
  },
  {
    criterion: 'Telegram-интеграция',
    subtitle: 'Глубина работы с платформой',
    icon: '🔗',
    web4tg: { text: 'Нативная', status: 'good', detail: 'Mini Apps API, Telegram Payments, бот-оркестрация, WebApp Bridge', score: 97 },
    competitors: [
      { text: 'Базовая', status: 'neutral', score: 40 },
      { text: 'Ограниченная', status: 'bad', score: 20 },
      { text: 'Базовая', status: 'neutral', score: 45 },
    ],
  },
  {
    criterion: 'Поддержка 24/7',
    subtitle: 'Когда что-то идёт не так',
    icon: '🛡️',
    web4tg: { text: 'Круглосуточно', status: 'good', detail: 'Выделенный менеджер, SLA < 1 час, мониторинг и алерты', score: 95 },
    competitors: [
      { text: 'Нет', status: 'bad', score: 10 },
      { text: 'Нет', status: 'bad', score: 5 },
      { text: 'Иногда', status: 'neutral', score: 40 },
    ],
  },
  {
    criterion: 'Масштабируемость',
    subtitle: 'Рост без ограничений',
    icon: '📈',
    web4tg: { text: 'Безлимит', status: 'good', detail: 'Микросервисная архитектура, автоскейлинг, CDN, кэширование', score: 96 },
    competitors: [
      { text: 'Ограничена', status: 'neutral', score: 35 },
      { text: 'Ограничена', status: 'bad', score: 25 },
      { text: 'Да', status: 'good', score: 70 },
    ],
  },
  {
    criterion: 'Стоимость / Качество',
    subtitle: 'Баланс цены и результата',
    icon: '💎',
    web4tg: { text: 'Оптимальная', status: 'good', detail: 'Прозрачное ценообразование, фиксированная стоимость, без скрытых платежей', score: 90 },
    competitors: [
      { text: 'Дёшево', status: 'good', score: 80 },
      { text: 'Дёшево', status: 'good', score: 85 },
      { text: 'Дорого', status: 'bad', score: 30 },
    ],
  },
];

const AUTOPLAY_INTERVAL = 5500;
const PAUSE_AFTER_INTERACTION = 10000;

function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return prefersReduced;
}

function ScoreBar({ score, status, animate }: { score: number; status: Status; animate: boolean }) {
  const barColor = status === 'good'
    ? 'linear-gradient(90deg, rgba(139,92,246,0.6), rgba(167,139,250,0.8))'
    : status === 'neutral'
      ? 'linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0.25))'
      : 'linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.1))';
  return (
    <div className="w-full h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{
          width: animate ? `${score}%` : '0%',
          background: barColor,
          transitionDelay: '200ms',
        }}
      />
    </div>
  );
}

function CompetitorCard({ name, icon, text, status, score, animate, delay }: {
  name: string; icon: string; text: string; status: Status; score: number; animate: boolean; delay: number;
}) {
  const textClass = status === 'good' ? 'text-[#C4B5FD]' : status === 'neutral' ? 'text-white/40' : 'text-white/25';
  const iconEl = status === 'good'
    ? <Check className="w-3 h-3 text-[#A78BFA]" />
    : status === 'neutral'
      ? <Minus className="w-3 h-3 text-white/30" />
      : <X className="w-3 h-3 text-white/20" />;

  return (
    <div
      className="relative px-4 py-3.5 rounded-xl border border-white/[0.06] bg-white/[0.015] backdrop-blur-sm transition-all duration-700 ease-out"
      style={{
        opacity: animate ? 1 : 0,
        transform: animate ? 'translateX(0)' : 'translateX(-20px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <span className="text-lg" aria-hidden="true">{icon}</span>
          <span className="text-white/40 text-xs font-medium">{name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {iconEl}
          <span className={`text-xs font-medium ${textClass}`}>{text}</span>
        </div>
      </div>
      <ScoreBar score={score} status={status} animate={animate} />
      <div className="absolute right-4 bottom-3.5 text-[10px] text-white/15 font-mono">{score}%</div>
    </div>
  );
}

export default function ComparisonTable() {
  const sectionRef = useScrollReveal();
  const reducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState(1);
  const [slideReady, setSlideReady] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const effectivePlaying = isPlaying && !isHovered && !reducedMotion;

  const goTo = useCallback((idx: number, dir: number) => {
    setSlideReady(false);
    setDirection(dir);
    setActive(idx);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setSlideReady(true));
    });
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => setSlideReady(true));
  }, []);

  const next = useCallback(() => {
    goTo((active + 1) % slides.length, 1);
  }, [active, goTo]);

  const prev = useCallback(() => {
    goTo((active - 1 + slides.length) % slides.length, -1);
  }, [active, goTo]);

  const handleUserNav = useCallback((action: () => void) => {
    setIsPlaying(false);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    action();
    pauseTimerRef.current = setTimeout(() => setIsPlaying(true), PAUSE_AFTER_INTERACTION);
  }, []);

  useEffect(() => {
    if (!effectivePlaying) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }
    timerRef.current = setTimeout(next, AUTOPLAY_INTERVAL);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [active, effectivePlaying, next]);

  useEffect(() => {
    return () => { if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current); };
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); handleUserNav(next); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); handleUserNav(prev); }
    };
    el.addEventListener('keydown', handleKey);
    return () => el.removeEventListener('keydown', handleKey);
  }, [next, prev, handleUserNav]);

  useEffect(() => {
    if (reducedMotion || !heroRef.current) return;
    const el = heroRef.current;
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale3d(1.02, 1.02, 1.02)`;
    };
    const handleLeave = () => {
      el.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
    };
    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [reducedMotion, active]);

  const wins = useMemo(() => {
    let w = 0;
    slides.forEach(s => {
      const maxComp = Math.max(...s.competitors.map(c => c.score));
      if (s.web4tg.score >= maxComp) w++;
    });
    return w;
  }, []);

  const slide = slides[active];
  const slideNumber = String(active + 1).padStart(2, '0');
  const totalSlides = String(slides.length).padStart(2, '0');

  return (
    <section className="py-20 sm:py-28 md:py-36 px-5 sm:px-8" ref={sectionRef} id="comparison">
      <div className="max-w-6xl mx-auto">
        <div className="mb-14 sm:mb-20 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6" data-reveal>
          <div>
            <div className="section-label">
              <span className="w-8 h-px bg-[#8B5CF6]/40 mr-3" />
              Сравнение
            </div>
            <h2
              className="font-instrument-serif gradient-text-white leading-[1.1]"
              style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3.5rem)' }}
            >
              Почему
              <br />
              <span className="italic gradient-text">мы?</span>
            </h2>
          </div>

          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#8B5CF6]/[0.06] border border-[#8B5CF6]/15">
            <Trophy className="w-4 h-4 text-[#A78BFA]" />
            <span className="text-[#C4B5FD] text-sm font-medium">
              Лидер в <span className="text-white font-semibold">{wins}</span> из {slides.length} категорий
            </span>
          </div>
        </div>

        <div
          className="relative"
          data-reveal
          ref={carouselRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Сравнение WEB4TG с конкурентами"
          tabIndex={0}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={(e) => {
            if (!carouselRef.current?.contains(e.relatedTarget as Node)) setIsHovered(false);
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleUserNav(() => goTo(i, i > active ? 1 : -1))}
                    className={`transition-all duration-500 rounded-full ${
                      i === active
                        ? 'w-8 h-2 bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA]'
                        : i < active
                          ? 'w-2 h-2 bg-[#8B5CF6]/40 hover:bg-[#8B5CF6]/60'
                          : 'w-2 h-2 bg-white/[0.1] hover:bg-white/[0.2]'
                    }`}
                    aria-label={`Слайд ${i + 1}: ${slides[i].criterion}`}
                  />
                ))}
              </div>
              <span className="text-white/30 font-mono text-xs tracking-wider">{slideNumber}/{totalSlides}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {!reducedMotion && (
                <button
                  onClick={() => {
                    setIsPlaying(!isPlaying);
                    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-white/[0.08] hover:border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/[0.06] transition-all focus-visible:outline-2 focus-visible:outline-[#8B5CF6]"
                  aria-label={isPlaying ? 'Остановить автоплей' : 'Запустить автоплей'}
                >
                  {isPlaying
                    ? <Pause className="w-3 h-3 text-white/50" />
                    : <Play className="w-3 h-3 text-white/50 ml-0.5" />
                  }
                </button>
              )}
              <button
                onClick={() => handleUserNav(prev)}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-white/[0.08] hover:border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/[0.06] transition-all focus-visible:outline-2 focus-visible:outline-[#8B5CF6]"
                aria-label="Предыдущий слайд"
              >
                <ChevronLeft className="w-4 h-4 text-white/50" />
              </button>
              <button
                onClick={() => handleUserNav(next)}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-white/[0.08] hover:border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/[0.06] transition-all focus-visible:outline-2 focus-visible:outline-[#8B5CF6]"
                aria-label="Следующий слайд"
              >
                <ChevronRight className="w-4 h-4 text-white/50" />
              </button>
            </div>
          </div>

          {effectivePlaying && (
            <div className="w-full h-px bg-white/[0.04] mb-6 overflow-hidden rounded-full">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6]/60 to-[#A78BFA]/60"
                key={active}
                style={{
                  animation: `comparisonProgress ${AUTOPLAY_INTERVAL}ms linear forwards`,
                }}
              />
            </div>
          )}

          <div
            className="relative overflow-hidden rounded-3xl border border-white/[0.04]"
            style={{ minHeight: '460px' }}
            role="group"
            aria-roledescription="slide"
            aria-label={`Слайд ${active + 1} из ${slides.length}: ${slide.criterion}`}
          >
            <div className="absolute inset-0" style={{
              background: 'radial-gradient(ellipse 100% 80% at 50% -10%, rgba(139,92,246,0.06) 0%, transparent 60%)',
            }} />
            <div className="absolute inset-0" style={{
              background: 'radial-gradient(circle at 80% 80%, rgba(139,92,246,0.03) 0%, transparent 40%)',
            }} />

            <div aria-live="polite" aria-atomic="true" className="sr-only">
              {slide.criterion}: WEB4TG — {slide.web4tg.text}
            </div>

            <div
              key={active}
              className={reducedMotion ? '' : 'comparison-slide-enter'}
              style={reducedMotion ? undefined : { '--slide-dir': direction } as React.CSSProperties}
            >
              <div className="text-center pt-10 pb-4 relative z-10 px-4">
                <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">
                  <span className="text-base" aria-hidden="true">{slide.icon}</span>
                  <span className="text-white/40 text-xs uppercase tracking-[0.15em] font-medium">{slide.subtitle}</span>
                </div>
                <h3
                  className="font-instrument-serif text-white leading-[1.1]"
                  style={{ fontSize: 'clamp(1.75rem, 5vw, 3.5rem)' }}
                >
                  {slide.criterion}
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 px-5 sm:px-8 lg:px-10 pb-10 pt-4 relative z-10">
                <div className="flex flex-col gap-3 order-2 lg:order-1">
                  <p className="text-white/25 text-[11px] uppercase tracking-[0.2em] font-medium mb-1 pl-1">Конкуренты</p>
                  {competitors.map((comp, i) => (
                    <CompetitorCard
                      key={comp.name}
                      name={comp.name}
                      icon={comp.icon}
                      text={slide.competitors[i].text}
                      status={slide.competitors[i].status}
                      score={slide.competitors[i].score}
                      animate={slideReady}
                      delay={200 + i * 120}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-center order-1 lg:order-2">
                  <div
                    ref={heroRef}
                    className="comparison-hero-card-v2 relative w-full max-w-sm rounded-2xl overflow-hidden"
                    style={{ transition: 'transform 0.15s ease-out' }}
                  >
                    <div className="comparison-glow-border" />

                    <div className="relative rounded-2xl overflow-hidden border border-[#8B5CF6]/20 bg-[#0a0a0f]">
                      <div className="absolute inset-0" style={{
                        background: 'linear-gradient(160deg, rgba(139,92,246,0.15) 0%, rgba(139,92,246,0.02) 40%, rgba(139,92,246,0.08) 100%)',
                      }} />
                      <div className="absolute inset-0" style={{
                        background: 'radial-gradient(circle at 20% 10%, rgba(139,92,246,0.2), transparent 50%)',
                      }} />

                      <div className="relative p-6 sm:p-8">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] flex items-center justify-center shadow-lg shadow-[#8B5CF6]/20">
                              <Crown className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <span className="text-[#C4B5FD] text-xs font-semibold tracking-wider block">WEB4TG</span>
                              <span className="text-white/30 text-[10px] tracking-wider">STUDIO</span>
                            </div>
                          </div>
                          <div className="px-2.5 py-1 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/25">
                            <span className="text-[#C4B5FD] text-[11px] font-semibold">ЛИДЕР</span>
                          </div>
                        </div>

                        <div className="text-center mb-5">
                          <div
                            className="font-instrument-serif text-white leading-none mb-2 transition-all duration-700"
                            style={{
                              fontSize: 'clamp(2rem, 5vw, 3rem)',
                              opacity: slideReady ? 1 : 0,
                              transform: slideReady ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(10px)',
                            }}
                          >
                            {slide.web4tg.text}
                          </div>
                          <div className="flex items-center justify-center gap-1.5 mb-4">
                            <Check className="w-4 h-4 text-[#A78BFA]" />
                            <span className="text-[#C4B5FD]/80 text-sm font-medium">Лучший выбор</span>
                          </div>
                        </div>

                        <div className="mb-5">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white/30 text-[11px] uppercase tracking-wider">Рейтинг</span>
                            <span
                              className="text-[#C4B5FD] text-sm font-bold font-mono transition-all duration-1000"
                              style={{ opacity: slideReady ? 1 : 0 }}
                            >
                              {slide.web4tg.score}%
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-1200 ease-out"
                              style={{
                                width: slideReady ? `${slide.web4tg.score}%` : '0%',
                                background: 'linear-gradient(90deg, #8B5CF6, #A78BFA, #C4B5FD)',
                                transitionDelay: '300ms',
                                transitionDuration: '1200ms',
                              }}
                            />
                          </div>
                        </div>

                        <p className="text-white/40 text-sm leading-relaxed">
                          {slide.web4tg.detail}
                        </p>

                        <div className="mt-5 pt-4 border-t border-[#8B5CF6]/10 flex items-center justify-between" aria-hidden="true">
                          <div className="flex items-center gap-1">
                            {slides.map((_, i) => (
                              <div
                                key={i}
                                className={`rounded-full transition-all duration-500 ${
                                  i === active
                                    ? 'w-5 h-1.5 bg-[#8B5CF6]'
                                    : 'w-1.5 h-1.5 bg-white/[0.08]'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-white/15 text-[10px] font-mono">{slideNumber}/{totalSlides}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-8 flex-wrap" role="tablist" aria-label="Критерии сравнения">
            {slides.map((s, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === active}
                onClick={() => handleUserNav(() => goTo(i, i > active ? 1 : -1))}
                className={`group relative px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-300 focus-visible:outline-2 focus-visible:outline-[#8B5CF6] ${
                  i === active
                    ? 'bg-[#8B5CF6]/10 text-[#C4B5FD] border border-[#8B5CF6]/20 shadow-lg shadow-[#8B5CF6]/5'
                    : 'text-white/30 hover:text-white/50 border border-transparent hover:border-white/[0.06] hover:bg-white/[0.02]'
                }`}
              >
                <span className="mr-1.5">{s.icon}</span>
                {s.criterion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
