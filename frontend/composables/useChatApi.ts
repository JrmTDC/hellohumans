import { useRuntimeConfig } from '#imports'
import { useChatStore } from '~/stores/chatStore'

export function useChatApi() {
     const config = useRuntimeConfig()
     const apiUrl = `${config.public.apiBaseUrl}/api/chat/`

     const chatStore = useChatStore()
     const apiKey = () => chatStore.config.apiKey || ''

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

          const contentType = response.headers.get('Content-Type') || ''
          const isJson = contentType.includes('application/json')
          const data = isJson ? await response.json() : await response.text()

          if (response.ok) {
               return data
          }

          const message = isJson
               ? data?.error?.description || JSON.stringify(data)
               : data

          throw new Error(`Erreur API Chat: ${response.status} - ${message}`)
     }

     return { apiFetch }
}
