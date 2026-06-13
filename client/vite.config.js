import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// During `npm run dev`, the app calls relative '/api' and connects sockets to
// the same origin (port 5173). These proxies forward both to the backend on
// :5000, so the exact same relative URLs work unchanged in production.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000',
      '/socket.io': { target: 'http://localhost:5000', ws: true },
    },
  },
});
