<template>
     <div id="hellohumans-panel" class="w-full min-h-screen grid grid-rows-[auto_1fr]">
          <!-- Header -->
          <div class="flex flex-row justify-start items-center relative p-[32px_40px] z-[1]">
               <div class="mr-auto">
                    <svgo-logo-hello-humans-full class="w-[220px]" />
               </div>
               <div class="login-container">
                    <LanguageSelector />
               </div>
          </div>

          <!-- Contenu principal -->
          <div class="grid place-items-center relative">
               <div class="py-[40px] px-0 m-0">

                    <!-- Formulaire de récupération -->
                    <div v-if="!emailSent">
                         <form class="flex flex-col items-center w-full" @submit.prevent="handleForgot">
                              <fieldset class="self-center border-0 flex flex-col items-center p-0 w-[min(370px,-32px+100vw)]">
                                   <h1 class="text-[rgb(8,15,26)] font-semibold m-0 mb-[28px] text-center text-[32px] leading-[41px] tracking-[-0.01em]">
                                        {{ t('panel.pages.forgotPassword.title') }}
                                   </h1>
                                   <p class="font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[rgb(100,116,145)] mt-[-20px] mb-[12px] text-center">
                                        {{ t('panel.pages.forgotPassword.subtitle') }}
                                   </p>
                              </fieldset>

                              <!-- Champ Email -->
                              <fieldset class="self-center border-0 flex flex-col items-center p-0 w-[min(370px,-32px+100vw)]">
                                   <fieldset class="border-0 p-0 m-0 mb-[16px] flex flex-col items-center">
                                        <input
                                             type="email"
                                             v-model="inputEmail"
                                             :placeholder="t('panel.pages.forgotPassword.emailPlaceholder')"
                                             class="box-border rounded-[4px] border border-[rgb(226,232,239)] text-[rgb(8,15,26)] text-[18px] p-[22px_18px_20px] w-[min(370px,-32px+100vw)] max-w-full focus:border-[rgb(5,102,255)] focus:shadow-[0px_0px_0px_1px_rgb(5,102,255)] focus:outline-0"
                                             :class="{ 'border-[rgb(232,19,50)]': errors.email }"
                                        />
                                        <span v-if="errors.email" class="_inputError self-start text-[rgb(232,19,50)] inline-flex pl-[2px] pt-[4px] mb-[-7px] text-[12px] leading-[16px] tracking-[-0.01em]">
                                             {{ errorMessageEmail }}
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
                                   {{ loading ? t('panel.pages.forgotPassword.loading') : t('panel.pages.forgotPassword.submit') }}
                              </button>

                              <!-- Retour à la connexion ou Créer un compte -->
                              <p class="mt-4 text-gray-600 text-[16px] text-center">
                                   <a href="/panel/register" class="text-blue-500 hover:underline">{{ t('panel.pages.forgotPassword.createAccount') }}</a>
                                   <span class="mx-3"></span>
                                   <a href="/panel/login" class="text-blue-500 hover:underline">{{ t('panel.pages.forgotPassword.login') }}</a>
                              </p>

                              <!-- Message d'erreur -->
                              <p v-if="errorMessage" class="text-red-600 mt-3 text-sm">
                                   {{ t('panel.pages.forgotPassword.errorMessage') }}
                              </p>
                         </form>
                    </div>

                    <!-- Message de succès  -->
                    <div v-else class="flex flex-col items-center w-full">
                         <fieldset class="self-center border-0 flex flex-col items-center p-0 w-[min(370px,-32px+100vw)]">
                              <h1 class="text-[rgb(8,15,26)] font-semibold m-0 mb-[28px] text-center text-[32px] leading-[41px] tracking-[-0.01em]">
                                   {{ t('panel.pages.forgotPassword.emailSentTitle') }}
                              </h1>
                              <span class="block w-2 min-w-[8px] h-2 min-h-[20px]"></span>
                              <div class="self-center border-0 flex flex-col items-center p-0">
                                   <span class="flex flex-row items-center justify-center mb-[15px]  text-[16px] max-w-[370px]">
                                        <svgo-panel-icon-info class="h-[18px] w-[18px] mx-[9px] my-0 fill-[#0569FF] min-w-[18px] min-h-[18px]"/>
                                        <p class="text-[16px] leading-[18px] text-[#303f9f]">
                                             {{ t('panel.pages.forgotPassword.emailSentNote') }}
                                        </p>
                                   </span>
                              </div>
                         </fieldset>

                         <!-- Retour à la connexion -->
                         <p class="mt-4 text-gray-600 text-center text-[16px] ">
                              <a href="/panel/login" class="text-blue-500 hover:underline">{{ t('panel.pages.forgotPassword.loginLink') }}</a>
                         </p>
                    </div>
               </div>
          </div>
     </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LanguageSelector from '~/components/panel/LanguageSelector.vue'

const { t } = useI18n()

const inputEmail = ref('')
const errors = ref({ email: false })
const loading = ref(false)
const emailSent = ref(false)
const errorMessage = ref('')
const errorMessageEmail = ref('');
const publicStore = usePublicStore()

// Fonction de validation
const validateForm = () => {
     errors.value = { email: false }
     let valid = true

     if (!inputEmail.value) {
          errors.value.email = true
          errorMessageEmail.value = t('panel.pages.forgotPassword.errorEmailEmpty')
          valid = false
     } else if (!/\S+@\S+\.\S+/.test(inputEmail.value)) {
          errors.value.email = true
          errorMessageEmail.value  = t('panel.pages.forgotPassword.errorEmailInvalid')
          valid = false
     }

     return valid
}

const handleForgot = async () => {
     if (!validateForm()) return
     errorMessageEmail.value = ''
     loading.value = true

     const success = await publicStore.forgotPassword(inputEmail.value)
     if (success) {
          emailSent.value = true
     } else {
          errorMessageEmail.value = t('panel.pages.forgotPassword.errorMessage')
     }

     loading.value = false
}
</script>
