<template>
     <div id="hellohumans-panel" class="w-full min-h-screen grid [grid-template-rows:auto_auto_32px_1fr] [grid-template-areas:'header''main''.''aside'] [grid-template:'header_header''aside_main'_1fr_/505px_1fr] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTcyIiBoZWlnaHQ9IjI0MSIgdmlld0JveD0iMCAwIDU3MiAyNDEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEzMjcuOTUgLTIwNy41NzRDMTMwMS40NiAtMTc1Ljg4NyAxMjYzLjcgLTE0MS40OSAxMjEzLjcyIC0xMDMuODc2QzExNjUuMDUgLTY3LjI0NjcgMTEyNy44NiAtMzQuMTAxOCAxMDk5LjkxIC00LjU1MTIxQzExMDAuMTkgLTQuMjEwMTcgMTEwMC40OCAtMy44NjgzMiAxMTAwLjc2IC0zLjUyNTYzTDEwOTIuODYgMy4wMjc2NUwxMTAwLjc2IC0zLjUyNTU3QzExNTYuNCA2My41MTQ5IDExNzguNTEgMTIzLjk0MyAxMTYzLjcyIDE3Mi44NjdDMTE0Ny45MiAyMjUuMTI1IDEwOTcuMzYgMjQ0LjAzMiAxMDU1Ljg4IDI0MC4yODlDMTAxMy42MSAyMzYuNDczIDk2OC4yMDEgMjA4Ljk1NSA5NTUuMTM3IDE1NS44NDhDOTQ0LjI0OSAxMTEuNTg1IDk1OC4zMjYgNTkuMjQ4OCA5OTkuMDc3IDEuNDIzOThDOTE1LjI0MyAtNTkuNDg1NiA4MDIuODAzIC01NC4wMzkxIDY5MS4wMjcgLTcuMDE2NzVDNTY3LjcwOSA0NC44NjA2IDQ1OC42NiAxNDIuNTMxIDQxNC4yODkgMjI5LjQwM0wzNDUuMzk3IDIwMy43ODdDMzUwLjg1NCAxODEuNDY0IDM3Ni4xMyAzNy41MDU3IDM4MS45MTUgLTEwLjYxNzdDMzg3Ljc5NSAtNTkuNTIxIDM4MS43NzQgLTk2LjcwOTIgMzY5LjIxNiAtMTIyLjQyNkMzNTcuMTAxIC0xNDcuMjM3IDMzOC4yNzkgLTE2Mi45NTIgMzEzLjIyNSAtMTY5Ljk3MkMyNjAuMDg4IC0xODQuODYgMTY3LjY2NSAtMTYyLjU2OSA0Ny4wMzAxIC02My4yNjU3TDAgLTEyMC4zOTlDMTI1Ljg5NSAtMjI0LjAzMiAyNDMuOTQxIC0yNjYuMjM0IDMzMy4xOSAtMjQxLjIyOEMzNzkuMzI5IC0yMjguMyA0MTQuNjc5IC0xOTcuOTcgNDM1LjcxMiAtMTU0Ljg5NkM0NTYuMzAzIC0xMTIuNzI4IDQ2Mi40MDggLTYwLjE5MDggNDU1LjM4NyAtMS43ODUxQzQ1My40NDQgMTQuMzcxOSA0NDkuNDU1IDQwLjU5NzQgNDQ0LjcyNyA2OS41OTIyQzUwNC45MjMgMTAuODAwNCA1ODEuNTU5IC00MS4yNDczIDY2Mi4zMzIgLTc1LjIyNjhDNzg3LjExNiAtMTI3LjcyMSA5MzMuMTQyIC0xNDEuMTU4IDEwNDYuNDEgLTU1LjY4MTlDMTA3Ny44NSAtODguODgwMSAxMTE4LjI2IC0xMjQuNjQ5IDExNjkuMjMgLTE2My4wMDNDMTIxNi42MiAtMTk4LjY3MSAxMjQ5LjYgLTIyOS4yMjggMTI3MS4xNyAtMjU1LjAzNEMxMjkzLjAxIC0yODEuMTY1IDEzMDEuMTQgLTMwMC4wMjMgMTMwMy4wNCAtMzEyLjQwMkMxMzA0LjY1IC0zMjIuODc0IDEzMDIuMjEgLTMzMC41NTQgMTI5NS40OCAtMzM4LjM3MUMxMjg3LjU5IC0zNDcuNTM1IDEyNzMuMDMgLTM1Ny40NDUgMTI0OS42NSAtMzY2LjYzM0MxMjAyLjkxIC0zODUuMDAxIDExMzMuNzYgLTM5NS42MzEgMTA1NS4xMiAtNDAwLjIyOEM5NzcuMzExIC00MDQuNzc2IDg5My40MzQgLTQwMy4yNjcgODE5LjExNiAtMzk5LjAyNkw4MTQuOSAtNDcyLjkwNUM4OTEuMDg0IC00NzcuMjU0IDk3Ny45NTQgLTQ3OC44NjUgMTA1OS40NCAtNDc0LjEwMkMxMTQwLjA5IC00NjkuMzg3IDEyMTguNzggLTQ1OC4yNzQgMTI3Ni43MSAtNDM1LjUwNUMxMzA1LjY3IC00MjQuMTI0IDEzMzIuNjYgLTQwOC42MTcgMTM1MS41NyAtMzg2LjY0NEMxMzcxLjY0IC0zNjMuMzI1IDEzODEuMjQgLTMzNC4xNSAxMzc2LjE4IC0zMDEuMTc3QzEzNzEuNDIgLTI3MC4xMTIgMTM1NC4xNiAtMjM4LjkzNiAxMzI3Ljk1IC0yMDcuNTc0Wk0xMDUyLjQ3IDU0LjQ5OEMxMDI1LjMyIDk2LjUxMjkgMTAyMy40OCAxMjMuODg2IDEwMjcgMTM4LjE3MkMxMDMxLjAzIDE1NC41NjggMTA0NS4wNiAxNjUuMDExIDEwNjIuNTMgMTY2LjU4OEMxMDgwLjgxIDE2OC4yMzcgMTA5MC4zMSAxNTkuOTY5IDEwOTIuODggMTUxLjQ1OEMxMDk0LjYxIDE0NS43NSAxMDk1LjUyIDEzNC42OTQgMTA4OC45NyAxMTYuMzg0QzEwODMuMiAxMDAuMjM3IDEwNzIgNzkuNjI1MiAxMDUyLjQ3IDU0LjQ5OFoiIGZpbGw9IiM2NEVEODAiLz4KPC9zdmc+Cg==')] bg-[position:-60px_top] bg-no-repeat bg-[rgb(0,20,51)]"
     >
          <!-- Header -->
          <div class="flex flex-row justify-start items-center relative [grid-area:header] px-[40px] py-[32px] z-[1]">
               <div class="mr-auto">
                    <svgo-logo-hello-humans-full class="w-[220px] fill-[#f7f0e5]"/>
               </div>
               <div class="login-container">
                    <LanguageSelector />
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
                              <PasswordInput
                                   v-model="password"
                                  :placeholder="t('panel.pages.register.passwordPlaceholder')"
                                  extraClassInput="box-border rounded-[4px] border border-[rgb(226,232,239)] text-[rgb(8,15,26)] text-[18px] px-[18px] pt-[22px] pb-[20px] [width:min(370px,_calc(-32px+100vw))] max-w-full focus:border-[rgb(5,102,255)] focus:shadow-[0px_0px_0px_1px_rgb(5,102,255)] focus:outline-0"
                                   :error=errors.password
                                  :iconSize=20
                              />
                              <span v-if="errors.password" class="_inputError self-start text-[rgb(232,19,50)] inline-flex pl-[2px] pt-[4px] mb-[-7px] text-[12px] leading-[16px] tracking-[-0.01em]">{{ errorMessagePassword }}</span>
                         </fieldset>
                         <fieldset class="border-0 p-0 mb-[16px] flex flex-col items-center">
                              <input v-model="website" type="text" class="box-border rounded-[4px] border border-[rgb(226,232,239)] text-[rgb(8,15,26)] text-[18px] px-[18px] pt-[22px] pb-[20px] [width:min(370px,_calc(-32px+100vw))] max-w-full focus:border-[rgb(5,102,255)] focus:shadow-[0px_0px_0px_1px_rgb(5,102,255)] focus:outline-0" :class="{ 'border-[rgb(232,19,50)]': errors.website }" :placeholder=" t('panel.pages.register.websitePlaceholder')">


                              <span v-if="errors.website" class="_inputError self-start text-[rgb(232,19,50)] inline-flex pl-[2px] pt-[4px] mb-[-7px] text-[12px] leading-[16px] tracking-[-0.01em]">{{ errorMessageWebsite }}</span>
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
                                             class="float-left block w-[20px] h-[20px] rounded-[3px] border-[2px] border-[rgb(226,232,239)] cursor-pointer mr-[14px] mb-[16px] translate-y-[1px] transition-all duration-100 ease-in-out peer-checked:bg-[rgb(5,102,255)] peer-checked:border-[rgb(5,102,255)] peer-checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNMTg2LjMwMSAzMzkuODkzTDk2IDI0OS40NjFsLTMyIDMwLjUwN0wxODYuMzAxIDQwMiA0NDggMTQwLjUwNiA0MTYgMTEweiIvPjwvc3ZnPg==')] peer-checked:bg-center peer-checked:bg-no-repeat peer-checked:bg-[length:16px_16px]" :class="{ 'border-[rgb(232,19,50)]': errors.agreed }"
                                        ></span>
                                        <span class="mt-0 mb-0">
                                            {{ t('panel.pages.register.acceptLabel') }}
                                             <a href="#" class="underline text-[#0566ff]">{{ t('panel.pages.register.terms') }}</a> {{ t('panel.pages.register.andLabel') }} <a href="#" class="underline text-[#0566ff]">{{ t('panel.pages.register.privacy') }}</a> {{ appName }}.
                                        </span>
                                        <span v-if="errors.agreed" class="_inputError self-start text-[rgb(232,19,50)] inline-flex pl-[2px] pt-[4px] mb-[-7px] text-[12px] leading-[16px] tracking-[-0.01em]">{{ errorsMessageAgreed }}</span>
                                   </span>
                              </label>
                         </fieldset>

                         <fieldset class="self-center border-0 flex flex-col items-center p-0 [width:min(370px,_calc(-32px+100vw))]">
                              <button class="bg-[#64ed80] rounded-[8px] border border-[rgb(100,237,128)] text-[rgb(0,11,38)] cursor-pointer outline-none px-[20px] py-[15px] transition-[all] duration-200 ease-in-out w-full max-w-[370px] text-[20px] hover:bg-[#31e756] hover:border-[#31e756]">{{ t('panel.pages.register.cta') }}</button>
                              <span class="block text-center mt-[40px] pt-[20px] text-[16px]  text-[#647491] border-t border-[#e2e8ef]">{{ t('panel.pages.register.alreadyHaveAccount') }} <a href="/panel/login" class="text-blue-500 hover:underline">{{ t('panel.pages.register.loginCta') }}</a>
                              </span>
                         </fieldset>
                    </form>
               </div>
          </div>
     </div>
