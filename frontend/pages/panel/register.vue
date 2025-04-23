<template>
     <div id="hellohumans-panel" class="w-full min-h-screen grid [grid-template-rows:auto_auto_32px_1fr] [grid-template-areas:'header''main''.''aside'] [grid-template:'header_header''aside_main'_1fr_/505px_1fr] bg-[position:-60px_top] bg-no-repeat bg-[rgb(0,20,51)]" :style="{ backgroundImage: `url('${backgroundImage}')` }">
          <!-- Header -->
          <div class="flex flex-row justify-start items-center relative [grid-area:header] px-[40px] py-[32px] z-[1]">
               <div class="mr-auto">
                    <svgo-logo-hello-humans-full class="w-[220px] fill-[#f7f0e5]"/>
               </div>
               <div class="login-container">
                    <PanelCommonLanguageSelector />
               </div>
          </div>
          <div class="[grid-area:1_/_2_/_3_/_4] relative z-0 overflow-hidden relative before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:-z-10 before:bg-white before:[width:max(3000px,300vh)] before:[height:max(3000px,300vh)] before:[transform:translateX(-50%)]"></div>
          <div class="grid place-items-center [grid-area:aside]">
               <section class="p-[40px] mx-auto text-white">
                    <h2 class="mt-0 mb-0 font-semibold text-[24px] leading-[31px] tracking-[-0.01em]">{{ t('panel.pages.register.asideTitle') }}</h2>
                    <span class="block w-2 min-w-[8px] h-2 min-h-[8px]"></span>
                    <p class="mt-0 mb-0 font-normal text-[16px] leading-[20px] tracking-[-0.01em] text-[#8796af]">{{ t('panel.pages.register.asideText') }}</p>
                    <span class="block w-10 min-w-[40px] h-10 min-h-[40px]"></span>
                    <div class="flex flex-col justify-start items-start mb-[max(7vw,40px)]">
                         <div class="flex flex-row justify-start items-start">
                              <svgo-panel-icon-up-register class="h-[20px] w-[20px] shrink-0" />
                              <p class="mt-0 mb-0 ml-3 font-normal text-[16px] leading-[20px] tracking-[-0.01em]">{{ t('panel.pages.register.benefit1') }}</p>
                         </div>
                         <div class="flex flex-row justify-start items-start mt-8">
                              <svgo-panel-icon-up-register class="h-[20px] w-[20px] shrink-0" />
                              <p class="mt-0 mb-0 ml-3 font-normal text-[16px] leading-[20px] tracking-[-0.01em]">{{ t('panel.pages.register.benefit2') }}</p>
                         </div>
                         <div class="flex flex-row justify-start items-start mt-8">
                              <svgo-panel-icon-up-register class="h-[20px] w-[20px] shrink-0" />
                              <p class="mt-0 mb-0 ml-3 font-normal text-[16px] leading-[20px] tracking-[-0.01em]">{{ t('panel.pages.register.benefit3') }}</p>
                         </div>
                    </div>
               </section>
          </div>
          <div class="grid place-items-center [grid-area:main] relative">
               <div class="px-[40px] py-[32px]">
                    <form class="flex flex-col items-center w-full" @submit.prevent="handleRegister">
                         <fieldset class="self-center border-0 flex flex-col items-center p-0 [width:min(370px,_calc(-32px+100vw))]">
                              <h1 class="text-[rgb(8,15,26)] font-semibold mb-[28px] text-center relative text-[32px] leading-[41px] tracking-[-0.01em]">{{ t('panel.pages.register.title') }}</h1>
                              <span class="block text-center text-[14px] leading-[18px] tracking-[-0.01em] text-[#647491] -mt-[20px] mb-[12px]">{{ t('panel.pages.register.subtitle') }}</span>
                         </fieldset>
                         <fieldset class="border-0 p-0 mb-[16px] flex flex-col items-center">
                              <input v-model="inputEmail" type="email" class="box-border rounded-[4px] border border-[rgb(226,232,239)] text-[rgb(8,15,26)] text-[18px] px-[18px] pt-[22px] pb-[20px] [width:min(370px,_calc(-32px+100vw))] max-w-full focus:border-[rgb(5,102,255)] focus:shadow-[0px_0px_0px_1px_rgb(5,102,255)] focus:outline-0" :class="{ 'border-[rgb(232,19,50)]': errors.email }" :placeholder="t('panel.pages.register.emailPlaceholder')">
                              <span v-if="errors.email" class="_inputError self-start text-[rgb(232,19,50)] inline-flex pl-[2px] pt-[4px] mb-[-7px] text-[12px] leading-[16px] tracking-[-0.01em]">{{ errorMessageEmail }}</span>
                         </fieldset>
                         <fieldset class="border-0 p-0 mb-[16px] flex flex-col items-center">
                              <PanelCommonPasswordInput
                                   v-model="password"
                                   @input="evaluatePasswordStrength"
                                   @focus="() => { passwordFocused = true; evaluatePasswordStrength() }"
                                   @blur="() => { passwordFocused = false; evaluatePasswordStrength() }"
                                   :placeholder="t('panel.pages.register.passwordPlaceholder')"
                                   extraClassInput="box-border rounded-[4px] border border-[rgb(226,232,239)] text-[rgb(8,15,26)] text-[18px] px-[18px] pt-[22px] pb-[20px] [width:min(370px,_calc(-32px+100vw))] max-w-full focus:border-[rgb(5,102,255)] focus:shadow-[0px_0px_0px_1px_rgb(5,102,255)] focus:outline-0"
                                   :error=errors.password
                                   :iconSize=20
                              />
                              <span v-if="errors.password" class="_inputError self-start text-[rgb(232,19,50)] inline-flex pl-[2px] pt-[4px] mb-[-7px] text-[12px] leading-[16px] tracking-[-0.01em]">{{ errorMessagePassword }}</span>
                         </fieldset>

                         <!-- Barre de progression et texte -->
                         <Transition name="slide-fade" appear>
                              <div v-if="passwordFocused" class="relative translate-y-[-8px] pl-[4px] self-start h-[0.1px] overflow-hidden h-[15.9px] mb-[8px]">
                                   <div class="flex items-center">
                                        <div class="w-[100px] h-[4px] rounded-[3.5px] bg-[#eff2f6] inline-block mr-[12px]">
                                             <div class="block h-[4px] rounded-[3.5px]" :style="{ width: progressWidth, backgroundColor: progressColor }"></div>
                                        </div>
                                        <span class="text-[12px] font-medium leading-normal tracking-[-0.09px] text-[rgb(135,150,175)]">{{ passwordStrength }}</span>
                                   </div>
                              </div>
                         </Transition>

                         <fieldset class="border-0 p-0 mb-[16px] flex flex-col items-center">
                              <input v-model="displayName" type="text" class="box-border rounded-[4px] border border-[rgb(226,232,239)] text-[rgb(8,15,26)] text-[18px] px-[18px] pt-[22px] pb-[20px] [width:min(370px,_calc(-32px+100vw))] max-w-full focus:border-[rgb(5,102,255)] focus:shadow-[0px_0px_0px_1px_rgb(5,102,255)] focus:outline-0" :class="{ 'border-[rgb(232,19,50)]': errors.displayName }" :placeholder=" t('panel.pages.register.displayNamePlaceholder')">


                              <span v-if="errors.displayName" class="_inputError self-start text-[rgb(232,19,50)] inline-flex pl-[2px] pt-[4px] mb-[-7px] text-[12px] leading-[16px] tracking-[-0.01em]">{{ errorMessageDisplayName }}</span>
                         </fieldset>
                         <fieldset class="border-0 p-0 mb-[16px] flex flex-col items-center mt-[13px]">
                              <label class="flex items-start max-w-[365px] text-[14px] leading-[18px] tracking-[-0.01em] cursor-pointer">
                                   <!-- Case visuelle custom -->
                                   <span>
                                        <!-- Input caché -->
                                        <input
                                             type="checkbox"
                                             v-model="agreed"
                                             tabindex="0"
                                             class="sr-only peer"
                                        />
                                        <span
                                             class="float-left block w-[20px] h-[20px] rounded-[3px] border-[2px] border-[rgb(226,232,239)] cursor-pointer mr-[14px] mb-[16px] translate-y-[1px] transition-all duration-100 ease-in-out peer-checked:bg-[rgb(5,102,255)] peer-checked:border-[rgb(5,102,255)] peer-checked:bg-center peer-checked:bg-no-repeat peer-checked:bg-[length:16px_16px]" :class="{ 'border-[rgb(232,19,50)]': errors.agreed }" :style="{ backgroundImage: `url('${checkSvg}')` }"
                                        ></span>
                                        <span class="mt-0 mb-0">
                                            {{ t('panel.pages.register.acceptLabel') }}
                                             <a href="#" class="underline text-[#0566ff]">{{ t('panel.pages.register.terms') }}</a> {{ t('panel.pages.register.andLabel') }} <a href="#" class="underline text-[#0566ff]">{{ t('panel.pages.register.privacy') }}</a> {{ appName }}.
                                        </span>
                                        <span v-if="errors.agreed" class="_inputError self-start text-[rgb(232,19,50)] inline-flex pl-[2px] pt-[4px] mb-[-7px] text-[12px] leading-[16px] tracking-[-0.01em]">{{ errorsMessageAgreed }}</span>
                                   </span>
                              </label>
                         </fieldset>

                         <span v-if="apiError" class="_inputError text-[rgb(232,19,50)] flex items-center justify-center flex-row mb-[15px] max-w-[370px] text-[16px] leading-[20px] tracking-[-0.01em]">{{ getErrorMessageByKey(publicStore.publicReturn) }}</span>

                         <fieldset class="self-center border-0 flex flex-col items-center p-0 [width:min(370px,_calc(-32px+100vw))]">
                              <button
                                   type="submit"
                                   :disabled="loading"
                                   class="bg-[rgb(100,237,128)] border border-[rgb(100,237,128)] cursor-pointer outline-none p-[15px_20px] transition duration-200 ease-in-out w-full max-w-[370px] text-[20px] leading-[26px] tracking-[-0.01em] rounded-[8px]"
                                   :class="{ 'text-[#aab6c9] bg-[rgb(236,242,244)] border-[rgb(236,242,244)] cursor-not-allowed': loading }"
                              >
                                   {{ loading ? t('panel.pages.register.loading') : t('panel.pages.register.cta')  }}
                              </button>
                              <span class="block text-center mt-[40px] pt-[20px] text-[16px]  text-[#647491] border-t border-[#e2e8ef]">{{ t('panel.pages.register.alreadyHaveAccount') }} <a href="/panel/login" class="text-blue-500 hover:underline">{{ t('panel.pages.register.loginCta') }}</a>
                              </span>
                         </fieldset>
                    </form>
               </div>
          </div>
     </div>
