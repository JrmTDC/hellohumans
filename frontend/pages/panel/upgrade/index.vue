<template>
     <div id="app-content" class="w-full h-full overflow-auto fixed left-0 top-0 z-[133] bg-white">
          <div class="flex flex-col justify-start items-[normal] h-full">
               <PanelUpgradeStepperHeader :step="1" @goStep="goStep" @close="closePanel" />

               <div class="flex flex-row justify-start items-start self-stretch flex-grow">
                    <!-- Liste d'offres -->
                    <div class="flex flex-col justify-start items-center flex-grow">
                         <span class="block w-[32px] min-w-[32px] h-[32px] min-h-[32px]"></span>
                         <div class="flex flex-col justify-start items-[normal] w-min max-[1366px]:w-[672px] max-[737px]:w-min">
                              <div class="flex flex-col justify-start items-[normal] self-start">
                                   <span v-if="trialActive" class="uppercase text-[11px] leading-[14px] tracking-[-0.01em] bg-[#dce9ff] text-[#303f9f] px-[6px] py-[3px] rounded-[4px] font-medium self-start">{{ t('panel.pages.upgrade.index.trialRemainingZero') }}</span>
                                   <h2 class="mt-[8px] mb-0 font-medium text-[28px] leading-[33px] tracking-[-0.01em] text-left">{{ t('panel.pages.upgrade.index.selectPlan') }}</h2>
                                   <p class="mb-0 mt-[8px] font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-left text-[#647491]"> {{ t('panel.pages.upgrade.index.choosePlanDescription') }}</p>
                              </div>

                              <div class="flex flex-col justify-start items-[normal] mt-[32px]">
                                   <div
                                        class="w-max max-w-none grid gap-x-[12px] grid-cols-[repeat(4,_238px)] auto-rows-fr items-stretch
                                        max-[1366px]:grid-cols-[repeat(2,_326px)]
                                        max-[737px]:flex max-[737px]:flex-col max-[737px]:w-full max-[737px]:min-w-0 max-[737px]:px-[20px] max-[737px]:justify-center"
                                   >

                                   <!-- Boucle sur store.plans -->
                                        <PanelUpgradePlanCard
                                             v-for="(plan, index) in panelStore.plans"
                                             :key="plan.id"
                                             :plan="plan"
                                             :selected="upgradeStore.selectedPlanId === plan.id"
                                             :billingCycle="upgradeStore.billingCycle"
                                             :index="index"
                                             @selectPlan="upgradeStore.setPlan"
                                        />
                                   </div>

                                   <button class="mt-[16px] rounded-[8px] text-[14px] h-[34px] leading-[18px] min-w-[64px] px-[14px] py-0 "><span>{{ t('panel.pages.upgrade.index.viewAllFeatures') }}</span></button>
                              </div>

                              <div class="mt-[32px] flex flex-col justify-start items-center border border-[#e2e8ef] rounded-[16px] p-[20px] mb-[32px]">
                                   <div class="bg-[#ffdda7] rounded-[10px] w-[40px] h-[40px] flex justify-center items-center">
                                        <svgo-panel-upgrade-icon-bulb class="w-[24px] h-[24px] fill-[#d48200]" />
                                   </div>
                                   <span class="block w-[12px] min-w-[12px] h-[12px] min-h-[12px]"></span>
                                   <h2 class="mt-0 mb-0 font-medium text-[16px] leading-[20px] tracking-[-0.01em]">{{ t('panel.pages.upgrade.index.helpTitle') }}</h2>
                                   <span class="block w-[4px] min-w-[4px] h-[4px] min-h-[4px]"></span>
                                   <p class="mt-0 mb-0 font-normal text-[12px] leading-[16px] tracking-[-0.01em] text-[#647491]">{{ t('panel.pages.upgrade.index.helpDescription') }}</p>
                                   <span class="block w-[16px] min-w-[16px] h-[16px] min-h-[16px]"></span>
                                   <button class="rounded-[8px] text-[14px] h-[34px] leading-[18px] min-w-[64px] px-[14px] inline-flex items-center justify-center bg-[#dce9ff] border border-[#dce9ff] text-[#0049bd] cursor-pointer font-normal text-center touch-manipulation select-none align-middle whitespace-nowrap hover:bg-[#9ac1ff] hover:border-[#9ac1ff] hover:text-[#0049bd]">
                                        <span>{{ t('panel.pages.upgrade.index.helpCta') }}</span>
                                   </button>
                              </div>
                         </div>
                    </div>

                    <!-- Résumé -->
                    <PanelUpgradeSubscriptionSummary
                         :selectedPlan="upgradeStore.currentPlan"
                         :billingCycle="upgradeStore.billingCycle"
                         :totalPrice="computedTotalPrice"
                         :selectedModules="upgradeStore.selectedAddOns"
                         :nextButtonLabel="t('panel.pages.upgrade.index.nextStep')"
                         @updateBillingCycle="upgradeStore.setBillingCycle"
                         :disableIfZero="false"
                         @goNext="goNext"
                    />
               </div>
          </div>
     </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const upgradeStore = useUpgradeStore()
const panelStore = usePanelStore()
const router = useRouter()
const trialActive = ref(false)
const layoutLoadingPanel = useState('layoutLoadingPanel')

onMounted(async () => {
     if (!panelStore.plans.length) await panelStore.fetchPlans()

     upgradeStore.restore()
     await nextTick()
     measureAllSections()
     layoutLoadingPanel.value = false
})

function measureAllSections(){
     // les blocs statiques
     const staticSections = ['header', 'description', 'spacer', 'price', 'button', 'footer', 'features-title']

     // les lignes de features (on part du principe qu'on a au plus N features)
     const maxFeatures = Math.max(
          ...panelStore.plans.map(p => p.includedFeatures.length)
     )

     const featureSections = Array.from({ length: maxFeatures }, (_, i) => `feature-${i}`)

     const allSections = [...staticSections, ...featureSections]

     allSections.forEach(sectionName => {
          const els = Array.from(
               document.querySelectorAll<HTMLElement>(`[data-section="${sectionName}"]`)
          )
          if (!els.length) return
          const maxH = Math.max(...els.map(el => el.getBoundingClientRect().height))
          els.forEach(el => (el.style.minHeight = `${maxH}px`))
     })
}

// Calculer le total (offre sans modules, car modules seront dans l’étape 2)
const computedTotalPrice = computed(() => {
     const plan = upgradeStore.currentPlan
     if (!plan) return 0
     if (upgradeStore.billingCycle === 'monthly') {
          return plan.monthlyPrice
     }
     return plan.monthlyPrice * (12 - plan.discountMonths)
})

function goNext() {
     router.push('/panel/upgrade/modules')
}

function goStep(step: number) {
     if (step === 1) {
     } else if (step === 2) {
          if (upgradeStore.selectedPlanId) {
               router.push('/panel/upgrade/modules')
          }
     } else if (step === 3) {
          // ...
     }
}

function closePanel() {
     router.push('/panel/dashboard')
}

const { pageMenuPanel, setMeta } = usePanelPageMeta()
setMeta({
     title: t('panel.pages.upgrade.index.metaTitle'),
     description: t('panel.pages.upgrade.index.metaDescription')
})
pageMenuPanel.value = false

definePageMeta({
     layout: 'panel'
})
</script>
