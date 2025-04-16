<template>
     <div class="flex flex-col gap-[32px] sm:gap-[48px]">
          <PanelOnboardingSection title="J'utilise Hellohumans avant tout pour…" description="">
               <PanelOnboardingBoxSelect
                    v-model="onboardingStore.answers.primaryUse"
                    :options="goals"
               />
          </PanelOnboardingSection>

     </div>
</template>

<script setup lang="ts">
const onboardingStore = useOnboardingStore()
useSection(4, 1, () => !!onboardingStore.answers.primaryUse)

const goals = [
     {
          value: 'support_ai',
          label: 'Automatiser mon système d’assistance grâce à AI Agent',
          description: 'Répondez aux questions des clients et automatisez les tâches répétitives grâce à HelloHumans AI Agent',
          icon: 'svgo-panel-onboarding-icon-bot',
     },
     {
          value: 'marketing_growth',
          label: 'Optimiser mes conversions grâce à l’IA',
          description: 'Accompagnez vos visiteurs et déclenchez des actions marketing grâce à des réponses intelligentes',
          icon: 'svgo-panel-onboarding-icon-chat-bull',
     },
     {
          value: 'lead_generation',
          label: 'Générer des leads automatiquement',
          description: 'Identifiez et engagez les visiteurs intéressés avant même qu’ils ne vous contactent, et convertissez-les en clients potentiels',
          icon: 'svgo-panel-onboarding-icon-prospect',
     },
     {
          value: 'ecommerce_assistant',
          label: 'Accompagner mes visiteurs e-commerce',
          description: 'Proposez une expérience d’achat personnalisée, recommandez des produits et guidez vos clients tout au long de leur parcours',
          icon: 'svgo-panel-onboarding-icon-ecommerce',
     }
]
</script>
