import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: 'all',
    watch: {
      ignored: ['**/.local/**', '**/.cache/**', '**/.git/**'],
    },
  },
  build: {
    target: 'es2022',
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'gsap-vendor': ['gsap', '@gsap/react', 'gsap/all'],
          'lenis-vendor': ['lenis'],
        },
      },
    },
  },
})
