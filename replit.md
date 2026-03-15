# WEB4TG Studio — web4tg.com

## Overview
WEB4TG Studio website — premium agency for Telegram Mini Apps development. Full Russian-language landing page with animated neon tubes background (Three.js via iframe), glassmorphic cards, GSAP scroll animations, count-up stats, bento grid, noise texture overlay, Lenis smooth scroll, gradient mesh hero. Dark OLED theme with electric violet accents using CSS custom properties.

## Architecture
- **Runtime**: Node.js 20
- **Framework**: Next.js 16 (App Router, SSR) + React 19
- **Styling**: Tailwind CSS 4 + @tailwindcss/postcss + tw-animate-css
- **Animations**: GSAP + @gsap/react + ScrollTrigger (tree-shaken imports), framer-motion
- **Smooth Scroll**: Lenis (disabled when prefers-reduced-motion)
- **Icons**: lucide-react
- **Language**: TypeScript
- **Port**: 5000 (Next.js dev/start server)
- **Fonts**: Self-hosted (Inter, Cormorant Garamond, Montserrat) in `public/fonts/`
- **Service Worker**: `public/sw.js` — offline caching, stale-while-revalidate

## Project Structure
```
next.config.ts                       - Next.js config (security headers, CSP, allowedDevOrigins)
postcss.config.mjs                   - PostCSS config for Tailwind CSS 4
tsconfig.json                        - TypeScript config (Next.js App Router)
app/
  layout.tsx                         - Root layout (metadata, JSON-LD, CSS imports, lang=ru)
  page.tsx                           - Home page (renders App component)
  api/
    contact/
      route.ts                       - Contact form API (rate limiting, sanitization, Telegram forwarding)
public/
  fonts/                             - Self-hosted woff2 font files (cyrillic + latin subsets)
  favicon.svg                        - SVG favicon (violet W4 monogram)
  manifest.json                      - PWA web manifest
  robots.txt                         - Robots + sitemap reference
  sitemap.xml                        - Single-page sitemap
  og-image.png                       - Open Graph social sharing image (1200x630)
  sw.js                              - Service Worker (offline + stale-while-revalidate)
src/
  App.tsx                            - Main app (use client), Lenis init, ScrollProgress, ErrorBoundary, mesh gradient dividers, SW registration. ResponsiveHeroBanner rendered OUTSIDE <main> to avoid z-index stacking context bug (header z-50 must be global, not trapped inside main's z-[2])
  index.css                          - Theme (CSS vars for accent color), animations, utility classes, glass-panel, gradient mesh, skeleton shimmer, mesh dividers, focus-visible styles, heroClipReveal + heroFadeUp keyframes
  fonts.css                          - Self-hosted @font-face declarations (Inter, Cormorant Garamond, Montserrat) — paths to /fonts/
  data/
    pricing.ts                       - Pricing data (development, subscriptions, AI systems)
    services.ts                      - Services data (8 industry cards)
    faq.ts                           - FAQ items (5 questions)
    testimonials.ts                  - Testimonial cards (3 reviews)
    integration-icons.tsx            - SVG path data for integration badges
  hooks/
    use-animations.tsx               - 11 standardized animation hooks (expo.out, 0.8s baseline): useScrollReveal, useScrubReveal, useDirectionalReveal, useSlideReveal, useClipReveal, useRotateReveal, useFlipReveal, useScaleReveal, useWordReveal, useCharReveal, useCountUp, useStickyNav, useTextReveal
    use-sound.tsx                    - SoundManager (Web Audio API), SoundProvider, useSound hook, programmatic tones
  components/
    ui/                              - All components marked "use client" for Next.js App Router
      error-boundary.tsx             - React ErrorBoundary with graceful fallback UI
      custom-cursor.tsx              - Dot + ring cursor follower
      scroll-progress.tsx            - Thin gradient progress bar at top
      scroll-narrative.tsx           - Fixed vertical story thread with progress line, glow orb, section nodes
      sound-toggle.tsx               - Floating mute/unmute button (bottom-left)
      magnetic-button.tsx            - GSAP spring-physics magnetic button
      contact-form.tsx               - Inline contact form (name, email, phone, description) + POST /api/contact
      tubes-background.tsx           - Iframe-isolated Three.js tubes
      responsive-hero-banner.tsx     - Hero + glass sticky nav + fullscreen mobile menu + TrustBadge component + cinematic entrance animations
      services-section.tsx           - Bento grid services + useCharReveal heading
      ai-agent-section.tsx           - Multi-agent AI showcase (ARIA tabs)
      ai-agent/                      - AI agent sub-components (isometric office, phone mockup, etc.)
      iphone-carousel.tsx            - GSAP video carousel (ARIA carousel)
      process-section.tsx            - 3-step process glassmorphic cards
      case-studies.tsx               - 3 case study cards with 3D tilt + ROI metrics
      testimonials-section.tsx       - 3 review cards
      pricing-section.tsx            - Bento pricing grid
      faq-section.tsx                - Accordion FAQ (ARIA expanded/controls)
      cta-banner.tsx                 - Primary Telegram CTA + toggle email/callback alternatives (API-gated success)
      footer-section.tsx             - Full premium footer: CTA, 4-column grid, legal bar
      telegram-fab.tsx               - Floating Telegram button
```

