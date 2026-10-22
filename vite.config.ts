import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { videosFeedPlugin } from './vite/videosFeedPlugin';

// https://vitejs.dev/config/
export default defineConfig({
  // /videos-feed.json : vidéos des fiches src/content/videos (lu par le linktree).
  plugins: [react(), videosFeedPlugin('src/content/videos')],
  base: '/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
