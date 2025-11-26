import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '', // Use relative paths for assets
  root: 'src/client',
  publicDir: '../public', // Serve static assets from src/public
  build: {
    outDir: '../../public/dist', // Output to src/public/dist
    emptyOutDir: true,
    rollupOptions: {
      input: 'src/client/index.html',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/client'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Backend server
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
