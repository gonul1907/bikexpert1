import { defineConfig } from 'vite';

export default defineConfig({
  // Serve from repo root — finds index.html automatically
  root: '.',
  server: {
    port: 3000,
    open: true,           // auto-opens browser
    host: true,           // also reachable on LAN
  },
  preview: {
    port: 4173,
    open: true,
  },
});
