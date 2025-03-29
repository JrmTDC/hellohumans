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

          <!-- Formulaire de réinitialisation -->
          <div class="grid place-items-center relative">
               <div class="py-[40px] px-0 m-0">
                    <div v-if="!resetPassword">
                         <form class="flex flex-col items-center w-full" @submit.prevent="handleReset">
                              <fieldset class="self-center border-0 flex flex-col items-center p-0 w-[min(370px,-32px+100vw)]">
                                   <h1 class="text-[rgb(8,15,26)] font-semibold m-0 mb-[28px] text-center text-[32px] leading-[41px] tracking-[-0.01em]">
                                        Réinitialiser le mot de passe
                                   </h1>
                              </fieldset>

                              <!-- Champ Mot de passe -->
                              <fieldset class="self-center border-0 flex flex-col items-center p-0 w-[min(370px,-32px+100vw)]">
                                   <fieldset class="border-0 p-0 m-0 mb-[16px] flex flex-col items-center">
                                        <PasswordInput
                                             v-model="password"
                                             placeholder="Nouveau mot de passe"
                                             :error="!!errors.password"
                                             @input="evaluatePasswordStrength"
                                             @focus="() => { passwordFocused = true; evaluatePasswordStrength() }"
                                             @blur="() => { passwordFocused = false; evaluatePasswordStrength() }"
                                             extraClassInput="box-border rounded-[4px] border border-[rgb(226,232,239)] text-[rgb(8,15,26)] text-[18px] p-[22px_18px_20px] w-[min(370px,-32px+100vw)] max-w-full focus:border-[rgb(5,102,255)] focus:shadow-[0px_0px_0px_1px_rgb(5,102,255)] focus:outline-0"
                                             :iconSize="20"
                                        />
                                        <span v-if="errors.password" class="_inputError self-start text-[rgb(232,19,50)] inline-flex pl-[2px] pt-[4px] mb-[-7px] text-[12px] leading-[16px] tracking-[-0.01em]">
                                             {{ errorPassword }}
                                        </span>

                                        <!-- Barre de progression et texte -->
                                        <div v-if="passwordFocused" class="flex items-center w-[min(370px,-32px+100vw)] max-w-full mt-2">
                                             <div class="ml-[20px] w-[100px] bg-gray-300 h-1 rounded-full mr-4">
                                                  <div class="h-full rounded-full transition-all duration-300 ease-in-out"
                                                       :style="{ width: progressWidth, backgroundColor: progressColor }">
                                                  </div>
                                             </div>
                                             <div :class="strengthClass" class="text-sm">
                                                  {{ passwordStrength }}
                                             </div>
                                        </div>
                                   </fieldset>

                                   <!-- Champ Confirmation du mot de passe -->
                                   <fieldset class="border-0 p-0 m-0 mb-[16px] flex flex-col items-center">
                                        <PasswordInput
                                             v-model="confirmPassword"
                                             placeholder="Confirmer le mot de passe"
                                             :error="!!errors.confirmPassword"
                                             extraClassInput="box-border rounded-[4px] border border-[rgb(226,232,239)] text-[rgb(8,15,26)] text-[18px] p-[22px_18px_20px] w-[min(370px,-32px+100vw)] max-w-full focus:border-[rgb(5,102,255)] focus:shadow-[0px_0px_0px_1px_rgb(5,102,255)] focus:outline-0"
                                             :iconSize="20"
                                        />
                                        <span v-if="errors.confirmPassword" class="_inputError self-start text-[rgb(232,19,50)] inline-flex pl-[2px] pt-[4px] mb-[-7px] text-[12px] leading-[16px] tracking-[-0.01em]">
                                              {{ errorConfirmPassword }}
                                        </span>
                                   </fieldset>
                              </fieldset>

                              <!-- Bouton de soumission -->
                              <button
                                   type="submit"
                                   :disabled="loading"
                                   class="bg-[rgb(100,237,128)] border border-[rgb(100,237,128)] cursor-pointer outline-none p-[15px_20px] transition duration-200 ease-in-out w-full max-w-[370px] text-[20px] leading-[26px] tracking-[-0.01em] rounded-[8px]"
                                   :class="{ 'text-[#aab6c9] bg-[rgb(236,242,244)] border-[rgb(236,242,244)] cursor-not-allowed': loading }"
                              >
                                   {{ loading ? 'Chargement...' : 'Réinitialiser le mot de passe' }}
                              </button>
                         </form>
                    </div>

                    <!-- Message de succès -->
                    <div v-else class="flex flex-col items-center w-full">
                         <fieldset class="self-center border-0 flex flex-col items-center p-0 w-[min(370px,-32px+100vw)]">
                              <h1 class="text-[rgb(8,15,26)] font-semibold m-0 mb-[28px] text-center text-[32px] leading-[41px] tracking-[-0.01em]">
                                   Réinitialiser le mot de passe
                              </h1>
                              <span class="block w-2 min-w-[8px] h-2 min-h-[20px]"></span>
                              <div class="relative">
                                   <svgo-panel-icon-info class="absolute left-[-28px] top-[-19px] w-4 h-4 fill-[#0569FF]"/>
                                   <p class="font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[rgb(26,73,143)] mt-[-20px] mb-[12px]">
                                        Opération réussie ! Votre mot de passe a été réinitialisé.
                                   </p>
                              </div>
                         </fieldset>
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
import PasswordInput from '@/components/panel/PasswordInput.vue'
import LanguageSelector from '@/components/panel/LanguageSelector.vue'

