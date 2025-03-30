export default defineNuxtConfig({
     compatibilityDate: '2024-11-01',
     devtools: { enabled: true },
     modules: [
       '@pinia/nuxt',
       '@nuxtjs/tailwindcss',
       '@formkit/auto-animate',
       'nuxt-svgo',
       '@nuxtjs/color-mode',
       'nuxt-echarts',
       'dayjs-nuxt',
       '@nuxtjs/i18n'
     ],
     css: [
          '@/assets/css/fonts/mulish.css',
          '@/assets/css/fonts/euclidcircularb.css',
          '@/assets/css/main.css'
     ],
     svgo: {
          defaultImport: 'component',
     },
     i18n: {
          bundle: {
               optimizeTranslationDirective: false,
          },
          strategy: 'no_prefix',
          defaultLocale: 'en',
          langDir: 'locales/',
          lazy: true,
          locales: [
               { code: 'en', file: 'en.json', name: 'English' },
               { code: 'fr', file: 'fr.json', name: 'Français' },
               { code: 'de', file: 'de.json', name: 'Deutsch' },
               { code: 'es', file: 'es.json', name: 'Español' },
               { code: 'it', file: 'it.json', name: 'Italiano' },
               { code: 'pt', file: 'pt.json', name: 'Português' },
          ],
          detectBrowserLanguage: {
               useCookie: true,
               cookieKey: 'i18n_redirected',
               alwaysRedirect: false, // Ne pas rediriger l'utilisateur
               fallbackLocale: 'en'
          }
     },
     runtimeConfig: {
          public: {
               apiBaseUrl: process.env.API_BASE_URL || ""
          },
     }
})
