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
     app: {
          head: {
               title: 'AI Service Chatbot | Hellohumans',
               meta: [
                    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                    { charset: 'utf-8' },
                    { name: 'description', content: 'Hellohumans, is an AI customer service agent that instantly resolves up to 64% of customer queries. It understands customer intentions, responds in natural language and automates repetitive tasks.' },
                    { name: 'theme-color', content: '#ffffff' }
               ],
               link: [
                    { rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' }
               ]
          }
     },
     css: [
          '@/assets/css/fonts/mulish.css',
          '@/assets/css/fonts/euclidcircularb.css',
          '@/assets/css/main.css'
     ],
     echarts: {
          charts: ['BarChart', 'LineChart'],
          components: ['GridComponent', 'TooltipComponent', 'LegendComponent'],
          renderer: 'canvas',    // 'svg' ou 'canvas' (defaut)
     },
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
               alwaysRedirect: false,
               fallbackLocale: 'en'
          }
     },
     supabase: {
          url: process.env.SUPABASE_URL,
          key: process.env.SUPABASE_KEY,
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
               stripeKey: process.env.PUBLIC_STRIPE_KEY || "",
               chatBotName: process.env.CHAT_BOT_NAME || "",
          },
     }
})
