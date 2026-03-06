# WEB4TG Studio — web4tg.com

## Overview
WEB4TG Studio website — premium agency for Telegram Mini Apps development. Full Russian-language landing page with animated neon tubes background (Three.js via iframe), glassmorphic cards, GSAP scroll animations, count-up stats, bento grid, marquee tech stack, noise texture overlay, Lenis smooth scroll, gradient mesh hero. Dark OLED theme with electric violet accents using CSS custom properties.

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
  App.tsx                            - Main app, Lenis init, Preloader, CustomCursor, ScrollProgress, ErrorBoundary, varied skeleton fallbacks
  index.css                          - Theme (CSS vars for accent color), animations, utility classes, glass-panel, gradient mesh, skeleton shimmer
  fonts.css                          - Self-hosted @font-face declarations (Inter, Instrument Serif, Montserrat)
  fonts/                             - Local woff2 font files (cyrillic + latin subsets)
  data/
    pricing.ts                       - Pricing data (development, subscriptions, AI systems)
    services.ts                      - Services data (8 industry cards)
    faq.ts                           - FAQ items (5 questions)
    testimonials.ts                  - Testimonial cards (3 reviews)
    integration-icons.tsx            - SVG path data for integration badges (extracted from integrations-marquee)
  hooks/
    use-animations.tsx               - useScrollReveal, useCountUp, useParallax, useTextReveal, useStickyNav, useSlideReveal, useScaleReveal, useStaggerGrid, useFlipReveal
  components/
    ui/
      error-boundary.tsx             - React ErrorBoundary with graceful fallback UI
      preloader.tsx                  - GSAP-animated preloader (logo + character reveal + fade out ~2s)
      custom-cursor.tsx              - Dot (8px) + ring (40px) cursor follower with mix-blend-mode:difference, grows on hover over interactive elements, hidden on touch devices
      scroll-progress.tsx            - Thin gradient progress bar at top of viewport (accent gradient)
      magnetic-button.tsx            - GSAP spring-physics magnetic button (elastic.out on mouseleave)
      contact-form.tsx               - Inline contact form (name, phone/telegram, description) with validation, Telegram deep link submit
      tubes-background.tsx           - Iframe-isolated Three.js tubes (requestIdleCallback init, sandbox=allow-scripts only)
      responsive-hero-banner.tsx     - Hero + glass sticky nav + GradientMesh + SplitText reveal + DemandIndicator (weekly seed) + mobile menu (focus trap)
      client-logos.tsx               - Two-row client logos marquee
      services-section.tsx           - Bento grid services (imports from data/)
      ai-agent-section.tsx           - Orchestrator for multi-agent AI showcase
      ai-agent/
        data.ts                      - Niche data with agentTeam arrays
        isometric-office.tsx         - Main isometric office component with drone, roomba, toast systems
        office-config.ts             - Layout, colors, positions config + Drone/Roomba/Toast interfaces + Agent (glasses/headphones/hairStyle fields)
        office-agents.ts             - Agent movement logic + buildLayout (mobile-aware: fewer desks/lounges/agents on low LOD, wider spacing)
        office-renderer.ts           - Canvas drawing: room, desks, chibi-style agents (gradient shading, ears, 5 hairstyles, glasses, headphones, cheek blush, eye detail w/ pupils+highlights, drop shadows), arcade, couch, vending, coffee table, whiteboard (kanban), clock, wifi router, roomba, toasts, water cooler, cables, bookshelf, drone, connections, particles
        phone-mockup.tsx             - iPhone mockup with chat UI
        propensity-bar.tsx           - Animated propensity bar
        before-after-cards.tsx       - Before/after comparison cards
        result-panel.tsx             - Hero metric + result cards panel
      iphone-carousel.tsx            - GSAP video carousel with loading spinner states
      process-section.tsx            - 3-step process glassmorphic cards (slideRight animation)
      features-section.tsx           - Technical features grid (staggerGrid animation)
      case-studies.tsx               - 3 case study cards with 3D tilt on mousemove, phone mockups, colored metric badges, tech stack pills
      testimonials-section.tsx       - 3 review cards (flipReveal animation)
      comparison-table.tsx           - 4-column comparison table with mobile scroll snap (slideLeft animation)
      pricing-section.tsx            - Bento pricing grid (imports from data/)
      guarantees-section.tsx         - Bento grid with gradient borders (scaleReveal animation)
      faq-section.tsx                - Accordion FAQ (imports from data/)
      integrations-marquee.tsx       - Scrolling integration badges (SVG data from data/integration-icons.tsx)
      cta-banner.tsx                 - Urgency CTA with capacity badge (scaleReveal animation)
      footer-section.tsx             - Contact CTA + footer (dynamic year)
      telegram-fab.tsx               - Floating Telegram button
