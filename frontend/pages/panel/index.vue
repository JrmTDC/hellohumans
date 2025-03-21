<template>
     <div v-if="isChecking" class="min-h-screen flex items-center justify-center">
          <p class="text-gray-500">Vérification de votre session...</p>
     </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Configuration de l'API
const config = useRuntimeConfig()
const apiUrl = `${config.public.apiBaseUrl}/api`

const router = useRouter()
const isChecking = ref(true) // Indique si l'on vérifie l'authentification

onMounted(async () => {
     const token = localStorage.getItem('token')

     if (!token) {
          router.push('/panel/login') // Redirige vers login si aucun token
          return
     }

     try {
          const response = await fetch(apiUrl + '/panel/auth/verify', {
               method: 'GET',
               headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
               }
          })

          if (!response.ok) {
               throw new Error('Token invalide ou expiré')
          }

          const data = await response.json()

          // Déterminer la page de destination après connexion
          const defaultPage = data.defaultPage || '/panel/dashboard' // Si API renvoie une page par défaut

          router.push(defaultPage) // Redirige vers la page définie
     } catch (error) {
          console.error('Erreur d’authentification:', error)
          localStorage.removeItem('token') // Supprime le token expiré
          router.push('/panel/login') // Redirection vers login
     } finally {
          isChecking.value = false
     }
})
</script>
