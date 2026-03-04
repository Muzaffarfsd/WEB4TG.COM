# WEB4TG Studio — web4tg.com

## Overview
WEB4TG Studio website — premium agency for Telegram Mini Apps development. Full landing page with animated neon tubes background, glassmorphic cards, GSAP scroll animations, 3D tilt cards, count-up stats, mouse-tracking glow, bento grid, marquee tech stack, noise texture overlay, Lenis smooth scroll, magnetic buttons, gradient mesh hero. Dark OLED theme with electric violet (#8B5CF6) accents.

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
      tubes-background.tsx           - Animated neon tubes canvas background (fixed, no cursor tracking)
      responsive-hero-banner.tsx     - Hero + glass sticky nav + GradientMesh + magnetic buttons
      magnetic-button.tsx            - Magnetic button wrapper (GSAP elastic effect)
      services-section.tsx           - Bento grid services (8 glassmorphic cards)
      iphone-carousel.tsx            - GSAP video carousel (portfolio)
      process-section.tsx            - 3-step process glassmorphic cards + marquee
      features-section.tsx           - Glass features grid (8 cells)
      pricing-section.tsx            - 3 pricing glassmorphic cards + 3D tilt
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
- Accent: electric violet gradients (#8B5CF6 → #7C3AED → #A78BFA)
- Fonts: Instrument Serif (headings), Inter (body)
- Background: animated neon tubes (Canvas 2D, fixed, no cursor tracking, violet glow)
- Glassmorphism: .glass-panel and .glow-card with backdrop-blur, semi-transparent bg, border
- Gradient text: .gradient-text (violet), .gradient-text-white (white fade)
- Glow cards: .glow-card with glassmorphic hover + border glow
- Noise texture: .noise-overlay (z-index 1, pointer-events none)
- Gradient mesh: animated blurred violet blobs in hero
- Magnetic buttons: GSAP-driven elastic follow on mouse move
- Buttons: .btn-primary (gradient + shadow), .btn-secondary (ghost)
- Section labels: .section-label (uppercase, tracked, with line decoration)
- Smooth scroll: Lenis with custom easing
- Animations: scroll reveal, count-up, 3D tilt (desktop only), mouse glow, marquee, text reveal
- Reduced motion: respects prefers-reduced-motion
- Touch devices: 3D tilt disabled, mouse glow uses CSS transition
- Mobile: fluid clamp() typography, 2-col grids, stacked cards, hamburger menu with overlay
- All external links: https://t.me/w4tg_bot
- Section IDs: #services, #highlights, #process, #pricing, #contact
