<template>
     <div v-if="!isOpen && !previewMode && notificationMessageAlert" class="hhcss_ChatBoxNotificationMessage bg-white py-[0] px-[20px] max-w-[calc(100%-103px)] absolute bottom-[26px] rounded-[12px] shadow-[0_8px_26px_0_rgba(0,18,46,0.16)] flex flex-col z-[1] max-h-[calc(100%-76px)] right-[48px] ml-[20px]">
          <div class="message-container w-full text-[17px] pr-[22px] py-[19px] pl-0 pr-[38px] max-w-[290px] bg-white relative break-words overflow-y-auto whitespace-pre-line text-[#06132b] tracking-[-0.24px] antialiased">Text du message</div>
          <div @click="toggleConversation" class="px-[24px] pb-[16px] pt-[9px] pr-[22px] pl-0 self-end w-full relative bg-white z-[3] flex-[0_0_auto] cursor-pointer">
               <button class="w-auto min-w-[130px] transition-[min-width] duration-300 px-0 pt-[4px] pb-[8px] leading-[21px] text-left cursor-pointer text-[17px] text-[rgb(136,148,171)] whitespace-nowrap overflow-hidden text-ellipsis">Enter your message...</button>
          </div>
          <div></div>
     </div>

     <div
          v-if="isReady"
          id="hellohumans-chat-iframe"
          :class="[previewMode ? 'relative h-full static w-full h-auto scale-100 opacity-100' : 'fixed inset-[auto_0_0_auto] z-[999999999] bg-transparent border-none',wrapperWidth ]"
          :style="previewMode ? wrapperStylePreview : wrapperStyle">
          <!-- bubble -->
          <div class="fixed right-0 bottom-[12px] w-[112px] h-[140px] flex items-center justify-center pointer-events-none z-[1]">
               <button v-if="!isOpen" @click="toggleChat" class="pointer-events-auto w-[60px] h-[60px] rounded-[30px] flex items-center justify-center shadow-[0_4px_24px_#02061033] transition hover:scale-110" :style="{ background: chatStore.configChat.backgroundColor }">
                    <svgo-chat-button-icon-chat class="w-6 h-6" />
               </button>
               <div v-if="!isOpen && !previewMode && notificationMessageAlert" class="hhcss_newMessage absolute top-[34px] right-[27px] font-bold text-white pointer-events-none rounded-[10px] flex justify-center items-center min-w-[20px] h-[20px] text-[12px] bg-[rgb(232,19,50)] z-[2] leading-[16px] px-[4px] py-[2px]">0</div>
               <div v-if="!isOpen && notificationSnoozed" class="absolute top-[35px] right-[22px] w-5 h-5 rounded-[10px] flex items-center justify-center bg-white outline outline-1 outline-[#e2e8ef]">
                    <svgo-chat-icon-notification-disabled class="w-4 h-4" />
               </div>
          </div>

          <!-- window -->
          <div
               v-if="isOpen || isVisible"
               ref="chatContent"
               class="fixed bottom-[26px] right-[26px] left-auto bg-white rounded-[16px] shadow-lg overflow-hidden flex flex-col pointer-events-auto transition-[transform,opacity] duration-300 ease-in-out max-md:w-full max-md:h-full max-md:bottom-0 max-md:bg-white max-md:flex max-md:flex-col max-md:rounded-none max-md:right-0 max-md:left-auto max-md:max-h-none"
               :class="[
                    isExpanded ? 'w-[593px]' : 'w-[372px]',
                    isVisible ? 'scale-100 opacity-100' : 'scale-85 opacity-0'
               ]"
               :style="previewMode ? 'max-height:100%' : 'max-height:calc(100% - 47px) max-md:max-h-none'"

          >
               <ChatHeader
                    :isChatActive="isChatActive"
                    :isOpen="isOpen"
                    :notificationSnoozed="notificationSnoozed"
                    :showOptions="showOptions"
                    @goToHome="goToHome"
                    @toggleChat="toggleChat"
                    @toggleOptions="toggleOptions"
                    :previewMode="previewMode"
               />

               <div class="relative z-10">
                    <svgo-chat-line-wave class="h-6 w-[calc(100%+10px)] absolute bottom-[-12px] left-[-4px]" />
               </div>

               <ChatHome
                    v-if="!isChatActive"
                    @sendSuggestedMessage="sendSuggestedMessage"
                    @openChat="() => (isChatActive = true)"
                    :previewMode="previewMode"
               />
               <ChatMessages
                    v-else
                    :messages="messages"
                    :isLoading="isLoading"
                    :isChatActive="isChatActive"
                    @choiceSelected="onChoiceSelected"
                    :previewMode="previewMode"
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
                    :previewMode="previewMode"
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
                    :previewMode="previewMode"
               />
          </div>
     </div>
