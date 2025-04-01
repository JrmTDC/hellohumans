import { useRuntimeConfig } from "#imports";
export function usePanelApi() {
     const config = useRuntimeConfig()
     const apiUrl = `${config.public.apiBaseUrl}/panel`

     const token = () => {
          if (process.client) {
               return localStorage.getItem('panel_token') || ''
          }
          return ''
     }

     async function apiFetch(path: string, options: RequestInit = {}) {
          const headers = {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token()}`,
               ...(options.headers || {})
          }

          const response = await fetch(`${apiUrl}${path}`, {
               ...options,
               headers
          })

          if (!response.ok) {
               const errorText = await response.text()
               throw new Error(`Erreur API Panel: ${response.status} - ${errorText}`)
          }

          return await response.json()
     }

     return { apiFetch }
}
