'use client';

import { useState } from 'react';
import { ArrowRight, Clock, ShieldCheck, FileText, Mail, Phone } from 'lucide-react';
import { useScaleReveal } from '../../hooks/use-animations';

export default function CtaBanner() {
  const sectionRef = useScaleReveal({ stagger: 0.1, scale: 0.95 });
  const [showAlt, setShowAlt] = useState<'email' | 'callback' | null>(null);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [callbackPhone, setCallbackPhone] = useState('');
  const [callbackSubmitted, setCallbackSubmitted] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'email_capture' }),
      });
      if (res.ok) setEmailSubmitted(true);
    } catch {}
  };

  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackPhone) return;
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: callbackPhone, type: 'callback_request' }),
      });
      if (res.ok) setCallbackSubmitted(true);
    } catch {}
  };

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
          Расскажите о задаче — подготовим оценку с дедлайнами за один рабочий день. Без обязательств.
        </p>

        <div data-reveal className="mt-8">
          <a
            href="https://t.me/w4tg_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-base px-8 py-4"
          >
            Написать в Telegram
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div data-reveal className="mt-6 flex items-center justify-center gap-4 text-[12px] text-white/40">
          <button
            onClick={() => setShowAlt(showAlt === 'email' ? null : 'email')}
            className={`inline-flex items-center gap-1.5 transition-colors ${showAlt === 'email' ? 'text-violet-400' : 'hover:text-white/60'}`}
          >
            <Mail className="w-3.5 h-3.5" />
            Написать на email
          </button>
          <span className="w-px h-3 bg-white/10" />
          <button
            onClick={() => setShowAlt(showAlt === 'callback' ? null : 'callback')}
            className={`inline-flex items-center gap-1.5 transition-colors ${showAlt === 'callback' ? 'text-violet-400' : 'hover:text-white/60'}`}
          >
            <Phone className="w-3.5 h-3.5" />
            Заказать звонок
          </button>
        </div>

        {showAlt === 'email' && (
          <div data-reveal className="mt-6 max-w-sm mx-auto">
            {emailSubmitted ? (
              <div className="text-emerald-400 text-[14px] font-medium py-4">
                Спасибо! Мы свяжемся с вами по email.
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[14px] placeholder:text-white/30 outline-none focus:border-violet-500/40 transition-colors"
                />
                <button type="submit" className="btn-primary px-6 py-3 text-[14px]">
                  Отправить
                </button>
              </form>
            )}
          </div>
        )}

        {showAlt === 'callback' && (
          <div data-reveal className="mt-6 max-w-sm mx-auto">
            {callbackSubmitted ? (
              <div className="text-emerald-400 text-[14px] font-medium py-4">
                Спасибо! Мы перезвоним вам в ближайшее время.
              </div>
            ) : (
              <form onSubmit={handleCallbackSubmit} className="flex gap-2">
                <input
                  type="tel"
                  required
                  placeholder="+7 (999) 123-45-67"
                  value={callbackPhone}
                  onChange={(e) => setCallbackPhone(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[14px] placeholder:text-white/30 outline-none focus:border-violet-500/40 transition-colors"
                />
                <button type="submit" className="btn-primary px-6 py-3 text-[14px]">
                  Перезвоните
                </button>
              </form>
            )}
          </div>
        )}

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
