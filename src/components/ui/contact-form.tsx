import { useState, useCallback, FormEvent } from 'react';

const TELEGRAM_BOT_USERNAME = 'w4tg_bot';

interface FormData {
  name: string;
  contact: string;
  description: string;
}

interface FormErrors {
  name?: string;
  contact?: string;
  description?: string;
}

const validate = (data: FormData): FormErrors => {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = 'Укажите ваше имя';
  if (!data.contact.trim()) errors.contact = 'Укажите телефон или Telegram';
  if (!data.description.trim()) errors.description = 'Опишите ваш проект';
  return errors;
};

const ContactForm = () => {
  const [form, setForm] = useState<FormData>({ name: '', contact: '', description: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = useCallback((field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }, []);

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const message = `Заявка с сайта:\n\nИмя: ${form.name}\nКонтакт: ${form.contact}\nПроект: ${form.description}`;
    const encoded = encodeURIComponent(message);
    const telegramUrl = `https://t.me/${TELEGRAM_BOT_USERNAME}?start=${encoded}`;

    window.open(telegramUrl, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
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
              Мы получили вашу заявку и свяжемся с вами в ближайшее время через Telegram.
            </p>
            <button
              onClick={() => { setSubmitted(false); setForm({ name: '', contact: '', description: '' }); }}
              className="btn-secondary"
            >
              Отправить ещё
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="relative px-5 sm:px-8 py-20 md:py-28">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <span className="section-label">Связаться</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white leading-tight">
            Обсудим <span className="font-instrument-serif italic text-[var(--accent-light)]">ваш проект</span>
          </h2>
          <p className="mt-4 text-[var(--text-300)] text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
            Оставьте заявку, и мы свяжемся с вами в Telegram для обсуждения деталей
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
              className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-white placeholder-[var(--text-400)] text-base outline-none transition-colors focus:border-[var(--accent)] focus:bg-[rgba(255,255,255,0.06)]"
            />
            {errors.name && <p className="mt-1.5 text-sm text-red-400">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="cf-contact" className="block text-sm font-medium text-[var(--text-200)] mb-2">Телефон или Telegram</label>
            <input
              id="cf-contact"
              type="text"
              value={form.contact}
              onChange={e => handleChange('contact', e.target.value)}
              placeholder="+7 (999) 123-45-67 или @username"
              className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-white placeholder-[var(--text-400)] text-base outline-none transition-colors focus:border-[var(--accent)] focus:bg-[rgba(255,255,255,0.06)]"
            />
            {errors.contact && <p className="mt-1.5 text-sm text-red-400">{errors.contact}</p>}
          </div>

          <div>
            <label htmlFor="cf-desc" className="block text-sm font-medium text-[var(--text-200)] mb-2">Описание проекта</label>
            <textarea
              id="cf-desc"
              value={form.description}
              onChange={e => handleChange('description', e.target.value)}
              placeholder="Расскажите о вашем проекте, задачах и сроках"
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-white placeholder-[var(--text-400)] text-base outline-none transition-colors focus:border-[var(--accent)] focus:bg-[rgba(255,255,255,0.06)] resize-none"
            />
            {errors.description && <p className="mt-1.5 text-sm text-red-400">{errors.description}</p>}
          </div>

          <button type="submit" className="btn-primary w-full justify-center mt-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
            Отправить заявку
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
