import { useRuntimeConfig, useRouter } from '#imports'

export function usePanelApi() {
     const config = useRuntimeConfig()
     const apiUrl = `${config.public.apiBaseUrl}/panel`
     const router = useRouter()
     const supabase = useSupabaseClient()

     // Récupère le token Supabase dynamiquement
     const getToken = async () => {
          const { data, error } = await supabase.auth.getSession()
          if (error || !data?.session?.access_token) return null
          return data.session.access_token
     }
     
     async function apiFetch(path: string, options: RequestInit = {}) {
          const token = await getToken()

          const headers = {
               'Content-Type': 'application/json',
               ...(token ? { Authorization: `Bearer ${token}` } : {}),
               ...(options.headers || {}),
          }

          const response = await fetch(`${apiUrl}${path}`, {
               ...options,
               headers,
          })

          const isJson = response.headers.get('Content-Type')?.includes('application/json')
          const data = isJson ? await response.json() : await response.text()

          if (!response.ok) {
               if (isJson && data?.error?.name === 'invalidToken') {
                    await supabase.auth.signOut()
                    await router.push('/panel/login')
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
