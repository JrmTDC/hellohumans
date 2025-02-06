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
const isNewVisitor = ref(true) // Nouveau visiteur

const isBrowser = typeof window !== "undefined"

// Détecte si l'utilisateur est sur mobile
onMounted(() => {
  isMobile.value = window.innerWidth <= 768

  if (isBrowser) {
    const savedMessages = localStorage.getItem("chat_history")
    if (savedMessages) {
      messages.value = JSON.parse(savedMessages)
    }
    isNewVisitor.value = !localStorage.getItem("hasVisited")

    if (isNewVisitor.value) {
      setTimeout(() => {
        messages.value.push({ text: "👋 Besoin d'aide ?", sender: "bot" })
        localStorage.setItem("hasVisited", "true")
        scrollToBottom()
      }, 5000)
    }
  }
})

// Sauvegarde l'historique en localStorage (uniquement côté client)
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

// Formater le message reçu
const formatMessage = (text) => {
  return text ? text.replace(/\n/g, "<br>") : "⚠️ Réponse invalide du chatbot."
}
// Envoi d'un message
const sendMessage = async () => {
  if (!message.value.trim()) return

  messages.value.push({ text: message.value, sender: "user" })
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
      console.log(data.response);
      const botResponse = data.response || "⚠️ Le chatbot n'a pas pu répondre."
      messages.value.push({ text: formatMessage(botResponse), sender: "bot" })
      scrollToBottom()
      isLoading.value = false
    }, 1000)
  } catch (error) {
    messages.value.push({ text: "Erreur : Impossible de contacter le chatbot.", sender: "bot" })
    scrollToBottom()
    isLoading.value = false
  }
}

// Fonction pour vider l'historique
const clearChat = () => {
  messages.value = []
  if (isBrowser) {
    localStorage.removeItem("chat_history")
  }
}

// Fonction pour ouvrir/fermer le chatbot
const toggleChat = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <!-- Bouton flottant -->
  <button @click="toggleChat" class="fixed bottom-6 right-6 bg-blue-500 text-white p-3 rounded-full shadow-lg">
    {{ isOpen ? '❌' : '💬' }}
  </button>

  <!-- Chatbot -->
  <div v-if="isOpen" class="fixed bottom-6 right-6 bg-white shadow-lg rounded-lg transition-all border border-gray-200"
       :class="isMobile ? 'w-full h-full top-0 left-0 flex flex-col' : 'w-96 h-[75vh] flex flex-col'">

    <!-- Header -->
    <div class="p-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex justify-between items-center">
      <h2 class="text-lg font-bold">Chat avec ChatDataSense</h2>
      <button @click="toggleChat" class="text-white">❌</button>
    </div>

    <!-- Messages -->
    <div ref="chatContainer" class="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
      <div v-for="(msg, index) in messages" :key="index" class="flex items-center"
           :class="msg.sender === 'user' ? 'justify-end' : 'justify-start'">

        <div v-if="msg.sender === 'user'" class="ml-2">
          <span class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">👤</span>
        </div>

        <p :class="msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'"
           class="inline-block rounded-xl px-4 py-2 shadow-md max-w-xs leading-relaxed"
           v-html="msg.text">
        </p>

        <div v-if="msg.sender === 'bot'" class="mr-2">
          <span class="bg-gray-300 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center">🤖</span>
        </div>
      </div>

      <div v-if="isLoading" class="text-left animate-pulse">
        <p class="bg-gray-300 text-gray-700 inline-block rounded-lg px-3 py-2 my-1 max-w-xs">
          Chatbot est en train d'écrire...
        </p>
      </div>
    </div>

    <!-- Saisie utilisateur -->
    <div class="p-4 bg-white border-t flex">
      <input v-model="message" class="border p-2 w-full rounded-md focus:outline-none focus:ring focus:border-blue-400" placeholder="Écrivez un message..."
             @keyup.enter="sendMessage" />
      <button @click="sendMessage" class="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md">Envoyer</button>
    </div>
  </div>
</template>
