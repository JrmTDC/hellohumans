// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
     compatibilityDate: '2024-11-01',
     devtools: { enabled: true },
     modules: [
       '@pinia/nuxt',
       '@nuxtjs/tailwindcss',
       '@formkit/auto-animate',
       'nuxt-svgo',
       '@nuxtjs/color-mode',
     ],
     css: [
          '@/assets/css/fonts/mulish.css',
          '@/assets/css/fonts/euclidcircularb.css',
          '@/assets/css/main.css'
     ],
     svgo: {
          defaultImport: 'component',
     },
     runtimeConfig: {
          public: {
               apiBaseUrl: process.env.API_BASE_URL || "",
               apiVersion: process.env.API_VERSION || "",
               apiClientKey: process.env.API_CLIENT_KEY || "",
          },
     },
})
