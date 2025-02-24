<script setup>
import { ref, nextTick, onMounted, watch } from 'vue'

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
const showOptions = ref(false) // Affiche les options

// Exemples de questions suggérées
const suggestedQuestions = [
  "Quels sont les meilleurs restaurants ?",
  "Quels sont les événements à venir ?",
  "Quels sites touristiques visiter ?",
  "Où trouver un hôtel ?"
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
  isMobile.value = window.innerWidth <= 768

  if (isBrowser) {
    const savedMessages = localStorage.getItem("chat_history")
    if (savedMessages) {
      messages.value = JSON.parse(savedMessages)
    }
  }
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
// Fonction pour activer/désactiver les notifications
const toggleOptions = () => {
     showOptions.value = !showOptions.value
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
     <button v-if="!isOpen" @click="toggleChat" class="fixed bottom-6 right-6 shadow-lg w-[60px] h-[60px] rounded-[28px] flex items-center justify-center text-white bg-[#007dfc] shadow-[rgba(2,6,16,0.2)_0px_4px_24px] hover:scale-110 focus:scale-110 transition-transform duration-200">
          <svg fill="white" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"> <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"></path> <path d="M0 0h24v24H0z" fill="none"></path> </svg>
     </button>

     <!-- Chatbot -->

     <div v-if="isOpen" v-auto-animate class="fixed bottom-6 right-6 bg-white shadow-lg rounded-lg transition-all border border-gray-200 flex flex-col" :class="isMobile ? 'w-full h-full top-0 left-0' : 'w-96 h-[88vh]'">

          <!-- Header -->
          <div class="p-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex justify-between items-center rounded-t-lg">
               <div v-if="!isChatActive">
                    HelloHumans
               </div>
               <div v-if="isChatActive">
                    <button @click="isChatActive = false" class="relative group p-2 rounded-full transition hover:bg-[#00245c29] w-10 h-10 flex items-center justify-center">
                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="directional-icon"><path d="M16.6312 17.7375L14.8687 19.5L7.36865 12L14.8687 4.5L16.6312 6.2625L10.9062 12L16.6312 17.7375Z"></path></svg>
                    </button>
               </div>

               <div class="flex space-x-2">
                    <!-- Open options -->
                    <button @click="toggleOptions" class="relative group p-2 rounded-full transition hover:bg-[#00245c29] testddd w-10 h-10 flex items-center justify-center">
                         <span class="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">Open options</span>
                         <svg fill="white" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"> <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path> </svg>
                    </button>

                    <!-- Minimize -->
                    <button @click="toggleChat" class="relative group p-2 rounded-full transition hover:bg-[#00245c29] w-10 h-10 flex items-center justify-center">
                         <span class="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">Minimize</span>
                         <svg fill="#fff" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path d="M17.7375 7.36914L19.5 9.13164L12 16.6316L4.5 9.13164L6.2625 7.36914L12 13.0941L17.7375 7.36914Z"></path> </svg>
                    </button>
               </div>
          </div>

          <!-- Home (Accueil) -->
          <div v-if="!isChatActive" class="p-4 space-y-4">
               <p class="text-gray-700 text-lg">Bienvenue sur le site de l'Office de Tourisme ! Je suis prêt à vous aider.</p>

               <!-- Questions suggérées -->
               <div class="bg-gray-100 p-3 rounded-lg shadow-inner max-h-40 overflow-y-auto">
                    <button v-for="(question, index) in suggestedQuestions" :key="index" @click="sendSuggestedMessage(question)" class="block w-full text-left p-2 bg-white rounded-md shadow-sm hover:bg-gray-200 transition">{{ question }}</button>
               </div>

               <!-- Bouton Chat avec nous -->
               <button @click="isChatActive = true" class="w-full bg-blue-500 text-white py-3 rounded-md text-center font-bold">💬 Chat avec nous</button>

               <!-- Powered by HelloHumans Agent -->
               <div class="p-4 text-center text-sm text-gray-500">Powered by <span class="font-semibold">HelloHumans Agent</span></div>

               <!-- Navigation en bas -->
               <div class="flex border-t bg-white h-[75px]">
                    <!-- Home -->
                    <button @click="isChatActive = false"
                            class="flex-1 flex flex-col items-center justify-center"><svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"> <g> <path d="M4.66663 24.5V10.5L14 3.5L23.3333 10.5V24.5H16.3333V16.3333H11.6666V24.5H4.66663Z" fill="#0566ff"></path> </g> </svg><span class="text-sm text-gray-700">Home</span>
                    </button>

                    <!-- Chat -->
                    <button @click="isChatActive = true" class="flex-1 flex flex-col items-center justify-center"><svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"> <g> <path d="M2.91663 23.9613V4.44205C2.91663 3.85269 3.12079 3.35384 3.52913 2.94551C3.93746 2.53717 4.43631 2.33301 5.02567 2.33301H22.9743C23.5636 2.33301 24.0625 2.53717 24.4708 2.94551C24.8791 3.35384 25.0833 3.85269 25.0833 4.44205V17.724C25.0833 18.3133 24.8791 18.8122 24.4708 19.2205C24.0625 19.6288 23.5636 19.833 22.9743 19.833H7.04488L2.91663 23.9613ZM6.29996 18.083H22.9743C23.0641 18.083 23.1463 18.0456 23.221 17.9707C23.2959 17.896 23.3333 17.8138 23.3333 17.724V4.44205C23.3333 4.35222 23.2959 4.26997 23.221 4.1953C23.1463 4.12044 23.0641 4.08301 22.9743 4.08301H5.02567C4.93583 4.08301 4.85358 4.12044 4.77892 4.1953C4.70406 4.26997 4.66663 4.35222 4.66663 4.44205V19.6985L6.29996 18.083Z" fill="#4C596B"></path> </g> </svg><span class="text-sm text-gray-700">Chat</span>
                    </button>
               </div>

          </div>

          <!-- Messages -->
          <div ref="chatContainer"  v-auto-animate v-if="isChatActive" class="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
               <div v-for="(msg, index) in messages" :key="index" class="flex items-center"  :class="msg.sender === 'user' ? 'justify-end' : 'justify-start'">
                    <p v-html="formatMessage(msg.text)" :class="msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 border border-gray-200'" class="inline-block rounded-2xl px-4 py-3 shadow-lg max-w-xs leading-relaxed"></p>
               </div>
               <div v-if="isLoading" class="text-left animate-pulse">
                    <p class="bg-gray-300 text-gray-700 inline-block rounded-lg px-3 py-2 my-1 max-w-xs">Chatbot est en train d'écrire...</p>
               </div>
          </div>

          <div v-if="isChatActive">
               <!-- Ligne de séparation -->
               <div class="border-t border-gray-300"></div>

               <!-- Saisie utilisateur -->
               <div class="p-4 bg-white flex items-center">
                    <input v-model="message" class="w-full rounded-md focus:outline-none" placeholder="Écrivez un message..." @keyup.enter="sendMessage" />
                    <button @click="sendMessage" class="relative group p-2 rounded-full transition hover:bg-[#00245c29] w-10 h-10 flex items-center justify-center ml-2"><span class="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">Envoyer</span><svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg"> <g> <path d="M4.8198 9.47833L3.34528 6.5293C2.23596 4.31066 1.68131 3.20135 2.19096 2.69169C2.70061 2.18204 3.80993 2.7367 6.02856 3.84601L15.7176 8.69056C17.2787 9.4711 18.0593 9.86138 18.0593 10.4794C18.0593 11.0974 17.2787 11.4877 15.7177 12.2683L6.02857 17.1128C3.80993 18.2221 2.70061 18.7768 2.19096 18.2671C1.68131 17.7575 2.23596 16.6482 3.34528 14.4295L4.82088 11.4783H10.5305C11.0827 11.4783 11.5305 11.0306 11.5305 10.4783C11.5305 9.92605 11.0827 9.47833 10.5305 9.47833H4.8198Z" fill="var(--custom-action-color, #0566ff)"></path> </g></svg>
                    </button>
               </div>
          </div>
          <!-- Options -->
          <div v-if="showOptions" class="absolute top-14 right-4 bg-white shadow-lg rounded-md p-3 border border-gray-200 w-56">
               <button @click="toggleNotifications" class="w-full bg-white shadow rounded-md p-2 flex items-center space-x-2 hover:bg-gray-100 transition"><svg fill="black" height="24" viewBox="0 0 24 24" width="24"> <path d="M0 0h24v24H0z" fill="none"></path> <path d="M20 18.69L7.84 6.14 5.27 3.49 4 4.76l2.8 2.8v.01c-.52.99-.8 2.16-.8 3.42v5l-2 2v1h13.73l2 2L21 19.72l-1-1.03zM12 22c1.11 0 2-.89 2-2h-4c0 1.11.89 2 2 2zm6-7.32V11c0-3.08-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68c-.15.03-.29.08-.42.12-.1.03-.2.07-.3.11h-.01c-.01 0-.01 0-.02.01-.23.09-.46.2-.68.31 0 0-.01 0-.01.01L18 14.68z"></path></svg><span>{{ notificationsEnabled ? "Turn off notifications" : "Turn on notifications" }}</span>
               </button>
          </div>

     </div>
</template>
