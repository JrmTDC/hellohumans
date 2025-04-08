import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { usePanelApi } from '~/composables/usePanelApi'

export interface UpgradePlan {
     id: string
     name: string
     description: string
     monthlyPrice: number
     discountMonths: number
     includedFeatures: string[]
     baseSubtitle: string
     popular?: boolean
     includedModules?: string[]
}

export interface ModuleAddOn {
     id: string
     name: string
     description: string
     basePrice: number
     discountMonths?: number
     multipleChoice?: boolean
     choices?: Array<{
          label: string
          monthlyPrice: number
          discountMonths?: number
     }>
     selectedChoiceIndex?: number
     selected: boolean
     disabled?: boolean
     comingSoon?: boolean
}

export const useUpgradeStore = defineStore('upgrade', () => {
     const plans = ref<UpgradePlan[]>([])
     const availableModules = ref<ModuleAddOn[]>([])
     const selectedPlanId = ref<string | null>(null)
     const billingCycle = ref<'monthly' | 'annual'>('monthly')

     const currentPlan = computed(() => {
          return plans.value.find(o => o.id === selectedPlanId.value) || null
     })

     const selectedAddOns = computed(() => {
          const included = currentPlan.value?.includedModules || []
          return availableModules.value.filter(m => m.selected || included.includes(m.id))
     })

     const billableAddOns = computed(() => {
          const included = currentPlan.value?.includedModules || []
          return availableModules.value.filter(m => m.selected && !included.includes(m.id))
     })

     async function fetchPlans() {
          const { apiFetch } = usePanelApi()
          const res = await apiFetch('/upgrade/plans')
          plans.value = res.success.plans
     }

     async function fetchModules() {
          const { apiFetch } = usePanelApi()
          const res = await apiFetch('/upgrade/modules')
          availableModules.value = res.success.modules
     }

     function setPlan(planId: string) {
          selectedPlanId.value = planId
          save()
     }

     function setBillingCycle(cycle: 'monthly' | 'annual') {
          billingCycle.value = cycle
          save()
     }

     function toggleModule(moduleId: string, checked: boolean) {
          const mod = availableModules.value.find(m => m.id === moduleId)
          if (mod) {
               mod.selected = checked
               save()
          }
     }

     function setModuleChoice(moduleId: string, index: number) {
          const mod = availableModules.value.find(m => m.id === moduleId)
          if (mod?.multipleChoice && mod.choices) {
               mod.selectedChoiceIndex = index
               save()
          }
     }

     function resetAll() {
          selectedPlanId.value = null
          billingCycle.value = 'monthly'
          availableModules.value = []
          plans.value = []
          localStorage.removeItem('upgradeStore')
     }

     function save() {
          if (import.meta.client) {
               const data = {
                    selectedPlanId: selectedPlanId.value,
                    billingCycle: billingCycle.value,
                    modules: availableModules.value.map(m => ({
                         id: m.id,
                         selected: m.selected,
                         selectedChoiceIndex: m.selectedChoiceIndex ?? 0
                    }))
               }
               localStorage.setItem('upgradeStore', JSON.stringify(data))
          }
     }

     function restore() {
          if (import.meta.client) {
               const raw = localStorage.getItem('upgradeStore')
               if (!raw) return
               try {
                    const saved = JSON.parse(raw)
                    selectedPlanId.value = saved.selectedPlanId
                    billingCycle.value = saved.billingCycle

                    for (const m of saved.modules || []) {
                         const mod = availableModules.value.find(am => am.id === m.id)
                         if (mod) {
                              mod.selected = m.selected
                              mod.selectedChoiceIndex = m.selectedChoiceIndex
                         }
                    }
               } catch (e) {
                    console.error('Erreur restauration store upgrade:', e)
               }
          }
     }

     return {
          // state
          plans,
          availableModules,
          selectedPlanId,
          billingCycle,

          // getters
          currentPlan,
          selectedAddOns,
          billableAddOns,

          // actions
          fetchPlans,
          fetchModules,
          setPlan,
          setBillingCycle,
          toggleModule,
          setModuleChoice,
          resetAll,
          save,
          restore
     }
})
