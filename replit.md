# WEB4TG Studio — web4tg.com

## Overview
WEB4TG Studio website — premium agency for Telegram Mini Apps development. Full Russian-language landing page with animated neon tubes background (Three.js via iframe), glassmorphic cards, GSAP scroll animations, count-up stats, bento grid, marquee tech stack, noise texture overlay, Lenis smooth scroll, gradient mesh hero. Dark OLED theme with electric violet (#8B5CF6) accents. No mouse-tracking effects (no 3D tilt, no magnetic buttons, no cursor glow).

## Architecture
- **Runtime**: Node.js 20
- **Framework**: React 19 + Vite 6
- **Styling**: Tailwind CSS 4 + tw-animate-css
- **Animations**: GSAP + @gsap/react + ScrollTrigger, framer-motion (peer dep)
- **Smooth Scroll**: Lenis
- **Icons**: lucide-react
- **Language**: TypeScript
- **Port**: 5000 (Express server serving built static files)
- **Entry point**: `src/main.tsx`

## Project Structure
```
index.html                           - HTML entry (Google Fonts, meta tags, lang=ru)
vite.config.ts                       - Vite build configuration
server.js                            - Express server serving dist/ on PORT or 5000
src/
  main.tsx                           - React root mount
  App.tsx                            - Main app, Lenis init, TubesBackground, all sections
  index.css                          - Theme, animations, utility classes, glass-panel, gradient mesh
  hooks/
    use-animations.tsx               - useScrollReveal, useCountUp, useTilt, useTextReveal, useStickyNav
  components/
    ui/
      tubes-background.tsx           - Iframe-isolated Three.js tubes background (CDN tubes1 + Canvas 2D fallback, 3-level input blocking)
      responsive-hero-banner.tsx     - Hero + glass sticky nav + GradientMesh + text reveal + DemandIndicator (dynamic "Ближайший старт") + stats 2x2 mobile
      magnetic-button.tsx            - Plain link/button wrapper (no mouse tracking)
      client-logos.tsx               - Two-row client logos marquee (opposite directions)
      services-section.tsx           - Bento grid services (8 clickable <a> cards linking to sections, ArrowUpRight visible on hover)
      ai-agent-section.tsx           - Premium multi-niche AI agent showcase (4 niches, 3 stages, 2-column layout, iPhone 17 Pro Max mockup, before/after cards, social proof, CTA)
      iphone-carousel.tsx            - GSAP video carousel (portfolio) with gradient fallback on video error
      process-section.tsx            - 3-step process glassmorphic cards (step 3 links to #pricing)
      features-section.tsx           - "Под капотом" — technical features grid (8 cells, PCI DSS, WebSocket, PWA details)
      case-studies.tsx               - 3 case study cards with animated count-up metrics (IntersectionObserver) + hover effects
      testimonials-section.tsx       - 3 review cards with verified badges, result metrics, gradient avatars, company info
      comparison-table.tsx           - 4-column comparison table with mobile scroll snap + animated hint arrow
      pricing-section.tsx            - Development cost block (от 150 000₽) + 3 subscription plans
      guarantees-section.tsx         - Bento grid (first card spans 2 cols) with gradient top borders + icon hover animations
      faq-section.tsx                - Accordion FAQ (5 items, one open at a time)
      integrations-marquee.tsx       - Scrolling integration badges with emoji prefixes
      cta-banner.tsx                 - Urgency-focused CTA ("конкуренты уже запустили") with capacity badge + trust indicators
      footer-section.tsx             - Contact CTA + footer (© 2026)
      telegram-fab.tsx               - Floating Telegram button (FAB, visible after scrolling past hero)
```

## Section Order (App.tsx)
Hero → ClientLogos → Services → AiAgent → IphoneCarousel → Process → Features → CaseStudies → Testimonials → ComparisonTable → Pricing → Guarantees → FAQ → IntegrationsMarquee → CtaBanner → Footer

## Running
```bash
npm run dev    # builds and starts Express server
npm run build  # Vite production build only
npm start      # Express server only (requires dist/)
```

## Deployment (Railway)
- Build: `npm run build`
- Start: `npm start`
- All build tools in `dependencies` (not devDependencies) for Railway
- Express reads PORT env var, defaults to 5000

## Design System
- Dark OLED: #050505 background
- Accent: electric violet gradients (#8B5CF6 → #7C3AED → #A78BFA)
- Fonts: Instrument Serif (headings), Inter (body), Montserrat (logo: WEB4TG STUDIO)
- Background: Three.js tubes1 library via iframe (CDN), Canvas 2D multi-pass glow fallback; 3-level input isolation (CSS pointer-events:none + inert, JS event blocking, frozen mouse coords)
- Glassmorphism: .glass-panel and .glow-card with backdrop-blur(16px), semi-transparent bg rgba(8,8,12,0.75), border
- Gradient text: .gradient-text (violet), .gradient-text-white (white fade)
- Glow cards: .glow-card with glassmorphic hover + border glow
- Noise texture: .noise-overlay (z-index 1, pointer-events none)
- Gradient mesh: animated blurred violet blobs in hero
- Buttons: .btn-primary (gradient + shadow + rotating conic-gradient border), .btn-secondary (ghost); MagneticButton is plain wrapper (no GSAP)
- Section labels: .section-label (uppercase, tracked, with line decoration)
- Smooth scroll: Lenis with autoRaf and custom easing
- Animations: scroll reveal, count-up (direct DOM updates), marquee, text reveal, pulse-glow, bounce-slow (no 3D tilt, no mouse glow, no cursor tracking)
- Performance: backdrop-blur(16px) instead of 32px, CSS containment on sections/cards, rAF-throttled scroll handlers, GSAP ticker cleanup, decorative blobs blur(80px)
- Reduced motion: respects prefers-reduced-motion
- Mobile: fluid clamp() typography, 2-col grids, stacked cards, hamburger menu with overlay, horizontal scroll on comparison table
- All external links: https://t.me/w4tg_bot
- Section IDs: #services, #ai-agent, #highlights, #process, #pricing, #contact