```

## Section Order (App.tsx)
Hero → ClientLogos → Services → AiAgent → IphoneCarousel → Process → Features → CaseStudies → Testimonials → ComparisonTable → Pricing → Guarantees → FAQ → IntegrationsMarquee → CtaBanner → ContactForm → Footer

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
- Hero SplitText: individual character reveal with rotateX, coordinated with preloader timing (2.2s/2.7s delays)
- CSS fade-slide-in animations: delayed to start after preloader (2.1s-3.8s)
- Custom cursor: rAF loop with lerp interpolation (dot: 0.35, ring: 0.12), grows 1.8x on interactive hover
- MagneticButton: GSAP displacement on mousemove (power2.out), elastic spring-back on leave (elastic.out(1, 0.3))
- Scroll animations (per-section diversity): useScrollReveal (fadeUp), useSlideReveal (left/right), useScaleReveal (scale+rotate), useStaggerGrid (children stagger), useFlipReveal (rotateX flip)
- Case studies: 3D tilt via GSAP rotateX/Y on mousemove with perspective
- Scroll progress: rAF-throttled scroll listener, gradient width bar

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

### Canvas Office Optimizations
- **OffscreenCanvas static cache** (`renderStaticLayer`): wall, floor, bricks, tiles, grid, divider, zone labels, LED strips, window/sky/city, server rack shell, plant — rendered once and reused as `drawImage()` per frame
- **LOD system** (detectLOD): 'high' (W≥700), 'medium' (400-699), 'low' (<400). On 'low': skip cables, clock, wifi router, bookshelf, water cooler, roomba, drone; larger grid step, no tile checkerboard, no light cones; fewer desks (3 vs 5), fewer agents (max 4), wider spacing. On 'medium': double brick width
- **Responsive canvas aspect ratio**: CSS class `office-canvas-wrap` — 16/9 desktop, 3/2 tablet (640-899px), 4/3 mobile (<640px)
- **DPR capped at MAX_DPR=2** — prevents 3x mobile from rendering 9x pixel count
- **IntersectionObserver** pauses rAF when canvas is offscreen (threshold 0.05)
- **Pre-sorted desk positions** stored in `sortedDesks.current` (sorted once on layout rebuild, not per frame)
- **All `shadowBlur` replaced** with cheaper alpha-blended glow rects/circles — eliminates GPU shadow compositing
- **Loop-based state counting** instead of `.filter()` for walking/working/idle counts
- **`drawRoomDynamic`** renders only per-frame dynamic elements: ceiling lights, screen animations, server LEDs, city building lights, alert pulse

## Accessibility
- Skip-to-content link (#main-content)
- Mobile menu: focus trap, role="dialog", aria-modal="true", Escape key closes
- prefers-reduced-motion: all GSAP animations skip (gsap.set instead of gsap.to), Three.js background disabled, Lenis duration=0
- Custom cursor hidden on touch devices
- Contact form: proper labels, validation errors, noValidate for custom UX
