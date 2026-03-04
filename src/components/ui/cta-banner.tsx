import { Send, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '../../hooks/use-animations';

export default function CtaBanner() {
  const sectionRef = useScrollReveal();

  return (
    <section ref={sectionRef} className="relative py-20 sm:py-28 md:py-36 px-5 sm:px-8 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.12)_0%,transparent_70%)] blur-[80px]" />
      </div>

      <div className="relative max-w-6xl mx-auto text-center">
        <h2
          data-reveal
          className="font-instrument-serif gradient-text-white"
          style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3.5rem)', lineHeight: 1.15 }}
        >
          Запустите Mini App
          <br />
          <em className="gradient-text">за 14 дней</em>
        </h2>

        <p
          data-reveal
          className="mt-5 text-[13px] sm:text-[14px] text-white/50 max-w-md mx-auto leading-relaxed"
        >
          Бесплатная консультация — обсудим задачу и рассчитаем стоимость за 15 минут
        </p>

        <div data-reveal className="mt-8">
          <a
            href="https://t.me/w4tg_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-base px-8 py-4"
          >
            <Send className="w-4 h-4" />
            Обсудить проект
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div data-reveal className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] sm:text-[13px] text-white/40">
          <span>✓ Бесплатная оценка</span>
          <span>✓ NDA</span>
          <span>✓ Старт за 24 часа</span>
        </div>
      </div>
    </section>
  );
}