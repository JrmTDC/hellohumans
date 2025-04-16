<template>
     <div id="app-content" class="w-full h-full overflow-auto fixed left-0 top-0 z-[133] bg-white">
          <div class="flex flex-col justify-start items-[normal] h-full">
               <PanelUpgradeStepperHeader :step="1" @goStep="goStep" @close="closePanel" />

               <div class="flex flex-row justify-start items-start self-stretch flex-grow">
                    <!-- Liste d'offres -->
                    <div class="flex flex-col justify-start items-center flex-grow">
                         <span class="block w-[32px] min-w-[32px] h-[32px] min-h-[32px]"></span>
                         <div class="w-max max-w-none grid gap-x-[12px] gap-y-0 grid-auto-rows-auto grid-cols-[repeat(4,_238px)] p-0 max-[1366px]:grid-cols-[repeat(2,_326px)] max-[1366px]:gap-x-[20px] max-[1366px]:p-0 max-[1366px]:grid-auto-flow-row max-[737px]:flex max-[737px]:flex-col max-[737px]:w-full max-[737px]:min-w-0 max-[737px]:px-[20px] max-[737px]:justify-center">
                              <div class="flex flex-col justify-start items-[normal] self-start">
                                   <span v-if="trialActive" class="uppercase text-[11px] leading-[14px] tracking-[-0.01em] bg-[#dce9ff] text-[#303f9f] px-[6px] py-[3px] rounded-[4px] font-medium self-start">{{ t('panel.pages.upgrade.Index.trialRemainingZero') }}</span>
                                   <h2 class="mt-[8px] mb-0 font-medium text-[28px] leading-[33px] tracking-[-0.01em] text-left">{{ t('panel.pages.upgrade.Index.selectPlan') }}</h2>
                                   <p class="mb-0 mt-[8px] font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-left text-[#647491]"> {{ t('panel.pages.upgrade.Index.choosePlanDescription') }}</p>
                              </div>

                              <div class="flex flex-col justify-start items-[normal] mt-[32px]">
                                   <div
                                        class="w-max max-w-none grid gap-x-[12px] gap-y-0 grid-auto-rows-auto grid-cols-[repeat(4,_238px)] p-0 max-[1366px]:grid-cols-[repeat(2,_326px)] max-[1366px]:gap-x-[20px] max-[1366px]:p-0 max-[1366px]:grid-auto-flow-row max-[737px]:flex max-[737px]:flex-col max-[737px]:w-full max-[737px]:min-w-0 max-[737px]:px-[20px] max-[737px]:justify-center"
                                   >
                                        <!-- Boucle sur store.plans -->
                                        <PanelUpgradePlanCard
                                             v-for="plan in store.plans"
                                             :key="plan.id"
                                             :plan="plan"
                                             :selected="store.selectedPlanId === plan.id"
                                             :billingCycle="store.billingCycle"
                                             @selectPlan="store.setPlan"
                                        />
                                   </div>

                                   <button
                                        class="mt-[16px] rounded-[8px] text-[14px] h-[34px] leading-[18px] min-w-[64px] px-[14px] py-0"
                                   >
                                        <span>{{ t('panel.pages.upgrade.Index.viewAllFeatures') }}</span>
                                   </button>
                              </div>

                              <div class="mt-[32px] flex flex-col justify-start items-center border border-[#e2e8ef] rounded-[16px] p-[20px] mb-[32px]"></div>
                         </div>
                    </div>

                    <!-- Résumé -->
                    <PanelUpgradeSubscriptionSummary
                         :selectedPlan="store.currentPlan"
                         :billingCycle="store.billingCycle"
                         :totalPrice="computedTotalPrice"
                         :selectedModules="store.selectedAddOns"
                         nextButtonLabel="t('panel.pages.upgrade.Index.nextStep')"
                         @updateBillingCycle="store.setBillingCycle"
                         :disableIfZero="false"
                         @goNext="goNext"
                    />
               </div>
          </div>
     </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const store = useUpgradeStore()
const router = useRouter()
const trialActive = ref(false)

onMounted(async () => {
     if (!store.plans.length) await store.fetchPlans()

     store.restore()

     // Si aucune offre sélectionnée, on prend la première
     if (!store.selectedPlanId && store.plans.length) {
          store.setPlan(store.plans[0].id)
     }
})

// Calculer le total (offre sans modules, car modules seront dans l’étape 2)
const computedTotalPrice = computed(() => {
     const plan = store.currentPlan
     if (!plan) return 0
     if (store.billingCycle === 'monthly') {
          return plan.monthlyPrice
     }
     return plan.monthlyPrice * (12 - plan.discountMonths)
})

function goNext() {
     router.push('/panel/upgrade/modules')
}

function goStep(step: number) {
     if (step === 1) {
          // déjà dessus
     } else if (step === 2) {
          if (store.selectedPlanId) {
               router.push('/panel/upgrade/modules')
          }
     } else if (step === 3) {
          // ...
     }
}

function closePanel() {
     router.push('/panel/dashboard')
}
definePageMeta({
     layout: 'panel-empty'
})
usePanelPageMeta( t('panel.pages.upgrade.Index.metaTitle'), t('panel.pages.upgrade.Index.metaDescription'))
</script>
