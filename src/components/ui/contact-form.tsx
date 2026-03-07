'use client';

import { useState, useCallback, FormEvent } from 'react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  description: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  description?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (data: FormData): FormErrors => {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = 'Укажите ваше имя';
  if (!data.email.trim()) {
    errors.email = 'Укажите email';
  } else if (!EMAIL_RE.test(data.email.trim())) {
    errors.email = 'Некорректный email';
  }
  if (!data.phone.trim()) errors.phone = 'Укажите телефон или Telegram';
  if (!data.description.trim()) errors.description = 'Опишите ваш проект';
  return errors;
};

const ContactForm = () => {
  const [form, setForm] = useState<FormData>({ name: '', email: '', phone: '', description: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleChange = useCallback((field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
    setServerError(null);
  }, []);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          description: form.description.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || 'Ошибка отправки. Попробуйте позже.');
        return;
      }

      setSubmitted(true);
    } catch {
      setServerError('Ошибка сети. Проверьте подключение и попробуйте снова.');
    } finally {
      setSubmitting(false);
    }
  }, [form]);

  if (submitted) {
    return (
      <section className="relative px-5 sm:px-8 py-20 md:py-28">
        <div className="max-w-2xl mx-auto">
          <div className="glass-panel rounded-3xl p-8 sm:p-12 text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.15)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-3">Заявка отправлена</h3>
            <p className="text-[var(--text-300)] text-base leading-relaxed mb-8">
              Мы получили вашу заявку и свяжемся с вами в ближайшее время.
            </p>
            <button
              onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', description: '' }); }}
              className="btn-secondary"
            >
              Отправить ещё
            </button>
          </div>
        </div>
      </section>
    );
  }

  const inputClass = "w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-white placeholder-[var(--text-400)] text-base outline-none transition-colors focus:border-[var(--accent)] focus:bg-[rgba(255,255,255,0.06)]";

  return (
    <section id="contact" className="relative px-5 sm:px-8 py-20 md:py-28">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <span className="section-label">Связаться</span>
          <h2 className="text-[clamp(1.75rem,4.5vw,3.5rem)] font-normal font-instrument-serif gradient-text-white tracking-[-0.02em] leading-[1.1]">
            Обсудим <span className="italic gradient-text">ваш проект</span>
          </h2>
          <p className="mt-4 text-[var(--text-300)] text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
            Оставьте заявку, и мы свяжемся с вами для обсуждения деталей
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="glass-panel rounded-3xl p-6 sm:p-10 space-y-5">
          <div>
            <label htmlFor="cf-name" className="block text-sm font-medium text-[var(--text-200)] mb-2">Имя</label>
            <input
              id="cf-name"
              type="text"
              value={form.name}
              onChange={e => handleChange('name', e.target.value)}
              placeholder="Как к вам обращаться"
              className={inputClass}
            />
            {errors.name && <p className="mt-1.5 text-sm text-red-400">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="cf-email" className="block text-sm font-medium text-[var(--text-200)] mb-2">Email</label>
            <input
              id="cf-email"
              type="email"
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
              placeholder="you@company.com"
              className={inputClass}
            />
            {errors.email && <p className="mt-1.5 text-sm text-red-400">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="cf-phone" className="block text-sm font-medium text-[var(--text-200)] mb-2">Телефон или Telegram</label>
            <input
              id="cf-phone"
              type="text"
              value={form.phone}
              onChange={e => handleChange('phone', e.target.value)}
              placeholder="+7 (999) 123-45-67 или @username"
              className={inputClass}
            />
            {errors.phone && <p className="mt-1.5 text-sm text-red-400">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="cf-desc" className="block text-sm font-medium text-[var(--text-200)] mb-2">Описание проекта</label>
            <textarea
              id="cf-desc"
              value={form.description}
              onChange={e => handleChange('description', e.target.value)}
              placeholder="Расскажите о вашем проекте, задачах и сроках"
              rows={4}
              className={inputClass + " resize-none"}
            />
            {errors.description && <p className="mt-1.5 text-sm text-red-400">{errors.description}</p>}
          </div>

          {serverError && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {serverError}
            </div>
          )}

          <button type="submit" disabled={submitting} className="btn-primary w-full justify-center mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {submitting ? (
              <>
                <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Отправка...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13" />
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                </svg>
                Отправить заявку
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
