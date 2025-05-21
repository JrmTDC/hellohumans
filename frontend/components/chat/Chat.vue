<template>
     <div v-if="isReady" id="hellohumans-chat-iframe" class="block border-none fixed inset-[auto_0_0_auto] opacity-100 text-[inherit] bg-transparent !bg-transparent m-0 max-w-[100vw] translate-y-0 !transition-none visible z-[999999999] rounded-[47px_30px_]()_]()"
          :class="[
               isVisible ? [
                    isChatActive ? 'w-[424px] h-[747px] max-h-[100%]' : 'w-[424px] h-[469px] max-h-[100%]'
               ] : 'w-[112px] h-[140px] max-h-[100dvh]',

          ]">
          <!-- BOUTON FLOTANT POUR OUVRIR -->
          <div class="fixed w-[112px] h-[140px] bottom-[12px] flex items-center justify-center pointer-events-none z-[1] right-0">
               <button
                    v-if="!isOpen"
                    @click="toggleChat"
                    class="w-[60px] h-[60px] rounded-[30px] flex items-center justify-center pointer-events-auto
             transition duration-150 ease-in-out relative text-[#007dfc]
             shadow-[0px_4px_24px_#02061033] hover:scale-110"
                    :style="{ background: chatStore.configChat.backgroundColor }"
               >
                    <svgo-chat-button-icon-chat class="w-[24px] h-[24px]" />
               </button>
               <!-- Icône de notifications désactivées (optionnel) -->
               <div
                    v-if="!isOpen && !notificationSnoozed"
                    class="absolute top-[37px] right-[23px] font-bold pointer-events-none
             rounded-[10px] flex justify-center items-center min-w-[20px] h-[20px]
             bg-white outline outline-1 outline-[rgb(226,232,239)] text-[rgb(8,15,26)] z-1"
               >-
                    <svgo-chat-icon-notification-disabled class="w-[16px] h-[16px]" />
               </div>
          </div>

          <!-- CONTENEUR PRINCIPAL DU CHAT -->

          <div
               v-if="isOpen || isVisible"
               class="max-h-[calc(100%-47px)] h-[699px] flex flex-col transition-[height] duration-200 fixed bottom-[26px] right-[26px] left-auto rounded-[16px] pointer-events-auto shadow-lg overflow-hidden z-1 bg-white scale-85 opacity-0 transform transition-transform duration-300 ease-in-out h-min"
               :class="[
                    isExpanded ? 'w-[593px]' : 'w-[372px]',
                    isVisible ? 'scale-100 opacity-100' : 'scale-85 opacity-0'
               ]"
          >
               <div v-auto-animate class="min-h-0 flex flex-col flex-[1_1_0%] inset-0">
                    <!-- HEADER -->
                    <ChatHeader
                         :isChatActive="isChatActive"
                         :isOpen="isOpen"
                         :notificationSnoozed="notificationSnoozed"
                         :showOptions="showOptions"
                         @goToHome="goToHome"
                         @toggleChat="toggleChat"
                         @toggleOptions="toggleOptions"
                    />

                    <!-- Vague décorative -->
                    <div class="relative z-10">
                         <svgo-chat-line-wave class="h-6 w-[calc(100%+10px)] absolute bottom-[-12px] left-[-4px]" />
                    </div>

                    <!-- ÉCRAN D'ACCUEIL -->
                    <ChatHome
                         v-if="!isChatActive"
                         :suggestedQuestions="formattedQuestions"
                         @sendSuggestedMessage="sendSuggestedMessage"
                         @openChat="() => (isChatActive = true)"
                    />

                    <!-- LISTE DES MESSAGES -->
                    <ChatMessages
                         v-if="isChatActive"
                         :messages="messages"
                         :isLoading="isLoading"
                         :isChatActive="isChatActive"
                         @choiceSelected="onChoiceSelected"
                    />

                    <!-- CHAMP DE SAISIE -->
                    <ChatInput
                         v-if="isChatActive && !disableInput"
                         v-model:currentMessage="message"
                         :disableInput="disableInput"
                         @sendMessage="sendMessage"
                    />
               </div>

               <!-- MODAL RGPD -->
               <ChatModal
                    :show="showRGPDModal"
                    @accept="onAcceptRGPD"
                    @close="onCloseRGPD"
                    :isLoading="onLoadingRGPD"
               />

               <!-- OPTIONS -->
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
     id: string;
     idFromServer?: string;
     type: 'text' | string;
     sender: 'visitor' | 'bot';
     content: string;
     time_sent: number;
     isAIAssistant?: boolean;
     aiAssistantResponseType?: string;
     questionMessageId?: string | null;
     disableTextInput?: boolean;
     choices?: string[];
     status?: 'success' | 'unavailable';
}

const chatStore = useChatStore()
const isReady   = ref(false)

