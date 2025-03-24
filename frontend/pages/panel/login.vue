<template>
     <div v-auto-animate id="hellohumans-panel" class="w-full min-h-screen grid grid-rows-[auto_1fr]">
          <!-- Header -->
          <div class="flex flex-row justify-start items-center relative p-[32px_40px] z-[1]">
               <div class="mr-auto">
                    <svgo-logo-hello-humans-full class="w-[220px]"/>
               </div>

               <!-- Sélecteur de langue -->
               <div ref="langMenuRef" class="inline-flex relative align-top ml-0">
                    <button
                         @click="toggleLangMenu"
                         class="box-border h-[34px] px-[8px] pr-[6px] inline-flex items-center justify-center rounded-[3px] border border-transparent text-[rgb(100,116,145)] text-[14px] leading-[1] uppercase"
                    >
                         <svgo-panel-icon-earth class="w-[16px] h-[16px] mr-2 fill-[#647491]" />
                         {{ selectedLang }}
                         <svgo-panel-icon-triangle-caret-down class="w-[16px] h-[16px] ml-2 transform transition-transform fill-[#647491]" :class="{ 'rotate-180': isLangMenuOpen }" />
                    </button>

                    <!-- Liste des langues -->
                    <div v-if="isLangMenuOpen" class="absolute left-[-51.4562px] min-w-[128px] top-full z-[20] opacity-100 visible translate-y-[4px]">
                         <div class="max-h-none overflow-y-visible bg-white rounded-[8px] p-[8px] mb-[10px] shadow-[0px_8px_20px_rgba(0,20,51,0.24)]">
                              <div
                                   v-for="lang in languages"
                                   :key="lang.code"
                                   @click="selectLanguage(lang.code)"
                                   class="text-[14px] leading-[18px] tracking-[-0.01em] h-[44px] px-[24px] flex items-center text-[rgb(8,15,26)] hover:bg-[rgb(239,242,246)] cursor-pointer">
                                   {{ lang.name }}
                              </div>
                         </div>
                    </div>

               </div>
          </div>

          <!-- Formulaire de connexion -->
          <div class="grid place-items-center relative">
               <div class="py-[40px] px-0 m-0">
                    <form class="flex flex-col items-center w-full" @submit.prevent="handleLogin">
                         <fieldset class="self-center border-0 flex flex-col items-center p-0 w-[min(370px,-32px+100vw)]">
                              <h1 class="text-[rgb(8,15,26)] font-semibold m-0 mb-[28px] text-center relative text-[32px] leading-[41px] tracking-[-0.01em]">Bon retour parmi nous</h1>
                              <p class="font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[rgb(100,116,145)] mt-[-20px] mb-[12px]">Connectez-vous à votre compte HelloHumans</p>
                         </fieldset>

                         <!-- Champ Email -->
                         <fieldset class="self-center border-0 flex flex-col items-center p-0 w-[min(370px,-32px+100vw)]">
                              <fieldset class="border-0 p-0 m-0 mb-[16px] flex flex-col items-center">
                                   <input
                                        type="email"
                                        v-model="email"
                                        placeholder="Adresse e-mail"
                                        class="box-border rounded-[4px] border border-[rgb(226,232,239)] text-[rgb(8,15,26)] text-[18px] p-[22px_18px_20px] w-[min(370px,-32px+100vw)] max-w-full focus:border-[rgb(5,102,255)] focus:shadow-[0px_0px_0px_1px_rgb(5,102,255)] focus:outline-0"
                                        :class="{ 'border-[rgb(232,19,50)]': errors.email }"
                                   />
                                   <span v-if="errors.email" class="_inputError self-start text-[rgb(232,19,50)] inline-flex pl-[2px] pt-[4px] mb-[-7px] text-[12px] leading-[16px] tracking-[-0.01em]">{{ errors.email }}</span>
                              </fieldset>

                              <!-- Champ Mot de passe -->
                              <fieldset class="border-0 p-0 m-0 mb-[16px] flex flex-col items-center">
                                   <PasswordInput
                                        v-model="password"
                                        placeholder="Mot de passe"
                                        :error="!!errors.password"
                                        extraClassInput="box-border rounded-[4px] border border-[rgb(226,232,239)] text-[rgb(8,15,26)] text-[18px] p-[22px_18px_20px] w-[min(370px,-32px+100vw)] max-w-full focus:border-[rgb(5,102,255)] focus:shadow-[0px_0px_0px_1px_rgb(5,102,255)] focus:outline-0"
                                        :iconSize=20
                                   />
                                   <span v-if="errors.password" class="_inputError self-start text-[rgb(232,19,50)] inline-flex pl-[2px] pt-[4px] mb-[-7px] text-[12px] leading-[16px] tracking-[-0.01em]">{{ errors.password }}</span>
                              </fieldset>
                         </fieldset>


                         <!-- Lien Mot de passe oublié -->
                         <div class="w-full text-left mt-[-8px] mb-[24px]">
                              <a href="#" class="text-[rgb(5,102,255)] font-normal no-underline transition-colors duration-200 ease-in-out text-[14px]">Mot de passe oublié ?</a>
                         </div>

                         <!-- Erreur d'authentification -->
                         <span v-if="loginError" class="_inputError text-[rgb(232,19,50)] flex items-center justify-center flex-row mb-[15px] max-w-[370px] text-[16px] leading-[20px] tracking-[-0.01em]">E-mail ou mot de passe incorrect !</span>

                         <!-- Bouton de connexion -->
                         <button
                              type="submit"
                              :disabled="loading"
                              class="bg-[rgb(100,237,128)] border border-[rgb(100,237,128)] cursor-pointer outline-none p-[15px_20px] transition duration-200 ease-in-out w-full max-w-[370px] text-[20px] leading-[26px] tracking-[-0.01em] rounded-[8px]"
                              :class="{ 'text-[#aab6c9] bg-[rgb(236,242,244)] border-[rgb(236,242,244)] cursor-not-allowed': loading }"
                         >
                              {{ loading ? 'Chargement...' : 'Se connecter' }}
                         </button>

                         <!-- Lien vers l'inscription -->
                         <p class="mt-4 text-gray-600 text-sm">
                              Vous n’avez pas de compte ? <a href="/panel/register" class="text-blue-500 hover:underline">C'est parti</a>
                         </p>
                    </form>
               </div>
          </div>
     </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PasswordInput from '@/components/panel/PasswordInput.vue'


