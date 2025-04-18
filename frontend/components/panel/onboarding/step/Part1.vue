<template>
     <div class="flex flex-col gap-[32px] sm:gap-[48px]">
          <PanelOnboardingSection
               :title="t('panel.components.onboarding.step.part1.selectClient.title')"
               :description="t('panel.components.onboarding.step.part1.selectClient.description')">
               <PanelOnboardingSelectClient
                    v-model="onboardingStore.answers.selectedClientId" :clients="panelStore.clients"
                    :placeholder="t('panel.components.onboarding.step.part1.selectClient.placeholder')"
                    :placeholderCreate="t('panel.components.onboarding.step.part1.selectClient.placeholderCreate')"/>
          </PanelOnboardingSection>


          <!-- SECTION 1 : URL du site -->
          <div v-if="onboardingStore.stepSections[1].completed >= 1"
               ref="refConversations"
               class="scroll-mt-[80px]">
               <PanelOnboardingSection
                    :title="t('panel.components.onboarding.step.part1.siteUrl.title')"
                    :description="t('panel.components.onboarding.step.part1.siteUrl.description')">
                    <label class="block font-normal max-w-full flex flex-col relative text-[16px] leading-[20px] tracking-[-0.01em] w-full text-left text-[#647491]">
                         <input type="text"
                                v-model="onboardingStore.answers.webSite" :placeholder="t('panel.components.onboarding.step.part1.siteUrl.placeholder')"
                                class="block w-full h-[51px] text-[#080f1a] border-2 border-[#d3dbe5] rounded-[8px] px-[14px] py-[16px] outline-none focus:border-[#3886ff]"/>
                    </label>
               </PanelOnboardingSection>
          </div>
     </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
const { t } = useI18n()
const panelStore = usePanelStore()
const onboardingStore = useOnboardingStore()

onboardingStore.validateSections(1)

// Refs pour les sections
const refConversations = ref<HTMLElement | null>(null)

// Auto-scroll vers la prochaine section visible
watch(() => onboardingStore.stepSections[1
     ].completed, (val) => {
     nextTick(() => {
          setTimeout(() => {
               requestAnimationFrame(() => {
                    if (val === 1) refConversations.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
               })
          },100)
     })
})
</script>
