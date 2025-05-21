export function useChatApi() {
     const config = useRuntimeConfig()
     const panelStore = usePanelStore()
     const chatStore = useChatStore()
     const apiUrl = `${config.public.apiBaseUrl}/chat`
     const projectPublicKey = () => chatStore.projectPublicKey || panelStore.project?.public_key || ''

     const visitorPublicKey = () => {
          const storedVisitorData = localStorage.getItem('hhs_isp_chat')
          if (storedVisitorData) {
              const visitorData = JSON.parse(storedVisitorData)
              return visitorData.visitor.public_key
          }
          return ''
     }

     async function apiFetch(path: string, options: RequestInit = {}) {
          const headers = {
               'Content-Type': 'application/json',
               'x-project-public-key': projectPublicKey(),
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
