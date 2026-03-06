import { useState } from 'react';
import { Zap, ArrowRight, Clock, ShieldCheck, FileText, Send, Mail, Phone } from 'lucide-react';
import { useScaleReveal } from '../../hooks/use-animations';

export default function CtaBanner() {
  const sectionRef = useScaleReveal({ stagger: 0.1, scale: 0.9 });
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [callbackPhone, setCallbackPhone] = useState('');
  const [callbackSubmitted, setCallbackSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'telegram' | 'email' | 'callback'>('telegram');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'email_capture' }),
      });
    } catch {}
    setEmailSubmitted(true);
  };

  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackPhone) return;
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: callbackPhone, type: 'callback_request' }),
      });
    } catch {}
    setCallbackSubmitted(true);
  };

  return (
    <section ref={sectionRef} className="relative py-20 sm:py-28 md:py-36 px-5 sm:px-8 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.12)_0%,transparent_70%)] blur-[80px]" />
      </div>

      <div className="relative max-w-6xl mx-auto text-center">
        <div
          data-reveal
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
          </span>
          <span className="text-[12px] sm:text-[13px] text-violet-300/80 font-medium tracking-wide">
            Принимаем 3 проекта в месяц
          </span>
        </div>

        <h2
          data-reveal
          className="font-instrument-serif gradient-text-white"
          style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3.5rem)', lineHeight: 1.15 }}
        >
          Пока вы думаете,
          <br />
          <em className="gradient-text">конкуренты уже запустили</em>
        </h2>

        <p
          data-reveal
          className="mt-5 text-[13px] sm:text-[14px] text-white/70 max-w-md mx-auto leading-relaxed"
        >
          Каждый день без Mini App — это упущенные клиенты и продажи. Узнайте, что мы можем сделать для вас.
        </p>

        <div data-reveal className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setActiveTab('telegram')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] sm:text-[13px] font-medium transition-all duration-300 border ${
              activeTab === 'telegram'
                ? 'bg-violet-500/15 border-violet-500/30 text-violet-300'
                : 'border-white/[0.06] text-white/50 hover:text-white/70 hover:border-white/10'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            Telegram
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] sm:text-[13px] font-medium transition-all duration-300 border ${
              activeTab === 'email'
                ? 'bg-violet-500/15 border-violet-500/30 text-violet-300'
                : 'border-white/[0.06] text-white/50 hover:text-white/70 hover:border-white/10'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Email
          </button>
          <button
            onClick={() => setActiveTab('callback')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] sm:text-[13px] font-medium transition-all duration-300 border ${
              activeTab === 'callback'
                ? 'bg-violet-500/15 border-violet-500/30 text-violet-300'
                : 'border-white/[0.06] text-white/50 hover:text-white/70 hover:border-white/10'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            Звонок
          </button>
        </div>

        <div data-reveal className="mt-6">
          {activeTab === 'telegram' && (
            <a
              href="https://t.me/w4tg_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-base px-8 py-4"
            >
              <Zap className="w-4 h-4" />
              Получить бесплатную оценку
              <ArrowRight className="w-4 h-4" />
            </a>
          )}

          {activeTab === 'email' && (
            <div className="max-w-sm mx-auto">
              {emailSubmitted ? (
                <div className="text-emerald-400 text-[14px] font-medium py-4">
                  ✓ Спасибо! Мы свяжемся с вами по email.
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
                  <button
                    type="submit"
                    className="btn-primary px-6 py-3 text-[14px]"
                  >
                    <Mail className="w-4 h-4" />
                    Отправить
                  </button>
                </form>
              )}
            </div>
          )}

          {activeTab === 'callback' && (
            <div className="max-w-sm mx-auto">
              {callbackSubmitted ? (
                <div className="text-emerald-400 text-[14px] font-medium py-4">
                  ✓ Спасибо! Мы перезвоним вам в ближайшее время.
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
                  <button
                    type="submit"
                    className="btn-primary px-6 py-3 text-[14px]"
                  >
                    <Phone className="w-4 h-4" />
                    Перезвоните
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        <div data-reveal className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[12px] sm:text-[13px] text-white/60">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-violet-400/60" />
            Оценка за 15 минут
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-violet-400/60" />
            Без обязательств
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-violet-400/60" />
            NDA
          </span>
        </div>
      </div>
    </section>
  );
}