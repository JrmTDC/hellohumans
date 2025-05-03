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
          return panelStore.availableModules.filter(
               (m) => m.selected || included.includes(m.id)
          )
     })

     const billableAddOns = computed(() => {
          const included = currentPlan.value?.includedModules || []
          return panelStore.availableModules.filter(
               (m) => m.selected && !included.includes(m.id)
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
          // Si pas d’abonnement actif → autorisé
          if (!panelStore.project?.subscription) return true
          // Sinon → uniquement si modification
          return !isSameAsCurrent.value
     })

     function setPlan(planId: string) {
          selectedPlanId.value = planId
          save()
     }

     function setBillingCycle(cycle: 'month' | 'year') {
          billingCycle.value = cycle
          save()
     }

     function toggleModule(moduleId: string, checked: boolean) {
          const mod = panelStore.availableModules.find((m) => m.id === moduleId)
          if (mod) {
               mod.selected = checked
               save()
          }
     }

     function setModuleChoice(moduleId: string, index: number) {
          const mod = panelStore.availableModules.find((m) => m.id === moduleId)
          if (mod?.multipleChoice && mod.choices) {
               mod.selectedChoiceIndex = index
               save()
          }
     }

     function resetAll() {
          selectedPlanId.value = null
          billingCycle.value = 'month'
          panelStore.plans = []
          panelStore.availableModules = []
          localStorage.removeItem('upgradeStore')
     }

     function save() {
          if (!import.meta.client) return
          const data = {
               selectedPlanId: selectedPlanId.value,
               billingCycle: billingCycle.value,
               modules: panelStore.availableModules.map((m) => ({
                    id: m.id,
                    selected: m.selected,
                    selectedChoiceIndex: m.selectedChoiceIndex ?? 0
               }))
          }
          localStorage.setItem('upgradeStore', JSON.stringify(data))
     }

     function restore() {
          if (!import.meta.client) return
          const raw = localStorage.getItem('upgradeStore')
          if (!raw) return
          try {
               const saved = JSON.parse(raw)
               selectedPlanId.value = saved.selectedPlanId
               billingCycle.value = saved.billingCycle

               for (const m of saved.modules || []) {
                    const mod = panelStore.availableModules.find((am) => am.id === m.id)
                    if (mod) {
                         mod.selected = m.selected
                         mod.selectedChoiceIndex = m.selectedChoiceIndex
                    }
               }
          } catch (e) {
               console.error('Erreur restauration store upgrade:', e)
          }
     }

     return {
          // state
          selectedPlanId,
          billingCycle,

          // getters
          currentPlan,
          selectedAddOns,
          billableAddOns,
          isSameAsCurrent,
          canValidateUpgrade,

          // actions
          setPlan,
          setBillingCycle,
          toggleModule,
          setModuleChoice,
          resetAll,
          save,
          restore
     }
})
