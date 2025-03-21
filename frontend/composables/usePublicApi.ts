import {useRuntimeConfig} from "#imports";
export function usePublicApi() {
     const config = useRuntimeConfig()
     const apiUrl = `${config.public.apiBaseUrl}/api/`

     async function apiFetch(path: string, options: RequestInit = {}) {
          const headers = {
               'Content-Type': 'application/json',
               ...(options.headers || {})
          }

          const response = await fetch(`${apiUrl}${path}`, {
               ...options,
               headers
          })

          if (!response.ok) {
               const errorText = await response.text()
               throw new Error(`Erreur API publique: ${response.status} - ${errorText}`)
          }

          return await response.json()
     }

     return { apiFetch }
}
