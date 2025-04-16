import { ref, watch } from 'vue'

export function useSection(partIndex: number, sectionIndex: number, conditionFn: () => boolean) {
     const onboardingStore = useOnboardingStore()
     const isValid = ref(false)

     watch(conditionFn, (newVal) => {
          const valid = conditionFn()
          if (valid && !isValid.value) {
               isValid.value = true
               onboardingStore.incrementSectionCompleted(partIndex)
          } else if (!valid && isValid.value) {
               isValid.value = false
               onboardingStore.decrementSectionCompleted(partIndex)
          }
     }, { immediate: true })

     return { isValid }
}
