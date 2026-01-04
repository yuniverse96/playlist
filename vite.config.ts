import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 5173, // Vite 개발 서버 포트
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Vercel Dev 서버 포트
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
