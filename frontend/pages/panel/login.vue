<template>
     <div id="hellohumans-panel" class="w-full min-h-screen grid grid-rows-[auto_1fr]">
          <!-- Header -->
          <div class="flex flex-row justify-start items-center relative p-[32px_40px] z-[1]">
               <div class="mr-auto">
                    <svgo-logo-hello-humans-full class="w-[220px]"/>
               </div>
               <div class="login-container">
                    <LanguageSelector />
               </div>
          </div>
          <!-- Formulaire de connexion -->
          <div class="grid place-items-center relative">
               <div class="py-[40px] px-0 m-0">
                    <form class="flex flex-col items-center w-full" @submit.prevent="handleLogin">
                         <fieldset class="self-center border-0 flex flex-col items-center p-0 w-[min(370px,-32px+100vw)]">
                              <h1 class="text-[rgb(8,15,26)] font-semibold m-0 mb-[28px] text-center relative text-[32px] leading-[41px] tracking-[-0.01em]">{{ t('panel.pages.login.title') }}</h1>
                              <p class="font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[rgb(100,116,145)] mt-[-20px] mb-[12px]">{{ t('panel.pages.login.subtitle') }}</p>
                         </fieldset>

                         <!-- Champ Email -->
                         <fieldset class="self-center border-0 flex flex-col items-center p-0 w-[min(370px,-32px+100vw)]">
                              <fieldset class="border-0 p-0 m-0 mb-[16px] flex flex-col items-center">
                                   <input
                                        type="email"
                                        v-model="inputEmail"
                                        :placeholder="t('panel.pages.login.emailPlaceholder')"
                                        class="box-border rounded-[4px] border border-[rgb(226,232,239)] text-[rgb(8,15,26)] text-[18px] p-[22px_18px_20px] w-[min(370px,-32px+100vw)] max-w-full focus:border-[rgb(5,102,255)] focus:shadow-[0px_0px_0px_1px_rgb(5,102,255)] focus:outline-0"
                                        :class="{ 'border-[rgb(232,19,50)]': errors.email }"
                                   />
                                   <span v-if="errors.email" class="_inputError self-start text-[rgb(232,19,50)] inline-flex pl-[2px] pt-[4px] mb-[-7px] text-[12px] leading-[16px] tracking-[-0.01em]">{{ errorMessageEmail }}
                                   </span>

                              </fieldset>

                              <!-- Champ Mot de passe -->
                              <fieldset class="border-0 p-0 m-0 mb-[16px] flex flex-col items-center">
                                   <PasswordInput
                                        v-model="password"
                                        :placeholder="t('panel.pages.login.passwordPlaceholder')"
                                        :error="!!errors.password"
                                        extraClassInput="box-border rounded-[4px] border border-[rgb(226,232,239)] text-[rgb(8,15,26)] text-[18px] p-[22px_18px_20px] w-[min(370px,-32px+100vw)] max-w-full focus:border-[rgb(5,102,255)] focus:shadow-[0px_0px_0px_1px_rgb(5,102,255)] focus:outline-0"
                                        :iconSize=20
                                   />
                                   <span v-if="errors.password" class="_inputError self-start text-[rgb(232,19,50)] inline-flex pl-[2px] pt-[4px] mb-[-7px] text-[12px] leading-[16px] tracking-[-0.01em]">{{ errorMessagePassword }}
                                   </span>
                              </fieldset>
                         </fieldset>


                         <!-- Lien Mot de passe oublié -->
                         <div class="w-full text-left mt-[-8px] mb-[24px]">
                              <a href="/panel/forgot-password" class="text-[rgb(5,102,255)] font-normal no-underline transition-colors duration-200 ease-in-out text-[14px]">{{ t('panel.pages.login.forgotPassword') }}</a>
                         </div>

                         <!-- Erreur d'authentification -->
                         <span v-if="loginError" class="_inputError text-[rgb(232,19,50)] flex items-center justify-center flex-row mb-[15px] max-w-[370px] text-[16px] leading-[20px] tracking-[-0.01em]">{{ t('panel.pages.login.loginError') }}</span>

                         <!-- Bouton de connexion -->
                         <button
                              type="submit"
                              :disabled="loading"
                              class="bg-[rgb(100,237,128)] border border-[rgb(100,237,128)] cursor-pointer outline-none p-[15px_20px] transition duration-200 ease-in-out w-full max-w-[370px] text-[20px] leading-[26px] tracking-[-0.01em] rounded-[8px]"
                              :class="{ 'text-[#aab6c9] bg-[rgb(236,242,244)] border-[rgb(236,242,244)] cursor-not-allowed': loading }"
                         >
                              {{ loading ? t('panel.pages.login.loading') : t('panel.pages.login.submit')  }}
                         </button>

                         <!-- Lien vers l'inscription -->
                         <div class="mt-[40px] border-t border-[#e2e8ef] pt-[20px] w-full text-center">
                              <p class="mt-4 text-gray-600 text-[16px]">{{ t('panel.pages.login.noAccount') }} <a href="/panel/register" class="text-blue-500 hover:underline">{{ t('panel.pages.login.registerCta') }}</a></p>
                         </div>
                    </form>
               </div>
          </div>
     </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PasswordInput from '~/components/panel/PasswordInput.vue'
import LanguageSelector from '~/components/panel/LanguageSelector.vue'
import {usePublicStore} from "~/stores/publicStore";
const { t } = useI18n()

const router = useRouter()
const publicStore = usePublicStore()

// Champs du formulaire
const inputEmail = ref('')
const password = ref('')
const errors = ref({ email: false, password: false })
const loginError = ref(false)
const loading = ref(false)
const errorMessageEmail = ref('');
const errorMessagePassword = ref('');

// Fonction pour valider le formulaire
     const validateForm = () => {
          errors.value = { email: false, password: false }
          let valid = true

          if (!inputEmail.value) {
               errors.value.email = true
               errorMessageEmail.value = t('panel.pages.login.errorEmailEmpty')
               valid = false

          } else if (!/\S+@\S+\.\S+/.test(inputEmail.value)) {
               errors.value.password = true
               errorMessageEmail.value  = t('panel.pages.login.errorEmailInvalid')
               valid = false
          }


     if (!password.value) {
          errors.value.password = true
          errorMessagePassword.value = t('panel.pages.login.errorPasswordEmpty')
          valid = false
     }

     return valid
}

// Fonction pour gérer la connexion
const handleLogin = async () => {
     if (!validateForm()) return
     loginError.value = false
     loading.value = true

     const success = await publicStore.login(inputEmail.value, password.value)
     if (success) {
          loginError.value = false
          errorMessageEmail.value = ''
          errorMessagePassword.value = ''
          await router.push('/panel')
     } else {
          loginError.value = true
     }

     loading.value = false
}
</script>
