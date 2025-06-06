<template>
     <div id="app-content" class="w-full h-full overflow-auto fixed left-0 top-0 z-[133] bg-white">
          <div class="flex flex-col justify-start items-[normal] h-full">
               <PanelUpgradeStepperHeader :step="2" @goStep="goStep" @close="closePanel" />

               <div class="flex flex-row justify-start items-start self-stretch flex-grow">
                    <!-- Liste des modules -->
                    <div class="flex flex-col justify-start items-center flex-grow">
                         <span class="block w-[32px] h-[32px]"></span>
                         <div class="flex flex-col w-[672px]">
                              <div class="flex flex-col self-start">
              <span
                   v-if="trialActive"
                   class="uppercase text-[11px] leading-[14px] tracking-[-0.01em] bg-[#dce9ff] text-[#303f9f] px-[6px] py-[3px] rounded-[4px] font-medium self-start"
              >
                 {{ t('panel.pages.upgrade.modules.trialRemainingZero') }}
              </span>
                                   <h2 class="mt-[8px] mb-0 font-medium text-[28px] leading-[33px] tracking-[-0.01em] text-left">
                                        {{ t('panel.pages.upgrade.modules.title') }}
                                   </h2>
                                   <p
                                        class="mb-0 mt-[8px] font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-left text-[#647491]"
                                   >
                                        {{ t('panel.pages.upgrade.modules.description') }}
                                   </p>
                              </div>

                              <span class="block w-[32px] h-[32px]"></span>
                              <div class="flex flex-row items-center h-[34px]">
                                   <h2 class="mt-0 mb-0 font-medium text-[16px] leading-[20px] tracking-[-0.01em]">
                                        {{ t('panel.pages.upgrade.modules.chooseModules') }}
                                   </h2>
                              </div>
                              <span class="block w-[16px] h-[16px]"></span>

                              <div class="flex flex-col">
                                   <!-- Filtrer les modules pour ne pas afficher ceux "disabled" -->
                                   <PanelUpgradeModuleCard
                                        v-for="(module, idx) in panelStore.modules.filter(m => !m.disabled)"
                                        :key="module.id"
                                        :module="module"
                                        :selected="upgradeStore.isModuleSelected(module.id)"
                                        :index="idx"
                                        :billingCycle="upgradeStore.billingCycle"
                                        :onToggle="toggleModule"
                                        :onChangeChoice="changeModuleChoice"
                                        :includedModules="upgradeStore.currentPlan?.includedModules || []"
                                   />
                              </div>
                         </div>
                    </div>

                    <PanelUpgradeSubscriptionSummary
                         :selectedPlan="upgradeStore.currentPlan"
                         :billingCycle="upgradeStore.billingCycle"
                         :selectedModules="upgradeStore.selectedAddOns"
                         showModules
                         :totalPrice="computedTotalPrice"
                         @updateBillingCycle="upgradeStore.setBillingCycle"
                         @goNext="handlePaymentClick"
                         :nextButtonLabel="t('panel.pages.upgrade.modules.nextButtonLabel')"
                         :disableIfZero="!upgradeStore.canValidateUpgrade"
                    />

                    <PanelModalUpgradePayment
                         v-if="showPaymentModal"
                         @close="showPaymentModal = false"
                    />
               </div>
          </div>
     </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const layoutLoadingPanel = useState('layoutLoadingPanel')
const panelStore = usePanelStore()
const upgradeStore = useUpgradeStore()
const trialActive = ref(false)
const showPaymentModal = ref(false)
const upgradeFlow = useUpgradeFlow()
const from = router.options.history.state.back as string | null
const noInitPages = ['/panel/onboarding', '/panel/upgrade', '/panel/upgrade/modules']

onMounted(async () => {

     if(!panelStore.plans.length || !panelStore.modules.length) {
          await panelStore.fetchUpgrade()
          upgradeStore.initialiseStore()
     }
     if (!upgradeStore.currentPlan) {
          await router.replace('/panel/upgrade')
          return
     }
     if (upgradeFlow.currentStep < 1 || !upgradeStore.currentPlan) {
          await router.replace('/panel/upgrade')
          return
     }
     const shouldInit = !noInitPages.includes(from || '')
     if (shouldInit) {
          upgradeStore.initialiseStore()
     }
     upgradeFlow.setStep(2)
     layoutLoadingPanel.value = false
})

function toggleModule(moduleId: string, checked: boolean) {
     upgradeStore.toggleModule(moduleId, checked)
}

function changeModuleChoice(moduleId: string, choiceIndex: number) {
     upgradeStore.setModuleChoice(moduleId, choiceIndex)
}

const computedTotalPrice = computed(() => {
     let total = 0
     // Offre
     const off = upgradeStore.currentPlan
     if (off) {
          if (upgradeStore.billingCycle === 'month') {
               total += off.monthlyPrice
          } else {
               total += off.monthlyPrice * (12 - off.discountMonths)
          }
     }
     // Modules
     const includedIds = off?.includedModules || []
     for (const mod of upgradeStore.selectedAddOns) {
          // Si c’est inclus dans l’offre => on l’affiche, mais pas de prix
          if (includedIds.includes(mod.key)) {
               continue
          }
          // Sinon, on calcule
          if (mod.multipleChoice && mod.choices && mod.selectedChoiceIndex != null) {
               const choice = mod.choices[mod.selectedChoiceIndex]
               const disc = choice.discountMonths ?? 0
               if (upgradeStore.billingCycle === 'month') {
                    total += choice.monthlyPrice
               } else {
                    total += choice.monthlyPrice * (12 - disc)
               }
          } else {
               const disc = mod.discountMonths ?? 0
               if (upgradeStore.billingCycle === 'month') {
                    total += mod.basePrice
               } else {
                    total += mod.basePrice * (12 - disc)
               }
          }
     }
     return total
})

function goNext() {
     router.push('/panel/upgrade/payment')
}

function handlePaymentClick() {
     if (!upgradeStore.canValidateUpgrade) return
     showPaymentModal.value = true
}

function goStep(step: number) {
     if (step === 1) router.push('/panel/upgrade')
     else if (step === 2) {}
     else if (step === 3) goNext()
}

function closePanel() {
     router.push('/panel/dashboard')
}

const { pageMenuPanel, setMeta } = usePanelPageMeta()

const pageTitle = computed(() => t('panel.pages.upgrade.modules.metaTitle'));
const pageDescription = computed(() => t('panel.pages.upgrade.modules.metaDescription'));

watchEffect(() => {
     setMeta({
          title: pageTitle.value,
          description: pageDescription.value
     });
})

pageMenuPanel.value = false

definePageMeta({
     layout: 'panel'
})
</script>
