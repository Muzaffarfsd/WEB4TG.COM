'use client';

import { ArrowRight, Clock, ShieldCheck, FileText } from 'lucide-react';
import { useScaleReveal } from '../../hooks/use-animations';

export default function CtaBanner() {
  const sectionRef = useScaleReveal({ stagger: 0.1, scale: 0.95 });

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
          Готовы обсудить
          <br />
          <em className="gradient-text">ваш проект?</em>
        </h2>

        <p
          data-reveal
          className="mt-5 text-[13px] sm:text-[14px] text-white/70 max-w-md mx-auto leading-relaxed"
        >
          Расскажите о задаче — подготовим оценку с дедлайнами за один рабочий день.
        </p>

        <div data-reveal className="mt-8">
          <a
            href="https://t.me/w4tg_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-base px-8 py-4"
          >
            Обсудить проект
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div data-reveal className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[12px] sm:text-[13px] text-white/50">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-violet-400/60" />
            Ответим за 2 часа
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-violet-400/60" />
            Без обязательств
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-violet-400/60" />
            NDA по умолчанию
          </span>
        </div>
      </div>
    </section>
  );
}
