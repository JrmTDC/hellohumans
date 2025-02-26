<script setup>
import { ref, nextTick, onMounted, onUnmounted, watch } from 'vue'
import logoHelloHumanMini from '@/assets/svg/logoHelloHumansMini.svg?raw'
import logoHelloHumanFull from 'assets/svg/logoHelloHumansFull.svg?raw'
import buttonIconChat from 'assets/svg/buttonIconChat.svg?raw'
import iconChat from 'assets/svg/iconChat.svg?raw'
import iconBack from '@/assets/svg/iconBack.svg?raw'
import iconHome from 'assets/svg/iconHome.svg?raw'
import iconMinimize from '@/assets/svg/iconMinimize.svg?raw'
import iconOption from 'assets/svg/iconOption.svg?raw'
import iconSend from 'assets/svg/iconSend.svg?raw'
import emojiHello from 'assets/svg/emojiHello.svg?raw'

// Config
const config = useRuntimeConfig()
const apiUrl = `${config.public.apiBaseUrl}/api/${config.public.apiVersion}/chat`

const message = ref("")
const clientKey = ref("550e8400-e29b-41d4-a716-446655440000") // Clé client
const messages = ref([]) // Historique des messages
const isLoading = ref(false) // Animation de chargement
const chatContainer = ref(null) // Référence à la zone de chat
const isOpen = ref(false) // Gère l'ouverture du chatbot
const isMobile = ref(false) // Détecte si l'utilisateur est sur mobile
const isChatActive = ref(false) // Gère l'affichage entre Home & Chat
const notificationsEnabled = ref(true) // True = Notifications activées
const showOptions = ref(false)
const optionsBox = ref(null)

// Fonction pour jouer un son lorsqu'un message du chatbot arrive
const playNotificationSound = () => {
     const audio = new Audio("/sounds/notification.mp3") // Charger le son
     audio.volume = 0.5 // Ajuste le volume si nécessaire (0.0 - 1.0)
     audio.play().catch(error => console.warn("Impossible de jouer le son :", error)) // Gestion d'erreur
}

// Fonction pour activer/désactiver les notifications
const toggleNotifications = () => {
     notificationsEnabled.value = !notificationsEnabled.value
     localStorage.setItem("notifications_enabled", notificationsEnabled.value)
}

// Exemples de questions suggérées
const suggestedQuestions = [
     "Quels sont les restaurants ?",
     "Quels sont les événements à venir ?",
     "Quels sites touristiques visiter ?",
     "Où trouver un hôtel ?",
     "Quels sont les transport ?"
]

// Fonction pour envoyer une question pré-remplie
const sendSuggestedMessage = (question) => {
  message.value = question
  sendMessage()
}

// Vérifie si c'est un nouveau visiteur
const isBrowser = typeof window !== "undefined"

// Détecte si l'utilisateur est sur mobile
onMounted(() => {
     document.addEventListener("click", handleClickOutside)
     isMobile.value = window.innerWidth <= 768
     const savedNotifications = localStorage.getItem("notifications_enabled")
     if (savedNotifications !== null) {
          notificationsEnabled.value = savedNotifications === "true"
     }
     if (isBrowser) {
          const savedMessages = localStorage.getItem("chat_history")
          if (savedMessages) {
               messages.value = JSON.parse(savedMessages)
          }
     }
})

  if (isBrowser) {
    const savedMessages = localStorage.getItem("chat_history")
    if (savedMessages) {
      messages.value = JSON.parse(savedMessages)
    }
  }
onUnmounted(() => {
     document.removeEventListener("click", handleClickOutside)
})

// Sauvegarde l'historique en localStorage
watch(messages, (newMessages) => {
  if (isBrowser) {
    localStorage.setItem("chat_history", JSON.stringify(newMessages))
  }
}, { deep: true })

// Scroll automatique
const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

// Fonction pour vider l'historique
const clearChat = () => {
  messages.value = []
  if (isBrowser) {
    localStorage.removeItem("chat_history")
  }
}

// Fonction pour activer/désactiver les notifications
const toggleOptions = () => {
     showOptions.value = !showOptions.value
}

// Fonction pour fermer les options quand on clique en dehors
const handleClickOutside = (event) => {
     if (optionsBox.value && !optionsBox.value.contains(event.target)) {
          showOptions.value = false
     }
}

// Envoi d'un message
const sendMessage = async () => {
     if (!message.value.trim()) return

     messages.value.push({ text: message.value, sender: "user" })
     isChatActive.value = true
     scrollToBottom()

     isLoading.value = true
     const userMessage = message.value
     message.value = ""

     try {
          const res = await fetch(apiUrl, {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ message: userMessage, clientKey: clientKey.value })
          })
          const data = await res.json()

          setTimeout(() => {
               if (notificationsEnabled.value) {
                    playNotificationSound()
               }
               messages.value.push({ text: data.response, sender: "bot" })
               scrollToBottom()
               isLoading.value = false
          }, 1000)
     } catch (error) {
          messages.value.push({ text: "Erreur : Impossible de contacter le chatbot.", sender: "bot" })
          scrollToBottom()
          isLoading.value = false
     }
}

