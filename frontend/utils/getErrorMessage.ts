export function getErrorMessageByKey(key: string | null): string {
     const { t, te } = useI18n()
     if (!key) return 'An unknown error has occurred. Please try again.'
     return te(key) ? t(key) : 'An unknown error has occurred. Please try again.'
}
