<template>
     <div class="flex flex-col gap-[32px] sm:gap-[48px]">
          <PanelOnboardingSection
               :title="t('panel.components.onboarding.step.part2.industry.title')"
               :description="t('panel.components.onboarding.step.part2.industry.description')">
               <PanelOnboardingRadioGroup
                    v-model="onboardingStore.answers.serviceModel"
                    :options="[
                         { value: 'services', label: t('panel.components.onboarding.step.part2.industry.options.services'), icon: 'svgo-panel-onboarding-icon-dev-web-site' },
                         { value: 'sale', label: t('panel.components.onboarding.step.part2.industry.options.sale'), icon: 'svgo-panel-onboarding-icon-sale' },
                         { value: 'marketing', label: t('panel.components.onboarding.step.part2.industry.options.marketing'), icon: 'svgo-panel-onboarding-icon-marketing' }
                         ]"/>
          </PanelOnboardingSection>

          <div v-if="onboardingStore.stepSections[2].completed >= 1"
               ref="refConversations"
               class="scroll-mt-[80px]">
               <PanelOnboardingSection
                    :title="t('panel.components.onboarding.step.part2.communication.title')"
                    :description="t('panel.components.onboarding.step.part2.communication.description')">
                    <PanelOnboardingRadioGroup
                         v-model="onboardingStore.answers.communicationMethods"
                         :multiple="true"
                         :options="[
                              { value: 'mail', label: t('panel.components.onboarding.step.part2.communication.options.mail'), icon: 'svgo-panel-onboarding-icon-mail' },
                              { value: 'phone', label: t('panel.components.onboarding.step.part2.communication.options.phone'), icon: 'svgo-panel-onboarding-icon-phone' },
                              { value: 'place', label: t('panel.components.onboarding.step.part2.communication.options.place'), icon: 'svgo-panel-onboarding-icon-marketing' },
                              { value: 'website', label: t('panel.components.onboarding.step.part2.communication.options.website'), icon: 'svgo-panel-onboarding-icon-marketing' },
                              { value: 'none', label: t('panel.components.onboarding.step.part2.communication.options.none') }]"/>
               </PanelOnboardingSection>
          </div>

          <div v-if="onboardingStore.stepSections[2].completed >= 2"
               ref="refVisitors"
               class="scroll-mt-[80px]">
               <PanelOnboardingSection
                    :title="t('panel.components.onboarding.step.part2.businessModel.title')"
                    :description="t('panel.components.onboarding.step.part2.businessModel.description')">
                    <PanelOnboardingRadioGroup
                         v-model="onboardingStore.answers.businessModel"
                         :options="[
                              { value: 'services', label: t('panel.components.onboarding.step.part2.businessModel.options.services'), icon: 'svgo-panel-onboarding-icon-service' },
                              { value: 'ecommerce', label: t('panel.components.onboarding.step.part2.businessModel.options.ecommerce'), icon: 'svgo-panel-onboarding-icon-ecommerce' },
                              { value: 'other', label: t('panel.components.onboarding.step.part2.businessModel.options.other') }]"/>
               </PanelOnboardingSection>
          </div>
     </div>
</template>
<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const { t } = useI18n()
const onboardingStore = useOnboardingStore()

onboardingStore.validateSections(2)

// Refs pour les sections
const refConversations = ref<HTMLElement | null>(null)
const refVisitors = ref<HTMLElement | null>(null)

// Auto-scroll vers la prochaine section visible
watch(() => onboardingStore.stepSections[2].completed, (val) => {
     nextTick(() => {
          setTimeout(() => {
               requestAnimationFrame(() => {
                    if (val === 1) refConversations.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    else if (val === 2) refVisitors.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
               })
          },100)
     })
})
</script>
