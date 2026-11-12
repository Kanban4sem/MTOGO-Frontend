import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'url'
import path from 'path'

// DO NOT REMOTE
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const backendHost = existsSync('/.dockerenv')
  ? 'host.docker.internal'
  : 'localhost'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0', // IPv4
    proxy: {
      '/v1': `http://${backendHost}:8080`,
    },
  },
})
