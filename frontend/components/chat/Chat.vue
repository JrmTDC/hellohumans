<template>
     <div
          v-if="isReady"
          id="hellohumans-chat-iframe"
          class="fixed inset-[auto_0_0_auto] z-[999999999] bg-transparent border-none"
          :class="wrapperWidth"
          :style="wrapperStyle"
     >
          <!-- bubble -->
          <div class="fixed right-0 bottom-[12px] w-[112px] h-[140px] flex items-center justify-center pointer-events-none z-[1]">
               <button
                    v-if="!isOpen"
                    @click="toggleChat"
                    class="pointer-events-auto w-[60px] h-[60px] rounded-[30px] flex items-center justify-center shadow-[0_4px_24px_#02061033] transition hover:scale-110"
                    :style="{ background: chatStore.configChat.backgroundColor }"
               >
                    <svgo-chat-button-icon-chat class="w-6 h-6" />
               </button>

               <div
                    v-if="!isOpen && notificationSnoozed"
                    class="absolute top-[37px] right-[23px] w-5 h-5 rounded-[10px] flex items-center justify-center bg-white outline outline-1 outline-[#e2e8ef]"
               >
                    <svgo-chat-icon-notification-disabled class="w-4 h-4" />
               </div>
          </div>

          <!-- window -->
          <div
               v-if="isOpen || isVisible"
               ref="chatContent"
               class="fixed bottom-[26px] right-[26px] left-auto bg-white rounded-[16px] shadow-lg overflow-hidden flex flex-col pointer-events-auto transition-[transform,opacity] duration-300 ease-in-out"
               :class="[
                    isExpanded ? 'w-[593px]' : 'w-[372px]',
                    isVisible ? 'scale-100 opacity-100' : 'scale-85 opacity-0'
               ]"
               style="max-height:calc(100% - 47px)"

          >
               <ChatHeader
                    :isChatActive="isChatActive"
                    :isOpen="isOpen"
                    :notificationSnoozed="notificationSnoozed"
                    :showOptions="showOptions"
                    @goToHome="goToHome"
                    @toggleChat="toggleChat"
                    @toggleOptions="toggleOptions"
               />

               <div class="relative z-10">
                    <svgo-chat-line-wave class="h-6 w-[calc(100%+10px)] absolute bottom-[-12px] left-[-4px]" />
               </div>

               <ChatHome
                    v-if="!isChatActive"
                    @sendSuggestedMessage="sendSuggestedMessage"
                    @openChat="() => (isChatActive = true)"
               />
               <ChatMessages
                    v-else
                    :messages="messages"
                    :isLoading="isLoading"
                    :isChatActive="isChatActive"
                    @choiceSelected="onChoiceSelected"
               />

               <ChatInput
                    v-if="isChatActive && !disableInput"
                    v-model:currentMessage="message"
                    :disableInput="disableInput"
                    @sendMessage="sendMessage"
               />

               <ChatModal
                    :show="showRGPDModal"
                    :isLoading="onLoadingRGPD"
                    @accept="onAcceptRGPD"
                    @close="onCloseRGPD"
               />

               <ChatOptions
                    v-if="showOptions"
                    :notificationSnoozed="notificationSnoozed"
                    :isExpanded="isExpanded"
                    :optionsBox="optionsBox"
                    @toggleNotifications="toggleNotifications"
                    @toggleExpend="toggleExpend"
                    @clearChatAndClose="clearChatAndClose"
                    @closeOptions="showOptions = false"
               />
          </div>
     </div>
</template>

