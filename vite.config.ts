import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

import { VitePWA } from 'vite-plugin-pwa'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    nitro(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: false,
      includeAssets: [
        'icons/favicon-16x16.png',
        'icons/favicon-32x32.png',
        'icons/favicon-48x48.png',
        'icons/apple-touch-icon.png',
      ],
      workbox: {
        cleanupOutdatedCaches: true,

        globPatterns: [],

        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              ['script', 'style', 'worker'].includes(request.destination),

            handler: 'StaleWhileRevalidate',

            options: {
              cacheName: 'gkj-static-assets',
            },
          },

          {
            urlPattern: ({ request }) =>
              ['image', 'font'].includes(request.destination),

            handler: 'CacheFirst',

            options: {
              cacheName: 'gkj-media-assets',

              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },
    }),
  ],
})

export default config
