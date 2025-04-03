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
     supabase: {
          url: process.env.NUXT_PUBLIC_SUPABASE_URL,
          key: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
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
               apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || "",
               appName: process.env.NUXT_PUBLIC_APP_NAME || "",
               appYear: process.env.NUXT_PUBLIC_APP_YEAR || "",
               supabaseRedirect: process.env.NUXT_PUBLIC_SUPABASE_REDIRECT || "",
               supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || "",
               supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || "",
          },
     }
})
