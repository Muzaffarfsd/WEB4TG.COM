import { Shield, RotateCcw, FileCheck, Infinity } from 'lucide-react';
import { useScaleReveal } from '../../hooks/use-animations';

const guarantees = [
  {
    icon: Shield,
    title: '99.9% Uptime',
    description: 'Серверы в Европе с резервированием. Мониторинг 24/7 — узнаём о проблемах раньше вас.',
  },
  {
    icon: RotateCcw,
    title: 'Возврат предоплаты',
    description: 'Если результат не устроит на этапе демо — вернём 100% предоплаты без вопросов.',
  },
  {
    icon: FileCheck,
    title: 'NDA по умолчанию',
    description: 'Подписываем NDA до начала работы. Ваша идея и данные под защитой.',
  },
  {
    icon: Infinity,
    title: 'Бесплатные правки',
    description: 'Все правки до запуска включены в стоимость. Без скрытых доплат и сюрпризов.',
  },
];

export default function GuaranteesSection() {
  const sectionRef = useScaleReveal({ stagger: 0.12 });

  return (
    <section id="guarantees" className="py-20 sm:py-28 md:py-36 px-5 sm:px-8 relative" ref={sectionRef}>
      <div className="max-w-6xl mx-auto">
        <div data-reveal>
          <span className="section-label">
            <span className="w-8 h-px bg-[#8B5CF6]/40 mr-3" />
            Гарантии
          </span>
          <h2
            className="font-instrument-serif gradient-text-white leading-[1.1] mb-12 sm:mb-16"
            style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3.5rem)' }}
          >
            Работаем
            <br />
            <em className="gradient-text">без рисков</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {guarantees.map((item, index) => (
            <div
              key={item.title}
              data-reveal
              className={`relative rounded-2xl overflow-hidden group ${index === 0 ? 'sm:col-span-2' : ''}`}
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent" />
              <div className="glow-card rounded-2xl p-6 sm:p-8 flex flex-col gap-4 h-full transition-all duration-300 group-hover:border-[#8B5CF6]/30">
                <div className="w-11 h-11 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-[#8B5CF6]/20 group-hover:border-[#8B5CF6]/40">
                  <item.icon className="w-5 h-5 text-[#8B5CF6] transition-colors duration-300 group-hover:text-[#A78BFA]" />
                </div>
                <h3 className="text-white font-normal text-lg sm:text-xl font-instrument-serif tracking-tight">{item.title}</h3>
                <p className="text-[13px] sm:text-[14px] text-white/70 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
