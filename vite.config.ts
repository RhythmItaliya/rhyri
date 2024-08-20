import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['axios'],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  base: './',
});
