import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ ssrBuild }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    hmr: { clientPort: 443 }
  },
  build: {
    chunkSizeWarningLimit: 900
  },
  ssr: {
    noExternal: ['react-katex']
  }
}))
