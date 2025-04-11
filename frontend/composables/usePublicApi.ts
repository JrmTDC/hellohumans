import { useRuntimeConfig } from '#imports'

export function usePublicApi() {
     const config = useRuntimeConfig()
     const apiUrl = `${config.public.apiBaseUrl}/panel`

     async function apiFetch(path: string, options: RequestInit = {}) {
          const headers = {
               'Content-Type': 'application/json',
               ...(options.headers || {})
          }

          const response = await fetch(`${apiUrl}${path}`, {
               ...options,
               headers
          })

          const contentType = response.headers.get('Content-Type') || ''
          const isJson = contentType.includes('application/json')
          const data = isJson ? await response.json() : await response.text()

          if (response) {
               return data
          }

          const message = isJson
               ? data?.error?.description || JSON.stringify(data)
               : data

          throw new Error(`Erreur API publique: ${response.status} - ${message}`)
     }

     return { apiFetch }
}
