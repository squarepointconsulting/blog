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
  }
})