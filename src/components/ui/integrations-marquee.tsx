import { useScrollReveal } from '../../hooks/use-animations';

const StripeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" fill="#635BFF"/>
  </svg>
);

const YookassaIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <circle cx="12" cy="12" r="11" stroke="#4285F4" strokeWidth="2"/>
    <path d="M8 12h8M12 8v8" stroke="#4285F4" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ApplePayIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <path d="M17.72 7.56c-.94.52-1.58 1.5-1.48 2.37 1.07.08 2.16-.56 2.84-1.26.66-.68 1.1-1.63.96-2.58-.93.04-2.06.54-2.84 1.26l.52.21zM19.08 10.16c-1.58-.1-2.93.9-3.68.9s-1.93-.85-3.18-.83c-1.63.03-3.14.95-3.98 2.42-1.7 2.94-.44 7.3 1.22 9.7.81 1.18 1.78 2.5 3.05 2.45 1.22-.05 1.68-.79 3.16-.79s1.89.79 3.18.76c1.32-.02 2.15-1.2 2.96-2.38.93-1.36 1.31-2.68 1.33-2.75-.03-.01-2.56-1-2.58-3.9-.02-2.43 1.98-3.6 2.07-3.65-1.13-1.67-2.9-1.86-3.53-1.9l-.02.01z" fill="white"/>
  </svg>
);

const GooglePayIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" fill="#4285F4"/>
  </svg>
);

const SbpIcon = () => (
  <img src="/sbp-logo.png" alt="СБП" className="w-5 h-5 object-contain rounded-sm" />
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0h-.056zm5.62 7.16-2.118 9.98c-.16.72-.576.896-1.168.558l-3.228-2.38-1.558 1.498c-.172.172-.316.316-.648.316l.232-3.282 5.978-5.4c.26-.232-.056-.36-.404-.128l-7.39 4.654-3.182-1c-.692-.216-.706-.692.144-.1.024l12.898-4.968c.576-.208 1.08.14.892 1.024l-.448.228z" fill="#26A5E4"/>
  </svg>
);

const CloudflareIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <path d="M16.509 16.516c.21-.72.122-1.384-.246-1.88a1.857 1.857 0 0 0-1.476-.682l-8.79.112a.326.326 0 0 1-.303-.18.338.338 0 0 1 .024-.356.397.397 0 0 1 .327-.178l8.89-.116c1.244-.058 2.588-1.088 3.04-2.346l.576-1.6a.563.563 0 0 0 .024-.192A5.744 5.744 0 0 0 7.332 8.2a3.804 3.804 0 0 0-3.558 2.086A3.438 3.438 0 0 0 0 13.752a3.12 3.12 0 0 0 .072.704.214.214 0 0 0 .2.162h15.87a.4.4 0 0 0 .367-.282v.18z" fill="#F6821F"/>
    <path d="M19.348 10.276a.138.138 0 0 0-.14.008 .138.138 0 0 0-.068.118l-.072.844c-.21.72-.122 1.384.246 1.88.318.434.832.688 1.384.7l1.836.116a.326.326 0 0 1 .303.18.338.338 0 0 1-.024.356.397.397 0 0 1-.327.178l-1.936.116c-1.25.058-2.588 1.088-3.04 2.346l-.162.46a.198.198 0 0 0 .18.268h5.848A5.288 5.288 0 0 0 24 14.464a5.312 5.312 0 0 0-4.652-4.188z" fill="#FBAD41"/>
  </svg>
);

const PostgresIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <path d="M12 2a8 8 0 0 0-8 8c0 3.2 1.9 6 4.6 7.3L12 22l3.4-4.7A8 8 0 0 0 12 2z" stroke="#5494C4" strokeWidth="1.5" fill="none"/>
    <ellipse cx="12" cy="10" rx="3.5" ry="4" stroke="#5494C4" strokeWidth="1.5"/>
    <path d="M15.5 10c0 1.5-.5 3-1.5 4" stroke="#5494C4" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const RedisIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <path d="M23.99 14.34c-.02.78-1.22 1.54-3.4 2.12-1.2.36-2.74.62-4.48.78-1.5.14-3.12.2-4.8.18a29.95 29.95 0 0 1-4.36-.38C4.8 16.66 3.18 16.1 2.1 15.42.8 14.62.1 13.68.02 12.82v2.52c0 .86.78 1.8 2.08 2.6 1.08.68 2.7 1.24 4.85 1.62 1.32.22 2.8.36 4.36.38 1.68.02 3.3-.04 4.8-.18 1.74-.16 3.28-.42 4.48-.78 2.18-.58 3.38-1.34 3.4-2.12v-2.52z" fill="#DC382D"/>
    <path d="M23.99 10.26c-.02.78-1.22 1.54-3.4 2.12-1.2.36-2.74.62-4.48.78-1.5.14-3.12.2-4.8.18a29.95 29.95 0 0 1-4.36-.38C4.8 12.58 3.18 12.02 2.1 11.34.8 10.54.1 9.6.02 8.74v2.52c0 .86.78 1.8 2.08 2.6 1.08.68 2.7 1.24 4.85 1.62 1.32.22 2.8.36 4.36.38 1.68.02 3.3-.04 4.8-.18 1.74-.16 3.28-.42 4.48-.78 2.18-.58 3.38-1.34 3.4-2.12V8.74z" fill="#DC382D"/>
    <path d="M23.99 6.18c.02-.86-.76-1.7-2.06-2.42-1.08-.6-2.62-1.1-4.52-1.44a31.14 31.14 0 0 0-4.78-.5c-1.72-.06-3.38.02-4.88.24C5.7 2.42 4.1 2.92 3.02 3.58 1.68 4.38.84 5.36.82 6.22c0 .86.78 1.8 2.08 2.6 1.08.68 2.7 1.24 4.85 1.62 1.32.22 2.8.36 4.36.38 1.68.02 3.3-.04 4.8-.18 1.74-.16 3.28-.42 4.48-.78 2.18-.58 3.38-1.34 3.4-2.12v-1.56z" fill="#DC382D"/>
    <path d="M14.95 4.14l-1.47.6 1.67.72-1.67.68 1.87.76-3.23 1.24 3.23-4.0z" fill="white" opacity="0.3"/>
  </svg>
);

const SentryIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <path d="M13.91 2.504c-.56-.968-1.96-.968-2.52 0L8.378 7.57a7.122 7.122 0 0 1 3.622 6.27h-2.18a4.944 4.944 0 0 0-2.47-4.282L4.86 13.712A2.652 2.652 0 0 1 6.18 16.04H1.5l-.728 1.26h5.408a3.91 3.91 0 0 0-1.947-3.42l1.47-2.548a6.088 6.088 0 0 1 3.062 5.268h-1.266l-.728 1.26h3.254a7.38 7.38 0 0 0-3.748-6.45l2.374-4.114c2.712 1.574 4.544 4.512 4.544 7.864h-1.266l-.728 1.26h3.254c0-4.016-2.194-7.522-5.448-9.396l1.506-2.608c3.946 2.286 6.602 6.548 6.602 11.404h1.26C22.5 10.696 19.164 5.466 14.32 2.882l-.41-.378z" fill="#E1567C"/>
  </svg>
);

interface Integration {
  name: string;
  icon: React.FC;
}

const integrations: Integration[] = [
  { name: 'Stripe', icon: StripeIcon },
  { name: 'ЮKassa', icon: YookassaIcon },
  { name: 'Apple Pay', icon: ApplePayIcon },
  { name: 'Google Pay', icon: GooglePayIcon },
  { name: 'СБП', icon: SbpIcon },
  { name: 'Telegram API', icon: TelegramIcon },
  { name: 'CloudFlare', icon: CloudflareIcon },
  { name: 'PostgreSQL', icon: PostgresIcon },
  { name: 'Redis', icon: RedisIcon },
  { name: 'Sentry', icon: SentryIcon },
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
                <item.icon />
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
