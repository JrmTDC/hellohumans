<template>
     <!-- BOUTON FLOTANT POUR OUVRIR -->
     <div class="absolute w-[112px] h-[140px] bottom-[12px] flex items-center justify-center pointer-events-none z-[1] right-0">
          <button
               v-if="!isOpen"
               @click="toggleChat"
               class="w-[60px] h-[60px] rounded-[30px] flex items-center justify-center pointer-events-auto
             transition duration-150 ease-in-out relative text-[#007dfc] bg-[#0566ff]
             shadow-[0px_4px_24px_#02061033] hover:scale-110"
          >
               <svgoButtonIconChat class="w-[24px] h-[24px]" />
          </button>
          <!-- Icône de notifications désactivées (optionnel) -->
          <div
               v-if="!isOpen && !notificationSound"
               class="absolute top-[37px] right-[23px] font-bold pointer-events-none
             rounded-[10px] flex justify-center items-center min-w-[20px] h-[20px]
             bg-white outline outline-1 outline-[rgb(226,232,239)] text-[rgb(8,15,26)] z-1"
          >
               <svgoIconNotificationDisabled class="w-[16px] h-[16px]" />
          </div>
     </div>

     <!-- CONTENEUR PRINCIPAL DU CHAT -->
     <div
          v-if="isOpen || isVisible"
          id="hellohumans-chat-iframe"
          class="max-h-[calc(100%-47px)] h-[699px] flex flex-col transition-[height] duration-200
           absolute bottom-[26px] right-[26px] left-auto rounded-[16px] pointer-events-auto
           shadow-lg overflow-hidden z-1 bg-white scale-85 opacity-0
           transform transition-transform duration-300 ease-in-out"
          :class="[
      isExpanded ? 'w-[593px]' : 'w-[372px]',
      isVisible ? 'scale-100 opacity-100' : 'scale-85 opacity-0'
    ]"
     >
          <div v-auto-animate class="flex-1 overflow-hidden">
               <!-- HEADER -->
               <ChatHeader
                    :isChatActive="isChatActive"
                    :isOpen="isOpen"
                    :notificationSound="notificationSound"
                    :showOptions="showOptions"
                    @goToHome="goToHome"
                    @toggleChat="toggleChat"
                    @toggleOptions="toggleOptions"
               />

               <!-- Vague décorative -->
               <div class="relative z-10">
                    <svgoLineWave class="h-6 w-[calc(100%+10px)] absolute bottom-[-12px] left-[-4px]" />
               </div>

               <!-- ÉCRAN D'ACCUEIL -->
               <ChatHome
                    v-if="!isChatActive"
                    :suggestedQuestions="suggestedQuestions"
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
               :notificationSound="notificationSound"
               :isExpanded="isExpanded"
               :optionsBox="optionsBox"
               @toggleNotifications="toggleNotifications"
               @toggleExpend="toggleExpend"
               @clearChatAndClose="clearChatAndClose"
               @closeOptions="showOptions = false"
          />
     </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRuntimeConfig } from '#imports'

// SOUS-COMPOSANTS
import ChatHeader from '@/components/chat/ChatHeader.vue'
import ChatHome from '@/components/chat/ChatHome.vue'
import ChatMessages from '@/components/chat/ChatMessages.vue'
import ChatInput from '@/components/chat/ChatInput.vue'
import ChatOptions from '@/components/chat/ChatOptions.vue'
import ChatModal from '@/components/chat/ChatModal.vue'

// --- ÉTAT PRINCIPAL DU CHAT ---
const config = useRuntimeConfig()
const apiUrl = `${config.public.apiBaseUrl}/api/${config.public.apiVersion}`

// Variables / Refs principales
const message = ref('')         // Message en cours de saisie
const clientKey = ref(`${config.public.apiClientKey}`)
const messages = ref<any[]>([]) // Historique des messages
const isLoading = ref(false)    // Indicateur de chargement
const isOpen = ref(false)       // Gère l'ouverture du chatbot
const isChatActive = ref(false) // Vue "home" vs "chat"
const notificationSound = ref(true)
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

// Questions suggérées
const suggestedQuestions = [
     'Quels sont les restaurants ?',
     'Quels sont les événements à venir ?',
     'Quels sites touristiques visiter ?',
     'Où trouver un hôtel ?',
     'Quels sont les transport ?',
]

// Vérifie si on est dans le navigateur (pour localStorage)
const isBrowser = typeof window !== 'undefined'

// Sauvegarder l'historique des messages dans localStorage
watch(
     messages,
     newMessages => {
          if (isBrowser) {
               localStorage.setItem('user_messages', JSON.stringify(newMessages))
          }
     },
     { deep: true }
)

