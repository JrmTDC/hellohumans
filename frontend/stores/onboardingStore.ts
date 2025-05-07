import { defineStore } from 'pinia'

interface SectionInfo {
     total: number
     completed: number
}
//organizationName: string,
interface OnboardingAnswers {
     webSite: string
     organizationId: string | null
     organizationName: string,
     organizationType: string,
     serviceModel: string
     businessModel: string
     communicationMethods: string[]
     selectedActivity: string
     conversationsPerMonth: string
     monthlyWebsiteVisitors: string
     websiteHostingPlatform: string
     primaryUse: string
}

export const useOnboardingStore = defineStore('onboarding', () => {
     const router = useRouter()

     const currentStep = ref(1)
     const disabledRedirect = ref(false)
     const totalSteps = 4
     const isInitialized = ref(false)
     const submitting = ref(false)
     const createMode = ref(false)

     const stepSections = reactive<Record<number, SectionInfo>>({
          1: { total: 2, completed: 0 },
          2: { total: 3, completed: 0 },
          3: { total: 4, completed: 0 },
          4: { total: 1, completed: 0 },
     })

     const answers = ref<OnboardingAnswers>({
          webSite: '',
          organizationId: null,
          organizationName: '',
          organizationType:'',
          serviceModel: '',
          businessModel: '',
          communicationMethods: [],
          selectedActivity: '',
          conversationsPerMonth: '',
          monthlyWebsiteVisitors: '',
          websiteHostingPlatform: '',
          primaryUse: '',
     })

     const progressPercent = computed(() => {
          const total = Object.values(stepSections).reduce((sum, s) => sum + s.total, 0)
          const done = Object.values(stepSections).reduce((sum, s) => sum + s.completed, 0)
          return total === 0 ? 0 : Math.round((done / total) * 100)
     })

     const isCurrentStepComplete = computed(() => {
          const step = currentStep.value
          return stepSections[step].completed >= stepSections[step].total
     })

     const validators: Record<number, Record<number, () => boolean>> = {
          1: {
               1: () => {
                    const { organizationId, organizationName, organizationType } = answers.value
                    const panel = usePanelStore()
                    const isValidClient = !!panel.clients.find((c) => c.id === organizationId)
                    return isValidClient || (organizationName.trim().length > 0 && organizationType.trim().length > 0)
               },
               2: () => {
                    const { webSite } = answers.value
                    return /^(https?:\/\/)?([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/.test(webSite)
               },
          },
          2: {
               1: () => !!answers.value.serviceModel,
               2: () => answers.value.communicationMethods.length > 0,
               3: () => !!answers.value.businessModel,
          },
          3: {
               1: () => !!answers.value.selectedActivity,
               2: () => !!answers.value.conversationsPerMonth,
               3: () => !!answers.value.monthlyWebsiteVisitors,
               4: () => !!answers.value.websiteHostingPlatform,
          },
          4: {
               1: () => !!answers.value.primaryUse,
          },
     }

     function validateSections(step: number) {
          const validations = validators[step]
          let completed = 0
          for (const key in validations) {
               if (validations[key as unknown as number]()) {
                    completed++
               }
          }
          stepSections[step].completed = completed
     }

     function redirectIfInvalid() {
          if(!disabledRedirect) {
               for (const [stepStr, section] of Object.entries(stepSections)) {
                    if (section.completed < section.total) {
                         currentStep.value = Number(stepStr)
                         return
                    }
               }
          }
     }

     function goNext() {
          validateSections(currentStep.value)
          if (isCurrentStepComplete.value && currentStep.value < totalSteps) {
               currentStep.value++
          }
     }

     function goPrevious() {
          if (currentStep.value > 1) {
               currentStep.value--
          }
     }

     async function submitOnboarding() {
          submitting.value = true
          const panelStore = usePanelStore()
          validateSections(currentStep.value)

          try {
               const success = await panelStore.createOnboarding({ ...answers.value })

               if (success) {
                    resetStore()
                    await router.push('/panel/upgrade')
               } else {
                    resetStore()
                    window.location.reload()
               }
          } catch (error) {
               resetStore()
               window.location.reload()
          }
     }

     function resetStore() {
          const wasCreatingNew = createMode.value
          currentStep.value = 1
          submitting.value = false
          disabledRedirect.value = false
          Object.assign(answers.value, {
               webSite: '',
               organizationId: null,
               organizationName: '',
               serviceModel: '',
               businessModel: '',
               communicationMethods: [],
               selectedActivity: '',
               conversationsPerMonth: '',
               monthlyWebsiteVisitors: '',
               websiteHostingPlatform: '',
               primaryUse: '',
          })

          Object.keys(stepSections).forEach((step) => {
               stepSections[Number(step)].completed = 0
          })

          localStorage.removeItem('onboardingStore')
          createMode.value = wasCreatingNew
     }
     function incrementSectionCompleted(step: number) {
          const section = stepSections[step]
          if (!section) return
          if (section.completed < section.total) {
               section.completed++
          }
     }

     function decrementSectionCompleted(step: number) {
          const section = stepSections[step]
          if (!section) return
          if (section.completed > 0) {
               section.completed--
          }
     }
     function prepareNewFromDashboard(data: { webSite?: string, newClient?: boolean }) {
          resetStore()
          currentStep.value = 1
          disabledRedirect.value = true
          if(data.webSite){
               answers.value.webSite = data.webSite
               createMode.value = false
          }
          if(data.newClient){
               answers.value.organizationId = null
               answers.value.organizationName = ''
               answers.value.organizationType = ''
               createMode.value = true
          }
          saveToStorage()
     }

     function autoSelectClient() {
          const panel = usePanelStore()

          // Si on est en mode création, on ne sélectionne pas automatiquement le client
          if (createMode.value) return

          const noClientSelected = !answers.value.organizationId && !answers.value.organizationName
          const validClient = panel.client?.id && panel.clients.some(c => c.id === panel.client?.id)

          if (noClientSelected && validClient) {
               answers.value.organizationId = panel.client?.id ?? null
          }
     }

     function initialize() {
          try {
               const raw = localStorage.getItem('onboardingStore')
               if (!raw) {
                    autoSelectClient()
                    return
               }
               const parsed = JSON.parse(raw)

               if (parsed.currentStep) currentStep.value = parsed.currentStep
               if (parsed.disabledRedirect) disabledRedirect.value = parsed.disabledRedirect
               if (parsed.answers) Object.assign(answers.value, parsed.answers)

               autoSelectClient()

               for (const [step, _] of Object.entries(stepSections)) {
                    validateSections(Number(step))
               }

               redirectIfInvalid()
          } catch (e) {
               console.warn('Erreur onboardingStore.initialize():', e)
          }
          finally {
               isInitialized.value = true
          }
     }

     watch(
          () => answers.value,
          () => {
               if (!isInitialized.value) return
               for (let step = 1; step <= totalSteps; step++) {
                    validateSections(step)
               }
               saveToStorage()
          },
          { deep: true }
     )

     function saveToStorage() {
          const data = {
               currentStep: currentStep.value,
               answers: answers.value,
          }
          localStorage.setItem('onboardingStore', JSON.stringify(data))
     }

     return {
          currentStep,
          totalSteps,
          submitting,
          createMode,
          stepSections,
          answers,
          progressPercent,
          isCurrentStepComplete,
          incrementSectionCompleted,
          decrementSectionCompleted,
          validateSections,
          redirectIfInvalid,
          goNext,
          goPrevious,
          submitOnboarding,
          resetStore,
          autoSelectClient,
          prepareNewFromDashboard,
          initialize,
     }
})
