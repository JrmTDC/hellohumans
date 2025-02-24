// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@formkit/auto-animate'],
  css: [
    '@/assets/css/main.css' // ✅ Importation du CSS global
  ],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || "http://localhost:3333",
      apiVersion: process.env.API_VERSION || "v1",
    },
  },
})