// Écouter les clics pour fermer le menu d'options
onMounted(() => {
     document.addEventListener('click', handleClickOutside)

     if (isBrowser) {
          // Récupérer l'état de notifications
          const userLocalStorage = localStorage.getItem('user_settings')
          if (userLocalStorage !== null) {
               const userLS = JSON.parse(userLocalStorage)
               notificationSound.value = userLS.notificationSound === true
          }

          // Récupérer l'historique
          const savedMessages = localStorage.getItem('user_messages')
          if (savedMessages) {
               messages.value = JSON.parse(savedMessages)
          }
     }
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
     if (!message.value.trim()) return

     // Vérification RGPD
     const userSettingsLocalStorage = localStorage.getItem('user_settings')
     let userSetting: any = {}
     try {
          userSetting = userSettingsLocalStorage ? JSON.parse(userSettingsLocalStorage) : {}
     } catch (error) {
          userSetting = {}
     }

     // Si pas accepté RGPD => forcer la modal
     if (userSetting.rgpd !== 'accepted') {
          pendingMessage.value = message.value
          showRGPDModal.value = true
          return
     }

     // On push d'abord le message user dans la conversation
     messages.value.push({
          text: message.value,
          datetime: new Date().toISOString(),
          status: 'success',
          sender: 'user',
     })

     isLoading.value = true
     const userMessage = message.value
     message.value = ''

     if (userSetting.uuid || !isSending.value) {
          isSending.value = true
          try {
               const res = await fetch(apiUrl + '/messages', {
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/json',
                         'x-client-key': clientKey.value,
                    },
                    body: JSON.stringify({
                         user_uuid: userSetting.uuid,
                         message: userMessage,
                    }),
               })
               const resUserMessage = await res.json()

               if (!res.ok) {
                    if (resUserMessage.error?.name === 'user_invalid') {
                         removeLastUserMessage();
                         isLoading.value = false
                         pendingMessage.value = userMessage
                         showRGPDModal.value = true
                         return
                    }
                    messages.value.push({
                         text: "Oups... Un problème est survenu ! Je n’arrive pas à répondre pour le moment. 🚀",
                         datetime: new Date().toISOString(),
                         status: 'unavailable',
                         sender: 'bot',
                    })
               } else {
                    // Notification audio ?
                    if (userSetting.notificationSound) {
                         playNotificationSound()
                    }
                    // SI L'API RETOURNE DES CHOICES
                    if (resUserMessage.success?.choices) {
                         messages.value.push({
                              text: resUserMessage.success.response,
                              datetime: new Date().toISOString(),
                              status: 'success',
                              sender: 'bot',
                              choices: resUserMessage.success.choices, // <-- On stocke les choix
                         })
                         // On désactive l'input tant que l'utilisateur n'a pas choisi
                         disableInput.value = true
                    } else {
                         // Réponse classique
                         messages.value.push({
                              text: resUserMessage.success.response,
                              datetime: new Date().toISOString(),
                              status: "success",
                              sender: 'bot',
                         })
                         disableInput.value = false
                    }
               }

               isLoading.value = false
               isSending.value = false
          } catch (error) {
               messages.value.push({
                    text: "Oups... Un problème est survenu ! Je n’arrive pas à répondre pour le moment. 🚀",
                    datetime: new Date().toISOString(),
                    status: 'unavailable',
                    sender: 'bot',
               })
               isLoading.value = false
               isSending.value = false
          }
     }
}

// Quand l'utilisateur **clique un choix** renvoyé par l'API
function onChoiceSelected(choice: string) {
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
     notificationSound.value = !notificationSound.value
     if (isBrowser) {
          const userSettingsLocalStorage = localStorage.getItem('user_settings');
          let userSetting = {};

          try {
               userSetting = userSettingsLocalStorage ? JSON.parse(userSettingsLocalStorage) : {};
          } catch (error) {
               userSetting = {};
          }

          localStorage.setItem(
               'user_settings',
               JSON.stringify({
                    ...userSetting,
                    notificationSound: notificationSound.value,
               })
          );
     }
     showOptions.value = false
}

// RGPD : accepter
async function onAcceptRGPD(userData: string) {
     try {
          onLoadingRGPD.value = true
          const res = await fetch(apiUrl + '/users', {
               method: 'POST',
               headers: {
                    'Content-Type': 'application/json',
                    'x-client-key': clientKey.value,
               },
               body: JSON.stringify({
                    email: userData,
                    rgpd: 'accepted',
               }),
          })
          const resData = await res.json()
          if (res.status === 200) {
               const userSettingsLocalStorage = localStorage.getItem('user_settings')
               let userSetting: any = {}
               try {
                    userSetting = userSettingsLocalStorage ? JSON.parse(userSettingsLocalStorage) : {}
               } catch (error) {
                    userSetting = {}
               }

               localStorage.setItem(
                    'user_settings',
                    JSON.stringify({
                         ...userSetting,
                         uuid: resData.success.user.uuid,
                         notificationSound: userSetting.notificationSound ?? true,
                         rgpd: 'accepted',
                    })
               )

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
          }
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