<script setup lang="ts">
type ChatMessage = {
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

const chatStore = useChatStore()

const props = defineProps<{
     previewMode?: boolean
     forcedState?: 'home' | 'conversation' | 'modal'
     projectPublicKey?: string
}>()

if (props.projectPublicKey) chatStore.setProjectPublicKey(props.projectPublicKey)

/* ----- state ----- */
const isReady = ref(false)
const message = ref('')
const messages = computed(() => chatStore.messages)
const isLoading = ref(false)
const isOpen = ref(false)
const isChatActive = ref(false)
const notificationSnoozed = ref(false)
const isExpanded = ref(false)
const showOptions = ref(false)
const isSending = ref(false)
const isVisible = ref(false)
const disableInput = ref(false)
const showRGPDModal = ref(false)
const onLoadingRGPD = ref(false)
const pendingMessage = ref<string | null>(null)
const optionsBox = ref<HTMLElement | null>(null)

/* ----- size handling ----- */
const chatContent = ref<HTMLElement | null>(null)
const wrapperH = ref(140)

const wrapperWidth = computed(() =>
     isVisible.value ? (isExpanded.value ? 'w-[593px]' : 'w-[372px]') : 'w-[112px]'
)
const wrapperStyle = computed(() => ({
     height: `${wrapperH.value}px`,
     maxHeight: isVisible.value ? 'calc(100% - 47px)' : '140px',
     transition: 'height .25s ease'
}))
function resizeToContent() {
     if (!chatContent.value) return
     const real = chatContent.value.scrollHeight
     const min = isChatActive.value ? 747 : 469
     const max = window.innerHeight - 73 /* 47 + 26 */
     wrapperH.value = Math.min(Math.max(real, min), max)
}

/* ----- lifecycle ----- */
onMounted(async () => {
     await chatStore.fetchChatProject()
     isReady.value = true

     const raw = localStorage.getItem('hhs_isp_chat')
     if (raw) {
          try {
               const parsed = JSON.parse(raw)
               if (Array.isArray(parsed.messages)) {
                    // normalisation : text -> content
                    messages.value = parsed.messages.map((m: any) => ({
                         id:          m.id || crypto.randomUUID(),
                         type:        m.type || 'text',
                         sender:      m.sender || 'bot',
                         content:     m.content ?? m.text ?? '',
                         time_sent:   m.time_sent || Date.now(),
                         status:      m.status,
                         choices:     m.choices || [],
                         // autres champs si présents :
                         idFromServer:           m.idFromServer,
                         isAIAssistant:          m.isAIAssistant,
                         aiAssistantResponseType:m.aiAssistantResponseType,
                         questionMessageId:      m.questionMessageId,
                         disableTextInput:       m.disableTextInput
                    })) as ChatMessage[]
               }
               if (typeof parsed.notificationSnoozed === 'boolean')
                    notificationSnoozed.value = parsed.notificationSnoozed
          } catch {

          }
     }

     if (props.previewMode) {
          isOpen.value = true
          isVisible.value = true
          if (props.forcedState === 'conversation') isChatActive.value = true
          if (props.forcedState === 'modal') showRGPDModal.value = true
     }

     await nextTick(resizeToContent)

     const ro = new ResizeObserver(resizeToContent)
     chatContent.value && ro.observe(chatContent.value)

     watch([messages, isChatActive, isExpanded], () => nextTick(resizeToContent), { deep: true })
     watch(isVisible, v => v && nextTick(resizeToContent))
     window.addEventListener('resize', resizeToContent)

     document.addEventListener('click', e => {
          if (optionsBox.value && !optionsBox.value.contains(e.target as Node)) showOptions.value = false
     })
})

onUnmounted(() => {
     const ro = new ResizeObserver(resizeToContent)
     ro.disconnect()
     window.removeEventListener('resize', resizeToContent)
})


/* ----- ui ----- */
function toggleChat() {
     if (props.previewMode) return
     isOpen.value = !isOpen.value
     setTimeout(() => (isVisible.value = !isVisible.value), 90)
     if (!isOpen.value) setTimeout(() => (isChatActive.value = false), 300)
}

function toggleOptions() {
     showOptions.value = !showOptions.value
}
function toggleExpend() {
     isExpanded.value = !isExpanded.value
}
function toggleNotifications() {
     notificationSnoozed.value = !notificationSnoozed.value
     const data = JSON.parse(localStorage.getItem('hhs_isp_chat') || '{}')
     data.notificationSnoozed = notificationSnoozed.value
     localStorage.setItem('hhs_isp_chat', JSON.stringify(data))
}
function goToHome() {
     isChatActive.value = false
}
function clearChatAndClose() {
     chatStore.clearMessages()
     showOptions.value = false
}

/* ----- suggestions & messages ----- */
function sendSuggestedMessage(q: string) {
     message.value = q
     isChatActive.value = true
     sendMessage()
}

async function sendMessage() {
     if (props.previewMode || !message.value.trim()) return

     const local = JSON.parse(localStorage.getItem('hhs_isp_chat') || '{}')
     if (!local.visitor?.gdprConsent) {
          pendingMessage.value = message.value
          showRGPDModal.value = true
          return
     }

     isLoading.value = true
     const userTxt = message.value
     message.value = ''

     if (!isSending.value) {
          isSending.value = true
          const res = await chatStore.messageSend(userTxt)

          if (!res.success) {
               if (res.reason === 'user_invalid') {
                    removeLastUserMessage()
                    pendingMessage.value = userTxt
                    showRGPDModal.value = true
               }
          } else {
               const content = res?.message
               const localCfg = JSON.parse(localStorage.getItem('hhs_isp_chat') || '{}')
               if (!localCfg.notificationSnoozed) playNotificationSound()
               if (content && content.choices?.length) disableInput.value = true
          }

          isLoading.value = false
          isSending.value = false
     }
}

function onChoiceSelected(choice: string) {
     removeLastChoiceMessage()
     disableInput.value = false
     message.value = choice
     sendMessage()
}

/* ----- rgpd ----- */
async function onAcceptRGPD(email: string) {
     onLoadingRGPD.value = true
     await chatStore.visitorCreate(email)
     showRGPDModal.value = false
     if (pendingMessage.value) {
          message.value = pendingMessage.value
          pendingMessage.value = null
          await sendMessage()
     }
     onLoadingRGPD.value = false
}
function onCloseRGPD() {
     showRGPDModal.value = false
     if (pendingMessage.value) message.value = pendingMessage.value
}

/* ----- utils ----- */
function playNotificationSound() {
     const audio = new Audio('/sounds/notification.mp3')
     audio.volume = 0.5
     audio.play().catch(() => {})
}
function removeLastUserMessage() {
     const idx = [...messages.value].reverse().findIndex(m => m.sender === 'visitor')
     if (idx !== -1) messages.value.splice(messages.value.length - 1 - idx, 1)
}
function removeLastChoiceMessage() {
     const last = [...messages.value].reverse().find(m => m.sender === 'bot' && m.choices?.length)
     if (last) last.choices = []
}
</script>
