export function useChatApi() {
     const config = useRuntimeConfig()
     const apiUrl = `${config.public.apiBaseUrl}/chat`

     const chatStore = useChatStore()
     const apiKey = () => 'a676d92ebf97e101a7ef70c19583f22f64eeea66ee6f39c0d7d1bbddd4cb5e8c'

     const visitorPublicKey = () => {
          const storedVisitorData = localStorage.getItem('hhs_isp_chat')
          if (storedVisitorData) {
              const visitorData = JSON.parse(storedVisitorData)
              return visitorData.visitor.public_key
          }
          return null
     }

     async function apiFetch(path: string, options: RequestInit = {}) {
          const headers = {
               'Content-Type': 'application/json',
               'x-project-public-key': apiKey(),
               'x-visitor-public-key': visitorPublicKey(),
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
