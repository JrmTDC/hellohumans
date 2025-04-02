import { useRuntimeConfig, useRouter } from '#imports'

export function usePanelApi() {
     const config = useRuntimeConfig()
     const apiUrl = `${config.public.apiBaseUrl}/panel`
     const router = useRouter()

     const isClient = () => typeof window !== 'undefined'

     const token = () => {
          if (isClient()) {
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

          const isJson = response.headers.get('Content-Type')?.includes('application/json')
          const data = isJson ? await response.json() : await response.text()

          if (!response.ok) {
               if (isJson && data?.error?.name === 'invalidToken') {
                    if (isClient()) {
                         localStorage.removeItem('panel_token')
                         await router.push('/panel/login')
                    }
               }

               const message = isJson
                    ? `${data.error?.description || 'Erreur'}`
                    : `${response.status} - ${data}`

               throw new Error(`Erreur API Panel: ${message}`)
          }

          return data
     }

     return { apiFetch }
}
