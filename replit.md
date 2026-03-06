# WEB4TG Studio — web4tg.com

## Overview
WEB4TG Studio website — premium agency for Telegram Mini Apps development. Full Russian-language landing page with animated neon tubes background (Three.js via iframe), glassmorphic cards, GSAP scroll animations, count-up stats, bento grid, marquee tech stack, noise texture overlay, Lenis smooth scroll, gradient mesh hero. Dark OLED theme with electric violet (#8B5CF6) accents.

## Architecture
- **Runtime**: Node.js 20
- **Framework**: React 19 + Vite 7 (Rolldown bundler)
- **Styling**: Tailwind CSS 4 + tw-animate-css
- **Animations**: GSAP + @gsap/react + ScrollTrigger, framer-motion (peer dep)
- **Smooth Scroll**: Lenis
- **Icons**: lucide-react
- **Language**: TypeScript
- **Port**: 5000 (Express server with compression, security headers, serving built static files)
- **Entry point**: `src/main.tsx`
- **Fonts**: Self-hosted (Inter, Instrument Serif, Montserrat) in `src/fonts/`
- **Compression**: Brotli + Gzip pre-compressed via vite-plugin-compression2, fallback to runtime compression

## Project Structure
```
index.html                           - HTML entry (OG/Twitter meta, JSON-LD schemas, lang=ru)
vite.config.ts                       - Vite build (manualChunks, Brotli+Gzip compression plugins)
server.js                            - Express server: pre-compressed serving, CSP + security headers, immutable asset caching
public/
  favicon.svg                        - SVG favicon (violet W4 monogram)
  manifest.json                      - PWA web manifest
  robots.txt                         - Robots + sitemap reference
  sitemap.xml                        - Single-page sitemap
  og-image.png                       - Open Graph social sharing image (1200x630)
src/
  main.tsx                           - React root mount
  App.tsx                            - Main app, Lenis init, TubesBackground, ErrorBoundary, varied skeleton fallbacks
  index.css                          - Theme, animations, utility classes, glass-panel, gradient mesh, skeleton shimmer
  fonts.css                          - Self-hosted @font-face declarations (Inter, Instrument Serif, Montserrat)
  fonts/                             - Local woff2 font files (cyrillic + latin subsets)
  data/
    pricing.ts                       - Pricing data (development, subscriptions, AI systems)
    services.ts                      - Services data (8 industry cards)
    faq.ts                           - FAQ items (5 questions)
    testimonials.ts                  - Testimonial cards (3 reviews)
  hooks/
    use-animations.tsx               - useScrollReveal, useCountUp, useParallax, useTextReveal, useStickyNav
  components/
    ui/
      error-boundary.tsx             - React ErrorBoundary with graceful fallback UI
      tubes-background.tsx           - Iframe-isolated Three.js tubes (requestIdleCallback init, sandbox=allow-scripts only)
      responsive-hero-banner.tsx     - Hero + glass sticky nav + GradientMesh + text reveal + DemandIndicator (weekly seed) + mobile menu (focus trap)
      magnetic-button.tsx            - Plain link/button wrapper
      client-logos.tsx               - Two-row client logos marquee
      services-section.tsx           - Bento grid services (imports from data/)
      ai-agent-section.tsx           - Orchestrator for multi-agent AI showcase
      ai-agent/
        data.ts                      - Niche data with agentTeam arrays
        phone-mockup.tsx             - iPhone mockup with chat UI
        propensity-bar.tsx           - Animated propensity bar
        before-after-cards.tsx       - Before/after comparison cards
        result-panel.tsx             - Hero metric + result cards panel
      iphone-carousel.tsx            - GSAP video carousel with loading spinner states
      process-section.tsx            - 3-step process glassmorphic cards
      features-section.tsx           - Technical features grid (8 cells)
      case-studies.tsx               - 3 case study cards with animated count-up metrics
      testimonials-section.tsx       - 3 review cards (imports from data/)
      comparison-table.tsx           - 4-column comparison table with mobile scroll snap
      pricing-section.tsx            - Bento pricing grid (imports from data/)
      guarantees-section.tsx         - Bento grid with gradient borders
      faq-section.tsx                - Accordion FAQ (imports from data/)
      integrations-marquee.tsx       - Scrolling integration badges
      cta-banner.tsx                 - Urgency CTA with capacity badge
      footer-section.tsx             - Contact CTA + footer
      telegram-fab.tsx               - Floating Telegram button
```

## Section Order (App.tsx)
Hero → ClientLogos → Services → AiAgent → IphoneCarousel → Process → Features → CaseStudies → Testimonials → ComparisonTable → Pricing → Guarantees → FAQ → IntegrationsMarquee → CtaBanner → Footer

## Running
```bash
npm run dev    # builds and starts Express server
npm run build  # Vite production build only
npm start      # Express server only (requires dist/)
```

## SEO
- Full OG/Twitter meta tags in index.html
- JSON-LD: ProfessionalService + WebSite + WebPage + FAQPage schemas
- Canonical: https://web4tg.com/
- robots.txt + sitemap.xml in public/
- OG image: public/og-image.png (1200x630)

## Security (server.js)
- CSP: self + Cloudinary (media) + unpkg/jsdelivr (Three.js CDN)
- No Google Fonts in CSP (fonts are self-hosted)
- X-Content-Type-Options, X-Frame-Options, HSTS, Referrer-Policy, Permissions-Policy
- Brotli + Gzip pre-compressed assets served first, runtime compression fallback
- Immutable caching (1y) for hashed assets, no-cache for HTML
- Iframe sandbox: allow-scripts only (no allow-same-origin)

## Design System
- Dark OLED: #050505 background
- Accent: electric violet gradients (#8B5CF6 → #7C3AED → #A78BFA)
- Niche colors: Shop=#8B5CF6, Restaurant=#f59e0b, Beauty=#ec4899, Fitness=#22c55e
- Fonts: Instrument Serif (headings), Inter (body), Montserrat (logo) — self-hosted
- Glassmorphism: backdrop-blur(8px) desktop, rgba(8,8,12,0.92) solid on mobile
- Section labels: uppercase, tracked, with line decoration
- All external links: https://t.me/w4tg_bot
- Section IDs: #services, #ai-agent, #highlights, #process, #pricing, #contact

## Performance
- React.lazy + per-section Suspense with contextual skeleton fallbacks (cards, table, accordion, marquee, pricing)
- ErrorBoundary wrapping every lazy section
- Vendor chunks: react-vendor, gsap-vendor, lenis-vendor (manualChunks)
- Build target: es2022
- content-visibility: auto on sections
- Three.js lazy-loads via requestIdleCallback with opacity fade-in
- backdrop-filter removed on mobile (≤640px)
- Noise overlay + gradient mesh hidden on mobile
- CSS containment on cards and sections
- Self-hosted fonts with font-display: swap
- Pre-built Brotli (.br) and Gzip (.gz) compressed assets
- Video carousel loading spinner while buffering

## Accessibility
- Skip-to-content link (#main-content)
- Mobile menu: focus trap, role="dialog", aria-modal="true", Escape key closes
- prefers-reduced-motion: all GSAP animations skip, Three.js background disabled, Lenis duration=0
