import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { compression as viteCompression } from 'vite-plugin-compression2'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteCompression({
      algorithm: 'gzip',
      exclude: [/\.(png|jpg|jpeg|gif|webp|svg|woff2?|br|gz)$/i],
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      exclude: [/\.(png|jpg|jpeg|gif|webp|svg|woff2?|br|gz)$/i],
    }),
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
