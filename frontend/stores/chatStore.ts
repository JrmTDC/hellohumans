import { defineStore } from 'pinia'

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

interface ChatConfig {
     name: string
     welcomeTitle: string
     welcomeMessage: string
     suggestedQuestions: {
          label: string
          enabled: boolean
          order: number
     }[]
     backgroundColor: string
     textColor: string
     actionColor: string
     isCustomBackground: boolean
}

interface Project {
     public_key: string
     website: string
     config: ChatConfig
}

interface Visitor {
     public_key: string
     gdprConsent: boolean
}

export const useChatStore = defineStore('chat', () => {
     const panelStore = usePanelStore()
     const project = ref<Project | null>(null)
     const visitor = ref<Visitor | null>(null)
     const projectPublicKey = ref<string | null>(null)
     const messages = ref<ChatMessage[]>([])
     const suggestions = ref<Suggestion[]>([])
     const hasLoadedStorage = ref(false)
     const storageData = ref<Record<string, any>>(getStorageData())

     const configChat = reactive<ChatConfig>({
          name: 'HelloHumans',
          welcomeTitle: 'Bonjour !',
          welcomeMessage: 'Bienvenue sur notre site, puis-je vous aider ?',
          suggestedQuestions: [],
          backgroundColor: '#0566ff',
          textColor: '#ffffff',
          actionColor: '#0566ff',
          isCustomBackground: false
     })

     function getStorageData(): Record<string, any> {
          const key = `hhs_isp_chat_${panelStore.project?.public_key || 'default'}`
          try {
               return JSON.parse(localStorage.getItem(key) || '{}')
          } catch {
               return {}
          }
     }

     function setStorageData(data: Record<string, any>) {
          const key = `hhs_isp_chat_${panelStore.project?.public_key || 'default'}`
          localStorage.setItem(key, JSON.stringify(data))
          storageData.value = data
     }

     function parseSuggestedQuestionsFromConfig(list: string[]): Suggestion[] {
          return list.map((label, index) => ({
               id: crypto.randomUUID(),
               label,
               enabled: true,
               order: index,
          }))
     }

     function updateStorage(partial: Record<string, any>) {
          const merged = { ...storageData.value, ...partial }
          setStorageData(merged)
     }

     function loadFromStorage() {
          const data = getStorageData()
          storageData.value = data

          if (Array.isArray(data.messages)) messages.value = data.messages
          if (Array.isArray(data.suggestions)) {
               suggestions.value = data.suggestions
               configChat.suggestedQuestions = data.suggestions.map((s: Suggestion) => ({
                    label: s.label,
                    enabled: s.enabled,
                    order: s.order,
               }))
          }
          if (data.visitor) visitor.value = data.visitor

          hasLoadedStorage.value = true
     }

     function addSuggestion() {
          suggestions.value.push({
               id: crypto.randomUUID(),
               label: '',
               enabled: true,
               order: suggestions.value.length,
          })
     }

     function removeSuggestion(id: string) {
          suggestions.value = suggestions.value.filter(s => s.id !== id)
     }

     function toggleSuggestion(id: string) {
          const s = suggestions.value.find(x => x.id === id)
          if (s) s.enabled = !s.enabled
     }

     function saveOrder(ordered: Suggestion[]) {
          suggestions.value.splice(
               0,
               suggestions.value.length,
               ...ordered.map((s, i) => ({...s, order: i}))
          )
     }

     function clearMessages() {
          messages.value = []
          updateStorage({messages: [], suggestions: suggestions.value})
     }

     function setProjectPublicKey(key: string | null) {
          projectPublicKey.value = key
     }

     async function fetchChatProject() {
          const {apiFetch} = useChatApi()
          try {

               const projectRes = await apiFetch('/project')
               project.value = projectRes.success.project || null

               Object.assign(configChat, project.value?.config ?? {})

               if (Array.isArray(configChat.suggestedQuestions)) {
                    suggestions.value = configChat.suggestedQuestions.map((s, i) => ({
                         id: crypto.randomUUID(),
                         label: typeof s === 'object' && s.label ? s.label : String(s),
                         enabled: typeof s.enabled === 'boolean' ? s.enabled : true,
                         order: typeof s.order === 'number' ? s.order : i,
                    }))
               }

               return true
          } catch {
               return false
          }
     }

     async function visitorCreate(email: string) {
          const {apiFetch} = useChatApi()
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
               setStorageData({...getStorageData(), visitor: visitor.value})
               return true
          } catch {
               return false
          }
     }

     async function messageSend(content: string): Promise<{
          success: boolean
          message?: ChatMessage
          reason?: 'user_invalid' | 'internal_error'
     }> {
          const {apiFetch} = useChatApi()
          const chatData = getStorageData()

          if (!Array.isArray(chatData.messages)) {
               chatData.messages = []
          }

          const structuredVisitorMessage: ChatMessage = {
               id: crypto.randomUUID(),
               sender: 'visitor',
               type: 'text',
               content,
               time_sent: Date.now(),
               status: 'success',
          }

          chatData.messages.push(structuredVisitorMessage)
          messages.value.push(structuredVisitorMessage)
          updateStorage({messages: messages.value})

          try {
               const res = await apiFetch('/message', {
                    method: 'POST',
                    body: JSON.stringify({message: content}),
               })

               const botMsg = res.success.message || null

               const structuredBotMessage: ChatMessage = {
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
                    status: 'success',
               }

               chatData.messages.push(structuredBotMessage)
               messages.value.push(structuredBotMessage)
               updateStorage({messages: messages.value})

               return {
                    success: true,
                    message: structuredBotMessage,
               }
          } catch (err: any) {
               const errorMsg: ChatMessage = {
                    id: crypto.randomUUID(),
                    sender: 'bot',
                    type: 'text',
                    content: "Oups... Un problème est survenu ! Je n’arrive pas à répondre pour le moment. 🚀",
                    time_sent: Date.now(),
                    status: 'unavailable',
               }

               messages.value.push(errorMsg)
               updateStorage({messages: messages.value})

               if (err.message === 'user_invalid') {
                    return {success: false, reason: 'user_invalid'}
               }

               return {success: false, reason: 'internal_error'}
          }
     }

     // Sync suggestions -> config
     watch(suggestions, () => {
          if (!hasLoadedStorage.value) return
          configChat.suggestedQuestions = suggestions.value.map(({ label, enabled, order }) => ({
               label, enabled, order
          }))
          updateStorage({
               suggestions: suggestions.value,
               config: configChat,
               messages: messages.value,
          })
     }, { deep: true })

     return {
          projectPublicKey,
          project,
          visitor,
          configChat,
          messages,
          suggestions,
          storageData,
          loadFromStorage,
          getStorageData,
          setStorageData,
          updateStorage,
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
