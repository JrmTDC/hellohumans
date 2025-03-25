<template>
     <div v-auto-animate id="hellohumans-panel" class="w-full min-h-screen grid grid-rows-[auto_1fr]">
          <!-- Header -->
          <div class="flex flex-row justify-start items-center relative p-[32px_40px] z-[1]">
               <div class="mr-auto">
                    <svgo-logo-hello-humans-full class="w-[220px]" />
               </div>
               <div class="login-container">
                    <LanguageSelector @languageSelected="updateSelectedLang" />
               </div>
          </div>

          <!-- Contenu principal -->
          <div class="grid place-items-center relative">
               <div class="py-[40px] px-0 m-0">
                    <!-- Formulaire de récupération -->
                    <div v-if="!emailSent">
                         <form class="flex flex-col items-center w-full" @submit.prevent="handleReset">
                              <fieldset class="self-center border-0 flex flex-col items-center p-0 w-[min(370px,-32px+100vw)]">
                                   <h1 class="text-[rgb(8,15,26)] font-semibold m-0 mb-[28px] text-center text-[32px] leading-[41px] tracking-[-0.01em]">
                                        Mot de passe oublié ?
                                   </h1>
                                   <p class="font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[rgb(100,116,145)] mt-[-20px] mb-[12px]">
                                        Nous vous enverrons les instructions de réinitialisation par courrier électronique.
                                   </p>
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
                                        <span v-if="errors.email" class="_inputError text-[rgb(232,19,50)] text-[12px] leading-[16px] tracking-[-0.01em] pl-[2px] pt-[4px]">
                                             {{ errors.email }}
                                        </span>
                                   </fieldset>
                              </fieldset>

                              <!-- Bouton d'envoi -->
                              <button
                                   type="submit"
                                   :disabled="loading"
                                   class="bg-[rgb(100,237,128)] border border-[rgb(100,237,128)] cursor-pointer outline-none p-[15px_20px] transition duration-200 ease-in-out w-full max-w-[370px] text-[20px] leading-[26px] tracking-[-0.01em] rounded-[8px]"
                                   :class="{ 'text-[#aab6c9] bg-[rgb(236,242,244)] border-[rgb(236,242,244)] cursor-not-allowed': loading }"
                              >
                                   {{ loading ? 'Envoi en cours...' : 'Envoyer' }}
                              </button>

                              <!-- Retour à la connexion ou Créer un compte -->
                              <p class="mt-4 text-gray-600 text-sm text-center">
                                   <a href="/panel/register" class="text-blue-500 hover:underline">Créer un compte</a>
                                   <span class="mx-3"></span>
                                   <a href="/panel/login" class="text-blue-500 hover:underline">Se connecter</a>
                              </p>

                              <!-- Message d'erreur -->
                              <p v-if="errorMessage" class="text-red-600 mt-3 text-sm">
                                   {{ errorMessage }}
                              </p>
                         </form>
                    </div>

                    <!-- Message de succès  -->
                    <div v-else class="flex flex-col items-center w-full">
                         <fieldset class="self-center border-0 flex flex-col items-center p-0 w-[min(370px,-32px+100vw)]">
                              <h1 class="text-[rgb(8,15,26)] font-semibold m-0 mb-[28px] text-center text-[32px] leading-[41px] tracking-[-0.01em]">
                                   Vérifiez votre boîte de réception !
                              </h1>
                              <p class="font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[rgb(100,116,145)] mt-[-20px] mb-[12px]">
                                   Un e-mail de réinitialisation a été envoyé. Consultez votre boîte de réception et suivez les instructions.
                              </p>
                              <span class="block w-2 min-w-[8px] h-2 min-h-[20px]"></span>
                              <div class="relative">
                                   <svgo-panel-icon-info class="absolute left-[-28px] w-4 h-4"/>
                                   <p class="font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[rgb(26,73,143)] mt-[-20px] mb-[12px]">
                                        Si cette adresse e-mail est en notre possession, nous vous enverrons un e-mail contenant des instructions pour réinitialiser votre mot de passe.
                                   </p>
                              </div>


                         </fieldset>

                         <!-- Retour à la connexion -->
                         <p class="mt-4 text-gray-600 text-sm text-center">
                              <a href="/panel/login" class="text-blue-500 hover:underline">Se connecter</a>
                         </p>
                    </div>
               </div>
          </div>
     </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LanguageSelector from '@/components/panel/LanguageSelector.vue'

const router = useRouter()
const email = ref('')
const errors = ref({ email: null })
const loading = ref(false)
const emailSent = ref(false)
const errorMessage = ref('')

const updateSelectedLang = (lang: string) => {
     console.log('Langue sélectionnée :', lang)
}

// Fonction de validation
const validateForm = () => {
     errors.value = { email: null }
     let valid = true

     if (!email.value) {
          errors.value.email = 'Ne peut être vide !'
          valid = false
     } else if (!/\S+@\S+\.\S+/.test(email.value)) {
          errors.value.email = 'L’adresse e-mail est invalide !'
          valid = false
     }

     return valid
}

// Simulation de l'envoi d'un email sans appel API
const handleReset = async () => {
     if (!validateForm()) return

     loading.value = true
     errorMessage.value = ''

     setTimeout(() => {
          loading.value = false
          emailSent.value = true
     }, 2000) // Simulation d'un délai de traitement de 2 secondes
}
</script>
