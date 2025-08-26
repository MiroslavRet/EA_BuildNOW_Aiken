import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    global: 'globalThis',
  },
  server: {
    proxy: {
      '/koios': {
        target: 'https://preview.koios.rest/api/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/koios/, ''),
      },
    },
  },
})