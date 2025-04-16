<template>
     <div class="flex flex-col gap-[32px] sm:gap-[48px]">
          <PanelOnboardingSection title="Quel est le secteur d'activité de votre entreprise ?" description="">
               <PanelOnboardingSelectSimple v-model="onboardingStore.answers.selectedActivity" :options="panelStore.activities" placeholder="Sélectionnez votre secteur d'activité" />
          </PanelOnboardingSection>

     </div>
</template>

<script setup lang="ts">
const panelStore = usePanelStore()
const onboardingStore = useOnboardingStore()

useSection(3, 1, () => !!onboardingStore.answers.selectedActivity)
</script>
