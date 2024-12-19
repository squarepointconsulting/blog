import { defineNuxtConfig } from 'nuxt/config'
require("dotenv").config()

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  compatibilityDate: '2024-09-15',
  ssr: false,
  devtools: {enabled: true},
  modules: ['@nuxt/ui', 'nuxt-vuefire', '@vite-pwa/nuxt', ],
  vuefire: {
    auth: {
      enabled: true,
    },
    config: {
      apiKey: process.env.NUXT_FIREBASE_apiKey, 
      authDomain: process.env.NUXT_FIREBASE_authDomain,
      projectId: process.env.NUXT_FIREBASE_projectId,
      storageBucket: process.env.NUXT_FIREBASE_storageBucket,
      messagingSenderId: process.env.NUXT_FIREBASE_messagingSenderId,
      appId: process.env.NUXT_FIREBASE_appId,
      measurementId: process.env.NUXT_FIREBASE_measurementId,
    },
  },
  pwa: {
    registerType: 'autoUpdate', // Automatically updates service worker
    manifest: {
      name: 'VillaFact',
      short_name: 'VillaFact',
      description: 'Maximizing the return on your most valuable asset',
      theme_color: '#808080',
      start_url: '/',
      display: 'standalone',
      background_color: '#808080',
    },
    workbox: {
      navigateFallback: '/', // Ensure we fallback to the main page if not precached
      runtimeCaching: [
        {
          urlPattern: 'https://fonts.googleapis.com/.*',
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
            },
          },
        },
        {
          urlPattern: '/*',
          handler: 'NetworkFirst', // Use 'NetworkFirst' to ensure dynamic pages are handled
          options: {
            cacheName: 'dynamic-content',
            networkTimeoutSeconds: 10, // Fallback to cache if the network times out
          },
        },
      ],
    },
    devOptions: {
      enabled: true,
      type: 'module',
    },
  },
  vite: {
    optimizeDeps: {
      include: ['pdfjs-dist']
    },
    build: {
      commonjsOptions: {
        include: [/pdfjs-dist/]
      },
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('pdfjs-dist')) {
                return 'pdfjs'
              }
              return 'vendor'
            }
          }
        }
      }
    }
  },
  nitro: {
    externals: {
      inline: ['pdfjs-dist']
    }
  },
  build: {
    transpile: ['pdfjs-dist']
  },
  app: {
    head: {
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js',
          defer: true
        }
      ]
    }
  },
  runtimeConfig: {
    public: {
      authDomain: process.env.NUXT_PUBLIC_AUTH_DOMAIN
    }
  },
  ui: {
    primary: 'blue',
    gray: 'cool'
  }
})