const props = defineProps<{
     previewMode?: boolean
     forcedState?: 'home' | 'conversation' | 'modal'
     projectPublicKey?: string
}>()
if (props.projectPublicKey) {
     chatStore.setProjectPublicKey(props.projectPublicKey)
}
// Variables / Refs principales
const message = ref('')         // Message en cours de saisie
const messages = ref<ChatMessage[]>([]) // Historique des messages
const isLoading = ref(false)    // Indicateur de chargement
const isOpen = ref(false)       // Gère l'ouverture du chatbot
const isChatActive = ref(false) // Vue "home" vs "chat"
const notificationSnoozed = ref(true)
const isExpanded = ref(false)
const showOptions = ref(false)
const isSending = ref(false)
const isVisible = ref(false)

// Désactiver le champ de saisie s'il y a des `choices`
const disableInput = ref(false)

// RGPD
const showRGPDModal = ref(false)
const onLoadingRGPD = ref(false)
const pendingMessage = ref<string | null>(null)

// Pour cliquer en dehors des options
const optionsBox = ref<HTMLElement | null>(null)

// Vérifie si on est dans le navigateur (pour localStorage)
const isBrowser = typeof window !== 'undefined'

const formattedMessages = computed(() => messages.value)

const formattedQuestions = computed(() =>
     chatStore.configChat.suggestedQuestionsString
          ? chatStore.configChat.suggestedQuestionsString.split(';')
          : []
)

// Sauvegarder l'historique des messages dans localStorage
watch(
     messages,
     (newMessages) => {
          if (!isBrowser) return

          const raw = localStorage.getItem('hhs_isp_chat')
          let existing = {}
          try {
               existing = raw ? JSON.parse(raw) : {}
          } catch {
               existing = {}
          }

          existing.messages = newMessages
          localStorage.setItem('hhs_isp_chat', JSON.stringify(existing))
     },
     { deep: true }
)

onMounted(() => {
     const ok = chatStore.fetchChatProject()
     if (!ok) return
     isReady.value = true
     if (props.previewMode) initPreviewState()

     function initPreviewState() {
          if (props.previewMode) {
               isOpen.value = true
               isVisible.value = true
               if (props.forcedState === 'conversation') isChatActive.value = true
               if (props.forcedState === 'home') isChatActive.value = false
               if (props.forcedState === 'modal') showRGPDModal.value = true
          }
     }
     if (isBrowser) {
          const raw = localStorage.getItem('hhs_isp_chat')
          if (raw) {
               try {
                    const parsed = JSON.parse(raw)

                    if (Array.isArray(parsed.messages)) {
                         messages.value = parsed.messages
                    }

                    if (typeof parsed.notificationSnoozed === 'boolean') {
                         notificationSnoozed.value = !parsed.notificationSnoozed
                    }
               } catch (err) {
                    console.warn('hhs_isp_chat corrompu ou vide')
               }
          }
     }
     document.addEventListener('click', handleClickOutside)
})

// Désactiver l'écouteur de clics
onUnmounted(() => {
     document.removeEventListener('click', handleClickOutside)
})

// Fermer le menu d'options si on clique en dehors
function handleClickOutside(event: any) {
     if (optionsBox.value && !optionsBox.value.contains(event.target)) {
          showOptions.value = false
     }
}

// Envoyer une question pré-remplie
function sendSuggestedMessage(question: string) {
     message.value = question
     isChatActive.value = true
     sendMessage()
}

// Envoi d'un message
async function sendMessage() {
     if (props.previewMode) return
     if (!message.value.trim()) return

     // Vérification RGPD
     const ispChatLocalStorage = localStorage.getItem('hhs_isp_chat')
     let ispChatData: any = {}
     try {
          ispChatData = ispChatLocalStorage ? JSON.parse(ispChatLocalStorage) : {}
     } catch (error) {
          ispChatData = {}
     }

     // Si pas accepté RGPD => forcer la modal
     if (!ispChatData.visitor || ispChatData.visitor.gdprConsent !== true) {
          pendingMessage.value = message.value
          showRGPDModal.value = true
          return
     }

     // On push d'abord le message user dans la conversation
     messages.value.push({
          id: crypto.randomUUID(),
          sender: 'visitor',
          type: 'text',
          content: message.value,
          time_sent: Date.now(),
     })

     isLoading.value = true
     const visitorMessage = message.value
     message.value = ''

     if (ispChatData.visitor.public_key || !isSending.value) {
          isSending.value = true

          const sendResult = await chatStore.messageSend(visitorMessage)

          if (!sendResult.success) {
               if (sendResult.reason === 'user_invalid') {
                    removeLastUserMessage()
                    isLoading.value = false
                    pendingMessage.value = visitorMessage
                    showRGPDModal.value = true
                    return
               }

               messages.value.push({
                    id: crypto.randomUUID(),
                    type: 'text',
                    sender: 'bot',
                    status: 'unavailable',
                    content: "Oups... Un problème est survenu ! Je n’arrive pas à répondre pour le moment. 🚀",
                    time_sent: Date.now(),
               })
               isLoading.value = false
               isSending.value = false
               return
          }

          // Success → message AI
          const botMessage = sendResult.message

          // Jouer un son si pas désactivé
          const chatLocalData = JSON.parse(localStorage.getItem('hhs_isp_chat') || '{}')
          if (chatLocalData.notificationSnoozed !== true) {
               playNotificationSound()
          }

          // Ajouter visuellement le message bot (pour affichage immédiat)
          messages.value.push(botMessage)
          isLoading.value = false
          isSending.value = false

          // Gérer si le message contient des options (choices)
          if (botMessage.choices && botMessage.choices.length > 0) {
               disableInput.value = true
          }
     }
}

