import { defineStore } from 'pinia'

export const useUpgradeFlow = defineStore('upgradeFlow', () => {
     const currentStep = ref<number>(0)

     function setStep(step: number) {
          currentStep.value = step
     }

     return {
          currentStep,
          setStep,
     }
})