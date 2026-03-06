# WEB4TG Studio — web4tg.com

## Overview
WEB4TG Studio website — premium agency for Telegram Mini Apps development. Full Russian-language landing page with animated neon tubes background (Three.js via iframe), glassmorphic cards, GSAP scroll animations, count-up stats, bento grid, marquee tech stack, noise texture overlay, Lenis smooth scroll, gradient mesh hero. Dark OLED theme with electric violet accents using CSS custom properties.

## Architecture
- **Runtime**: Node.js 20
- **Framework**: React 19 + Vite 7 (Rolldown bundler)
- **Styling**: Tailwind CSS 4 + tw-animate-css
- **Animations**: GSAP + @gsap/react + ScrollTrigger (tree-shaken imports), framer-motion (peer dep)
- **Smooth Scroll**: Lenis (disabled when prefers-reduced-motion)
- **Icons**: lucide-react
- **Language**: TypeScript
- **Port**: 5000 (Express server with compression, security headers, serving built static files)
- **Entry point**: `src/main.tsx`
- **Fonts**: Self-hosted (Inter, Instrument Serif, Montserrat) in `src/fonts/`
- **Compression**: Brotli + Gzip pre-compressed via vite-plugin-compression2, fallback to runtime compression
- **Service Worker**: `public/sw.js` — offline caching, stale-while-revalidate

## Project Structure
```
index.html                           - HTML entry (OG/Twitter meta, JSON-LD schemas, critical CSS inline, lang=ru)
vite.config.ts                       - Vite build (manualChunks, Brotli+Gzip compression plugins)
server.js                            - Express server: pre-compressed serving, CSP + security headers, rate limiting, /api/contact, immutable asset caching
public/
  favicon.svg                        - SVG favicon (violet W4 monogram)
  manifest.json                      - PWA web manifest
  robots.txt                         - Robots + sitemap reference
  sitemap.xml                        - Single-page sitemap
  og-image.png                       - Open Graph social sharing image (1200x630)
  sw.js                              - Service Worker (offline + stale-while-revalidate)
src/
  main.tsx                           - React root mount + SW registration
  App.tsx                            - Main app, Lenis init (disabled w/ reduced-motion), Preloader, CustomCursor, ScrollProgress, ScrollNarrative, SoundProvider, SoundToggle, ErrorBoundary, mesh gradient dividers
  index.css                          - Theme (CSS vars for accent color), animations, utility classes, glass-panel, gradient mesh, skeleton shimmer, mesh dividers, focus-visible styles, scroll narrative styles
  fonts.css                          - Self-hosted @font-face declarations (Inter, Instrument Serif, Montserrat)
  fonts/                             - Local woff2 font files (cyrillic + latin subsets)
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
    ui/
      error-boundary.tsx             - React ErrorBoundary with graceful fallback UI
      preloader.tsx                  - GSAP-animated preloader
      custom-cursor.tsx              - Dot + ring cursor follower
      scroll-progress.tsx            - Thin gradient progress bar at top
      scroll-narrative.tsx           - Fixed vertical story thread with progress line, glow orb, section nodes
      sound-toggle.tsx               - Floating mute/unmute button (bottom-left)
      magnetic-button.tsx            - GSAP spring-physics magnetic button
      contact-form.tsx               - Inline contact form (name, email, phone, description) + POST /api/contact
      tubes-background.tsx           - Iframe-isolated Three.js tubes
      responsive-hero-banner.tsx     - Hero + glass sticky nav + useCharReveal
      client-logos.tsx               - Two-row client logos marquee
      services-section.tsx           - Bento grid services + useCharReveal heading
      ai-agent-section.tsx           - Multi-agent AI showcase (ARIA tabs)
      ai-agent/
        data.ts                      - Niche data with agentTeam arrays
        isometric-office.tsx         - Main canvas component: mouse parallax, FPS monitoring, agent tooltips, code particles, adaptive LOD
        office-config.ts             - Constants (ROOM_LEFT_PCT etc.), interfaces (Agent, Drone, Roomba, Toast, OfficeCat, CodeParticle), LOD/FPS helpers
        office-agents.ts             - Agent movement logic + buildLayout
        office-renderer.ts           - Barrel re-export from submodules
        draw-environment.ts          - Static layer + room dynamic (ambient occlusion, ceiling lights, windows, screens)
        draw-furniture.ts            - Desks, arcade (detailed + player), couch, vending, coffee table (soft shadows)
        draw-effects.ts              - Particles, connections, cables, drones, roombas, toasts, office cat, code particles
        draw-ui.ts                   - Persons, whiteboard, clock, wifi router, neon sign
        phone-mockup.tsx             - iPhone mockup with chat UI
        propensity-bar.tsx           - Animated propensity bar
        before-after-cards.tsx       - Before/after comparison cards
        result-panel.tsx             - Hero metric + result cards panel
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
      footer-section.tsx             - Contact CTA + footer
      telegram-fab.tsx               - Floating Telegram button
```

