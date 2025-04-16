<template>
     <div class="flex flex-col gap-[32px] sm:gap-[48px]">
          <PanelOnboardingSection title="Quel est le secteur d'activité de votre entreprise ?" description="">
               <PanelOnboardingSelectSimple v-model="onboardingStore.answers.selectedActivity" :options="panelStore.activities" placeholder="Sélectionnez votre secteur d'activité" />
          </PanelOnboardingSection>

          <PanelOnboardingSection title="Combien de conversations avec les clients votre entreprise traite-t-elle par mois ?" description="">
               <PanelOnboardingRadioGroup
                    v-model="onboardingStore.answers.conversationsPerMonth"
                    :options="[
                         { value: 'under_200', label: 'Jusqu\'a 200' },
                         { value: '200_1000', label: '200 - 1 000' },
                         { value: '1000_5000', label: '1 000 - 5 000' },
                         { value: '5000_10000', label: '5 000 - 10 000' },
                         { value: 'over_10000', label: '10 000 ou plus' },
                         { value: 'unknown', label: 'Je ne sais pas' },
                         ]"
               />
          </PanelOnboardingSection>

          <PanelOnboardingSection title="Combien de visiteurs votre site Web attire-t-il chaque mois ?" description="">
               <PanelOnboardingRadioGroup
                    v-model="onboardingStore.answers.monthlyWebsiteVisitors"
                    :options="[
                         { value: 'under_1000', label: 'Jusqu\'a 1 000' },
                         { value: '1000_10000', label: '1 000 - 10 000' },
                         { value: '10000_50000', label: '10 000 - 50 000' },
                         { value: '50000_100000', label: '50 000 - 100 000' },
                         { value: 'over_100000', label: '100 000 ou plus' },
                         { value: 'unknown', label: 'Je ne sais pas' },
                         ]"
               />
          </PanelOnboardingSection>
          <PanelOnboardingSection title="Quelle plateforme héberge votre site Web ?" description="">
               <PanelOnboardingRadioGroup
                    v-model="onboardingStore.answers.websiteHostingPlatform"
                    :options="[
                         { value: 'custom', label: 'Site personnalisé', icon: 'svgo-panel-onboarding-icon-website' },
                         { value: 'wordpress', label: 'WordPress', icon: 'svgo-panel-onboarding-icon-wordpress' },
                         { value: 'prestashop', label: 'PrestaShop', icon: 'svgo-panel-onboarding-icon-presta-shop' },
                         { value: 'woocommerce', label: 'WooCommerce', icon: 'svgo-panel-onboarding-icon-woo-commerce' },
                         { value: 'shopify', label: 'Shopify', icon: 'svgo-panel-onboarding-icon-shopify' },
                         { value: 'other', label: 'Autre', icon: 'svgo-panel-onboarding-icon-' },
                         ]"
               />
          </PanelOnboardingSection>

     </div>
</template>

<script setup lang="ts">
const panelStore = usePanelStore()
const onboardingStore = useOnboardingStore()

useSection(3, 1, () => !!onboardingStore.answers.selectedActivity)
useSection(3, 2, () => !!onboardingStore.answers.conversationsPerMonth)
useSection(3, 3, () => !!onboardingStore.answers.monthlyWebsiteVisitors)
useSection(3, 4, () => !!onboardingStore.answers.websiteHostingPlatform)
</script>
