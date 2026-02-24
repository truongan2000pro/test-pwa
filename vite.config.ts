import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['pwa-144x144.svg', 'pwa-192x192.svg', 'pwa-512x512.svg'],
        devOptions: {
          enabled: true
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}']
        },
        manifest: {
          id: 'pwa-demo-app',
          name: 'My PWA Demo',
          short_name: 'PWADemo',
          description: 'A simple PWA demo application',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          start_url: '/',
          prefer_related_applications: false,
          icons: [
            {
              src: 'pwa-192x192.svg',
              sizes: '192x192',
              purpose: 'any'
            },
            {
              src: 'pwa-512x512.svg',
              sizes: '512x512',
              purpose: 'any'
            }
          ],
          screenshots: [
            {
              src: 'https://picsum.photos/400/822.jpg',
              sizes: '400x822',
              type: 'image/jpeg',
              form_factor: 'narrow'
            },
            {
              src: 'https://picsum.photos/1280/676.jpg',
              sizes: '1280x676',
              type: 'image/jpeg',
              form_factor: 'wide'
            }
          ]
        }
      })
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
