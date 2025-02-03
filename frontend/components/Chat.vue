<script setup>
import { ref, nextTick, onMounted, watch } from 'vue'

// Récupération de l'API et des configurations
const config = useRuntimeConfig()
const apiUrl = `${config.public.apiBaseUrl}/api/${config.public.apiVersion}/chat`

const message = ref("")
const location = ref("Brioude") // Localisation par défaut
const messages = ref([]) // Historique des messages
const isLoading = ref(false) // Animation de chargement
const chatContainer = ref(null) // Référence à la zone de chat

// Charger l'historique des messages depuis localStorage
onMounted(() => {
  const savedMessages = localStorage.getItem("chat_history")
  if (savedMessages) {
    messages.value = JSON.parse(savedMessages)
  }
  scrollToBottom()
})

// Sauvegarder automatiquement les messages dans localStorage
watch(messages, (newMessages) => {
  localStorage.setItem("chat_history", JSON.stringify(newMessages))
}, { deep: true })

// Fonction pour scroller automatiquement vers le dernier message
const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

// Envoi d'un message
const sendMessage = async () => {
  if (!message.value.trim()) return

  // Ajouter le message utilisateur
  messages.value.push({ text: message.value, sender: "user" })
  scrollToBottom()

  isLoading.value = true
  const userMessage = message.value
  message.value = ""

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage, location: location.value })
    })
    const data = await res.json()

    // Délai simulé pour une animation de saisie
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

// Fonction pour vider l'historique
const clearChat = () => {
  messages.value = []
  localStorage.removeItem("chat_history")
}
</script>

<template>
  <div class="max-w-lg mx-auto bg-gray-100 shadow-lg rounded-lg p-4">
    <h2 class="text-xl font-bold mb-2 text-center flex justify-between">
      Chat
      <button @click="clearChat" class="text-red-500 text-sm">🗑 Vider</button>
    </h2>

    <!-- Localisation -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-600">Localisation :</label>
      <input v-model="location" class="border p-2 w-full rounded-md" placeholder="Entrez votre ville..." />
    </div>

    <!-- Zone de discussion -->
    <div ref="chatContainer" class="bg-white h-96 overflow-y-auto p-4 rounded-md shadow-inner">
      <div v-for="(msg, index) in messages" :key="index" class="flex items-center mb-2"
           :class="msg.sender === 'user' ? 'justify-end' : 'justify-start'">

        <!-- Icône Utilisateur -->
        <div v-if="msg.sender === 'user'" class="ml-2">
          <span class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">👤</span>
        </div>

        <p :class="msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'"
           class="inline-block rounded-lg px-3 py-2 my-1 max-w-xs">
          {{ msg.text }}
        </p>

        <!-- Icône Chatbot -->
        <div v-if="msg.sender === 'bot'" class="mr-2">
          <span class="bg-gray-300 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center">🤖</span>
        </div>
      </div>

      <!-- Animation de "saisie" du chatbot -->
      <div v-if="isLoading" class="text-left">
        <p class="bg-gray-300 text-gray-700 inline-block rounded-lg px-3 py-2 my-1 max-w-xs animate-pulse">
          Chatbot est en train d'écrire...
        </p>
      </div>
    </div>

    <!-- Saisie utilisateur -->
    <div class="mt-4 flex">
      <input v-model="message" class="border p-2 w-full rounded-md" placeholder="Écrivez un message..."
             @keyup.enter="sendMessage" />
      <button @click="sendMessage" class="ml-2 bg-blue-500 text-white p-2 rounded-md">Envoyer</button>
    </div>
  </div>
</template>
