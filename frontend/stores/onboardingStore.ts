import { defineStore } from 'pinia'
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from '#imports'

interface SectionInfo {
     total: number
     completed: number
}

interface OnboardingAnswers {
     webSite: string
     selectedClientId: string | null
     newClientName: string
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
     const totalSteps = ref(4)

     const submitting = ref(false)

     const stepSections = reactive<Record<number, SectionInfo>>({
          1: { total: 2, completed: 0 },
          2: { total: 3, completed: 0 },
          3: { total: 4, completed: 0 },
          4: { total: 1, completed: 0 }
     })

     const answers = ref<OnboardingAnswers>({
          webSite: '',
          selectedClientId: null,
          newClientName: '',
          serviceModel: '',
          businessModel: '',
          communicationMethods: [],
          selectedActivity: '',
          conversationsPerMonth: '',
          monthlyWebsiteVisitors: '',
          websiteHostingPlatform: '',
          primaryUse: ''
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
          }
     }

     function goPrevious() {
          if (currentStep.value > 1) {
               currentStep.value--
          }
     }

     async function submitOnboarding() {
          const panelStore = usePanelStore()
          submitting.value = true

          try {
               const success = await panelStore.createOnboarding({ ...answers.value })
               if (success) {
                    localStorage.removeItem('onboardingStore')
                    await router.push('/panel/upgrade')
                    return true
               } else {
                    localStorage.removeItem('onboardingStore')
                    await router.push('/panel/onboarding')
                    window.location.reload()
               }
          } catch (err) {
               localStorage.removeItem('onboardingStore')
               await router.push('/panel/onboarding')
               window.location.reload()
          }
     }

     // Sauvegarde locale
     function loadFromStorage() {
          try {
               const raw = localStorage.getItem('onboardingStore')
               if (!raw) return
               const parsed = JSON.parse(raw)

               if (parsed.currentStep) currentStep.value = parsed.currentStep
               if (parsed.stepSections) {
                    for (const [k, v] of Object.entries(parsed.stepSections as Record<number, SectionInfo>)) {
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
               answers: answers.value
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
          submitting,

          // computed
          progressPercent,
          isCurrentStepComplete,

          // actions
          incrementSectionCompleted,
          decrementSectionCompleted,
          goNext,
          goPrevious,
          submitOnboarding
     }
})