## Section Order (App.tsx — 14 sections, Apple-style visual-first flow)
Hero → Services → IntegrationsMarquee → IphoneCarousel (Portfolio) → AiAgent → Process → [mesh-divider] → CaseStudies → Testimonials → ClientLogos → Pricing → [mesh-divider-alt] → FAQ → CtaBanner → ContactForm → Footer

## Removed Sections (Audit Block 3)
FeaturesSection, ComparisonTable, GuaranteesSection — removed for page length optimization. 6 of 8 mesh dividers also removed. ClientLogos and IntegrationsMarquee restored.

## Pricing (Audit Block 5 — Redesigned)
3 fixed packages replacing old 3-group layout (development + subscriptions + AI):
- **Старт** (150K₽): Basic TMA, 7 days, support 9,900₽/mo
- **Бизнес** (300K₽, popular): Full-featured TMA, 14 days, support 14,900₽/mo
- **Премиум** (500K₽): TMA + multi-agent AI, 15 days, support 24,900₽/mo
Data: `src/data/pricing.ts` (PricingPackage interface). All CTAs → t.me/w4tg_bot.

## Deployment
- **Development**: Replit (port 5000 via `npm run dev`)
- **Production**: Railway (port auto via `PORT` env var, `npm run start`)
- **Railway config**: `nixpacks.toml` (Node.js 20, `npm ci && npm run build`, `npm run start`)
- **Important**: On Railway, set env vars: `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `NOTIFICATION_EMAIL`, and optionally `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`

## Running
```bash
npm run dev    # Next.js dev server on port 5000
npm run build  # Next.js production build
npm start      # Next.js production server (uses PORT env var, defaults to 3000)
```

## SEO (SSR via Next.js)
- Server-side rendering: full HTML delivered to crawlers on first request
- Next.js Metadata API in app/layout.tsx (title, description, OG, Twitter)
- JSON-LD: ProfessionalService + Organization + WebSite + WebPage + FAQPage + Service (8 services with Offer) + AggregateRating + Review (3 reviews)
- Canonical: https://web4tg.com/
- robots.txt + sitemap.xml in public/
- OG image: public/og-image.png (1200x630)
- Yandex verification: yandex_e603a085c27755fc.html

## Security (next.config.ts headers)
- CSP: self + unsafe-inline + unsafe-eval (Next.js dev) + Cloudinary (media) + unpkg/jsdelivr (Three.js CDN) + mc.yandex.ru (analytics)
- No Google Fonts in CSP (fonts are self-hosted)
- X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy
- poweredByHeader: false

## API Endpoints (app/api/)
- **POST /api/contact** — Contact form submission
  - Body: `{ name, email, phone, description }`
  - Rate limited (5/min/IP), sanitized, validated
  - Email notification via nodemailer/Gmail SMTP (env: GMAIL_USER, GMAIL_APP_PASSWORD, NOTIFICATION_EMAIL)
  - Optional Telegram Bot forwarding (env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID)
  - Supports types: 'email_capture', 'callback_request' from CTA banner

## Design System
- Dark OLED: #050505 background
- Accent color via CSS custom properties:
  - `:root` vars: `--accent` (#8B5CF6), `--accent-dark` (#7C3AED), `--accent-light` (#A78BFA), `--accent-lighter` (#C4B5FD)
  - Tailwind `@theme` vars: `--color-accent`, `--color-accent-dark`, `--color-accent-light`, `--color-accent-lighter`
- Niche colors: Shop=#8B5CF6, Restaurant=#f59e0b, Beauty=#ec4899, Fitness=#22c55e
- Fonts: Cormorant Garamond (headings, full Cyrillic support), Inter (body), Montserrat (logo) — self-hosted. Replaced Instrument Serif which had NO Cyrillic support (was falling back to Georgia).
- Typography (2026 standards): font-optical-sizing: auto, text-rendering: optimizeLegibility, font-synthesis: none, font-feature-settings: kern/liga/calt, text-wrap: balance (headings) + pretty (paragraphs), hanging-punctuation: first last, tabular-nums on pricing/stats, standardized tracking-[0.12em] on all uppercase labels
- Glassmorphism: backdrop-blur(8px) desktop, rgba(8,8,12,0.92) solid on mobile
- Section labels: uppercase, tracking-[0.12em], with line decoration
- Social links: Instagram (instagram.com/web4tg), TikTok (tiktok.com/@web4tg), YouTube (youtube.com/@WEB4TG)
- All external CTA links: https://t.me/w4tg_bot

## Apple Marketing Patterns Applied
- **Hero**: Emotional subtitle ("Ваш бизнес внутри Telegram"), no specs/pricing, no stats grid, no fake urgency
- **Services**: Bento grid — 2 large hero cards (Shops + AI) + 6 smaller cards, short headline "Для любого бизнеса"
- **Section order**: Visual proof (Portfolio) moved before AI Agent explanation
- **Headlines**: All shortened to 3-5 words Apple-style
- **CTA**: Single "Обсудить проект" button, no email/callback alternatives
- **Stats**: Removed from hero (live in Case Studies section)

## Animation System (Standardized — Block 4)
- **Easing**: `expo.out` across all hooks (replaced back.out, power4.out)
- **Duration**: 0.8s baseline, 1.2s for dramatic reveals
- **Motion values**: translateY 30-50px, blur 6-8px, rotate 1.5deg, scale 0.9-0.96 (reduced from previous heavy values)
- Hero entrance: cinematic staggered reveal without preloader — heroClipReveal (clip-path inset + translateY) for headlines, heroFadeUp (opacity + translateY + blur deconvolution) for supporting elements. Timing: badge 0.05s → headline 0.15s → headline-2 0.3s → body 0.5s → CTA 0.65s → meta 0.85s
- 11 hooks: useScrollReveal, useScrubReveal, useDirectionalReveal, useSlideReveal, useClipReveal, useRotateReveal, useFlipReveal, useScaleReveal, useWordReveal, useCharReveal (hero-only), useCountUp, useStickyNav, useTextReveal
- Micro-sound: Web Audio API programmatic tones on CTA hover (sounds off by default)
- Narrative scroll: fixed vertical thread on left side with progress line, glow orb, section nodes
- Mesh gradient dividers: 2 remaining animated radial/conic gradients between sections
- Custom cursor: rAF loop with lerp interpolation
- MagneticButton: GSAP displacement with elastic spring-back
- Case studies: 3D tilt via GSAP rotateX/Y on mousemove

## Performance
- React.lazy + per-section Suspense with contextual skeleton fallbacks
- ErrorBoundary wrapping every lazy section
- Critical CSS inlined via Next.js
- Service Worker for offline caching
- content-visibility: auto on sections
- Three.js lazy-loads via requestIdleCallback
- backdrop-filter removed on mobile (≤640px)
- Self-hosted fonts with font-display: swap
- Next.js automatic code splitting and compression

## Accessibility
- Skip-to-content link (#main-content)
- Mobile menu: focus trap, role="dialog", aria-modal="true", Escape key closes
- prefers-reduced-motion: all GSAP animations skip, Three.js disabled, Lenis fully disabled, canvas parallax off, mesh dividers hidden
- Focus-visible: purple outline (2px solid) on all interactive elements
- WCAG AA contrast: all text opacity ≥ 0.6 on dark background
- ARIA: FAQ accordion (aria-expanded, aria-controls, role=region), niche tabs (role=tablist/tab/tabpanel, aria-selected), carousel (role=group, aria-roledescription)
- Custom cursor hidden on touch devices
- Contact form: proper labels, validation errors, noValidate for custom UX
