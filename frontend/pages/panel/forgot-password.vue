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
                                        <staticInputCommon
                                             type="email"
                                             ref="emailInputRef"
                                             v-model="emailInputValue"
                                             :placeholder="t('panel.pages.login.emailPlaceholder')"
                                             extraClassInput="box-border rounded-[4px] border border-[rgb(226,232,239)] text-[rgb(8,15,26)] text-[18px] p-[22px_18px_20px] w-[min(370px,-32px+100vw)] max-w-full focus:border-[rgb(5,102,255)] focus:shadow-[0px_0px_0px_1px_rgb(5,102,255)] focus:outline-0"
                                             :error-text=errorMessageEmail
                                        />
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
                              <p v-if="errorMessageEmail" class="text-red-600 mt-3 text-sm">
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
import StaticInputCommon from "~/components/panel/common/staticInputCommon.vue";

const { t } = useI18n()

const inputEmail = ref('')
const loading = ref(false)
const emailSent = ref(false)
const publicStore = usePublicStore()

const emailInputRef = ref()
const emailInputValue = ref('')
const errorMessageEmail = computed(() => t('panel.pages.login.errorEmailInvalid'));

const handleForgot = async () => {
     const checkValidEmail = emailInputRef.value?.validate()
     if (!checkValidEmail) return


     loading.value = true

     const success = await publicStore.forgotPassword(inputEmail.value)
     if (success) {
          emailSent.value = true
     }

     loading.value = false


}
</script>