// Fonction pour ouvrir/fermer le chatbot
const toggleChat = () => {
     isOpen.value = !isOpen.value
     isChatActive.value = false

     // Si on ouvre le chat, scroller automatiquement vers le bas
     if (isOpen.value) {
          nextTick(() => {
               scrollToBottom()
          })
     }
}

const formatMessage = (text) => {
  // Gérer les sauts de ligne et les listes
  return text
      .replace(/\n/g, "<br>") // Remplace les sauts de ligne par <br>
      .replace(/(\d{1,2}\s\w+\s\w+)/g, "<strong>$1</strong>") // Met en gras les adresses ou dates
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Formatage en gras **Texte**
      .replace(/\*(.*?)\*/g, "<em>$1</em>") // Formatage en italique *Texte*
      .replace(/- (.*?)<br>/g, "• $1<br>"); // Convertir les listes en puces
}

watch(isChatActive, (newVal) => {
     if (newVal) {
          nextTick(() => {
               scrollToBottom()
          })
     }
})
</script>

<template>
     <!-- Bouton flottant -->
     <button v-if="!isOpen" @click="toggleChat" class="fixed bottom-6 right-6 shadow-lg w-[60px] h-[60px] rounded-[28px] flex items-center justify-center text-white bg-[#007dfc] shadow-[rgba(2,6,16,0.2)_0px_4px_24px] hover:scale-110 focus:scale-110 transition-transform duration-200" v-html="buttonIconChat"></button>

     <!-- Chatbot -->

     <div v-if="isOpen" v-auto-animate class="max-h-[calc(100%-47px)] h-[699px] flex flex-col transition-[height] duration-200 ease-in-out w-[372px] absolute bottom-[26px] right-[26px] left-auto rounded-[16px] pointer-events-auto shadow-lg overflow-hidden z-1 bg-white">
          <!-- Header -->
          <div class="p-[24px] bg-[#0566ff] text-white rounded-t-lg">
               <div class="flex justify-between items-center">
                    <div v-if="!isChatActive">
                         <div v-html="logoHelloHumanFull"></div>
                    </div>
                    <div v-if="isChatActive">
                         <div class="flex space-x-2 items-center">
                              <button @click="isChatActive = false" class="relative group p-2 rounded-full transition hover:bg-[#00245c29] w-10 h-10 flex items-center justify-center ml-[-15px]">
                                   <span class="bg-white px-2 py-[6px] rounded shadow-lg text-[13px] absolute pointer-events-none whitespace-nowrap transition-[opacity,transform] duration-[160ms] ease-in-out z-1 top-1/2 text-[#06132B] start-full ms-[10px] translate-x-[-5px] translate-y-[-50%] opacity-0 group-hover:opacity-100 transition">Retour</span>
                                   <span v-html="iconBack"></span>
                              </button>
                              <div v-html="logoHelloHumanMini"></div>
                              <div class="flex space-x-2 items-center"><span>Bonjour !</span> <span v-html="emojiHello" class="hhcss_emojiHelloChat"></span></div>
                         </div>
                    </div>
                    <div class="flex">
                         <!-- Open options -->
                         <button @click.stop="toggleOptions" class="relative group p-2 rounded-full transition hover:bg-[#00245c29] w-10 h-10 flex items-center justify-center">
                              <span v-html="iconOption"></span>
                              <span v-if="!showOptions"  class="bg-white px-2 py-[6px] rounded shadow-lg text-[13px] absolute pointer-events-none whitespace-nowrap transition-[opacity,transform] duration-[160ms] ease-in-out z-1 top-1/2 text-[#06132B] end-full me-[10px] translate-x-[5px] translate-y-[-50%] opacity-0 group-hover:opacity-100 transition">Ouvrir les options</span>
                              <span v-if="showOptions" class="bg-white px-2 py-[6px] rounded shadow-lg text-[13px] absolute pointer-events-none whitespace-nowrap transition-[opacity,transform] duration-[160ms] ease-in-out z-1 top-1/2 text-[#06132B] end-full me-[10px] translate-x-[5px] translate-y-[-50%] opacity-0 group-hover:opacity-100 transition">Fermer les options</span>
                         </button>

                         <!-- Minimize -->
                         <button @click="toggleChat" class="relative group p-2 rounded-full transition hover:bg-[#00245c29] w-10 h-10 flex items-center justify-center mr-[-15px]">
                              <span v-html="iconMinimize"></span>
                              <span v-auto-animate class="bg-white px-2 py-[6px] rounded shadow-lg text-[13px] absolute pointer-events-none whitespace-nowrap transition-[opacity,transform] duration-[160ms] ease-in-out z-1 top-1/2 text-[#06132B] end-full me-[10px] translate-x-[5px] translate-y-[-50%] opacity-0 group-hover:opacity-100 transition">Réduire</span>
                         </button>
                    </div>
               </div>

               <div v-if="!isChatActive" class="mt-[28px] text-white text-[32px] font-medium leading-[40px] gap-[12px] flex flex-col mb-[40px]">
                    <div class="flex flex-row justify-start items-center">Bonjour ! <span class="ml-[10px]" v-html="emojiHello"> </span></div>
                    <div class="text-white text-[15px] font-normal leading-[20px]">Bienvenue sur le site de l'Office de Tourisme, Avez vous besoin d’aider ?</div>
               </div>
               <div v-if="isChatActive" class="mt-[15px] text-white text-[15px] font-normal">Je suis là pour vous aider !</div>
          </div>
         <div class="relative">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 372 15" class="h-6 w-[calc(100%+10px)] absolute bottom-[-12px] left-[-4px]"
              ><path d="M349.8 1.4C334.5.4 318.5 0 302 0h-2.5c-9.1 0-18.4.1-27.8.4-34.5 1-68.3 3-102.3 4.7-14 .5-28 1.2-41.5 1.6C84 7.7 41.6 5.3 0 2.2v8.4c41.6 3 84 5.3 128.2 4.1 13.5-.4 27.5-1.1 41.5-1.6 33.9-1.7 67.8-3.6 102.3-4.7 9.4-.3 18.7-.4 27.8-.4h2.5c16.5 0 32.4.4 47.8 1.4 8.4.3 15.6.7 22 1.2V2.2c-6.5-.5-13.8-.5-22.3-.8z" fill="#fff"></path></svg>
         </div>
          <!-- Home (Accueil) -->
          <div v-if="!isChatActive" class="p-[24px] pt-[0] pb-[0] max-h-[434px] mt-[-40px] overflow-y-auto flex flex-col z-10 scroll-px-[24px] flex-[1_1_0%]">
               <!-- Questions suggérées -->
               <div class="flex rounded-[12px] divide-solid overflow-y-hidden mb-[16px] w-full border border-[#EFF2F6]">
                    <div class="flex flex-col w-full items-center overflow-y-auto bg-[#fff]">
                         <div v-for="(question, index) in suggestedQuestions" :key="index" class="w-full">
                              <button @click="sendSuggestedMessage(question)" class="flex scroll-px-[16px] items-center gap-[8px] justify-between w-full hover:bg-[#EFF2F6] p-[16px]">
                                   <span class="text-[15px] font-medium text-left text-[#06132b] overflow-hidden text-ellipsis">{{ question }}</span>
                                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" class="directional-icon"><path d="M7.5 6.175L8.675 5L13.675 10L8.675 15L7.5 13.825L11.3167 10L7.5 6.175Z"></path></svg>
                              </button>
                              <hr class="ml-[15px] mr-[15px]" v-if="index !== suggestedQuestions.length - 1">
                         </div>
                    </div>
               </div>

               <!-- Bouton Chat avec nous -->

               <button @click="isChatActive = true" class="flex px-4 py-3 items-center gap-2 w-full rounded-xl border border-[#e2e8ef] bg-white hover:bg-[#EFF2F6]">
                    <div class="flex flex-col items-start gap-[2px] flex-grow">
                         <span class="font-semibold text-[15px] leading-[19px] leading-norma">Parlez à notre assistant</span>
                         <span class="text-[14px] font-normal text-left text-[#4C596B] overflow-hidden text-ellipsis line-clamp-2 leading-norma">Je suis là pour vous aider !</span>
                    </div>
                    <span v-html="iconSend"></span>
               </button>

               <!-- Powered by HelloHumans Agent -->
               <div class="flex justify-center items-center flex-[0_0_48px]">
                    <a href="https://hellohumans.fr" target="_blank" class="text-[#6e7a95] text-xs font-normal uppercase text-center">Propulsé par HelloHumans</a>
               </div>
          </div>

          <!-- Navigation en bas -->
          <div v-if="!isChatActive" class="bg-white flex flex-col px-[24px]">
               <div class="px-5 py-3 flex justify-center items-start gap-1 self-stretch border-t border-[#e2e8ef] bg-white">
                    <!-- Home -->
                    <button @click="isChatActive = false" class="flex flex-1 flex-col items-center gap-[2px] text-[15px] font-semibold">
                         <span v-html="iconHome"></span>
                         <span class="text-sm text-gray-700">Accueil</span>
                    </button>

                    <!-- Chat -->
                    <button @click="isChatActive = true" class="flex flex-1 flex-col items-center gap-[2px] text-[15px] font-semibold text-[#647491] hover:text-gray-700">
                         <span v-html="iconChat" class="h-7 w-7"></span>
                         <span class="text-sm">Discussion</span>
                    </button>
               </div>
          </div>

          <!-- Messages -->
          <div ref="chatContainer"  v-auto-animate v-if="isChatActive" class="flex-1 overflow-y-auto p-[24px] space-y-3 bg-withe">
               <div v-for="(msg, index) in messages" :key="index" class="flex items-center"  :class="msg.sender === 'user' ? 'justify-end' : 'justify-start'">
                    <p v-html="formatMessage(msg.text)" :class="msg.sender === 'user' ? 'bg-[#0566FF] text-white' : 'bg-white text-[#606060] border border-[#777676]'" class="inline-block rounded-[20px] px-4 py-3  max-w-xs leading-relaxed text-sm"></p>
               </div>
               <div v-if="isLoading" class="text-left animate-pulse">
                         <p class="rounded-[20px] text-[#798096] text-sm bg-white"
                         >En train d'écrire...</p>
               </div>
          </div>

          <div v-if="isChatActive">

               <!-- Saisie utilisateur -->
               <div class="px-6 w-full relative bg-white z-3 flex-none">
                    <div class="transition-opacity duration-500 ease-in-out opacity-100 translate-y-0">
                         <hr>
                         <div class="flex items-center gap-3">
                             <textarea rows="1" v-model="message" placeholder="Écrivez un message..." class="py-4 border-0 w-full text-[17px] py-[16px] resize-none leading-6 overflow-x-hidden focus:outline-none" @keyup.enter="sendMessage"></textarea>

                              <button v-show="message.trim() !== ''" @click="sendMessage" class="relative group p-2 rounded-full transition hover:bg-[#dce9ff] w-10 h-10 flex items-center justify-center ml-2">
                                   <span class="bg-white px-2 py-[6px] rounded shadow-lg text-[13px] absolute pointer-events-none whitespace-nowrap z-1 text-[#06132B] bottom-[calc(100%-4px)] left-1/2 translate-x-[-50%] translate-y-[10px] opacity-0 transition-opacity transition-transform duration-[160ms] ease-in-out gap-2 bottom-[calc(100%-4px)] left-1/2 translate-x-[-50%] translate-y-[-10px] opacity-0 group-hover:opacity-100 transition">Envoyer
                                        <div class="flex items-center gap-1 text-xs text-[rgb(100,116,145)]">Raccourci <svg xmlns="http://www.w3.org/2000/svg" width="11" height="10" viewBox="0 0 11 10"><path d="M2.1665 6.25033L4.6665 8.75033L5.25817 8.15866L3.76234 6.66699H8.4165V1.66699H7.58317V5.83366H3.76234L5.25817 4.34199L4.6665 3.75033L2.1665 6.25033Z" fill="#647491"></path></svg></div>
                                   </span>
                                   <span v-html="iconSend"></span>
                              </button>
                         </div>
                    </div>
                    <div class="h-[30px] relative">
                         <div>
                              <a href="https://hellohumans.fr" target="_blank" class="mr-0 float-right flex no-underline text-[#bfc3cb] text-xs font-normal uppercase ltr"
                              >Propulsé par HelloHumans</a>
                         </div>
                    </div>
               </div>

          </div>
          <!-- Options -->
          <div v-if="showOptions" ref="optionsBox" class="absolute top-14 right-4 bg-white shadow-lg rounded-md p-3 border border-gray-200 w-56">
               <button  @click="toggleNotifications" class="w-full bg-white shadow rounded-md p-2 flex items-center space-x-2 hover:bg-gray-100 transition">
                    <svg fill="black" height="24" viewBox="0 0 24 24" width="24"> <path d="M0 0h24v24H0z" fill="none"></path> <path d="M20 18.69L7.84 6.14 5.27 3.49 4 4.76l2.8 2.8v.01c-.52.99-.8 2.16-.8 3.42v5l-2 2v1h13.73l2 2L21 19.72l-1-1.03zM12 22c1.11 0 2-.89 2-2h-4c0 1.11.89 2 2 2zm6-7.32V11c0-3.08-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68c-.15.03-.29.08-.42.12-.1.03-.2.07-.3.11h-.01c-.01 0-.01 0-.02.01-.23.09-.46.2-.68.31 0 0-.01 0-.01.01L18 14.68z"></path></svg>
                    <span> {{ notificationsEnabled ? "Désactiver" : "Activer" }} les notifications</span>
               </button>
               </button>
          </div>

     </div>
</template>