</template>
<script setup lang="ts">
const { appName } = useAppInfo()
const { t } = useI18n()
const { locale } = useI18n()
const publicStore = usePublicStore()
const backgroundImage = useSvgBase64Loader('panel/register/backgroundRegister')
const checkSvg = useSvgBase64Loader('panel/register/check')
const inputEmail = ref('')
const password = ref('')
const displayName = ref('')
const agreed = ref(false)
const errors = ref({ email: false, password: false, displayName: false, agreed: false })
const apiError = ref(false)
const loading = ref(false)
const errorMessageEmail = ref('');
const errorMessagePassword = ref('');
const errorMessageDisplayName = ref('');
const errorsMessageAgreed = ref('');
const lang = locale.value
const passwordStrength = ref('')
const passwordFocused = ref(false)
const progressWidth = ref('0%')
const progressColor = ref('rgb(226,232,239)')
const router = useRouter()

// Fonction pour valider le formulaire
const validateForm = () => {
     errors.value = { email: false, password: false, displayName: false, agreed: false }
     let valid = true

     if (!inputEmail.value) {
          errors.value.email = true
          errorMessageEmail.value = t('panel.pages.register.errorEmailInvalid')
          valid = false

     } else if (!/\S+@\S+\.\S+/.test(inputEmail.value)) {
          errors.value.password = true
          errorMessageEmail.value  =  t('panel.pages.register.errorEmailInvalid')
          valid = false
     }

     if (password.value.length < 6) {
          errors.value.password = true
          errorMessagePassword.value = t('panel.pages.register.errorPasswordTooShort')
          valid = false
     }

     if (displayName.value.length < 3) {
          errors.value.displayName = true
          errorMessageDisplayName.value = t('panel.pages.register.errorDisplayNameTooShort')
          valid = false
     }

     if (!agreed.value) {
          errors.value.agreed = true
          errorsMessageAgreed.value = t('panel.pages.register.errorAgreementRequired')
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
          passwordStrength.value = t('panel.pages.register.strengthLabel')
          progressWidth.value = '0%'
          progressColor.value = 'rgb(226,232,239)'
     } else if (pass.length <= 4 ) {
          passwordStrength.value = t('panel.pages.register.veryWeak')
          progressWidth.value = '20%'
          progressColor.value = 'rgb(246, 48, 62)'
     } else if (pass.length <= 7) {
          passwordStrength.value = t('panel.pages.register.weak')
          progressWidth.value = '40%'
          progressColor.value = 'rgb(246, 135, 48)'
     } else if (pass.length <= 9) {
          passwordStrength.value = t('panel.pages.register.medium')
          progressWidth.value = '60%'
          progressColor.value = 'rgb(255, 200, 89)'
     } else if (pass.length <= 13) {
          passwordStrength.value = t('panel.pages.register.strong')
          progressWidth.value = '80%'
          progressColor.value = 'rgb(52, 184, 87)'
     } else {
          passwordStrength.value = t('panel.pages.register.veryStrong')
          progressWidth.value = '100%'
          progressColor.value = 'rgb(52, 184, 87)'
     }
}

// Fonction pour gérer la connexion
const handleRegister = async () => {
     if (!validateForm()) return
     apiError.value = false
     loading.value = true

     const success = await publicStore.register(inputEmail.value, password.value, displayName.value, agreed.value, lang)
     if (success) {
          await router.push('/onboarding')
     } else {
         apiError.value = true
     }

     loading.value = false
}
const { setMeta } = usePanelPageMeta()
setMeta({
     title: t('panel.pages.register.metaTitle'),
     description: t('panel.pages.register.metaDescription')
})
</script>
