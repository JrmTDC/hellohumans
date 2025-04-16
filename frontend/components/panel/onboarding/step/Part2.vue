<template>
     <div class="flex flex-col gap-[32px] sm:gap-[48px]">
          <PanelOnboardingSection title="Quel est le secteur d'activité de votre entreprise ?" description="">
               <PanelOnboardingRadioGroup
                    v-model="onboardingStore.answers.serviceModel"
                    :options="[
                         { value: 'services', label: 'Développement de sites', icon: 'svgo-panel-onboarding-icon-dev-web-site' },
                         { value: 'sale', label: 'Vente', icon: 'svgo-panel-onboarding-icon-sale' },
                         { value: 'marketing', label: 'Marketing', icon: 'svgo-panel-onboarding-icon-marketing' }
                         ]"
               />
          </PanelOnboardingSection>

          <PanelOnboardingSection title="Actuellement comment vous communiquer avec vos clients ?" description="Sélectionnez tout ce qui s'applique">
               <PanelOnboardingRadioGroup
                    v-model="onboardingStore.answers.communicationMethods"
                    :multiple="true"
                    :options="[
                         { value: 'mail', label: 'Par e-mail', icon: 'svgo-panel-onboarding-icon-mail' },
                         { value: 'phone', label: 'Par téléphone', icon: 'svgo-panel-onboarding-icon-phone' },
                         { value: 'place', label: 'Sur place', icon: 'svgo-panel-onboarding-icon-marketing' },
                         { value: 'website', label: 'Siteweb / Blog', icon: 'svgo-panel-onboarding-icon-marketing' },
                         { value: 'none', label: 'Aucun', icon: 'svgo-panel-onboarding-icon-marketing' }
                         ]"
               />
          </PanelOnboardingSection>

          <PanelOnboardingSection title="Quel est votre principal modèle économique ?" description="">
               <PanelOnboardingRadioGroup
                    v-model="onboardingStore.answers.businessModel"
                    :options="[
                         { value: 'services', label: 'Je fournis des services', icon: 'svgo-panel-onboarding-icon-service' },
                         { value: 'ecommerce', label: 'E-commerce', icon: 'svgo-panel-onboarding-icon-ecommerce' },
                         { value: 'other', label: 'Autre' }
                         ]"
               />
          </PanelOnboardingSection>

     </div>
</template>

<script setup lang="ts">
const panelStore = usePanelStore()
const onboardingStore = useOnboardingStore()

useSection(2, 1, () => !!onboardingStore.answers.serviceModel)
useSection(2, 2, () => onboardingStore.answers.communicationMethods.length > 0)
useSection(2, 3, () => !!onboardingStore.answers.businessModel)
</script>
