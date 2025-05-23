import { defineStore } from 'pinia'

interface Project {
     public_key: string
     website: string
     config: {
          name: string
          suggestedQuestions: string
          backgroundColor: string
          textColor: string
          actionColor: string
          isCustomBackground: boolean
     }
}

interface Visitor {
     public_key: string
     gdprConsent: boolean
}

const configChat = reactive({
     name: 'HelloHumans',
     suggestedQuestions: '',
     backgroundColor: '#0566ff',
     textColor: '#ffffff',
     actionColor: '#0566ff',
     isCustomBackground: false
})
interface ChatMessage {
     id: string
     idFromServer?: string
     type: string
     sender: 'visitor' | 'bot'
     content: string
     time_sent: number
     isAIAssistant?: boolean
     aiAssistantResponseType?: string
     questionMessageId?: string | null
     disableTextInput?: boolean
     choices?: string[]
     status?: 'success' | 'unavailable'
}

interface Suggestion {
     id: string
     label: string
     enabled: boolean
     order: number
}

export const useChatStore = defineStore('chat', () => {
     const project = ref<Project | null>(null)
     const visitor = ref<Visitor | null>(null)
     const projectPublicKey   = ref<string | null>(null)
     const messages = ref<ChatMessage[]>([])
     const suggestions = ref<Suggestion[]>([])

     function loadFromStorage () {
          const data = JSON.parse(localStorage.getItem('hhs_isp_chat') || '{}')

          if (Array.isArray(data.messages))       messages.value      = data.messages
          if (Array.isArray(data.suggestions))    suggestions.value   = data.suggestions
     }

     function updateStorage (partial: Record<string, any>) {
          const existing = JSON.parse(localStorage.getItem('hhs_isp_chat') || '{}')
          localStorage.setItem('hhs_isp_chat', JSON.stringify({ ...existing, ...partial }))
     }

     function addSuggestion () {
          suggestions.value.push({
               id: crypto.randomUUID(),
               label: '',
               enabled: true,
               order: suggestions.value.length
          })
     }

     function removeSuggestion (id:string) {
          suggestions.value = suggestions.value.filter(s => s.id !== id)
     }

     function toggleSuggestion (id:string) {
          const s = suggestions.value.find(x=>x.id===id)
          if (s) s.enabled = !s.enabled
     }

     function saveOrder (ordered:Suggestion[]) {
          suggestions.value = ordered.map((s,idx)=>({...s, order:idx}))
     }

     function clearMessages() {
          messages.value = []
          updateStorage({ messages: [], suggestions: suggestions.value })
     }

     function setProjectPublicKey(key: string | null) {
          projectPublicKey.value = key
     }

     // --- Récupération projet ---
     async function fetchChatProject() {
          const { apiFetch } = useChatApi()
          try {
               const projectRes = await apiFetch('/project')
               project.value = projectRes.success.project || null
               configChat.name = project.value?.config.name || 'HelloHumans'
               configChat.suggestedQuestions = project.value?.config.suggestedQuestions || ''
               configChat.backgroundColor = project.value?.config.backgroundColor || '#0566ff'
               configChat.textColor = project.value?.config.textColor || '#ffffff'
               configChat.actionColor = project.value?.config.actionColor || '#0566ff'
               configChat.isCustomBackground = project.value?.config.isCustomBackground || false
               return true
          } catch (err: any) {
               return false
          }
     }

     // --- Création du visiteur ---
     async function visitorCreate(email: string) {
          const { apiFetch } = useChatApi()
          try {
               const payload = {
                    project_public_key: project.value?.public_key,
                    visitor_public_key: '',
                    email,
                    gdprConsent: 'accepted',
               }

               const visitorRes = await apiFetch('/visitor', {
                    method: 'POST',
                    body: JSON.stringify(payload),
               })

               visitor.value = visitorRes.success.visitor || null

               // Mise à jour du localStorage
               const existing = JSON.parse(localStorage.getItem('hhs_isp_chat') || '{}')

               const updated = {
                    ...existing,
                    visitor: visitor.value,
               }

               localStorage.setItem('hhs_isp_chat', JSON.stringify(updated))
               document.cookie = `hhs_isp_chat=${JSON.stringify({ visitor: visitor.value })}; path=/; max-age=31536000`

               return true
          } catch (err: any) {
               return false
          }
     }

     // --- Envoi message et ajout au localStorage ---
     async function messageSend(content: string): Promise<{ success: boolean, message?: ChatMessage, reason?: 'user_invalid' | 'internal_error' }> {
          const { apiFetch } = useChatApi()

          // Chargement / fallback des données locales
          let chatData: Record<string, any> = {}
          try {
               chatData = JSON.parse(localStorage.getItem('hhs_isp_chat') || '{}')
          } catch {
               chatData = {}
          }
          if (!Array.isArray(chatData.messages)) {
               chatData.messages = []
          }

          const structuredVisitorMessage : ChatMessage = {
               id: crypto.randomUUID(),
               sender: 'visitor',
               type: 'text',
               content: content,
               time_sent: Date.now(),
               status: 'success'
          }
          chatData.messages.push(structuredVisitorMessage)
          messages.value.push(structuredVisitorMessage)
          updateStorage({ messages: messages.value })
          try {
               const payload = { message:content }
               const res = await apiFetch('/message', {
                    method: 'POST',
                    body: JSON.stringify(payload),
               })

               const botMsg = res.success.message || null

               // Formatage du message AI
               const structuredLoopiMessage : ChatMessage = {
                    id: botMsg.id,
                    idFromServer: botMsg.idFromServer || botMsg.id,
                    type: botMsg.type || 'text',
                    sender: botMsg.sender || 'bot',
                    content: botMsg.content,
                    time_sent: botMsg.time_sent || Date.now(),
                    isAIAssistant: botMsg.isAIAssistant ?? true,
                    aiAssistantResponseType: botMsg.aiAssistantResponseType ?? 'answer_generated',
                    questionMessageId: botMsg.questionMessageId || null,
                    disableTextInput: false,
                    choices: botMsg.choices || [],
                    status: 'success'
               }

               // Ajout au localStorage
               chatData.messages.push(structuredLoopiMessage)
               messages.value.push(structuredLoopiMessage)
               updateStorage({ messages: messages.value })
               return {
                    success: true,
                    message: structuredLoopiMessage,
               }
          } catch (err: any) {
               const structuredLoopiErrorMessage : ChatMessage = {
                    id: crypto.randomUUID(),
                    sender: 'bot',
                    type: 'text',
                    status: 'unavailable',
                    content: "Oups... Un problème est survenu ! Je n’arrive pas à répondre pour le moment. 🚀",
                    time_sent: Date.now()
               }
               //chatData.messages.push(structuredLoopiErrorMessage)
               messages.value.push(structuredLoopiErrorMessage)

               if (err.message === 'user_invalid') {
                    return { success: false, reason: 'user_invalid' }
               }
               return { success: false, reason: 'internal_error' }
          }
     }

     watch([messages, suggestions], () => {
          updateStorage({ messages: messages.value, suggestions: suggestions.value })
     },{ deep:true })

     return {
          projectPublicKey,
          project,
          visitor,
          configChat,
          messages,
          loadFromStorage,
          suggestions,
          clearMessages,
          setProjectPublicKey,
          fetchChatProject,
          visitorCreate,
          messageSend,
          addSuggestion,
          removeSuggestion,
          toggleSuggestion,
          saveOrder,
     }
})