const router = useRouter()

// Configuration de l'API
const config = useRuntimeConfig()
const apiUrl = `${config.public.apiBaseUrl}/api`

// Champs du formulaire
const email = ref('')
const password = ref('')
const errors = ref({ email: null, password: null })
const loginError = ref(false)
const loading = ref(false)


// Sélecteur de langue
const isLangMenuOpen = ref(false)
const selectedLang = ref('FR')
const languages = ref([
     { code: 'DE', name: 'Deutsch' },
     { code: 'EN', name: 'English' },
     { code: 'ES', name: 'Español' },
     { code: 'FR', name: 'Français' },
     { code: 'IT', name: 'Italiano' },
     { code: 'PT', name: 'Português' }
])

const langMenuRef = ref(null) // Référence pour la boîte des langues

const toggleLangMenu = () => {
     isLangMenuOpen.value = !isLangMenuOpen.value
}

const selectLanguage = (code) => {
     selectedLang.value = code
     isLangMenuOpen.value = false
}

// Fonction pour détecter un clic en dehors de la boîte de langue
const handleClickOutside = (event) => {
     if (langMenuRef.value && !langMenuRef.value.contains(event.target)) {
          isLangMenuOpen.value = false
     }
}

// Ajouter/Supprimer l'événement lors du montage/démontage du composant
onMounted(() => {
     document.addEventListener('click', handleClickOutside)
})
onUnmounted(() => {
     document.removeEventListener('click', handleClickOutside)
})

// Fonction pour valider le formulaire
const validateForm = () => {
     errors.value = { email: null, password: null }
     let valid = true

     if (!email.value) {
          errors.value.email = 'Ne peut être vide !'
          valid = false
     } else if (!/\S+@\S+\.\S+/.test(email.value)) {
          errors.value.email = 'L’adresse e-mail est invalide !'
          valid = false
     }

     if (!password.value) {
          errors.value.password = 'Ne peut être vide !'
          valid = false
     }

     return valid
}

// Fonction pour gérer la connexion
const handleLogin = async () => {
     if (!validateForm()) return

     loginError.value = false
     loading.value = true

     try {
          const response = await fetch(apiUrl + '/panel/auth/login', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ email: email.value, password: password.value })
          })

          const data = await response.json()

          if (!response.ok) {
               loginError.value = true
          } else {
               localStorage.setItem('token', data.success.token)
               router.push('/panel/')
          }
     } catch (error) {
          loginError.value = false
     }

     loading.value = false
}
</script>
