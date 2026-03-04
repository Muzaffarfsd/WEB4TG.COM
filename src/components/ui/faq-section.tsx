import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useScrollReveal } from '../../hooks/use-animations';

const faqItems = [
  {
    question: 'Сколько стоит разработка Telegram Mini App?',
    answer: 'Стоимость зависит от сложности проекта. Простое приложение — от 150 000 ₽, средний проект — от 300 000 ₽, сложный кастомный продукт — от 500 000 ₽. Точную стоимость рассчитаем после обсуждения задачи.',
  },
  {
    question: 'Какие сроки разработки?',
    answer: 'Средний срок — 14 дней от заявки до запуска. Простые проекты делаем за 7 дней, сложные — до 30 дней. Первую демо-версию показываем через 3 дня.',
  },
  {
    question: 'Что входит в подписку после запуска?',
    answer: 'Хостинг с 99.9% uptime, техническая поддержка, обновления, бэкапы и мониторинг. Три тарифа на выбор — от 9 900 ₽/мес.',
  },
  {
    question: 'Можно ли интегрировать оплату?',
    answer: 'Да, мы подключаем Stripe, ЮKassa, Apple Pay, Google Pay и СБП. Все платежи проходят напрямую на ваш счёт — без комиссий с нашей стороны.',
  },
  {
    question: 'Как устроена поддержка после запуска?',
    answer: 'Персональный менеджер на связи в Telegram. Время ответа — от 2 часов (стандарт) до 30 минут (премиум). Мониторим работу приложения 24/7.',
  },
];

export const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useScrollReveal();

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="relative py-20 sm:py-28 px-4">
      <div className="max-w-3xl mx-auto" ref={sectionRef}>
        <div className="text-center mb-12 sm:mb-16" data-reveal>
          <span className="section-label justify-center">
            <span className="w-8 h-px bg-[#8B5CF6]/40 mr-3" />
            FAQ
            <span className="w-8 h-px bg-[#8B5CF6]/40 ml-3" />
          </span>
          <h2 className="text-[clamp(1.75rem,4.5vw,3.5rem)] font-normal font-instrument-serif gradient-text-white tracking-[-0.02em] leading-[1.1]">
            Частые
            <br />
            <span className="italic gradient-text">вопросы</span>
          </h2>
        </div>

        <div className="glass-panel rounded-2xl overflow-hidden" data-reveal>
          {faqItems.map((item, index) => (
            <div
              key={index}
              className={index < faqItems.length - 1 ? 'border-b border-white/[0.06]' : ''}
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-5 text-left transition-colors hover:bg-white/[0.02]"
              >
                <span className="text-[15px] sm:text-base font-medium text-white/90">
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-white/40 shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className="grid transition-all duration-300 ease-in-out"
                style={{
                  gridTemplateRows: openIndex === index ? '1fr' : '0fr',
                }}
              >
                <div className="overflow-hidden">
                  <p className="px-5 sm:px-6 pb-5 text-sm sm:text-[15px] leading-relaxed text-white/50">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
