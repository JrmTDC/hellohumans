import { defineStore } from 'pinia'

interface Subscription {
     current_plan_id: string
     current_modules: string[]
     billing_cycle: 'month' | 'year'
}
export const useUpgradeStore = defineStore('upgrade', () => {
     const panelStore = usePanelStore()
     const selectedPlanId = ref<string | null>(null)
     const billingCycle = ref<'month' | 'year'>('month')
     const selectedModules = ref<Record<string, boolean>>({})

     // Initialiser les modules avec leurs états par défaut
     const initSelectedModules = () => {
          // Réinitialiser l'état
          selectedModules.value = {}

          // Si un abonnement existe
          const sub = panelStore.project?.subscription
          if (sub?.current_modules) {
               sub.current_modules.forEach(moduleId => {
                    selectedModules.value[moduleId] = true
               })
          }
          const subCycle = panelStore.project?.subscription?.billing_cycle || 'month'
          if (subCycle) {
               billingCycle.value = subCycle
          }
     }

     // Initialiser les modules au chargement
     onMounted(() => {
          initSelectedModules()
     })

     function isModuleIncluded(module: ModuleAddOn, includedModules: IncludedModules[] | undefined): boolean {
          if (!includedModules || !Array.isArray(includedModules)) return false;
          return includedModules.some(includedModule => includedModule.key === module.key);
     }



     const currentPlan = computed(() =>
          panelStore.plans.find((p) => p.id === selectedPlanId.value) || null
     )

     const selectedAddOns = computed(() => {
          return panelStore.modules.filter((m) => {
               const included = isModuleIncluded(m, currentPlan.value?.includedModules || []);
               return m.selected || included;
          });
     });


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
               // Si le module est inclus dans le plan
               if (isModuleIncluded(mod.key, currentPlan.value?.includedModules)) {
                    mod.selected = true
               } else {
                    mod.selected = checked
                    // Mettre à jour l'état persistant
                    selectedModules.value[moduleId] = checked
               }
          }
     }

     function isModuleSelected(moduleId: string) {
          const mod = panelStore.modules.find((m) => m.id === moduleId)
          return mod ? mod.selected : false
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

     function initialiseStore() {
          const sub = panelStore.project?.subscription as Subscription | null

          billingCycle.value = sub?.billing_cycle ? sub?.billing_cycle : 'month'

          // Si pas d'abonnement, sélectionner le plan le plus populaire
          if (!sub) {
               const popularPlan = panelStore.plans.find(p => p.popular)
               if (popularPlan) {
                    selectedPlanId.value = popularPlan.id
               }
               panelStore.modules.forEach(mod => {
                    mod.selected = false
               })
          }
          // Si abonnement, sélectionner le plan et modules existants
          else {
               selectedPlanId.value = sub.current_plan_id
               // Sélectionner les modules existants
               const currentModules = sub.current_modules || []

               // D'abord vérifier le plan actuel
               const currentPlan = panelStore.plans.find(p => p.id === selectedPlanId.value)

               // Initialiser les modules
               panelStore.modules.forEach(mod => {
                    // Si le module est inclus dans le plan actuel
                    mod.selected = false
                    // Si le module est inclus, il est toujours sélectionné
                    if (isModuleIncluded(mod.key, currentPlan?.includedModules)) {
                         mod.selected = true
                    }
                    // Sinon, on vérifie s'il est dans l'abonnement
                    else {
                         // D'abord vérifier l'état persistant
                         //const persistedState = selectedModules.value[mod.id]

                         mod.selected = currentModules.includes(mod.id)
                         /*
                         if (persistedState !== undefined) {
                              mod.selected = persistedState
                         } else {
                              mod.selected = currentModules.includes(mod.id)
                         }
                         */

                    }
               })
          }
     }
     const agentCounts = ref<Record<string, number>>({})

// Récupère le nombre d'agents pour un plan (ou la valeur « incluse » par défaut)
     function getAgentCount(planId: string, included: number): number {
          return agentCounts.value[planId] ?? included
     }

// Affecte un nombre d'agents pour un plan donné
     function setAgentCount(planId: string, count: number) {
          agentCounts.value[planId] = count
     }

     // Initialisation automatique
     onMounted(() => {

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
          initialiseStore,
          setPlan,
          setBillingCycle,
          toggleModule,
          setModuleChoice,
          isModuleSelected,
          setAgentCount,
          agentCounts,
          getAgentCount,
          resetAll,

     }
})
