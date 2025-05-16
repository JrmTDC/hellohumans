import { defineStore } from 'pinia'

interface Subscription {
     current_plan_id: string
     current_modules: string[]
}
export const useUpgradeStore = defineStore('upgrade', () => {
     const panelStore = usePanelStore()
     const selectedPlanId = ref<string | null>(null)
     const billingCycle = ref<'month' | 'year'>('month')

     const currentPlan = computed(() =>
          panelStore.plans.find((p) => p.id === selectedPlanId.value) || null
     )

     const selectedAddOns = computed(() => {
          const included = currentPlan.value?.includedModules || []
          return panelStore.modules.filter(
               (m) => m.selected || included.includes(m.key)
          )
     })

     const isSameAsCurrent = computed(() => {

          const sub = panelStore.project?.subscription as Subscription | null
          if (!sub) return false // Pas encore d'abonnement

          const currentPlanId = sub.current_plan_id
          const currentModules = sub.current_modules || []

          const selectedModuleIds = selectedAddOns.value.map((m) => m.id)
          const samePlan = selectedPlanId.value === currentPlanId
          const sameModules =
               JSON.stringify([...currentModules].sort()) ===
               JSON.stringify([...selectedModuleIds].sort())

          return samePlan && sameModules


     })

     const canValidateUpgrade = computed(() => {
          // Si pas d'abonnement actif → autorisé
          if (!panelStore.project?.subscription) return true
          // Sinon → uniquement si modification
          return !isSameAsCurrent.value
     })

     function setPlan(planId: string) {
          selectedPlanId.value = planId
     }

     function setBillingCycle(cycle: 'month' | 'year') {
          billingCycle.value = cycle
     }

     function toggleModule(moduleId: string, checked: boolean) {
          const mod = panelStore.modules.find((m) => m.id === moduleId)
          if (mod) {
               mod.selected = checked
          }
     }

     function setModuleChoice(moduleId: string, index: number) {
          const mod = panelStore.modules.find((m) => m.id === moduleId)
          if (mod?.multipleChoice && mod.choices) {
               mod.selectedChoiceIndex = index
          }
     }

     function resetAll() {
          selectedPlanId.value = null
          billingCycle.value = 'month'
          panelStore.plans = []
          panelStore.modules = []
     }

     // Initialisation automatique
     onMounted(() => {
          const sub = panelStore.project?.subscription as Subscription | null
          
          // Si pas d'abonnement, sélectionner le plan le plus populaire
          if (!sub) {
               const popularPlan = panelStore.plans.find(p => p.popular)
               if (popularPlan) {
                    selectedPlanId.value = popularPlan.id
               }
          }
          // Si abonnement, sélectionner le plan et modules existants
          else {
               selectedPlanId.value = sub.current_plan_id
               // Sélectionner les modules existants
               const currentModules = sub.current_modules || []
               panelStore.modules.forEach(mod => {
                    mod.selected = currentModules.includes(mod.key)
               })
          }
     })

     return {
          // state
          selectedPlanId,
          billingCycle,

          // getters
          currentPlan,
          selectedAddOns,
          isSameAsCurrent,
          canValidateUpgrade,

          // actions
          setPlan,
          setBillingCycle,
          toggleModule,
          setModuleChoice,
          resetAll
     }
})
