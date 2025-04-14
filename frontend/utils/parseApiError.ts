
export function parseApiError(err: any): {
     name: string
     description: string
     key?: string
} {
     if (!err) return { name: 'unknown', description: 'Une erreur inconnue est survenue.' }

     // Supabase error
     if (err.message) {
          return {
               name: err.name || 'supabase_error',
               description: err.message,
               key: `errors.supabase.${err.name}` // traduction potentielle
          }
     }

     // API standardisée
     if (err.error && typeof err.error === 'object') {
          return {
               name: err.error.name || 'api_error',
               description: err.error.description || 'Une erreur est survenue.',
               key: `errors.api.${err.error.name}`
          }
     }

     // Autres
     return {
          name: 'unknown_error',
          description: typeof err === 'string' ? err : JSON.stringify(err),
          key: `errors.unknown`
     }
}
