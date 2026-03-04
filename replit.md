# WEB4TG Studio — web4tg.com

## Overview
WEB4TG Studio website — premium agency for Telegram Mini Apps development. Full landing page with GSAP scroll animations, 3D tilt cards, count-up stats, mouse-tracking glow, bento grid, marquee tech stack, noise texture overlay. Dark OLED theme with emerald (#10B981) accents.

## Architecture
- **Runtime**: Node.js 20
- **Framework**: React 19 + Vite 6
- **Styling**: Tailwind CSS 4 + tw-animate-css
- **Animations**: GSAP + @gsap/react + ScrollTrigger (scroll reveal, count-up, tilt, carousel)
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
  App.tsx                            - Main app, renders all sections + noise overlay
  index.css                          - Theme, animations, utility classes
  hooks/
    use-animations.tsx               - useScrollReveal, useCountUp, useTilt, useStickyNav
  components/
    ui/
      responsive-hero-banner.tsx     - Hero + sticky nav + mouse glow + count-up stats
      services-section.tsx           - Bento grid services (8 cards, 2 large + 6 small)
      iphone-carousel.tsx            - GSAP video carousel (portfolio)
      process-section.tsx            - 3-step process + marquee tech stack
      features-section.tsx           - Built-in features grid (8 cells)
      pricing-section.tsx            - 3 pricing tiers with 3D tilt
      footer-section.tsx             - CTA + footer with contacts
```

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
- Accent: emerald gradients (#10B981 → #059669)
- Fonts: Instrument Serif (headings), Inter (body)
- Gradient text: .gradient-text (emerald), .gradient-text-white (white fade)
- Glow cards: .glow-card with hover border glow
- Noise texture: .noise-overlay (z-index 1, pointer-events none)
- Buttons: .btn-primary (gradient + shadow), .btn-secondary (ghost)
- Section labels: .section-label (uppercase, tracked, with line decoration)
- Animations: scroll reveal, count-up, 3D tilt (desktop only), mouse glow, marquee
- Reduced motion: respects prefers-reduced-motion
- Touch devices: 3D tilt disabled, mouse glow uses CSS transition
- Mobile: fluid clamp() typography, 2-col grids, stacked cards, hamburger menu with overlay
