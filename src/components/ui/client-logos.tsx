import { useScrollReveal } from '../../hooks/use-animations';

const companies = [
  'Flowershop.tg',
  'FitLife',
  'DeliveryBot',
  'YumYum',
  'TicketPro',
  'MedLink',
  'StyleBox',
  'EduPlatform',
];

const LogoPill = ({ name }: { name: string }) => (
  <span className="inline-flex items-center px-5 py-2 rounded-full border border-white/[0.06] bg-white/[0.03] text-white/40 text-[13px] font-medium whitespace-nowrap select-none">
    {name}
  </span>
);

const MarqueeRow = ({ reverse }: { reverse?: boolean }) => {
  const items = [...companies, ...companies];
  return (
    <div className="relative overflow-hidden">
      <div
        className="flex gap-4 w-max"
        style={{
          animation: `marquee ${reverse ? '35s' : '30s'} linear infinite${reverse ? ' reverse' : ''}`,
        }}
      >
        {items.map((name, i) => (
          <LogoPill key={`${name}-${i}`} name={name} />
        ))}
        {items.map((name, i) => (
          <LogoPill key={`${name}-dup-${i}`} name={name} />
        ))}
      </div>
    </div>
  );
};

export default function ClientLogos() {
  const sectionRef = useScrollReveal();

  return (
    <section ref={sectionRef} className="relative py-12 sm:py-16 px-5 sm:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <p data-reveal className="text-center text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8B5CF6] mb-8">
          Нам доверяют
        </p>

        <div data-reveal className="relative flex flex-col gap-4">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-24 z-10 bg-gradient-to-r from-[#050505] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-24 z-10 bg-gradient-to-l from-[#050505] to-transparent" />

          <MarqueeRow />
          <MarqueeRow reverse />
        </div>
      </div>
    </section>
  );
}
