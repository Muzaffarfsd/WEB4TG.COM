import { useScrollReveal } from '../../hooks/use-animations';

const integrations = [
  { name: 'Stripe', emoji: '💳' },
  { name: 'ЮKassa', emoji: '🏦' },
  { name: 'Apple Pay', emoji: '🍎' },
  { name: 'Google Pay', emoji: '🔵' },
  { name: 'СБП', emoji: '⚡' },
  { name: 'Telegram API', emoji: '✈️' },
  { name: 'CloudFlare', emoji: '🛡️' },
  { name: 'PostgreSQL', emoji: '🐘' },
  { name: 'Redis', emoji: '🔴' },
  { name: 'Sentry', emoji: '🔍' },
];

export default function IntegrationsMarquee() {
  const sectionRef = useScrollReveal();

  return (
    <section className="py-10 sm:py-14 px-5 sm:px-8 relative overflow-hidden" ref={sectionRef}>
      <div className="max-w-6xl mx-auto" data-reveal>
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="h-px flex-1 max-w-16 bg-[#8B5CF6]/40" />
          <span className="section-label mb-0">Интеграции</span>
          <span className="h-px flex-1 max-w-16 bg-[#8B5CF6]/40" />
        </div>
      </div>

      <div className="relative" data-reveal>
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 z-10 pointer-events-none bg-gradient-to-r from-[#050505] to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 z-10 pointer-events-none bg-gradient-to-l from-[#050505] to-transparent" />

        <div className="overflow-hidden">
          <div className="flex animate-marquee" style={{ width: 'max-content' }}>
            {[...integrations, ...integrations].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 px-5 py-2.5 mx-2 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm whitespace-nowrap"
              >
                <span className="text-base">{item.emoji}</span>
                <span className="text-[14px] sm:text-[15px] text-white/50 font-medium tracking-wide">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
