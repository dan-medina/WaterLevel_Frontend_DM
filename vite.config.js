import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/query': {
        target: 'https://WaterlevelBackendDM.ecs162-s22.repl.co',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  }
})
