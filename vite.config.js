import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      'react-helmet-async': '/src/lib/react-helmet-async.jsx',
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    hmr: { clientPort: 443 }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          katex: ['katex'],
          motion: ['framer-motion'],
        }
      }
    },
    chunkSizeWarningLimit: 900
  }
})
