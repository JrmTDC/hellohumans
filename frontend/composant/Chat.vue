<script setup>
import { ref } from 'vue'

const config = useRuntimeConfig()
const apiUrl = `${config.public.apiBaseUrl}/api/${config.public.apiVersion}/chat`

const message = ref("")
const response = ref("")

const sendMessage = async () => {
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: message.value })
  })
  const data = await res.json()
  response.value = data.response
}
</script>

<template>
  <div class="p-4 max-w-md mx-auto">
    <input v-model="message" class="border p-2 w-full" placeholder="Posez-moi une question..." />
    <button @click="sendMessage" class="mt-2 p-2 bg-blue-500 text-white w-full">Envoyer</button>
    <p class="mt-4">{{ response }}</p>
  </div>
</template>