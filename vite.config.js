import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mkcert from 'vite-plugin-mkcert'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), mkcert()],
  server: {
    host: '127.0.0.1', // localhost IP
    port: 443,
    https: true,
    hmr: {
      host: 'www.bubbletime', // HMR도 같은 호스트 사용
      protocol: 'wss'
    },
    proxy: {
      '/socket.io': {
        target: 'http://127.0.0.1:3001',
        ws: true,
        changeOrigin: true,
        secure: false
      }
    }
  }
})