## Section Order (App.tsx)
Hero → ClientLogos → [mesh-divider] → Services → [mesh-divider-alt] → AiAgent → IphoneCarousel → [mesh-divider-conic] → Process → [mesh-divider] → Features → [mesh-divider-alt] → CaseStudies → Testimonials → [mesh-divider-conic] → ComparisonTable → Pricing → [mesh-divider] → Guarantees → FAQ → IntegrationsMarquee → [mesh-divider-alt] → CtaBanner → ContactForm → Footer

## Running
```bash
npm run dev    # builds and starts Express server
npm run build  # Vite production build only
npm start      # Express server only (requires dist/)
```

## SEO
- Full OG/Twitter meta tags in index.html
- JSON-LD: ProfessionalService + Organization + WebSite + WebPage + FAQPage + Service (8 services with Offer) + AggregateRating + Review (3 reviews)
- Canonical: https://web4tg.com/
- robots.txt + sitemap.xml in public/
- OG image: public/og-image.png (1200x630)
- Yandex verification: yandex_e603a085c27755fc.html

## Security (server.js)
- CSP: self + unsafe-inline + Cloudinary (media) + unpkg/jsdelivr (Three.js CDN) + mc.yandex.ru (analytics)
- No Google Fonts in CSP (fonts are self-hosted)
- X-Content-Type-Options, X-Frame-Options, HSTS (1 year), Referrer-Policy, Permissions-Policy
- Rate limiting: max 5 requests/IP/minute on /api/contact
- Input sanitization: XSS prevention (HTML entity escaping), 2000 char limit
- Brotli + Gzip pre-compressed assets served first, runtime compression fallback
- Immutable caching (1y) for hashed assets, no-cache for HTML
- Iframe sandbox: allow-scripts only (no allow-same-origin)

## API Endpoints
- **POST /api/contact** — Contact form submission
  - Body: `{ name, email, phone, description }`
  - Rate limited (5/min/IP), sanitized, validated
  - Optional Telegram Bot forwarding (env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID)
  - Supports types: 'email_capture', 'callback_request' from CTA banner

## Design System
- Dark OLED: #050505 background
- Accent color via CSS custom properties:
  - `:root` vars: `--accent` (#8B5CF6), `--accent-dark` (#7C3AED), `--accent-light` (#A78BFA), `--accent-lighter` (#C4B5FD)
  - Tailwind `@theme` vars: `--color-accent`, `--color-accent-dark`, `--color-accent-light`, `--color-accent-lighter`
- Niche colors: Shop=#8B5CF6, Restaurant=#f59e0b, Beauty=#ec4899, Fitness=#22c55e
- Fonts: Instrument Serif (headings), Inter (body), Montserrat (logo) — self-hosted
- Glassmorphism: backdrop-blur(8px) desktop, rgba(8,8,12,0.92) solid on mobile
- Section labels: uppercase, tracked, with line decoration
- All external links: https://t.me/w4tg_bot
- Section IDs: #services, #ai-agent, #highlights, #process, #pricing, #contact

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
- Vendor chunks: react-vendor, gsap-vendor (tree-shaken), lenis-vendor
- Critical CSS inlined in index.html
- Service Worker for offline caching
- Build target: es2022
- content-visibility: auto on sections
- Three.js lazy-loads via requestIdleCallback
- backdrop-filter removed on mobile (≤640px)
- Self-hosted fonts with font-display: swap
- Pre-built Brotli (.br) and Gzip (.gz) compressed assets

### Canvas Office Optimizations
- **OffscreenCanvas static cache**: wall, floor, bricks, tiles, grid rendered once
- **LOD system**: 'high' (W≥700), 'medium' (400-699), 'low' (<400) — device-aware via navigator.deviceMemory/hardwareConcurrency
- **FPS monitoring**: auto-downgrade LOD if FPS < 30 for 2+ seconds
- **Mouse parallax**: subtle 1-2° scene tilt based on mouse position
- **Agent tooltips**: hover shows name/role in glassmorphic tooltip
- **Code particles**: flying code symbols near working agents
- **Ambient occlusion**: darkened room corners and edges
- **Soft shadows**: blur-filtered ellipses under furniture
- **Modular rendering**: split into draw-environment, draw-furniture, draw-effects, draw-ui
- **DPR capped at MAX_DPR=2**
- **IntersectionObserver** pauses rAF when offscreen

## Accessibility
- Skip-to-content link (#main-content)
- Mobile menu: focus trap, role="dialog", aria-modal="true", Escape key closes
- prefers-reduced-motion: all GSAP animations skip, Three.js disabled, Lenis fully disabled, canvas parallax off, mesh dividers hidden
- Focus-visible: purple outline (2px solid) on all interactive elements
- WCAG AA contrast: all text opacity ≥ 0.6 on dark background
- ARIA: FAQ accordion (aria-expanded, aria-controls, role=region), niche tabs (role=tablist/tab/tabpanel, aria-selected), carousel (role=group, aria-roledescription)
- Custom cursor hidden on touch devices
- Contact form: proper labels, validation errors, noValidate for custom UX
