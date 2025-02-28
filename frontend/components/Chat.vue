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
const clearChatAndClose = () => {
  messages.value = []
  if (isBrowser) {
    localStorage.removeItem("chat_history")
  }
  showOptions.value = false
}

// Fonction pour ouvrire/fermer les options
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
     if (!isOpen.value) {
          setTimeout(() => { isChatActive.value = false }, 300) // Attendre la fin de l'animation
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
     <div class="absolute w-[112px] h-[140px] bottom-[12px] flex items-center justify-center pointer-events-none z-[1] right-0">
          <button v-if="!isOpen" @click="toggleChat" class="w-[60px] h-[60px] rounded-[30px] flex items-center justify-center pointer-events-auto transition duration-150 ease-in-out relative text-[#007dfc] bg-[#0566ff] shadow-[0px_4px_24px_#02061033] hover:scale-110 transition duration-150 ease-in-out" v-html="buttonIconChat"></button>
          <div v-if="!isOpen && !notificationsEnabled" class="absolute top-[37px] right-[23px] font-bold pointer-events-none rounded-[10px] flex justify-center items-center min-w-[20px] h-[20px] bg-white outline outline-1 outline-[rgb(226,232,239)] text-[rgb(8,15,26)] z-1">
               <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.53332 12.3233V11.4568H4.20516V7.14893C4.20516 6.74893 4.27055 6.3652 4.40132 5.99776C4.5321 5.6302 4.70605 5.28448 4.92316 4.96059L7.11149 7.14893H5.85649L1.92316 3.21559L2.54232 2.57976L13.4705 13.5246L12.8513 14.1438L11.0437 12.3233H3.53332ZM11.7948 10.1361L5.75516 4.07976C5.99016 3.89854 6.24443 3.75259 6.51799 3.64193C6.79143 3.53126 7.07432 3.45026 7.36666 3.39893V2.56693C7.36666 2.3917 7.42843 2.24237 7.55199 2.11893C7.67543 1.99537 7.82477 1.93359 7.99999 1.93359C8.17521 1.93359 8.32455 1.99537 8.44799 2.11893C8.57155 2.24237 8.63332 2.3917 8.63332 2.56693V3.39893C9.56066 3.53826 10.3194 3.96176 10.9097 4.66943C11.4998 5.37721 11.7948 6.2037 11.7948 7.14893V10.1361ZM7.99999 14.1951C7.70088 14.1951 7.44749 14.0913 7.23982 13.8836C7.03205 13.6759 6.92816 13.4225 6.92816 13.1233H9.07182C9.07182 13.4225 8.96793 13.6759 8.76016 13.8836C8.55249 14.0913 8.2991 14.1951 7.99999 14.1951Z" fill="#080F1A"></path></svg>
          </div>
     </div>



     <!-- Chatbot -->

     <div v-if="isOpen" id="hellohumans-chat-iframe" v-auto-animate class="transition-all max-h-[calc(100%-47px)] h-[699px] flex flex-col transition-[height] duration-200 ease-in-out w-[372px] absolute bottom-[26px] right-[26px] left-auto rounded-[16px] pointer-events-auto shadow-lg overflow-hidden z-1 bg-white transform scale-85 opacity-0"
          :class="{
               'scale-100 opacity-100': isOpen
          }">
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
          <div id="conversation-group" ref="chatContainer"  v-auto-animate v-if="isChatActive" class="w-full overflow-hidden overflow-y-auto bg-white transition duration-300 min-h-[160px] h-[487px] px-6 flex-1">
               <div id="messages" class="relative mt-[10px] w-full pb-6 float-left">
                    <div v-for="(msg, index) in messages" :key="index" :class="msg.sender === 'user' ? 'hhcss_message-visitor mt-[9px] bg-[#0566ff] text-white float-right' : 'hhcss_message-operator mt-[9px] text-[rgb(6,19,43)] float-left border border-transparent'" class="hhcss_message py-[10px] px-4 rounded-[20px] my-[2px] text-[15px] leading-[20px] break-words inline-block max-w-[85%] clear-both relative transition-[margin] duration-[280ms] ease-in-out">
                         <span v-html="formatMessage(msg.text)" class="whitespace-pre-line"></span>
                    </div>
                    <div v-if="isLoading" class="hhcss_messageLoading text-[#00a9ff] float-left border border-transparent py-[10px] px-4 rounded-[20px] my-[2px] text-[15px] leading-[20px] break-words inline-block max-w-[85%] clear-both relative transition-[margin] duration-[280ms] ease-in-out">
                         <span>En train d'écrire</span>
                         <div class="hhcss_puceAnimation">
                              <span></span>
                              <span></span>
                              <span></span>
                         </div>
                    </div>
                    <div id="hhcss_conversation-scroll" class="w-[16px] h-[313px] absolute right-0 px-[4px]">
                         <div class="w-[8px] mx-[1px] bg-[#00173b] opacity-0 top-0 absolute rounded-[4px] cursor-pointer transition-[opacity,width,margin] duration-100 ease-in-out z-[2] select-none"></div>
                    </div>

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
          <div v-if="showOptions" ref="optionsBox" class="absolute top-[72px] right-[24px] bg-white rounded-[8px] shadow-[0px_6px_32px_0px_rgba(0,18,46,0.16)] p-[12px_6px] z-[6]">
               <ul class="m-0 p-0">
                    <li class="rounded-[6px] flex">
                         <button  @click="toggleNotifications" class="p-2 px-4 flex m-0 w-full rounded-[6px] hover:bg-[#eff2f6]">
                              <svg class="fill-[#8894ab] h-[22px] w-[22px]" v-if="!notificationsEnabled" id="ic_notificationsOn" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M0 0h24v24H0z" fill="none"></path><path d="M7.58 4.08L6.15 2.65C3.75 4.48 2.17 7.3 2.03 10.5h2c.15-2.65 1.51-4.97 3.55-6.42zm12.39 6.42h2c-.15-3.2-1.73-6.02-4.12-7.85l-1.42 1.43c2.02 1.45 3.39 3.77 3.54 6.42zM18 11c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2v-5zm-6 11c.14 0 .27-.01.4-.04.65-.14 1.18-.58 1.44-1.18.1-.24.15-.5.15-.78h-4c.01 1.1.9 2 2.01 2z"></path></svg>
                              <svg class="fill-[#8894ab] h-[22px] w-[22px]" v-if="notificationsEnabled" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M3.53332 12.3233V11.4568H4.20516V7.14893C4.20516 6.74893 4.27055 6.3652 4.40132 5.99776C4.5321 5.6302 4.70605 5.28448 4.92316 4.96059L7.11149 7.14893H5.85649L1.92316 3.21559L2.54232 2.57976L13.4705 13.5246L12.8513 14.1438L11.0437 12.3233H3.53332ZM11.7948 10.1361L5.75516 4.07976C5.99016 3.89854 6.24443 3.75259 6.51799 3.64193C6.79143 3.53126 7.07432 3.45026 7.36666 3.39893V2.56693C7.36666 2.3917 7.42843 2.24237 7.55199 2.11893C7.67543 1.99537 7.82477 1.93359 7.99999 1.93359C8.17521 1.93359 8.32455 1.99537 8.44799 2.11893C8.57155 2.24237 8.63332 2.3917 8.63332 2.56693V3.39893C9.56066 3.53826 10.3194 3.96176 10.9097 4.66943C11.4998 5.37721 11.7948 6.2037 11.7948 7.14893V10.1361ZM7.99999 14.1951C7.70088 14.1951 7.44749 14.0913 7.23982 13.8836C7.03205 13.6759 6.92816 13.4225 6.92816 13.1233H9.07182C9.07182 13.4225 8.96793 13.6759 8.76016 13.8836C8.55249 14.0913 8.2991 14.1951 7.99999 14.1951Z"></path></svg>
                              <span class="ml-[10px] text-[#06132b]"> {{ notificationsEnabled ? "Désactiver" : "Activer" }} les notifications</span>
                         </button>
                    </li>
                    <li class="rounded-[6px] flex">
                         <button  @click="clearChatAndClose" class="p-2 px-4 flex m-0 w-full rounded-[6px] hover:bg-[#eff2f6]">
                              <svg class="fill-[#8894ab] h-[22px] w-[22px]" width="22" height="22" viewBox="0 0 14 15" xmlns="http://www.w3.org/2000/svg"> <path d="M0.956952 3.62988C0.956952 3.74707 1.34953 10.4238 1.54875 13.5908C1.60441 14.4668 2.18449 14.9971 3.07219 14.9971H9.97453C10.9853 14.9971 11.5185 14.4785 11.58 13.4736C11.7441 10.7666 12.1425 4.16602 12.1718 3.62695L0.956952 3.62988ZM8.91105 10.2949C9.28898 10.6729 9.28898 11.2852 8.91105 11.6631C8.53312 12.041 7.92082 12.041 7.54289 11.6631L6.56437 10.6846L5.58586 11.6631C5.20793 12.041 4.59562 12.041 4.21769 11.6631C3.83976 11.2852 3.83976 10.6729 4.21769 10.2949L5.19621 9.31641L4.21769 8.33496C3.83976 7.95703 3.83976 7.34473 4.21769 6.9668C4.59562 6.58887 5.20793 6.58887 5.58586 6.9668L6.56437 7.94531L7.54289 6.9668C7.92082 6.58887 8.53312 6.58887 8.91105 6.9668C9.28898 7.34473 9.28898 7.95703 8.91105 8.33496L7.93254 9.31641L8.91105 10.2949ZM12.1601 0.963867C11.3661 0.958008 10.5751 0.952148 9.7841 0.966797C9.73723 0.421875 9.28019 0 8.73234 0H4.37883C3.83098 0 3.37394 0.421875 3.33 0.966797C2.51555 0.952148 1.69816 0.958008 0.88371 0.963867C0.455976 0.969727 0.145429 1.20703 0.0428899 1.58203C-0.135821 2.23535 0.259687 2.77441 0.936444 2.77734C2.81437 2.7832 4.68937 2.78027 6.56437 2.78027H12.1542C12.7607 2.78027 13.1093 2.44043 13.1122 1.875C13.1152 1.30957 12.7636 0.966797 12.1601 0.963867Z"/> </svg>
                              <span class="ml-[10px] text-[#06132b]">Effacer l'historique</span>
                         </button>
                    </li>
               </ul>
          </div>
     </div>
</template>
