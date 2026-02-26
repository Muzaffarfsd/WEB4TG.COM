# WEB4TG.COM

## Overview
A React + Vite + TypeScript web application with a full-screen hero banner. Uses Tailwind CSS 4 and the Instrument Serif / Inter fonts.

## Architecture
- **Runtime**: Node.js 20
- **Framework**: React 19 + Vite 6
- **Styling**: Tailwind CSS 4 + tw-animate-css
- **Language**: TypeScript
- **Port**: 5000 (dev server)
- **Entry point**: `src/main.tsx`

## Project Structure
```
index.html                           - HTML entry point (includes Google Fonts)
vite.config.ts                       - Vite configuration (host 0.0.0.0, port 5000)
src/
  main.tsx                           - React root mount
  App.tsx                            - Main app, renders hero banner
  index.css                          - Tailwind CSS 4 + theme + animations
  components/
    ui/
      responsive-hero-banner.tsx     - Full-screen hero banner component
```

## Running
```bash
npm run dev
```

## Deployment
Configured for static deployment via `npm run build` → `dist/` directory.
