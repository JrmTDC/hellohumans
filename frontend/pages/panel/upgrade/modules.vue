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
                                        v-for="(module, idx) in store.availableModules.filter(m => !m.disabled)"
                                        :key="module.id"
                                        :module="module"
                                        :index="idx"
                                        :billingCycle="store.billingCycle"
                                        :onToggle="toggleModule"
                                        :onChangeChoice="changeModuleChoice"
                                        :includedModules="store.currentPlan?.includedModules || []"
                                   />
                              </div>
                         </div>
                    </div>

                    <PanelUpgradeSubscriptionSummary
                         :selectedPlan="store.currentPlan"
                         :billingCycle="store.billingCycle"
                         :selectedModules="store.selectedAddOns"
                         showModules
                         :totalPrice="computedTotalPrice"
                         @updateBillingCycle="store.setBillingCycle"
                         @goNext="handlePaymentClick"
                         :nextButtonLabel="t('panel.pages.upgrade.modules.nextButtonLabel')"
                         :disableIfZero="!store.canValidateUpgrade"
                    />

                    <PanelModalUpgradePayment
                         v-if="showPaymentModal"
                         :total="computedTotalPrice"
                         :canSubmit="store.canValidateUpgrade"
                         :billingCycle="store.billingCycle"
                         @close="showPaymentModal = false"
                         @submit="submitPayment"
                         @updateBillingCycle="store.setBillingCycle"
                    />
               </div>
          </div>
     </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const panelStore = usePanelStore()
const store = useUpgradeStore()
const router = useRouter()
const trialActive = ref(false)
const showPaymentModal = ref(false)

onMounted(async () => {

     if (!store.plans.length) await store.fetchPlans()
     if (!store.availableModules.length) await store.fetchModules()

     store.restore()

     if (!store.currentPlan) {
          await router.replace('/panel/upgrade')
          return
     }
})

function toggleModule(moduleId: string, checked: boolean) {
     store.toggleModule(moduleId, checked)
}

function changeModuleChoice(moduleId: string, choiceIndex: number) {
     store.setModuleChoice(moduleId, choiceIndex)
}

const computedTotalPrice = computed(() => {
     let total = 0
     // Offre
     const off = store.currentPlan
     if (off) {
          if (store.billingCycle === 'monthly') {
               total += off.monthlyPrice
          } else {
               total += off.monthlyPrice * (12 - off.discountMonths)
          }
     }
     // Modules
     const includedIds = off?.includedModules || []
     for (const mod of store.selectedAddOns) {
          // Si c’est inclus dans l’offre => on l’affiche, mais pas de prix
          if (includedIds.includes(mod.id)) {
               continue
          }
          // Sinon, on calcule
          if (mod.multipleChoice && mod.choices && mod.selectedChoiceIndex != null) {
               const choice = mod.choices[mod.selectedChoiceIndex]
               const disc = choice.discountMonths ?? 0
               if (store.billingCycle === 'monthly') {
                    total += choice.monthlyPrice
               } else {
                    total += choice.monthlyPrice * (12 - disc)
               }
          } else {
               const disc = mod.discountMonths ?? 0
               if (store.billingCycle === 'monthly') {
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
     if (!store.canValidateUpgrade) return
     showPaymentModal.value = true
}

function submitPayment() {
     try {
          const result = panelStore.confirmUpgrade()
          if (result === 'free' || result === 'stripe') {
               showPaymentModal.value = false
               router.push('/panel/upgrade/success')
          }
     } catch (err: any) {
          console.error('[UpgradeModules] Erreur upgrade :', err)

     }
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
setMeta({
     title: t('panel.pages.upgrade.modules.metaTitle'),
     description: t('panel.pages.upgrade.modules.metaDescription')
})
pageMenuPanel.value = false

definePageMeta({
     layout: 'panel'
})
</script>