// Quand l'utilisateur **clique un choix** renvoyé par l'API
function onChoiceSelected(choice: string) {
     if (props.previewMode) return
     removeLastChoiceMessage();
     disableInput.value = false
     message.value = choice
     sendMessage()
}

// Fonction pour jouer un son (notifications)
function playNotificationSound() {
     const audio = new Audio('/sounds/notification.mp3')
     audio.volume = 0.5
     audio.play().catch((error) => console.warn('Impossible de jouer le son :', error))
}

// Ouvrir/Fermer l'onglet "Options"
function toggleOptions() {
     showOptions.value = !showOptions.value
}

// Vider l'historique
function clearChatAndClose() {
     messages.value = []
     if (isBrowser) {
          localStorage.removeItem('user_messages')
     }
     showOptions.value = false
}

// Ouvrir/Fermer le chatbot
function toggleChat() {
     if (props.previewMode) return
     isOpen.value = !isOpen.value
     setTimeout(() => {
          isVisible.value = !isVisible.value
     }, 90)

     if (!isOpen.value) {
          // On repasse en mode "Accueil" après la fermeture
          setTimeout(() => {
               isChatActive.value = false
          }, 300)
     }
}

// Revenir à l'accueil
function goToHome() {
     isChatActive.value = false
}

// Activer/désactiver l'agrandissement
function toggleExpend() {
     isExpanded.value = !isExpanded.value
}

// Activer/désactiver les notifications
function toggleNotifications() {
     notificationSnoozed.value = !notificationSnoozed.value

     if (isBrowser) {
          const raw = localStorage.getItem('hhs_isp_chat')
          let existing = {}
          try {
               existing = raw ? JSON.parse(raw) : {}
          } catch {
               existing = {}
          }

          existing.notificationSnoozed = !notificationSnoozed.value
          localStorage.setItem('hhs_isp_chat', JSON.stringify(existing))
     }

     showOptions.value = false
}

// RGPD : accepter
async function onAcceptRGPD(email: string) {
     try {
          onLoadingRGPD.value = true
          await chatStore.visitorCreate(email)

          setTimeout(() => {
               showRGPDModal.value = false
               // On envoie immédiatement le pendingMessage
               if (pendingMessage.value && pendingMessage.value.trim().length > 0) {
                    message.value = pendingMessage.value
                    pendingMessage.value = null
                    sendMessage()
               }
               onLoadingRGPD.value = false
          }, 2000)


     } catch (err) {
          console.error("Erreur enregistrement de l'utilisateur:", err)
          onLoadingRGPD.value = false
     }
}

// RGPD : fermer
function onCloseRGPD() {
     showRGPDModal.value = false
     if (pendingMessage.value) {
          message.value = pendingMessage.value
     }
}

// Supprimer le dernier message
function removeLastMessage() {
     if (messages.value.length > 0) {
          messages.value.pop();
     }
}

// Supprimer le dernier message du bot
function removeLastBotMessage() {
     const lastBotIndex = messages.value
          .map((msg, index) => ({ msg, index }))
          .reverse()
          .find(({ msg }) => msg.sender === 'bot')?.index;

     if (lastBotIndex !== undefined) {
          messages.value.splice(lastBotIndex, 1);
     }
}

// Supprimer le dernier message de l'utilisateur
function removeLastUserMessage() {
     const lastUserIndex = messages.value
          .map((msg, index) => ({ msg, index }))
          .reverse()
          .find(({ msg }) => msg.sender === 'user')?.index;

     if (lastUserIndex !== undefined) {
          messages.value.splice(lastUserIndex, 1);
     }
}

// Supprimer le dernier message qui possède des choices
function removeLastChoiceMessage() {
     const lastBotMsg = messages.value
          .slice()
          .reverse()
          .find(msg => msg.sender === 'bot' && msg.choices);

     if (lastBotMsg) {
          lastBotMsg.choices = [];
     }
}

</script>
