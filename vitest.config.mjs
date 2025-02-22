import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: ['happy-dom'],
    include: [
      'src/app/**/*.{test,spec}.{js,jsx,ts,tsx}',
      'src/utilities/**/*.{test,spec}.{js,jsx,ts,tsx}'
    ],
    exclude: ['node_modules', 'dist', '.next'],
    coverage: {
      include: [
        'src/app/**',
        'src/utilities/**'
      ],
      exclude: [
        'node_modules',
        'dist',
        '.next',
        '**/*.d.ts',
        '**/*.test.{js,jsx,ts,tsx}',
        '**/*.spec.{js,jsx,ts,tsx}'
      ]
    },
    globals: true,
    setupFiles: ['./vitest.setup.js'],
    alias: {
      '@': resolve(__dirname, './src'),
    },
  }
})
