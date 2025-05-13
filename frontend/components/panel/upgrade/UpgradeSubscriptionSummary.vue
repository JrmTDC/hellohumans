<template>
     <div class="flex flex-col justify-start items-[normal] flex-grow-0 w-[482px] px-[20px] py-[32px] border border-[#e2e8ef] bg-[#f5f7f9] self-stretch flex-shrink-0 max-[1600px]:w-[400px] max-[1600px]:px-[20px] max-[1600px]:py-[32px] max-[1440px]:w-[336px] max-[1366px]:w-[448px] max-[1366px]:px-[40px] max-[1366px]:py-[32px]">
          <div class="flex flex-col justify-start items-[normal] sticky top-[96px]">
               <p class="text-[18px] font-medium mb-0">{{ t('panel.components.upgrade.subscriptionSummary.title') }}</p>

               <div class="mt-[20px] flex flex-row justify-center items-center bg-[#e5e7f7] px-[20px] py-[16px] rounded-[12px]">
                    <svgo-panel-upgrade-icon-diamon class="min-w-[24px] min-h-[24px] h-[24px] w-[24px] fill-[#303f9f]"/>
                    <p class="mt-0 mb-0 text-[14px] leading-[18px] tracking-[-0.01em] text-[#151c46] ml-[8px]">
                         <strong>{{ t('panel.components.upgrade.subscriptionSummary.highlight') }}</strong> {{ t('panel.components.upgrade.subscriptionSummary.highlightFull') }}</p>
               </div>

               <!-- Choix de cycle -->
               <p class="text-[12px] text-[#647491] mt-[20px] mb-0 font-medium">{{ t('panel.components.upgrade.subscriptionSummary.billingLabel') }}</p>
               <div class="flex items-center mt-[20px]">
                    <label class="flex items-center cursor-pointer">
                         <input type="radio" value="month" v-model="billingCycleLocal" class="hidden" />
                         <span v-if="billingCycleLocal === 'month'" class="w-[20px] h-[20px] rounded-full bg-[#0566ff] border-[6px] border-[#0566ff] shadow-[inset_0_0_0_4px_#fff]"></span>
                         <span v-else class="w-[20px] h-[20px] rounded-full border-[2px] border-[#647491]"></span>
                         <span class="ml-[8px]">{{ t('panel.components.upgrade.subscriptionSummary.billingMonthly') }}</span>
                    </label>

                    <!-- si désactivé, on affiche le tooltip -->
                             <PanelCommonTooltip
                                 v-if="disableAnnual"
                                 text="L’option annuelle n’est pas disponible sur cette offre."
                                  placement="top"
                                  variant="white"
                                  arrow
                             >
                               <label class="flex items-center ml-[32px] cursor-not-allowed opacity-50">
                                    <input type="radio" value="year" v-model="billingCycleLocal" class="hidden" disabled />
                                    <span class="w-[20px] h-[20px] rounded-full border-[2px] border-[#647491]"></span>
                                    <span class="ml-[8px]">{{ t('panel.components.upgrade.subscriptionSummary.billingAnnual') }}</span>
                               </label>
                             </PanelCommonTooltip>
                             <!-- sinon fonctionnement normal -->
                             <label v-else class="flex items-center ml-[32px] cursor-pointer">
                                  <input type="radio" value="year" v-model="billingCycleLocal" class="hidden" />
                                  <span v-if="billingCycleLocal === 'year'" class="w-[20px] h-[20px] rounded-full bg-[#0566ff] border-[6px] border-[#0566ff] shadow-[inset_0_0_0_4px_#fff]"></span>
                                  <span v-else class="w-[20px] h-[20px] rounded-full border-[2px] border-[#647491]"></span>
                                  <span class="ml-[8px]">{{ t('panel.components.upgrade.subscriptionSummary.billingAnnual') }}</span>
                    <span class="ml-[8px] text-[9px] bg-[#501cd8] text-white px-[4px] py-[2px] rounded">
                   {{ t('panel.components.upgrade.subscriptionSummary.billingDiscountBadge') }}
              </span>
                             </label>
               </div>

               <div class="bg-[#e2e8ef] h-px w-full mt-[20px]"></div>

               <!-- Offre sélectionnée -->
               <div class="mt-[20px]">
                    <p class="text-[12px] text-[#647491] font-medium mb-[16px]">{{ t('panel.components.upgrade.subscriptionSummary.planLabel') }}</p>
                    <div v-if="selectedPlan">
                         <div class="flex justify-between items-center">
                              <h2 class="text-[16px] font-medium">{{ selectedPlan.name }}</h2>
                              <div>
                                   <template v-if="isCurrentPlan">
                                        <span class="text-[14px] font-medium">Offre actuelle</span>
                                   </template>
                                   <template v-else>
                                        <span class="text-[14px] font-medium">{{ planPrice }} €</span>
                                        <span class="text-[14px] text-[#080f1a] font-medium">
                                             {{ billingCycleLocal === 'month' ? '/mois' : '/an' }}
                                        </span>
                                   </template>
                              </div>
                         </div>
                         <p class="text-[14px] text-[#647491] mt-[4px]">{{ firstFeature }}</p>
                    </div>
                    <div v-else>
                         <p class="text-[14px] text-[#647491]">{{ t('panel.components.upgrade.subscriptionSummary.planNoneSelected') }}</p>
                    </div>
               </div>

               <div class="bg-[#e2e8ef] h-px w-full mt-[20px]"></div>

               <!-- Modules sélectionnés / inclus -->
               <div v-if="showModules && selectedModules.length > 0" class="mt-[20px]">
                    <p class="text-[12px] font-medium text-[#647491]">{{ t('panel.components.upgrade.subscriptionSummary.modulesLabel') }}</p>
                    <div v-for="mod in selectedModules" :key="mod.id" class="mt-[16px] flex flex-col">
                         <div class="flex justify-between items-center">
                              <h2 class="text-[16px] font-medium">{{ mod.name }}</h2>
                              <div>
                                   <span v-if="selectedPlan?.includedModules?.includes(mod.key)" class="text-[14px] font-medium text-[#0566ff]">{{ t('panel.components.upgrade.subscriptionSummary.included') }}</span>
                                   <span v-else>
                                        <span class="text-[14px] font-medium">{{ modulePrice(mod) }} €</span>
                                        <span class="text-[14px] font-medium">{{ billingCycleLocal === 'month' ? '/mois' : '/an' }}</span>
                                   </span>
                              </div>
                         </div>
                         <p class="text-[14px] text-[#647491] mt-[4px]">{{ mod.description }}</p>
                    </div>
                    <div class="bg-[#e2e8ef] h-px w-full mt-[20px]"></div>
               </div>

               <!-- Total -->
               <div class="mt-[20px] flex justify-between items-center">
                    <h2 class="text-[20px] font-medium">{{ t('panel.components.upgrade.subscriptionSummary.totalLabel') }}</h2>
                    <div>
                         <span class="text-[20px] font-medium">{{ totalPriceLocal }} €</span>
                         <span class="text-[14px] font-medium">{{ billingCycleLocal === 'month' ? t('panel.components.upgrade.subscriptionSummary.perMonth') : t('panel.components.upgrade.subscriptionSummary.perYear') }}</span>
                    </div>
               </div>

               <!-- Bouton final -->
               <div class="mt-[20px]">
                    <button
                         :disabled="!selectedPlan || (disableIfZero && totalPriceLocal <= 0)"
                         @click="goNext"
                         :class="['rounded-[8px] text-[18px] h-[46px] px-[20px] w-full text-white font-medium',(!selectedPlan || (disableIfZero && totalPriceLocal <= 0)) ? 'bg-[#eff2f6] text-[#acb8cb] cursor-not-allowed' : 'bg-[#0566ff] hover:bg-[#0049bd]']">
                         {{ nextButtonLabel }}
                    </button>
                    <p class="text-[14px] text-[#647491] text-center mt-[8px]">{{ t('panel.components.upgrade.subscriptionSummary.changeOrCancelInfo') }}</p>
               </div>
          </div>
     </div>
