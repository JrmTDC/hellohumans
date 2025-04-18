<template>
     <div class="flex flex-col gap-[32px] sm:gap-[48px]">
          <PanelOnboardingSection
              :title="t('panel.components.onboarding.step.part4.title')"
              :description="t('panel.components.onboarding.step.part4.description')">
               <PanelOnboardingBoxSelect
                    v-model="onboardingStore.answers.primaryUse"
                    :options="goals"
               />
          </PanelOnboardingSection>

     </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const onboardingStore = useOnboardingStore()
onboardingStore.validateSections(4)

const goals = [
     {
          value: 'support_ai',
          label: t('panel.components.onboarding.step.part4.options.support_ai.label'),
          description: t('panel.components.onboarding.step.part4.options.support_ai.description'),
          icon: 'svgo-panel-onboarding-icon-bot',
     },
     {
          value: 'marketing_growth',
          label: t('panel.components.onboarding.step.part4.options.marketing_growth.label'),
          description:  t('panel.components.onboarding.step.part4.options.marketing_growth.description'),
          icon: 'svgo-panel-onboarding-icon-chat-bull',
     },
     {
          value: 'lead_generation',
          label: t('panel.components.onboarding.step.part4.options.lead_generation.label'),
          description: t('panel.components.onboarding.step.part4.options.lead_generation.description'),
          icon: 'svgo-panel-onboarding-icon-prospect',
     },
     {
          value: 'ecommerce_assistant',
          label: t('panel.components.onboarding.step.part4.options.ecommerce_assistant.label'),
          description: t('panel.components.onboarding.step.part4.options.ecommerce_assistant.description'),
          icon: 'svgo-panel-onboarding-icon-ecommerce',
     }
]
</script>
