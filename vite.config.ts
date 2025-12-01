import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Configurações importantes para o Vercel:
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: undefined // Opcional: melhora performance
      }
    }
  },
  server: {
    host: true, // Importante para deploy
    port: 3000
  },
  preview: {
    port: 3000
  }
})