const router = useRouter()

// Champs du formulaire
const errors = ref({ password: false, confirmPassword: false })
const resetPassword = ref(false)
const loading = ref(false)
const errorPassword = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorConfirmPassword = ref('')
const passwordStrength = ref('')
const strengthClass = ref('')
const progressWidth = ref('0%')
const progressColor = ref('rgb(226,232,239)')
const passwordFocused = ref(false)

const validateForm = () => {
     errors.value = { password: false, confirmPassword: false }
     let valid = true

     if (!password.value) {
          errors.value.password = true
          errorPassword.value = 'Ne peut être vide !'
          valid = false
     } else if (password.value.length < 6) {
          errors.value.password = true
          errorPassword.value = 'Le mot de passe doit contenir au moins 6 caractères.'
          valid = false
     }

     if (password.value !== confirmPassword.value) {
          errors.value.confirmPassword = true
          errorConfirmPassword.value = 'Les mots de passe ne correspondent pas'
          valid = false
     }

     return valid
}

const evaluatePasswordStrength = () => {
     const pass = password.value

     if (!passwordFocused.value) {
          passwordStrength.value = ''
          progressWidth.value = '0%'
          progressColor.value = 'rgb(226,232,239)'
          return
     }

     if (pass.length === 0) {
          passwordStrength.value = 'Niveau de sécurité du mot de passe'
          progressWidth.value = '0%'
          progressColor.value = 'rgb(226,232,239)'
          strengthClass.value = 'text-gray-400'
     } else if (pass.length <= 4) {
          passwordStrength.value = 'Faible'
          progressWidth.value = '25%'
          progressColor.value = 'rgb(255, 0, 0)'
          strengthClass.value = 'text-red-500'
     } else if (pass.length <= 8) {
          passwordStrength.value = 'Moyen'
          progressWidth.value = '50%'
          progressColor.value = 'rgb(255, 204, 0)'
          strengthClass.value = 'text-yellow-500'
     } else if (pass.length <= 12) {
          passwordStrength.value = 'Fort'
          progressWidth.value = '75%'
          progressColor.value = 'rgb(0, 204, 0)'
          strengthClass.value = 'text-green-500'
     } else {
          passwordStrength.value = 'Très fort'
          progressWidth.value = '100%'
          progressColor.value = 'rgb(0, 204, 0)'
          strengthClass.value = 'text-green-500'
     }
}

const handleReset = async () => {
     if (!validateForm()) return
     loading.value = true
     setTimeout(() => {
          loading.value = false
          resetPassword.value = true
     }, 2000)
}

const updateSelectedLang = (lang: string) => {
     console.log('Langue sélectionnée :', lang)
}
</script>




<!--
{{ t('panel.reset-passwordPage') }}
{{ t('panel.reset-passwordTitle') }}
{{ t('panel.password') }}
{{ t('panel.passwordErrorEmpty') }}
{{ t('panel.passwordErrorShort') }}
{{ t('panel.passwordStrength') }}
{{ t('panel.passwordStrengthWeak') }}
{{ t('panel.passwordStrengthMedium') }}
{{ t('panel.passwordStrengthStrong') }}
{{ t('panel.passwordStrengthVeryStrong') }}
{{ t('panel.confirmPassword') }}
{{ t('panel.confirmPasswordError') }}
{{ t('panel.submit') }}
{{ t('panel.loading') }}
{{ t('panel.successMessage') }}
{{ t('panel.loginLink') }}
-->
