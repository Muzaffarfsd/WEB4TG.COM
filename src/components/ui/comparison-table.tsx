import { useState, useEffect, useRef, useCallback } from 'react';
import { Check, X, Minus, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { useScrollReveal } from '../../hooks/use-animations';

type Status = 'good' | 'neutral' | 'bad';

interface Competitor {
  name: string;
  icon: string;
}

interface Slide {
  criterion: string;
  subtitle: string;
  web4tg: { text: string; status: Status; detail: string };
  competitors: [
    { text: string; status: Status },
    { text: string; status: Status },
    { text: string; status: Status },
  ];
}

const competitors: Competitor[] = [
  { name: 'Фрилансер', icon: '👤' },
  { name: 'No-code', icon: '🧩' },
  { name: 'Другие студии', icon: '🏢' },
];

const slides: Slide[] = [
  {
    criterion: 'Скорость запуска',
    subtitle: 'От идеи до рабочего продукта',
    web4tg: { text: '7–14 дней', status: 'good', detail: 'Отлаженный процесс, готовые модули, параллельная разработка' },
    competitors: [
      { text: '14–60 дней', status: 'neutral' },
      { text: '1–3 дня', status: 'good' },
      { text: '30–90 дней', status: 'bad' },
    ],
  },
  {
    criterion: 'Качество дизайна',
    subtitle: 'Визуальное впечатление и UX',
    web4tg: { text: 'Premium', status: 'good', detail: 'Уникальный дизайн под бренд, анимации, micro-interactions' },
    competitors: [
      { text: 'Средний', status: 'neutral' },
      { text: 'Шаблонный', status: 'bad' },
      { text: 'Высокий', status: 'good' },
    ],
  },
  {
    criterion: 'Telegram-интеграция',
    subtitle: 'Глубина работы с платформой',
    web4tg: { text: 'Нативная', status: 'good', detail: 'Mini Apps API, Telegram Payments, бот-оркестрация, WebApp Bridge' },
    competitors: [
      { text: 'Базовая', status: 'neutral' },
      { text: 'Ограниченная', status: 'bad' },
      { text: 'Базовая', status: 'neutral' },
    ],
  },
  {
    criterion: 'Поддержка 24/7',
    subtitle: 'Когда что-то идёт не так',
    web4tg: { text: 'Круглосуточно', status: 'good', detail: 'Выделенный менеджер, SLA < 1 час, мониторинг и алерты' },
    competitors: [
      { text: 'Нет', status: 'bad' },
      { text: 'Нет', status: 'bad' },
      { text: 'Иногда', status: 'neutral' },
    ],
  },
  {
    criterion: 'Масштабируемость',
    subtitle: 'Рост без ограничений',
    web4tg: { text: 'Безлимит', status: 'good', detail: 'Микросервисная архитектура, автоскейлинг, CDN, кэширование' },
    competitors: [
      { text: 'Ограничена', status: 'neutral' },
      { text: 'Ограничена', status: 'bad' },
      { text: 'Да', status: 'good' },
    ],
  },
  {
    criterion: 'Стоимость',
    subtitle: 'Баланс цены и качества',
    web4tg: { text: 'Оптимальная', status: 'good', detail: 'Прозрачное ценообразование, фиксированная стоимость, без скрытых платежей' },
    competitors: [
      { text: 'Низкая', status: 'good' },
      { text: 'Низкая', status: 'good' },
      { text: 'Высокая', status: 'bad' },
    ],
  },
];

const AUTOPLAY_INTERVAL = 5000;
const PAUSE_AFTER_INTERACTION = 8000;

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

function StatusBadge({ status, text, large }: { status: Status; text: string; large?: boolean }) {
  const base = large ? 'text-base sm:text-lg font-semibold' : 'text-xs sm:text-sm';
  if (status === 'good') {
    return (
      <span className={`inline-flex items-center gap-1.5 ${base}`}>
        <span className={`inline-flex items-center justify-center rounded-full bg-emerald-500/20 ${large ? 'w-7 h-7' : 'w-5 h-5'}`}>
          <Check className={`text-emerald-400 ${large ? 'w-4 h-4' : 'w-3 h-3'}`} />
        </span>
        <span className={large ? 'text-emerald-300' : 'text-emerald-400/80'}>{text}</span>
      </span>
    );
  }
  if (status === 'neutral') {
    return (
      <span className={`inline-flex items-center gap-1.5 ${base}`}>
        <span className={`inline-flex items-center justify-center rounded-full bg-amber-500/15 ${large ? 'w-7 h-7' : 'w-5 h-5'}`}>
          <Minus className={`text-amber-400 ${large ? 'w-4 h-4' : 'w-3 h-3'}`} />
        </span>
        <span className={large ? 'text-amber-300' : 'text-amber-400/70'}>{text}</span>
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1.5 ${base}`}>
      <span className={`inline-flex items-center justify-center rounded-full bg-red-500/15 ${large ? 'w-7 h-7' : 'w-5 h-5'}`}>
        <X className={`text-red-400 ${large ? 'w-4 h-4' : 'w-3 h-3'}`} />
      </span>
      <span className={large ? 'text-red-300' : 'text-red-400/70'}>{text}</span>
    </span>
  );
}

export default function ComparisonTable() {
  const sectionRef = useScrollReveal();
  const reducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const effectivePlaying = isPlaying && !isHovered && !reducedMotion;

  const goTo = useCallback((idx: number, dir: number) => {
    setDirection(dir);
    setActive(idx);
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
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleUserNav(next);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleUserNav(prev);
      }
    };
    el.addEventListener('keydown', handleKey);
    return () => el.removeEventListener('keydown', handleKey);
  }, [next, prev, handleUserNav]);

  const slide = slides[active];
  const slideNumber = String(active + 1).padStart(2, '0');
  const totalSlides = String(slides.length).padStart(2, '0');

  return (
    <section className="py-20 sm:py-28 md:py-36 px-5 sm:px-8" ref={sectionRef} id="comparison">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 sm:mb-16" data-reveal>
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
            if (!carouselRef.current?.contains(e.relatedTarget as Node)) {
              setIsHovered(false);
            }
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-[#A78BFA]/60 font-mono text-sm tracking-wider">{slideNumber} / {totalSlides}</span>
              <div className="w-24 h-0.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] rounded-full comparison-progress"
                  style={{
                    transform: effectivePlaying ? 'scaleX(1)' : 'scaleX(0)',
                    transition: effectivePlaying ? `transform ${AUTOPLAY_INTERVAL}ms linear` : 'none',
                    transformOrigin: 'left',
                  }}
                  key={effectivePlaying ? active : 'paused'}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!reducedMotion && (
                <button
                  onClick={() => {
                    setIsPlaying(!isPlaying);
                    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-white/[0.08] hover:border-[#8B5CF6]/30 transition-colors focus-visible:outline-2 focus-visible:outline-[#8B5CF6]"
                  aria-label={isPlaying ? 'Остановить автоплей' : 'Запустить автоплей'}
                >
                  {isPlaying
                    ? <Pause className="w-3.5 h-3.5 text-white/60" />
                    : <Play className="w-3.5 h-3.5 text-white/60 ml-0.5" />
                  }
                </button>
              )}
              <button
                onClick={() => handleUserNav(prev)}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-white/[0.08] hover:border-[#8B5CF6]/30 transition-colors focus-visible:outline-2 focus-visible:outline-[#8B5CF6]"
                aria-label="Предыдущий слайд"
              >
                <ChevronLeft className="w-4 h-4 text-white/60" />
              </button>
              <button
                onClick={() => handleUserNav(next)}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-white/[0.08] hover:border-[#8B5CF6]/30 transition-colors focus-visible:outline-2 focus-visible:outline-[#8B5CF6]"
                aria-label="Следующий слайд"
              >
                <ChevronRight className="w-4 h-4 text-white/60" />
              </button>
            </div>
          </div>

          <div
            className="relative overflow-hidden rounded-2xl"
            style={{ minHeight: '420px' }}
            role="group"
            aria-roledescription="slide"
            aria-label={`Слайд ${active + 1} из ${slides.length}: ${slide.criterion}`}
          >
            <div
              aria-live="polite"
              aria-atomic="true"
              className="sr-only"
            >
              {slide.criterion}: WEB4TG — {slide.web4tg.text}
            </div>

            <div
              key={active}
              className={reducedMotion ? '' : 'comparison-slide-enter'}
              style={reducedMotion ? undefined : { '--slide-dir': direction } as React.CSSProperties}
            >
              <div className="absolute inset-0 rounded-2xl" style={{
                background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,92,246,0.08) 0%, transparent 70%)',
              }} />

              <div className="text-center pt-8 pb-6 relative z-10">
                <p className="text-[#A78BFA]/70 text-xs sm:text-sm uppercase tracking-[0.2em] mb-3 font-medium">{slide.subtitle}</p>
                <h3
                  className="font-instrument-serif text-white leading-[1.1]"
                  style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)' }}
                >
                  {slide.criterion}
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 px-4 sm:px-8 pb-8 relative z-10">
                <div className="order-2 lg:order-1 flex flex-col gap-3">
                  {competitors.map((comp, i) => (
                    <div
                      key={comp.name}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.05] bg-white/[0.02] transition-all duration-500"
                      style={reducedMotion ? undefined : { transitionDelay: `${150 + i * 80}ms` }}
                    >
                      <span className="text-xl shrink-0" aria-hidden="true">{comp.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white/50 text-xs font-medium mb-0.5">{comp.name}</p>
                        <StatusBadge status={slide.competitors[i].status} text={slide.competitors[i].text} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-1 lg:order-2 flex items-center justify-center" aria-hidden="true">
                  <div className="w-px h-0 lg:h-full bg-gradient-to-b from-transparent via-[#8B5CF6]/20 to-transparent hidden lg:block" />
                  <div className="h-px w-full lg:hidden bg-gradient-to-r from-transparent via-[#8B5CF6]/20 to-transparent" />
                </div>

                <div className="order-3 flex items-center justify-center">
                  <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-[#8B5CF6]/20 comparison-hero-card">
                    <div className="absolute inset-0" style={{
                      background: 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(139,92,246,0.04) 50%, rgba(139,92,246,0.08) 100%)',
                    }} />
                    <div className="absolute inset-0" style={{
                      background: 'radial-gradient(circle at 30% 20%, rgba(139,92,246,0.15), transparent 50%)',
                    }} />
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8B5CF6]/40 to-transparent" />

                    <div className="relative p-6 sm:p-8 text-center">
                      <div className="inline-flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-[#8B5CF6] flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <rect x="2" y="6" width="20" height="12" rx="2" />
                            <path d="M12 12h.01" />
                            <path d="M17 12h.01" />
                            <path d="M7 12h.01" />
                          </svg>
                        </div>
                        <span className="text-[#C4B5FD] text-sm font-semibold tracking-wide">WEB4TG STUDIO</span>
                      </div>

                      <div className="mb-4">
                        <StatusBadge status={slide.web4tg.status} text={slide.web4tg.text} large />
                      </div>

                      <p className="text-white/50 text-sm leading-relaxed">
                        {slide.web4tg.detail}
                      </p>

                      <div className="mt-6 pt-4 border-t border-[#8B5CF6]/10" aria-hidden="true">
                        <div className="flex items-center justify-center gap-1">
                          {slides.map((_, i) => (
                            <div
                              key={i}
                              className={`h-1 rounded-full transition-all duration-500 ${
                                i === active
                                  ? 'w-6 bg-[#8B5CF6]'
                                  : i < active
                                    ? 'w-2 bg-[#8B5CF6]/30'
                                    : 'w-2 bg-white/[0.08]'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-6 flex-wrap" role="tablist" aria-label="Критерии сравнения">
            {slides.map((s, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === active}
                onClick={() => handleUserNav(() => goTo(i, i > active ? 1 : -1))}
                className={`group relative px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 focus-visible:outline-2 focus-visible:outline-[#8B5CF6] ${
                  i === active
                    ? 'bg-[#8B5CF6]/15 text-[#C4B5FD] border border-[#8B5CF6]/25'
                    : 'text-white/40 hover:text-white/60 border border-transparent hover:border-white/[0.06]'
                }`}
              >
                {s.criterion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
