<template>
     <div v-if="isChecking" id="hellohumans-loading" class="fixed inset-0 bg-[#001433] z-[2147483647] grid place-items-center">
          <div class="flex flex-col items-center w-[200px] text-center">
               <div>
                    <svgo-logo-hello-humans-full class="w-auto h-[35px] fill-[#fff]" />
                    <div class="progress w-full h-[12px] rounded-[4px] bg-[#002661] my-5 overflow-hidden">
                         <div class="progress-bar bg-[#0566ff] h-full transition-[width] duration-[600ms] ease-[ease]" role="progressbar" style="width:20%;"></div>
                    </div>
                    <p class="message text-white font-medium mx-[-20px] my-0">{{ t('panel.pages.index.loading') }}</p>
               </div>
          </div>
     </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const { t } = useI18n()

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

