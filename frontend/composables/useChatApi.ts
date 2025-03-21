// Configuration de l'API
import {useRuntimeConfig} from "#imports";

export function useChatApi() {
     const config = useRuntimeConfig()
     const apiUrl = `${config.public.apiBaseUrl}/api/chat/`

     const apiKey = () => {
          const chatStore = useChatStore()
          return chatStore.config.apiKey
     }

     async function apiFetch(path: string, options: RequestInit = {}) {
          const headers = {
               'Content-Type': 'application/json',
               'x-client-key': apiKey(),
               ...(options.headers || {})
          }

          const response = await fetch(`${apiUrl}${path}`, {
               ...options,
               headers
          })

          if (!response.ok) {
               const errorText = await response.text()
               throw new Error(`Erreur API Chat: ${response.status} - ${errorText}`)
          }

          return await response.json()
     }

     return { apiFetch }
}
