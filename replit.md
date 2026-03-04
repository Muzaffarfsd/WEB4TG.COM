# WEB4TG Studio — web4tg.com

## Overview
WEB4TG Studio website — a web agency specializing in Telegram Mini Apps development for business. Full landing page with hero banner, services, portfolio carousel, process steps, features, pricing, and contact sections. Dark theme with emerald (#10B981) accents.

## Architecture
- **Runtime**: Node.js 20
- **Framework**: React 19 + Vite 6
- **Styling**: Tailwind CSS 4 + tw-animate-css
- **Animations**: GSAP + @gsap/react + ScrollTrigger
- **Icons**: lucide-react
- **Language**: TypeScript
- **Port**: 5000 (Express server serving built static files)
- **Entry point**: `src/main.tsx`

## Project Structure
```
index.html                           - HTML entry (Google Fonts, meta tags)
vite.config.ts                       - Vite build configuration
server.js                            - Express server serving dist/ on PORT or 5000
src/
  main.tsx                           - React root mount
  App.tsx                            - Main app, renders all sections
  index.css                          - Tailwind CSS 4 + theme + animations
  components/
    ui/
      responsive-hero-banner.tsx     - Hero banner with nav, badge, stats
      services-section.tsx           - Services grid (8 categories)
      iphone-carousel.tsx            - GSAP video carousel (portfolio)
      process-section.tsx            - 3-step process + tech stack
      features-section.tsx           - Built-in features grid
      pricing-section.tsx            - 3 pricing tiers
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
- All build tools in `dependencies` (not devDependencies) for Railway compatibility
- Express reads PORT env var, defaults to 5000

## Design System
- Dark theme: OLED black (#09090b) backgrounds
- Accent: emerald green (#10B981)
- Fonts: Instrument Serif (headings), Inter (body)
- Glassmorphism cards with ring borders
- Fade-slide-in animations
- Mobile-first responsive design
