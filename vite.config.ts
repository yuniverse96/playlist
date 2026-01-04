import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 5173, // Vite는 원래포트
    strictPort: true, // 5173이 아니면 실행되지 않게 강제.
  }
});