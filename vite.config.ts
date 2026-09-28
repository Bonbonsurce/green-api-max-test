import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/green-api': {
        target: 'https://3100.api.green-api.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/green-api/, ''),
      },
    },
  },
})
