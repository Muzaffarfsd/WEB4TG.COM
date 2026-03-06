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

## Project Structure
```
index.html                           - HTML entry (Google Fonts preload, OG/Twitter meta, JSON-LD schemas, lang=ru)
vite.config.ts                       - Vite build (manualChunks: react/gsap/lenis vendors, es2022 target)
server.js                            - Express server: compression, CSP + security headers, immutable asset caching, no-cache HTML
public/
  favicon.svg                        - SVG favicon (violet W4 monogram)
  manifest.json                      - PWA web manifest
  robots.txt                         - Robots + sitemap reference
  sitemap.xml                        - Single-page sitemap
src/
  main.tsx                           - React root mount
  App.tsx                            - Main app, Lenis init, TubesBackground, skip-link, SectionSkeleton fallbacks
  index.css                          - Theme, animations, utility classes, glass-panel, gradient mesh, skip-link, skeleton shimmer
  hooks/
    use-animations.tsx               - useScrollReveal, useCountUp, useTilt, useTextReveal, useStickyNav
  components/
    ui/
      tubes-background.tsx           - Iframe-isolated Three.js tubes (lazy-loads after 1.5s, fade-in, respects prefers-reduced-motion)
      responsive-hero-banner.tsx     - Hero + glass sticky nav + GradientMesh + text reveal + DemandIndicator + mobile menu (focus trap, role=dialog, aria-modal, Escape key)
      magnetic-button.tsx            - Plain link/button wrapper
      client-logos.tsx               - Two-row client logos marquee
      services-section.tsx           - Bento grid services (8 cards)
      ai-agent-section.tsx           - Orchestrator for multi-agent AI showcase (~14KB)
      ai-agent/
        data.ts                      - Niche data with agentTeam arrays (5-6 agents per niche), interfaces, constants (~23KB)
        phone-mockup.tsx             - iPhone mockup with chat UI, team avatars overlay (~10KB)
        propensity-bar.tsx           - Animated propensity bar (~1KB)
        before-after-cards.tsx       - Before/after comparison cards (~2KB)
        result-panel.tsx             - Hero metric + result cards panel (~5KB)
      iphone-carousel.tsx            - GSAP video carousel (portfolio), reduced-motion safe
      process-section.tsx            - 3-step process glassmorphic cards
      features-section.tsx           - Technical features grid (8 cells)
      case-studies.tsx               - 3 case study cards with animated count-up metrics
      testimonials-section.tsx       - 3 review cards
      comparison-table.tsx           - 4-column comparison table with mobile scroll snap
      pricing-section.tsx            - Bento pricing grid (5 blocks)
      guarantees-section.tsx         - Bento grid with gradient borders
      faq-section.tsx                - Accordion FAQ (5 items)
      integrations-marquee.tsx       - Scrolling integration badges
      cta-banner.tsx                 - Urgency CTA with capacity badge
      footer-section.tsx             - Contact CTA + footer (© 2026)
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
- JSON-LD: Organization + WebSite + Service schemas
- Canonical: https://web4tg.com/
- robots.txt + sitemap.xml in public/
- OG image: references https://web4tg.com/og-image.png (needs to be created/uploaded)

## Security (server.js)
- CSP: self + Google Fonts + Cloudinary + unpkg + jsdelivr CDNs
- X-Content-Type-Options, X-Frame-Options, HSTS, Referrer-Policy, Permissions-Policy
- Compression (gzip) via `compression` package
- Immutable caching (1y) for hashed assets, no-cache for HTML

## Design System
- Dark OLED: #050505 background
- Accent: electric violet gradients (#8B5CF6 → #7C3AED → #A78BFA)
- Niche colors: Shop=#8B5CF6, Restaurant=#f59e0b, Beauty=#ec4899, Fitness=#22c55e
- Fonts: Instrument Serif (headings), Inter (body), Montserrat (logo)
- Glassmorphism: backdrop-blur(8px) desktop, rgba(8,8,12,0.92) solid on mobile
- Section labels: uppercase, tracked, with line decoration
- All external links: https://t.me/w4tg_bot
- Section IDs: #services, #ai-agent, #highlights, #process, #pricing, #contact

## Performance
- React.lazy + per-section Suspense with SectionSkeleton shimmer fallbacks
- Vendor chunks: react-vendor, gsap-vendor, lenis-vendor (manualChunks)
- Build target: es2022
- content-visibility: auto on sections
- Three.js lazy-loads after 1.5s delay with opacity fade-in
- backdrop-filter removed on mobile (≤640px)
- Noise overlay + gradient mesh hidden on mobile
- CSS containment on cards and sections
- Google Fonts: preload + display=swap + preconnect

## Accessibility
- Skip-to-content link (#main-content)
- Mobile menu: focus trap, role="dialog", aria-modal="true", Escape key closes
- prefers-reduced-motion: all GSAP animations skip, Three.js background disabled, Lenis duration=0
