type ValidatorFunction = () => boolean
const validatorsMap = new Map<number, Record<number, ValidatorFunction>>()

export function useSection(step: number, sectionIndex: number, validator: ValidatorFunction) {
     const store = useOnboardingStore()

     // Initialisation du map
     if (!validatorsMap.has(step)) {
          validatorsMap.set(step, {})
     }
     validatorsMap.get(step)![sectionIndex] = validator

     const validate = () => {
          const isValid = validator()
          if (isValid) store.incrementSectionCompleted(step)
          else store.decrementSectionCompleted(step)
     }

     // Exécution au montage et sur changement
     onMounted(validate)
     watchEffect(validate)
}

export function getValidatorsMap() {
     return validatorsMap
}
