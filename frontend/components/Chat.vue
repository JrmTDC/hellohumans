<script setup>
import { ref, nextTick } from 'vue'

const config = useRuntimeConfig()
const apiUrl = `${config.public.apiBaseUrl}/api/${config.public.apiVersion}/chat`

const message = ref("")
const location = ref("Brioude") // Localisation par défaut
const messages = ref([]) // Stocke l'historique des messages
const isLoading = ref(false) // Gère l'état de chargement
const chatContainer = ref(null) // Référence à la zone de chat

// Fonction pour scroller automatiquement
const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

const sendMessage = async () => {
  if (!message.value.trim()) return

  // Ajouter le message de l'utilisateur
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

    // Ajouter un délai pour une animation de "saisie"
    setTimeout(() => {
      messages.value.push({ text: data.response, sender: "bot" })
      scrollToBottom()
      isLoading.value = false
    }, 1000) // Délai simulant la saisie du chatbot
  } catch (error) {
    messages.value.push({ text: "Erreur : Impossible de contacter le chatbot.", sender: "bot" })
    scrollToBottom()
    isLoading.value = false
  }
}
</script>

<template>
  <div class="max-w-lg mx-auto bg-gray-100 shadow-lg rounded-lg p-4">
    <h2 class="text-xl font-bold mb-2 text-center">ChatDataSense</h2>

    <!-- Localisation -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-600">Localisation :</label>
      <input v-model="location" class="border p-2 w-full rounded-md" placeholder="Entrez votre ville..." />
    </div>

    <!-- Zone de discussion -->
    <div ref="chatContainer" class="bg-white h-96 overflow-y-auto p-4 rounded-md shadow-inner">
      <div v-for="(msg, index) in messages" :key="index"
           :class="msg.sender === 'user' ? 'text-right' : 'text-left'">
        <p :class="msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'"
           class="inline-block rounded-lg px-3 py-2 my-1 max-w-xs">
          {{ msg.text }}
        </p>
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
