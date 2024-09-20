import { defineNuxtConfig } from 'nuxt/config'
require("dotenv").config()

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  compatibilityDate: '2024-09-15',
  ssr: false,
  devtools: {enabled: true},
  modules: ['@nuxt/ui', 'nuxt-vuefire', '@vite-pwa/nuxt'],
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
      name: 'VillaFacts',
      short_name: 'VillaFacts',
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
})