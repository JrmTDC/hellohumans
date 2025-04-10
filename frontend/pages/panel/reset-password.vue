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

          <!-- Formulaire de réinitialisation -->
          <div class="grid place-items-center relative">
               <div class="py-[40px] px-0 m-0">

                    <!-- Vérification du token -->
                    <div v-if="resetPasswordStatus === 'loading'" class="flex flex-col items-center justify-center">
                         <div class="flex items-center justify-center space-x-2 mb-4 h-8">
                              <div class="w-2.5 h-2.5 bg-[#0569FF] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                              <div class="w-2.5 h-2.5 bg-[#0569FF] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                              <div class="w-2.5 h-2.5 bg-[#0569FF] rounded-full animate-bounce"></div>
                         </div>
                         <p class="text-gray-500 text-sm text-center">{{ t('panel.pages.resetPassword.messageTokenLoading') }}</p>
                    </div>

                    <div v-else-if="resetPasswordStatus === 'newpassword'">
                         <form class="flex flex-col items-center w-full" @submit.prevent="handleReset">
                              <fieldset class="self-center border-0 flex flex-col items-center p-0 w-[min(370px,-32px+100vw)]">
                                   <h1 class="text-[rgb(8,15,26)] font-semibold m-0 mb-[28px] text-center text-[32px] leading-[41px] tracking-[-0.01em]">
                                        {{ t('panel.pages.resetPassword.title') }}
                                   </h1>
                              </fieldset>

                              <!-- Champ Mot de passe -->
                              <fieldset class="self-center border-0 flex flex-col items-center p-0 w-[min(370px,-32px+100vw)] mb-[16px]">

                                   <fieldset class="border-0 p-0 m-0 flex flex-col items-center">
                                        <staticInputCommon
                                             type="password"
                                             ref="passwordInputRef"
                                             v-model="passwordInputValue"
                                             :placeholder="t('panel.pages.resetPassword.passwordPlaceholder')"
                                             :enableStrengthEvaluation="true"
                                             extraClassInput="box-border rounded-[4px] border border-[rgb(226,232,239)] text-[rgb(8,15,26)] text-[18px] p-[22px_18px_20px] w-[min(370px,-32px+100vw)] max-w-full focus:border-[rgb(5,102,255)] focus:shadow-[0px_0px_0px_1px_rgb(5,102,255)] focus:outline-0"
                                             :iconSize="20"
                                             :error-text=errorMessagePassword
                                             :validator="isValidPassword"
                                        />

                                   </fieldset>

                                   <!-- Champ Confirmation du mot de passe -->
                                   <fieldset class="border-0 p-0 m-0 flex flex-col items-center">
                                        <staticInputCommon
                                             type="confirmPassword"
                                             ref="confirmInputRef"
                                             v-model="confirmPasswordInputValue"
                                             :placeholder="t('panel.pages.resetPassword.confirmPasswordPlaceholder')"
                                             :enableStrengthEvaluation="false"
                                             extraClassInput="box-border rounded-[4px] border border-[rgb(226,232,239)] text-[rgb(8,15,26)] text-[18px] p-[22px_18px_20px] w-[min(370px,-32px+100vw)] max-w-full focus:border-[rgb(5,102,255)] focus:shadow-[0px_0px_0px_1px_rgb(5,102,255)] focus:outline-0"
                                             :iconSize="20"
                                             :error-text=errorMessageConfirmPassword
                                             :validator="isValidConfirmPassword"
                                        />
                                   </fieldset>
                              </fieldset>

                              <!-- Bouton de soumission -->
                              <button
                                   type="submit"
                                   :disabled="loading"
                                   class="bg-[rgb(100,237,128)] border border-[rgb(100,237,128)] cursor-pointer outline-none p-[15px_20px] transition duration-200 ease-in-out w-full max-w-[370px] text-[20px] leading-[26px] tracking-[-0.01em] rounded-[8px]"
                                   :class="{ 'text-[#aab6c9] bg-[rgb(236,242,244)] border-[rgb(236,242,244)] cursor-not-allowed': loading }"
                              >
                                   {{ loading ? t('panel.pages.resetPassword.loading') : t('panel.pages.resetPassword.submit')  }}
                              </button>
                         </form>
                    </div>

                    <!-- Message de succès -->
                    <div v-else-if="resetPasswordStatus === 'success'" class="flex flex-col items-center w-full">
                         <fieldset class="self-center border-0 flex flex-col items-center p-0 w-[min(370px,-32px+100vw)]">
                              <h1 class="text-[rgb(8,15,26)] font-semibold m-0 mb-[28px] text-center text-[32px] leading-[41px] tracking-[-0.01em]">
                                   {{ t('panel.pages.resetPassword.submit') }}
                              </h1>
                              <span class="block w-2 min-w-[8px] h-2 min-h-[20px]"></span>
                              <div class="self-center border-0 flex flex-col items-center p-0">
                                   <span class="flex flex-row items-center justify-center mb-[15px]  text-[16px] max-w-[370px]">
                                        <svgo-panel-icon-info class="h-[18px] w-[18px] mx-[9px] my-0 fill-[#0569FF] min-w-[18px] min-h-[18px]"/>
                                        <p class="text-[16px] leading-[18px] text-[#303f9f]">
                                            {{ t('panel.pages.resetPassword.success') }}
                                        </p>
                                   </span>
                              </div>
                         </fieldset>
                         <p class="mt-4 text-gray-600 text-[16px] text-center">
                              <a href="/panel/login" class="text-blue-500 hover:underline">{{ t('panel.pages.resetPassword.loginLink') }}</a>
                         </p>
                    </div>

                    <!-- Token invalide -->
                    <div v-else class="text-center text-sm">
                         <h1 class="text-[rgb(8,15,26)] font-semibold m-0 mb-[28px] text-center text-[32px] leading-[41px] tracking-[-0.01em]">
                              {{ t('panel.pages.resetPassword.messageTokenExpired') }}
                         </h1>

                         <!-- Bouton Renvoyer un lien -->
                         <button
                              @click="router.push('/panel/forgot-password')"
                              class="bg-[rgb(100,237,128)] border border-[rgb(100,237,128)] cursor-pointer outline-none p-[15px_20px] transition duration-200 ease-in-out w-full max-w-[370px] text-[20px] leading-[26px] tracking-[-0.01em] rounded-[8px]"
                         >
                              {{ t('panel.pages.resetPassword.resendCta') }}
                         </button>

                    </div>
               </div>
          </div>
     </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import LanguageSelector from '~/components/panel/LanguageSelector.vue'
import StaticInputCommon from "~/components/panel/common/staticInputCommon.vue";

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const getResetAttempt = ref('');

if (typeof route.query.resetAttempt === 'string') {
     getResetAttempt.value = route.query.resetAttempt;
}

// Champs du formulaire
const resetPasswordStatus = ref("loading")
const loading = ref(false)

const passwordInputRef = ref()
const confirmInputRef = ref()

const passwordInputValue = ref('')
const confirmPasswordInputValue = ref('')

const passwordAlreadyUsed = ref(false)

const errorMessagePassword = computed(() => {
     if (passwordAlreadyUsed.value) return t('panel.pages.resetPassword.errorPasswordAlreadyUsed')
     return t('panel.pages.resetPassword.errorPasswordTooShort')
})
const errorMessageConfirmPassword = computed(() => t('panel.pages.resetPassword.errorPasswordMismatch'))

const isValidPassword = (val: string) => val.length >= 6
const isValidConfirmPassword = (val: string) => val === passwordInputValue.value

const publicStore = usePublicStore()

const handleReset = async () => {
     const checkValidPassword = passwordInputRef.value?.validate()
     const checkValidConfirm = confirmInputRef.value?.validate()
     if (!checkValidPassword || !checkValidConfirm) return

     loading.value = true

     const success = await publicStore.resetPasswordUpdate(passwordInputValue.value)

     if (success) {
          resetPasswordStatus.value = "success"
     } else {
          if (publicStore.error === 'PASSWORD_ALREADY_USED') {
               passwordAlreadyUsed.value = true
          }
     }

     loading.value = false
}


onMounted(async () => {
     const hash = window.location.hash
     const params = new URLSearchParams(hash.substring(1))
     const access_token = params.get('access_token') || ''
     const refresh_token = params.get('refresh_token') || ''
     const type = params.get('type')

     if (type === 'recovery' && access_token) {
          const success = await publicStore.resetPasswordSession(access_token,refresh_token)
          if (success) {
               resetPasswordStatus.value = "newpassword"
          }else{
               resetPasswordStatus.value = "expired"
          }
     } else {
          resetPasswordStatus.value = "expired"
     }

})

</script>

