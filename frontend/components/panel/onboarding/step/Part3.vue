<template>
     <div class="flex flex-col gap-[32px] sm:gap-[48px]">
          <PanelOnboardingSection
               :title="t('panel.components.onboarding.step.part3.activitySector.title')"
               :description="t('panel.components.onboarding.step.part3.activitySector.description')">
               <PanelOnboardingSelectSimple
                    v-model="onboardingStore.answers.selectedActivity"
                    :options="panelStore.activities"
                    :placeholder="t('panel.components.onboarding.step.part3.activitySector.placeholder')"/>
          </PanelOnboardingSection>

          <PanelOnboardingSection
               v-if="onboardingStore.stepSections[3].completed >= 1"
               :title="t('panel.components.onboarding.step.part3.conversations.title')"
               :description="t('panel.components.onboarding.step.part3.conversations.description')">
               <PanelOnboardingRadioGroup
                    v-model="onboardingStore.answers.conversationsPerMonth"
                    :options="[
                         { value: 'under_200', label: t('panel.components.onboarding.step.part3.conversations.options.under', { nbr:'200' }) },
                         { value: '200_500', label: '200 - 500' },
                         { value: '500_1000', label: '500 - 1 000' },
                         { value: '200_1000', label: '200 - 1 000' },
                         { value: '1000_5000', label: '1 000 - 5 000' },
                         { value: '5000_10000', label: '5 000 - 10 000' },
                         { value: 'over_10000', label: t('panel.components.onboarding.step.part3.conversations.options.over', { nbr:'10 000'}) },
                         { value: 'unknown', label: t('panel.components.onboarding.step.part3.conversations.options.unknown') }

                         ]"/>
          </PanelOnboardingSection>

          <PanelOnboardingSection
               v-if="onboardingStore.stepSections[3].completed >= 2"
               :title="t('panel.components.onboarding.step.part3.visitors.title')"
               :description="t('panel.components.onboarding.step.part3.visitors.description')">
               <PanelOnboardingRadioGroup
                    v-model="onboardingStore.answers.monthlyWebsiteVisitors"
                    :options="[
                         { value: 'under_1000', label: t('panel.components.onboarding.step.part3.visitors.options.under', { nbr:'200' }) },
                         { value: '1000_10000', label: '1 000 - 10 000' },
                         { value: '10000_50000', label: '10 000 - 50 000' },
                         { value: '50000_100000', label: '50 000 - 100 000' },
                         { value: 'over_100000', label: t('panel.components.onboarding.step.part3.visitors.options.under', { nbr:'100 000' }) },
                         { value: 'unknown', label: t('panel.components.onboarding.step.part3.visitors.options.unknown') },
                         ]"/>
          </PanelOnboardingSection>

          <PanelOnboardingSection
               v-if="onboardingStore.stepSections[3].completed >= 3"
               :title="t('panel.components.onboarding.step.part3.platform.title')"
               :description="t('panel.components.onboarding.step.part3.platform.description')">
               <PanelOnboardingRadioGroup
                    v-model="onboardingStore.answers.websiteHostingPlatform"
                    :options="[
                         { value: 'custom', label: t('panel.components.onboarding.step.part3.platform.options.custom'), icon: 'svgo-panel-onboarding-icon-website' },
                         { value: 'wordpress', label: t('panel.components.onboarding.step.part3.platform.options.wordpress'), icon: 'svgo-panel-onboarding-icon-wordpress' },
                         { value: 'prestashop', label: t('panel.components.onboarding.step.part3.platform.options.prestashop'), icon: 'svgo-panel-onboarding-icon-presta-shop' },
                         { value: 'woocommerce', label: t('panel.components.onboarding.step.part3.platform.options.woocommerce'), icon: 'svgo-panel-onboarding-icon-woo-commerce' },
                         { value: 'shopify', label: t('panel.components.onboarding.step.part3.platform.options.shopify'), icon: 'svgo-panel-onboarding-icon-shopify' },
                         { value: 'other', label: t('panel.components.onboarding.step.part3.platform.options.other') },
                         ]"/>
          </PanelOnboardingSection>
     </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const panelStore = usePanelStore()
const onboardingStore = useOnboardingStore()
onboardingStore.validateSections(3)
</script>
