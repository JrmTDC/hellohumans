import { defineStore } from 'pinia'
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from '#imports'
import { usePanelApi } from '~/composables/usePanelApi'

interface SectionInfo {
     total: number
     completed: number
}

interface ClientAccount {
     id: string
     name: string
}

interface OnboardingAnswers {
     webSite: string
     selectedClientId: string | null
     newClientName: string,
     serviceModel: string,
     businessModel: string,
     communicationMethods: string,
     selectedActivity:string,
     conversationsPerMonth:string,
     monthlyWebsiteVisitors:string,
     websiteHostingPlatform:string,
     primaryUse:string
}

export const useOnboardingStore = defineStore('onboarding', () => {
     const router = useRouter()

     // ----- ÉTAT -----
     const currentStep = ref(1)
     const totalSteps = ref(4)

     const stepSections = reactive<Record<number, SectionInfo>>({
          1: { total: 2, completed: 0 },
          2: { total: 3, completed: 0 },
          3: { total: 4, completed: 0 },
          4: { total: 1, completed: 0 }
     })

     const answers = ref<OnboardingAnswers>({
          selectedClientId: null,
          newClientName: '',
          webSite: '',
          serviceModel:'',
          businessModel: '',
          communicationMethods: '',
          selectedActivity:'',
          conversationsPerMonth:'',
          monthlyWebsiteVisitors:'',
          websiteHostingPlatform:'',
          primaryUse:''
     })

     const clientAccounts = ref<ClientAccount[]>([])
     const createNewClient = ref(false)

     // ----- COMPUTED -----
     const globalSectionsTotal = computed(() => {
          return Object.values(stepSections).reduce((acc, s) => acc + s.total, 0)
     })

     const globalSectionsCompleted = computed(() => {
          return Object.values(stepSections).reduce((acc, s) => acc + s.completed, 0)
     })

     const progressPercent = computed(() => {
          if (globalSectionsTotal.value === 0) return 0
          return Math.round((globalSectionsCompleted.value / globalSectionsTotal.value) * 100)
     })

     const isCurrentStepComplete = computed(() => {
          const step = currentStep.value
          return stepSections[step].completed >= stepSections[step].total
     })

     const selectedClientAccount = computed(() =>
          clientAccounts.value.find((c) => c.id === answers.value.selectedClientId)
     )

     // ----- ACTIONS -----

     function incrementSectionCompleted(step: number) {
          if (stepSections[step].completed < stepSections[step].total) {
               stepSections[step].completed++
          }
     }

     function decrementSectionCompleted(step: number) {
          if (stepSections[step].completed > 0) {
               stepSections[step].completed--
          }
     }

     function goNext() {
          if (currentStep.value < totalSteps.value) {
               currentStep.value++
          } else {
               finishOnboarding()
          }
     }

     function goPrevious() {
          if (currentStep.value > 1) {
               currentStep.value--
          }
     }

     async function finishOnboarding() {
          await router.push('/panel/upgrade')
     }


     // ----- PERSISTANCE -----

     function loadFromStorage() {
          try {
               const raw = localStorage.getItem('onboardingStore')
               if (!raw) return
               const parsed = JSON.parse(raw)

               if (parsed.currentStep) currentStep.value = parsed.currentStep
               if (parsed.stepSections) {
                    const sections = parsed.stepSections as Record<number, SectionInfo>
                    for (const [k, v] of Object.entries(sections)) {
                         const stepNum = Number(k)
                         if (stepSections[stepNum]) {
                              stepSections[stepNum].completed = v.completed
                              stepSections[stepNum].total = v.total
                         }
                    }
               }
               if (parsed.answers) {
                    Object.assign(answers.value, parsed.answers)
               }
          } catch (e) {
               console.warn('Erreur loadFromStorage Onboarding:', e)
          }
     }

     function saveToStorage() {
          const data = {
               currentStep: currentStep.value,
               stepSections: JSON.parse(JSON.stringify(stepSections)),
               answers: answers.value,
          }
          localStorage.setItem('onboardingStore', JSON.stringify(data))
     }

     watch([currentStep, stepSections, answers], () => {
          saveToStorage()
     }, { deep: true })

     loadFromStorage()

     return {
          // state
          currentStep,
          totalSteps,
          stepSections,
          answers,
          clientAccounts,
          createNewClient,

          // computed
          progressPercent,
          globalSectionsTotal,
          globalSectionsCompleted,
          isCurrentStepComplete,
          selectedClientAccount,

          // actions
          incrementSectionCompleted,
          decrementSectionCompleted,
          goNext,
          goPrevious,
          finishOnboarding
     }
})
