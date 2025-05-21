import { defineStore } from 'pinia'

interface Project {
     public_key: string
     website: string
     config: {
          name: string
          suggestedQuestionsString: string
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
     suggestedQuestionsString: '',
     backgroundColor: '#0566ff',
     textColor: '#ffffff',
     actionColor: '#0566ff',
     isCustomBackground: false
})

export const useChatStore = defineStore('chat', () => {
     const project = ref<Project | null>(null)
     const visitor = ref<Visitor | null>(null)

     // --- Récupération projet ---
     async function fetchChatProject(overriddenKey?: string) {
          const { apiFetch } = useChatApi(overriddenKey)
          try {
               const projectRes = await apiFetch('/project')
               project.value = projectRes.success.project || null
               configChat.name = project.value?.config.name || 'HelloHumans'
               configChat.suggestedQuestionsString = project.value?.config.suggestedQuestionsString || ''
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
     async function visitorCreate(email: string,overriddenKey?: string) {
          const { apiFetch } = useChatApi(overriddenKey)
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
     async function messageSend(message: string,overriddenKey?: string) {
          const { apiFetch } = useChatApi(overriddenKey)
          try {
               const payload = { message }

               const res = await apiFetch('/message', {
                    method: 'POST',
                    body: JSON.stringify(payload),
               })

               const botMsg = res.success.message
               if (!botMsg) throw new Error('missing_bot_message')

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

               // Formatage du message AI
               const structuredMessage = {
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
                    choices: botMsg.choices || []
               }

               // Ajout au localStorage
               chatData.messages.push(structuredMessage)
               localStorage.setItem('hhs_isp_chat', JSON.stringify(chatData))

               return {
                    success: true,
                    message: structuredMessage,
               }
          } catch (err: any) {
               if (err.message === 'user_invalid') {
                    return { success: false, reason: 'user_invalid' }
               }

               return { success: false, reason: 'internal_error' }
          }
     }

     return {
          project,
          visitor,
          configChat,
          fetchChatProject,
          visitorCreate,
          messageSend,
     }
})