</template>

<script setup lang="ts">
const chatStore = useChatStore()

const props = defineProps<{
     previewMode: boolean
     forcedState?: 'minimal' | 'home' | 'conversation' | 'modal'
     projectPublicKey?: string
}>()

if (props.projectPublicKey) chatStore.setProjectPublicKey(props.projectPublicKey)

/* ----- state ----- */
const notificationMessageAlert = ref(false)
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
const hhs_isp_chat = computed(() => chatStore.storageData)

/* ----- size handling ----- */
const chatContent = ref<HTMLElement | null>(null)
const wrapperH = ref(0)

const wrapperWidth = computed(() =>
     isVisible.value ? (isExpanded.value ? 'w-[593px]' : 'w-[372px]') : 'w-[112px]'
)
const wrapperStyle = computed(() => ({
     height: `${wrapperH.value}px`,
     maxHeight: isVisible.value ? 'calc(100% - 47px)' : '140px',
     transition: 'height .25s ease'
}))
const wrapperStylePreview = computed(() => ({
     height: '100%',
     maxHeight: '100%',
     transition: 'height .25s ease'
}))

function resizeToContent () {
     if (!chatContent.value) return

     const contentHeight = chatContent.value.scrollHeight
     const windowHeight = window.innerHeight
     wrapperH.value = Math.min(contentHeight + 40, windowHeight - 150) // padding de sécurité
}

async function applyForcedState(value: typeof props.forcedState) {
     if (!props.previewMode) return

     isOpen.value = value !== 'minimal'
     isVisible.value = value !== 'minimal'
     isChatActive.value = ['conversation', 'modal'].includes(value || '')

     if (value === 'modal') {
          await nextTick()
          setTimeout(() => {
               showRGPDModal.value = true
          }, 400)
     }else{
          showRGPDModal.value = false
     }
}
onMounted(async () => {
     if (!props.previewMode) {
          chatStore.loadFromStorage()
     }
     await chatStore.fetchChatProject()

     isReady.value = true

     if (props.previewMode) {
          isOpen.value = true
          isVisible.value = true
     }
     await nextTick(() => {
          resizeToContent()
          setTimeout(resizeToContent, 500)
     })

     const ro = new ResizeObserver(resizeToContent)
     chatContent.value && ro.observe(chatContent.value)

     watch([messages, isChatActive, isExpanded], () => nextTick(resizeToContent), {deep: true})
     watch(isVisible, v => v && nextTick(resizeToContent))
     window.addEventListener('resize', resizeToContent)

     document.addEventListener('click', e => {
          if (optionsBox.value && !optionsBox.value.contains(e.target as Node)) showOptions.value = false
     })
     await applyForcedState(props.forcedState)
     if (!props.previewMode) {
          watch(() => chatStore.projectPublicKey, chatStore.visitorRegisterSocket, {immediate: true})
     }
})

onUnmounted(() => {
     const ro = new ResizeObserver(resizeToContent)
     ro.disconnect()
     window.removeEventListener('resize', resizeToContent)
})
watch(() => props.forcedState, applyForcedState)

/* ----- ui ----- */
function toggleChat() {
     if (props.previewMode) return
     isOpen.value = !isOpen.value
     setTimeout(() => (isVisible.value = !isVisible.value), 90)
     if (!isOpen.value) setTimeout(() => (isChatActive.value = false), 300)
}
function toggleConversation() {
     if (props.previewMode) return

     isOpen.value = true
     isVisible.value = true
     isChatActive.value = true

}
function toggleOptions() {
     showOptions.value = !showOptions.value
}
function toggleExpend() {
     isExpanded.value = !isExpanded.value
}
function toggleNotifications() {
     notificationSnoozed.value = !notificationSnoozed.value
     chatStore.updateStorage({ notificationSnoozed: notificationSnoozed.value })

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
     if (!hhs_isp_chat.value.visitor?.gdprConsent) {
          console.log('[Chat] RGPD consent not given, showing modal')
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
               if (!hhs_isp_chat.value.notificationSnoozed) playNotificationSound()
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

     await nextTick()

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
watch(() => chatStore.suggestions, () => {
     nextTick(() => resizeToContent())
}, { deep: true })
</script>
