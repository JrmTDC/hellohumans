export function useSetClientLocale() {
     const { locale, setLocale } = useI18n()
     const supportedLocales = ['en', 'fr', 'de', 'es', 'it', 'pt'] as const
     type Locale = typeof supportedLocales[number]

     return async (lang: string | undefined | null) => {
          if (!import.meta.client) return
          const safeLang = supportedLocales.includes(lang as Locale) ? lang : 'en'
          if (safeLang !== locale.value) {
               await setLocale(safeLang as Locale)
          }
     }
}
