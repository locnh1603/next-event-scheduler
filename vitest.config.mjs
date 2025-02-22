import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
export default defineConfig({
  plugins: [react()],
  test: {
    environment: ['happy-dom'],
    globals: true,
    setupFiles: ['./vitest.setup.js'],
    alias: {
      '@': resolve(__dirname, './src'),
    },
  }
})
