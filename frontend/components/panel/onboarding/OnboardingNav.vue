<template>
     <footer class="pointer-events-auto sticky bottom-0 w-full bg-white z-[3] text-center shadow-none p-5 pt-6">
          <!-- Barre de progression -->
          <div class="absolute top-0 left-0 w-full h-[6px] bg-[#dce9ff]">
               <div class="absolute top-0 left-0 h-[6px] bg-[#3886ff] transition-all duration-300" :style="{ width: store.progressPercent + '%' }"></div>
          </div>

          <div class="flex items-center">
               <div class="mx-[5px] sm:w-[200px]">
                    <button v-if="store.currentStep > 1" @click="store.goPrevious()" class="inline-flex items-center justify-center px-[20px] rounded-[8px] text-[18px] h-[46px] leading-[23px] border-transparent bg-transparent text-[#0566ff] font-normal hover:bg-transparent hover:text-[#0566ff] hover:underline"> {{ t('panel.components.onboarding.nav.back') }}</button>
               </div>
               <div class="flex-[0_0_auto] w-auto mx-[5px] ml-auto mr-[20px]">

                    <button class="rounded-[8px] text-[18px] h-[46px] leading-[23px] min-w-auto max-w-full w-full px-[20px] inline-flex items-center justify-center transition-all duration-200" :class="[(!store.isCurrentStepComplete || store.submitting) ? 'bg-[#eff2f6] text-[#acb8cb] cursor-not-allowed': 'bg-[#0566ff] border-[#0566ff] text-white hover:bg-[#0049bd] hover:border-[#0049bd]']" :disabled="!store.isCurrentStepComplete || store.submitting" @click="handleNext">
                         <template v-if="store.submitting">{{ t('panel.components.onboarding.nav.loading') }}
                         </template>
                         <template v-else>{{ isLastStep ? t('panel.components.onboarding.nav.submit') : t('panel.components.onboarding.nav.next') }}
                         </template>
                    </button>
               </div>
          </div>
     </footer>
</template>

<script setup lang="ts">
const store = useOnboardingStore()
const isLastStep = computed(() => store.currentStep === store.totalSteps)
const { t } = useI18n()
async function handleNext() {
     if (!store.isCurrentStepComplete || store.submitting) return
     if (isLastStep.value) {
          await store.submitOnboarding()
     } else {
          store.goNext()
     }
}
</script>
