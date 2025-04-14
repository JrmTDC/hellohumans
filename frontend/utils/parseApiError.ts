export function parseApiError(err: any, baseLocalKey: string): {
     name: string
     description: string
     key?: string
} {
     if (!err) return { name: 'unknown', description: 'Une erreur inconnue est survenue.', key: 'errors.api.unknown' }

     // Supabase error
     if (err.message && err.code && baseLocalKey) {
          return {
               name: err.name || 'sb_error',
               description: err.message,
               key: `${baseLocalKey}.api.${err.code}` || `errors.api.unknown`
          }
     }

     // API standardisées
     if (err.error && typeof err.error === 'object') {
          return {
               name: err.error.name || 'api_error',
               description: err.error.description || 'Une erreur est survenue.',
               key: err.error.name ? `${baseLocalKey}.api.${err.error.name}` : 'errors.api.unknown'
          }
     }

     // Autres
     return {
          name: 'unknown_error',
          description: 'Une erreur inconnue est survenue.',
          key: `errors.api.unknown`
     }
}
