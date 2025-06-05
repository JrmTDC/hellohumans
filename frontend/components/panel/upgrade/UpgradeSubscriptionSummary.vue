<template>
     <div
          class="flex flex-col justify-start items-[normal] flex-grow-0 w-[482px]
           px-[20px] py-[32px] border border-[#e2e8ef] bg-[#f5f7f9]
           self-stretch flex-shrink-0
           max-[1600px]:w-[400px] max-[1600px]:px-[20px] max-[1600px]:py-[32px]
           max-[1440px]:w-[336px]
           max-[1366px]:w-[448px] max-[1366px]:px-[40px] max-[1366px]:py-[32px]"
     >
          <div class="flex flex-col justify-start items-[normal] sticky top-[96px]">
               <p class="text-[18px] font-medium mb-0">
                    {{ t('panel.components.upgrade.subscriptionSummary.title') }}
               </p>

               <!-- Encadré “Diamant” -->
               <div
                    class="mt-[20px] flex flex-row justify-center items-center
               bg-[#e5e7f7] px-[20px] py-[16px] rounded-[12px]"
               >
                    <svgo-panel-upgrade-icon-diamon
                         class="min-w-[24px] min-h-[24px] h-[24px] w-[24px] fill-[#303f9f]"
                    />
                    <p class="mt-0 mb-0 text-[14px] leading-[18px] tracking-[-0.01em] text-[#151c46] ml-[8px]">
                         <strong>
                              {{ t('panel.components.upgrade.subscriptionSummary.highlight') }}
                         </strong>
                         {{ t('panel.components.upgrade.subscriptionSummary.highlightFull') }}
                    </p>
               </div>

               <!-- Choix du cycle de facturation avec badge “(mensuel)” ou “(annuel)” -->
               <p class="text-[12px] text-[#647491] mt-[20px] mb-0 font-medium">
                    FACTURÉ
                    <template v-if="panelStore.project?.subscription?.billing_cycle && panelStore.project?.subscription?.billing_cycle != upgradeStore.billingCycle">
                         <span
                              class="bg-[#dbe9ff] text-[#0766ff] py-[4px] px-[7px] rounded-[5px] text-[11px] ml-[10px]"
                         >
                              {{ panelStore.project.subscription.billing_cycle === 'year' ? 'Anciennement annuel' : 'Anciennement mensuel' }}
                         </span>
                    </template>
               </p>
               <div class="flex items-center mt-[20px]">
                    <!-- Mensuel -->
                    <label class="flex items-center cursor-pointer">
                         <input type="radio" value="month" v-model="billingCycleLocal" class="hidden" />
                         <span
                              v-if="billingCycleLocal === 'month'"
                              class="w-[20px] h-[20px] rounded-full bg-[#0566ff]
                   border-[6px] border-[#0566ff] shadow-[inset_0_0_0_4px_#fff]"
                         ></span>
                         <span
                              v-else
                              class="w-[20px] h-[20px] rounded-full border-[2px] border-[#647491]"
                         ></span>
                         <span class="ml-[8px]">
                              {{ t('panel.components.upgrade.subscriptionSummary.billingMonthly') }}
                         </span>
                    </label>

                    <!-- Annuel (désactivable) -->
                    <PanelCommonTooltip
                         v-if="disableAnnual"
                         text="L’option annuelle n’est pas disponible sur cette offre."
                         placement="top"
                         variant="white"
                         arrow
                    >
                         <label class="flex items-center ml-[32px] cursor-not-allowed opacity-50">
                              <input
                                   type="radio"
                                   value="year"
                                   v-model="billingCycleLocal"
                                   class="hidden"
                                   disabled
                              />
                              <span class="w-[20px] h-[20px] rounded-full border-[2px] border-[#647491]"></span>
                              <span class="ml-[8px]">
                                   {{ t('panel.components.upgrade.subscriptionSummary.billingAnnual') }}
                              </span>
                         </label>
                    </PanelCommonTooltip>
                    <label v-else class="flex items-center ml-[32px] cursor-pointer">
                         <input type="radio" value="year" v-model="billingCycleLocal" class="hidden" />
                         <span
                              v-if="billingCycleLocal === 'year'"
                              class="w-[20px] h-[20px] rounded-full bg-[#0566ff]
                   border-[6px] border-[#0566ff] shadow-[inset_0_0_0_4px_#fff]"
                         ></span>
                         <span
                              v-else
                              class="w-[20px] h-[20px] rounded-full border-[2px] border-[#647491]"
                         ></span>
                         <span class="ml-[8px]">
                              {{ t('panel.components.upgrade.subscriptionSummary.billingAnnual') }}
                         </span>
                         <span class="ml-[8px] text-[9px] bg-[#501cd8] text-white px-[4px] py-[2px] rounded">
                              {{ t('panel.components.upgrade.subscriptionSummary.billingDiscountBadge') }}
                         </span>
                    </label>
               </div>

               <div class="bg-[#e2e8ef] h-px w-full mt-[20px]"></div>

               <!-- Section “Offre sélectionnée” -->
               <div class="mt-[20px]">
                    <p class="text-[12px] text-[#647491] font-medium mb-[16px]">
                         {{ t('panel.components.upgrade.subscriptionSummary.planLabel') }}
                    </p>
                    <div v-if="selectedPlan">
                         <div class="flex justify-between items-center">
                              <div class="flex items-center">
                                   <h2 class="text-[16px] font-medium">{{ selectedPlan.name }}</h2>
                                   <template v-if="isCurrentPlan">
                                        <span
                                             class="bg-[#dbe9ff] text-[#0766ff] py-[4px] px-[7px]
                         rounded-[5px] text-[11px] ml-[10px]"
                                        >
                                             Offre actuelle
                                        </span>
                                   </template>
                              </div>
                              <div>
                                   <span class="text-[14px] font-medium">{{ planPrice }} €</span>
                                   <span class="text-[14px] text-[#080f1a] font-medium">
                                        {{ billingCycleLocal === 'month' ? '/mois' : '/an' }}
                                   </span>
                              </div>
                         </div>
                         <p class="text-[14px] text-[#647491] mt-[4px]">{{ firstFeature }}</p>
                    </div>
                    <div v-else>
                         <p class="text-[14px] text-[#647491]">
                              {{ t('panel.components.upgrade.subscriptionSummary.planNoneSelected') }}
                         </p>
                    </div>
               </div>

               <div class="bg-[#e2e8ef] h-px w-full mt-[20px]"></div>

               <!-- Section “Modules” (si showModules est vrai) -->
               <div v-if="showModules && selectedModules.length > 0" class="mt-[20px]">
                    <p class="text-[12px] font-medium text-[#647491]">
                         {{ t('panel.components.upgrade.subscriptionSummary.modulesLabel') }}
                    </p>
                    <div v-for="mod in selectedModules" :key="mod.id" class="mt-[16px] flex flex-col">
                         <div class="flex justify-between items-center">
                              <div class="flex items-center">
                                   <h2 class="text-[16px] font-medium">{{ mod.name }}</h2>
                                   <template v-if="panelStore.project?.subscription?.current_modules.includes(mod.id)">
                                        <span
                                             class="bg-[#dbe9ff] text-[#0766ff] py-[4px] px-[7px]
                         rounded-[5px] text-[11px] ml-[10px] font-medium"
                                        >
                                             Offre actuelle
                                        </span>
                                   </template>
                              </div>
                              <div>
                                   <span
                                        v-if="selectedPlan?.includedModules?.includes(mod.key)"
                                        class="bg-[#dbe9ff] text-[#0766ff] py-[4px] px-[7px]
                       rounded-[5px] text-[12px] ml-[10px]"
                                   >
                                        {{ t('panel.components.upgrade.subscriptionSummary.included') }}
                                   </span>
                                   <span v-else>
                                        <span class="text-[14px] font-medium">{{ modulePrice(mod) }} €</span>
                                        <span class="text-[14px] font-medium">
                                             {{ billingCycleLocal === 'month' ? '/mois' : '/an' }}
                                        </span>
                                   </span>
                              </div>
                         </div>
                    </div>
                    <div class="bg-[#e2e8ef] h-px w-full mt-[20px]"></div>
               </div>

               <!-- Total -->
               <div class="mt-[20px] flex justify-between items-center">
                    <h2 class="text-[20px] font-medium">
                         {{ t('panel.components.upgrade.subscriptionSummary.totalLabel') }}
                    </h2>
                    <div>
                         <span class="text-[20px] font-medium">{{ totalPriceLocal }} €</span>
                         <span class="text-[14px] font-medium">
                              {{
                                   billingCycleLocal === 'month'
                                        ? t('panel.components.upgrade.subscriptionSummary.perMonth')
                                        : t('panel.components.upgrade.subscriptionSummary.perYear')
                              }}
                         </span>
                    </div>
               </div>

               <!-- Bouton “Suivant” (et/ou “Valider”) -->
               <div class="mt-[20px]">
                    <button
                         :disabled="buttonDisabled"
                         @click="goNext"
                         :class="['rounded-[8px] text-[18px] h-[46px] px-[20px] w-full  font-medium', buttonDisabled
                         ? 'bg-[#eff2f6] text-[#acb8cb] cursor-not-allowed'
                         : 'bg-[#0566ff] hover:bg-[#0049bd] text-white']">
                         {{ nextButtonLabel }}
                    </button>
                    <p class="text-[14px] text-[#647491] text-center mt-[8px]">
                         {{ t('panel.components.upgrade.subscriptionSummary.changeOrCancelInfo') }}
                    </p>
               </div>
          </div>
     </div>
</template>

<script setup lang="ts">
import { computed, watch, nextTick } from 'vue'

const { t } = useI18n()

// Interfaces
interface Plan {
     id: string
     name: string
     price_month: number
     price_year: number
     includedFeatures: string[]
     billingYear: boolean
     includedModules?: string[]
}
interface ChoiceOption {
     label: string
     monthlyPrice: number
     discountMonths?: number
}
interface ModuleAddOn {
     id: string
     key: string
     name: string
     description: string
     price_month: number
     price_year: number
     multipleChoice?: boolean
     choices?: ChoiceOption[]
     selectedChoiceIndex?: number
     selected: boolean
}

// Props reçues depuis le parent
const props = defineProps<{
     selectedPlan: Plan | null
     billingCycle: 'month' | 'year'
     selectedModules: ModuleAddOn[]
     showModules?: boolean
     totalPrice: number
     nextButtonLabel?: string
     disableIfZero?: boolean
}>()

const emit = defineEmits(['updateBillingCycle', 'goNext'])
const upgradeStore = useUpgradeStore()
const panelStore = usePanelStore()

const currentBillingCycle = computed(() =>
     panelStore.project?.subscription?.billing_cycle || 'month'
)

// data local
const billingCycleLocal = computed<'month' | 'year'>({
     get() {
          return props.billingCycle
     },
     set(val) {
          if (val !== props.billingCycle) {
               emit('updateBillingCycle', val)
          }
     }
})


// On regroupe les modules à afficher (ceux inclus + cochés)
const selectedModules = computed(() => {
     const selected = props.selectedModules
     const subModules = panelStore.project?.subscription?.current_modules || []
     return selected.filter((mod) => {
          const isIncludedInPlan = props.selectedPlan?.includedModules?.includes(mod.key) || false
          if (isIncludedInPlan) return true
          return mod.selected
     })
})

// Est-ce qu’on affiche la section “Modules” ?
const showModules = computed(() => props.showModules)

// Prix du plan
const planPrice = computed(() => {
     if (!props.selectedPlan) return 0
     const { price_month, price_year } = props.selectedPlan
     return billingCycleLocal.value === 'month'
          ? price_month
          : price_year
})

// Prix total (plan + modules)
const totalPriceLocal = computed(() => {
     let total = planPrice.value
     for (const mod of props.selectedModules) {
          total += modulePrice(mod)
     }
     return total
})

// Première feature du plan
const firstFeature = computed(() => {
     if (!props.selectedPlan?.includedFeatures.length) return ''
     return props.selectedPlan.includedFeatures[0]
})

// Calcul du prix d’un module
function modulePrice(mod: ModuleAddOn): number {
     const isIncluded = props.selectedPlan?.includedModules?.includes(mod.key)
     if (isIncluded) return 0
     return billingCycleLocal.value === 'month'
          ? mod.price_month
          : mod.price_year

}

// Est-ce que le plan affiché est l’abonnement en cours ?
const isCurrentPlan = computed(() =>
     props.selectedPlan?.id === panelStore.project?.subscription?.current_plan_id
)

// Bloquer l’annuel si le plan ne le supporte pas
const disableAnnual = computed(() =>
     !props.selectedPlan?.billingYear
)
watch(disableAnnual, (off) => {
     if (off && billingCycleLocal.value === 'year') {
          billingCycleLocal.value = 'month'
     }
})

// LOGIQUE DU BOUTON
const buttonDisabled = computed(() => {
     // SI on est dans l’étape “PLANS” (showModules===false)
     if (!showModules.value) {
          return !props.selectedPlan || (props.disableIfZero && totalPriceLocal.value <= 0)
     }

     // SI on est dans l’étape “MODULES” (showModules===true)
     const currentCycle = panelStore.project?.subscription?.billing_cycle
     const cycleChanged = billingCycleLocal.value !== currentCycle
     // Si aucun plan n'est sélectionné ou prix à zéro, on désactive
     if (!props.selectedPlan || (props.disableIfZero && totalPriceLocal.value <= 0)) {
          return true
     }
     // Si ni le plan/modules n'ont changé ET que le cycle n'a pas changé, on désactive
     if (!cycleChanged && upgradeStore.isSameAsCurrent) {
          return true
     }
     // Sinon, on autorise
     return false
})

// Si vous voulez un libellé différent pour le bouton selon l’étape, vous pouvez aussi faire :
const nextButtonLabelComputed = computed(() => {
     if (!showModules.value) {
          return props.nextButtonLabel || t('panel.components.upgrade.subscriptionSummary.nextStepLabel')
     } else {
          return props.nextButtonLabel || t('panel.components.upgrade.subscriptionSummary.finishLabel')
     }
})

function goNext() {
     emit('goNext')
}
</script>
