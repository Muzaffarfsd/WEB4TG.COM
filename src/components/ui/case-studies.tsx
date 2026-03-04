import { useScrollReveal } from '../../hooks/use-animations';

const caseStudies = [
  {
    num: '01',
    category: 'E-commerce',
    title: 'Flowershop.tg',
    description: 'Магазин цветов с каталогом, корзиной и доставкой по Москве',
    metrics: ['Конверсия +40%', 'Запуск за 10 дней'],
  },
  {
    num: '02',
    category: 'Фитнес',
    title: 'FitLife App',
    description: 'Приложение для фитнес-студии: абонементы, расписание, онлайн-запись',
    metrics: ['Записи +65%', 'Отток −30%'],
  },
  {
    num: '03',
    category: 'Доставка',
    title: 'DeliveryBot',
    description: 'Сервис доставки еды с трекингом, оплатой и AI-поддержкой',
    metrics: ['Заказы +120%', 'NPS 92'],
  },
];

export default function CaseStudies() {
  const sectionRef = useScrollReveal({ stagger: 0.15 });

  return (
    <section ref={sectionRef} className="py-20 sm:py-28 md:py-36 px-5 sm:px-8 relative">
      <div className="max-w-6xl mx-auto">
        <div data-reveal>
          <div className="section-label">
            <span className="w-8 h-px bg-[#8B5CF6]/40 mr-3" />
            Кейсы
          </div>
          <h2
            className="font-instrument-serif gradient-text-white leading-[1.1] mb-12 sm:mb-16"
            style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3.5rem)' }}
          >
            Реальные <em className="gradient-text italic">результаты</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {caseStudies.map((study) => (
            <div
              key={study.num}
              data-reveal
              className="glow-card rounded-2xl p-6 sm:p-7 relative flex flex-col"
            >
              <span className="absolute top-5 right-6 text-[13px] font-instrument-serif text-white/15 select-none">
                {study.num}
              </span>

              <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8B5CF6] mb-4">
                {study.category}
              </span>

              <h3 className="font-instrument-serif text-xl sm:text-2xl text-white mb-2">
                {study.title}
              </h3>

              <p className="text-[13px] sm:text-[14px] text-white/50 leading-relaxed mb-6 flex-1">
                {study.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {study.metrics.map((metric) => (
                  <span
                    key={metric}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-[12px] sm:text-[13px] font-medium bg-[#8B5CF6]/10 text-[#A78BFA] border border-[#8B5CF6]/15"
                  >
                    {metric}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