</template>
<script setup lang="ts">
const { t } = useI18n()
interface Plan {
     id: string
     name: string
     monthlyPrice: number
     discountMonths: number
     includedFeatures: string[]
}

interface ChoiceOption {
     label: string
     monthlyPrice: number
     discountMonths?: number
}
interface ModuleAddOn {
     id: string
     name: string
     description: string
     basePrice: number
     discountMonths?: number
     multipleChoice?: boolean
     choices?: ChoiceOption[]
     selectedChoiceIndex?: number
     selected: boolean
}

// Props
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

const billingCycleLocal = computed<'month'|'year'>({
     get() {
          return props.billingCycle
     },
     set(val) {
          if (val !== props.billingCycle) {
               emit('updateBillingCycle', val)
          }
     }
})


const showModules = computed(() => props.showModules)
const totalPriceLocal = computed(() => props.totalPrice)
const nextButtonLabel = computed(() => props.nextButtonLabel || t('panel.components.upgrade.subscriptionSummary.defaultButtonLabel'))

const planPrice = computed(() => {
     if (!props.selectedPlan) return 0
     const { monthlyPrice, discountMonths } = props.selectedPlan
     return billingCycleLocal.value === 'month'
          ? monthlyPrice
          : monthlyPrice * (12 - discountMonths)
})

const firstFeature = computed(() => {
     if (!props.selectedPlan?.includedFeatures.length) return ''
     return props.selectedPlan.includedFeatures[0]
})

function modulePrice(mod: ModuleAddOn): number {
     const isIncluded = props.selectedPlan?.includedModules?.includes(mod.key)
     if (isIncluded) return 0

     if (mod.multipleChoice && mod.choices && mod.selectedChoiceIndex != null) {
          const choice = mod.choices[mod.selectedChoiceIndex]
          const disc = choice.discountMonths ?? 0
          return billingCycleLocal.value === 'month'
               ? choice.monthlyPrice
               : choice.monthlyPrice * (12 - disc)
     } else {
          const disc = mod.discountMonths ?? 0
          return billingCycleLocal.value === 'month'
               ? mod.basePrice
               : mod.basePrice * (12 - disc)
     }
}

// détecte si le plan sélectionné est l’abonnement en cours
const panelStore = usePanelStore()
const isCurrentPlan = computed(() =>
     props.selectedPlan?.id === panelStore.project?.subscription?.current_plan_id
)


// Désactive l’option annuelle pour les plans “Gratuit” et “Plus”
const disableAnnual = computed(() =>
          ['Gratuit', 'Plus'].includes(props.selectedPlan?.name || '')
);
// Si on désactive l’annuel et qu’il était sélectionné, repasser au mensuel
watch(disableAnnual, (off) => {
     if (off && billingCycleLocal.value === 'year') {
          billingCycleLocal.value = 'month'
     }
});

function goNext() {
     emit('goNext')
}
</script>
