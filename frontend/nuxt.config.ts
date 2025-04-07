export default defineNuxtConfig({
     compatibilityDate: '2024-11-01',
     devtools: { enabled: true },
     modules: [
       '@pinia/nuxt',
       '@nuxtjs/tailwindcss',
       'nuxt-svgo',
       '@nuxtjs/color-mode',
       'nuxt-echarts',
       'dayjs-nuxt',
       '@nuxtjs/i18n',
       '@nuxtjs/supabase'
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
               { code: 'en', file: 'en.json', name: 'English (EN)', shortName:'English' },
               { code: 'fr', file: 'fr.json', name: 'Français (FR)', shortName:'Français' },
               { code: 'de', file: 'de.json', name: 'Deutsch (DE)' , shortName:'Deutsch'},
               { code: 'es', file: 'es.json', name: 'Español (ES)' , shortName:'Español'},
               { code: 'it', file: 'it.json', name: 'Italiano (IT)' , shortName:'Italiano'},
               { code: 'pt', file: 'pt.json', name: 'Português (PT)' , shortName:'Português'},
          ],
          detectBrowserLanguage: {
               useCookie: true,
               cookieKey: 'i18n_redirected',
               alwaysRedirect: false, // Ne pas rediriger l'utilisateur
               fallbackLocale: 'en'
          }
     },
     supabase: {
          redirect:true,
          redirectOptions: {
               login: '/panel/login',
               callback: '/panel/',
               include: ['/panel/**'],
               exclude: ['/panel/login', '/panel/register', '/panel/forgot-password', '/panel/reset-password'],
               saveRedirectToCookie: false,
          }
     },
     runtimeConfig: {
          public: {
               apiBaseUrl: process.env.API_BASE_URL || "",
               appName: process.env.APP_NAME || "",
               appYear: process.env.APP_YEAR || "",
               supabaseBaseUrlRedirect: process.env.SUPABASE_BASE_URL_REDIRECT || "",
          },
     }
})
