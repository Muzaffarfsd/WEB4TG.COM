import { Check, X, Minus, ChevronRight } from 'lucide-react';
import { useScrollReveal } from '../../hooks/use-animations';

const columns = ['WEB4TG Studio', 'Фрилансер', 'No-code', 'Другие студии'] as const;

type Status = 'good' | 'neutral' | 'bad';

interface CriteriaRow {
  label: string;
  values: [
    { text: string; status: Status },
    { text: string; status: Status },
    { text: string; status: Status },
    { text: string; status: Status },
  ];
}

const rows: CriteriaRow[] = [
  {
    label: 'Скорость запуска',
    values: [
      { text: '7-14 дней', status: 'good' },
      { text: '14-60 дней', status: 'neutral' },
      { text: '1-3 дня', status: 'good' },
      { text: '30-90 дней', status: 'bad' },
    ],
  },
  {
    label: 'Качество дизайна',
    values: [
      { text: 'Premium', status: 'good' },
      { text: 'Средний', status: 'neutral' },
      { text: 'Шаблонный', status: 'bad' },
      { text: 'Высокий', status: 'good' },
    ],
  },
  {
    label: 'Telegram-интеграция',
    values: [
      { text: 'Нативная', status: 'good' },
      { text: 'Базовая', status: 'neutral' },
      { text: 'Ограниченная', status: 'bad' },
      { text: 'Базовая', status: 'neutral' },
    ],
  },
  {
    label: 'Поддержка 24/7',
    values: [
      { text: 'Да', status: 'good' },
      { text: 'Нет', status: 'bad' },
      { text: 'Нет', status: 'bad' },
      { text: 'Иногда', status: 'neutral' },
    ],
  },
  {
    label: 'Масштабируемость',
    values: [
      { text: 'Безлимит', status: 'good' },
      { text: 'Ограничена', status: 'neutral' },
      { text: 'Ограничена', status: 'bad' },
      { text: 'Да', status: 'good' },
    ],
  },
  {
    label: 'Стоимость',
    values: [
      { text: 'Средняя', status: 'neutral' },
      { text: 'Низкая', status: 'good' },
      { text: 'Низкая', status: 'good' },
      { text: 'Высокая', status: 'bad' },
    ],
  },
];

function StatusIcon({ status }: { status: Status }) {
  if (status === 'good') {
    return (
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/15">
        <Check className="w-3 h-3 text-emerald-400" />
      </span>
    );
  }
  if (status === 'neutral') {
    return (
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/15">
        <Minus className="w-3 h-3 text-amber-400" />
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500/15">
      <X className="w-3 h-3 text-red-400" />
    </span>
  );
}

export default function ComparisonTable() {
  const sectionRef = useScrollReveal({ stagger: 0.08 });

  return (
    <section className="py-20 sm:py-28 md:py-36 px-5 sm:px-8" ref={sectionRef}>
      <div className="max-w-6xl mx-auto">
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

        <div className="relative" data-reveal>
          <div className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none z-10 sm:hidden" style={{ background: 'linear-gradient(to left, #050505 0%, #050505cc 30%, transparent 100%)' }} />
          <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0 scrollbar-hide" style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
            <div className="glass-panel rounded-2xl overflow-hidden min-w-[640px]" style={{ scrollSnapAlign: 'start' }}>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-4 sm:p-5 text-[13px] sm:text-[14px] text-white/40 font-medium border-b border-white/[0.06]" />
                    {columns.map((col, i) => (
                      <th
                        key={col}
                        className={`p-4 sm:p-5 text-center text-[13px] sm:text-[14px] font-semibold border-b border-white/[0.06] ${
                          i === 0
                            ? 'text-[#A78BFA] bg-[#8B5CF6]/[0.06] border-x border-[#8B5CF6]/15'
                            : 'text-white/60'
                        }`}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rowIdx) => (
                    <tr
                      key={row.label}
                      className={rowIdx < rows.length - 1 ? 'border-b border-white/[0.06]' : ''}
                    >
                      <td className="p-4 sm:p-5 text-[13px] sm:text-[14px] text-white/70 font-medium whitespace-nowrap">
                        {row.label}
                      </td>
                      {row.values.map((val, colIdx) => (
                        <td
                          key={colIdx}
                          className={`p-4 sm:p-5 text-center ${
                            colIdx === 0
                              ? 'bg-[#8B5CF6]/[0.06] border-x border-[#8B5CF6]/15'
                              : ''
                          }`}
                        >
                          <div className="inline-flex items-center gap-2">
                            <StatusIcon status={val.status} />
                            <span className="text-[13px] sm:text-[14px] text-white/60">
                              {val.text}
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-3 sm:hidden">
            <span className="text-white/40 text-[12px]">Листайте</span>
            <span className="inline-flex animate-[scrollArrow_1.2s_ease-in-out_infinite]">
              <ChevronRight className="w-4 h-4 text-[#A78BFA]" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
