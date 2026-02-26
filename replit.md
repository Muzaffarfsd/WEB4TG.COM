# WEB4TG.COM

## Overview
A React + Vite + TypeScript web application with a full-screen hero banner and a GSAP-powered video carousel. Uses Tailwind CSS 4 and the Instrument Serif / Inter fonts.

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
index.html                           - HTML entry point (includes Google Fonts)
vite.config.ts                       - Vite build configuration
server.js                            - Express server serving dist/ on port 5000
src/
  main.tsx                           - React root mount
  App.tsx                            - Main app, renders hero + carousel
  index.css                          - Tailwind CSS 4 + theme + animations
  components/
    ui/
      responsive-hero-banner.tsx     - Full-screen hero banner component
      iphone-carousel.tsx            - GSAP video carousel with progress indicators
```

## Running
```bash
npm run dev    # builds and starts Express server
npm run build  # Vite production build only
```

## Deployment
Configured for static deployment via `npm run build` -> `dist/` directory.
