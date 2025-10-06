import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
  optimizeDeps: {
    // WebContainers use a lot of CJS modules, tell Vite to pre-bundle them
    // This can also help with some performance issues.
    include: ['@webcontainer/api'],
  },
});