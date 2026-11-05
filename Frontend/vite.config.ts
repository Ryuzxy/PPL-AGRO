import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    basicSsl({
      name: 'mowtitis-local',
      domains: ['localhost', 'mowtitis.localhost', '192.168.1.6'],
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['mowtitis.localhost', '192.168.1.6'],
  },
})