</template>
<script setup lang="ts">

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PasswordInput from "~/components/panel/PasswordInput.vue";
import LanguageSelector from "~/components/panel/LanguageSelector.vue";
import { usePublicStore } from "~/stores/publicStore";

const { appName } = useAppInfo()
const { t } = useI18n()
const { locale } = useI18n()

const publicStore = usePublicStore()

// Champs du formulaire
const inputEmail = ref('')
const password = ref('')
const website = ref('')
const agreed = ref(false)
const errors = ref({ email: false, password: false, website: false, agreed: false })
const loginError = ref(false)
const loading = ref(false)
const errorMessageEmail = ref('');
const errorMessagePassword = ref('');
const errorMessageWebsite = ref('');
const errorsMessageAgreed = ref('');
const lang = locale.value

const router = useRouter()

// Fonction pour valider le formulaire
const validateForm = () => {
     errors.value = { email: false, password: false, website: false, agreed: false }
     let valid = true

     if (!inputEmail.value) {
          errors.value.email = true
          errorMessageEmail.value = t('panel.pages.register.errorEmailEmpty')
          valid = false

     } else if (!/\S+@\S+\.\S+/.test(inputEmail.value)) {
          errors.value.password = true
          errorMessageEmail.value  =  t('panel.pages.register.errorEmailInvalid')
          valid = false
     }

     if (!password.value) {
          errors.value.password = true
          errorMessagePassword.value = t('panel.pages.register.errorPasswordEmpty')
          valid = false
     }

     if (!website.value) {
          errors.value.website = true
          errorMessageWebsite.value = t('panel.pages.register.errorWebsiteEmpty')
          valid = false
     }

     if (!agreed.value) {
          errors.value.agreed = true
          errorsMessageAgreed.value = t('panel.pages.register.errorAgreementRequired')
          valid = false
     }

     return valid
}

// Fonction pour gérer la connexion
const handleRegister = async () => {
     if (!validateForm()) return
     loginError.value = false
     loading.value = true

     const success = await publicStore.register(inputEmail.value, password.value, website.value, agreed.value, lang)
     if (success) {
          loginError.value = false
          errorMessageEmail.value = ''
          errorMessagePassword.value = ''
          errorMessageWebsite.value = ''
          errorsMessageAgreed.value = ''

          await router.push('/panel')
     } else {
          loginError.value = true
     }

     loading.value = false
}
</script>



