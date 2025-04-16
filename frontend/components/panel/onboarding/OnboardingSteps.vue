<template>
     <form>
          <PanelOnboardingStepPart1 v-if="onboardingStore.currentStep === 1" />
          <PanelOnboardingStepPart2 v-else-if="onboardingStore.currentStep === 2" />
          <PanelOnboardingStepPart3 v-else-if="onboardingStore.currentStep === 3" />
     </form>
</template>

<script setup lang="ts">
const onboardingStore = useOnboardingStore()
</script>
