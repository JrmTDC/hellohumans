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

          const isJson = response.headers.get('Content-Type')?.includes('application/json')
          const data = isJson ? await response.json() : await response.text()

          if (!response.ok) {
               throw isJson ? data : { name: 'http_error', description: `${response.status} - ${data}` }
          }
          return data

     }

     return { apiFetch }
}
