# WEB4TG Studio — web4tg.com

## Overview
WEB4TG Studio website — premium agency for Telegram Mini Apps development. Full Russian-language landing page with animated neon tubes background (Three.js via iframe), glassmorphic cards, GSAP scroll animations, count-up stats, bento grid, marquee tech stack, noise texture overlay, Lenis smooth scroll, gradient mesh hero. Dark OLED theme with electric violet accents using CSS custom properties.

## Architecture
- **Runtime**: Node.js 20
- **Framework**: Next.js 16 (App Router, SSR) + React 19
- **Styling**: Tailwind CSS 4 + @tailwindcss/postcss + tw-animate-css
- **Animations**: GSAP + @gsap/react + ScrollTrigger (tree-shaken imports), framer-motion
- **Smooth Scroll**: Lenis (disabled when prefers-reduced-motion)
- **Icons**: lucide-react
- **Language**: TypeScript
- **Port**: 5000 (Next.js dev/start server)
- **Fonts**: Self-hosted (Inter, Instrument Serif, Montserrat) in `public/fonts/`
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
  App.tsx                            - Main app (use client), Lenis init, Preloader, ScrollProgress, ErrorBoundary, mesh gradient dividers, SW registration. ResponsiveHeroBanner rendered OUTSIDE <main> to avoid z-index stacking context bug (header z-50 must be global, not trapped inside main's z-[2])
  index.css                          - Theme (CSS vars for accent color), animations, utility classes, glass-panel, gradient mesh, skeleton shimmer, mesh dividers, focus-visible styles
  fonts.css                          - Self-hosted @font-face declarations (Inter, Instrument Serif, Montserrat) — paths to /fonts/
  data/
    pricing.ts                       - Pricing data (development, subscriptions, AI systems)
    services.ts                      - Services data (8 industry cards)
    faq.ts                           - FAQ items (5 questions)
    testimonials.ts                  - Testimonial cards (3 reviews)
    integration-icons.tsx            - SVG path data for integration badges
  hooks/
    use-animations.tsx               - useScrollReveal, useCountUp, useParallax, useTextReveal, useCharReveal, useStickyNav, useSlideReveal, useScaleReveal, useStaggerGrid, useFlipReveal
    use-sound.tsx                    - SoundManager (Web Audio API), SoundProvider, useSound hook, programmatic tones
  components/
    ui/                              - All components marked "use client" for Next.js App Router
      error-boundary.tsx             - React ErrorBoundary with graceful fallback UI
      preloader.tsx                  - GSAP-animated preloader
      custom-cursor.tsx              - Dot + ring cursor follower
      scroll-progress.tsx            - Thin gradient progress bar at top
      scroll-narrative.tsx           - Fixed vertical story thread with progress line, glow orb, section nodes
      sound-toggle.tsx               - Floating mute/unmute button (bottom-left)
      magnetic-button.tsx            - GSAP spring-physics magnetic button
      contact-form.tsx               - Inline contact form (name, email, phone, description) + POST /api/contact
      tubes-background.tsx           - Iframe-isolated Three.js tubes
      responsive-hero-banner.tsx     - Hero + glass sticky nav + fullscreen mobile menu (numbered items, stagger animation, blur overlay, burger morph, focus trap) + useCharReveal
      client-logos.tsx               - Two-row client logos marquee
      services-section.tsx           - Bento grid services + useCharReveal heading
      ai-agent-section.tsx           - Multi-agent AI showcase (ARIA tabs)
      ai-agent/                      - AI agent sub-components (isometric office, phone mockup, etc.)
      iphone-carousel.tsx            - GSAP video carousel (ARIA carousel)
      process-section.tsx            - 3-step process glassmorphic cards
      features-section.tsx           - Technical features grid + useCharReveal heading
      case-studies.tsx               - 3 case study cards with 3D tilt + ROI metrics
      testimonials-section.tsx       - 3 review cards
      comparison-table.tsx           - 4-column comparison table
      pricing-section.tsx            - Bento pricing grid
      guarantees-section.tsx         - Bento grid with gradient borders
      faq-section.tsx                - Accordion FAQ (ARIA expanded/controls)
      integrations-marquee.tsx       - Scrolling integration badges
      cta-banner.tsx                 - Multi-channel CTA (Telegram/Email/Callback tabs)
      footer-section.tsx             - Full premium footer: CTA, 4-column grid (brand+socials, nav, company, contacts), tech stack badges, legal bar
      telegram-fab.tsx               - Floating Telegram button
```

## Section Order (App.tsx)
Hero → ClientLogos → [mesh-divider] → Services → [mesh-divider-alt] → AiAgent → IphoneCarousel → [mesh-divider-conic] → Process → [mesh-divider] → Features → [mesh-divider-alt] → CaseStudies → Testimonials → [mesh-divider-conic] → ComparisonTable → Pricing → [mesh-divider] → Guarantees → FAQ → IntegrationsMarquee → [mesh-divider-alt] → CtaBanner → ContactForm → Footer

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
- Fonts: Instrument Serif (headings), Inter (body), Montserrat (logo) — self-hosted
- Typography (2026 standards): font-optical-sizing: auto, text-rendering: optimizeLegibility, font-synthesis: none, font-feature-settings: kern/liga/calt, text-wrap: balance (headings) + pretty (paragraphs), hanging-punctuation: first last, tabular-nums on pricing/stats, standardized tracking-[0.12em] on all uppercase labels
- Glassmorphism: backdrop-blur(8px) desktop, rgba(8,8,12,0.92) solid on mobile
- Section labels: uppercase, tracking-[0.12em], with line decoration
- Social links: Instagram (instagram.com/web4tg), TikTok (tiktok.com/@web4tg), YouTube (youtube.com/@WEB4TG)
- All external links: https://t.me/w4tg_bot
- Section IDs: #services, #ai-agent, #highlights, #process, #pricing, #contact, #testimonials, #guarantees, #faq, #footer

## Animation System
- Preloader: GSAP timeline — logo scale+fade → character stagger reveal → background fade-out (~2s)
- Hero SplitText: individual character reveal with rotateX, coordinated with preloader timing
- useCharReveal: per-character scroll-driven reveal on key headings (hero, services, features)
- Micro-sound: Web Audio API programmatic tones on CTA hover (sounds off by default, mute toggle)
- Narrative scroll: fixed vertical thread on left side with progress line, glow orb, section nodes
- Mesh gradient dividers: animated radial/conic gradients between sections
- Custom cursor: rAF loop with lerp interpolation
- MagneticButton: GSAP displacement with elastic spring-back
- Scroll animations: useScrollReveal, useSlideReveal, useScaleReveal, useStaggerGrid, useFlipReveal
- Case studies: 3D tilt via GSAP rotateX/Y on mousemove
- Scroll progress: rAF-throttled gradient width bar

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
