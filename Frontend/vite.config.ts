import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    basicSsl({
      name: 'mowtitis-local',
      domains: ['localhost', 'mowtitis.localhost'],
    }),
  ],
  server: {
    host: '127.0.0.1',
    port: 5173,
    allowedHosts: ['mowtitis.localhost'],
  },
})
