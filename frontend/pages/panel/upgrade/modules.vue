<template>
     <LoadingOverlay v-if="isChecking" />
     <div v-else id="app-content" class="w-full h-full overflow-auto fixed left-0 top-0 z-[133] bg-white">
          <div class="flex flex-col justify-start items-[normal] h-full">
               <StepperHeader :step="2" @goStep="goStep" @close="closePanel" />

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
                Votre essai complet se termine dans 0 jours
              </span>
                                   <h2 class="mt-[8px] mb-0 font-medium text-[28px] leading-[33px] tracking-[-0.01em] text-left">
                                        Sélectionner votre offre
                                   </h2>
                                   <p
                                        class="mb-0 mt-[8px] font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-left text-[#647491]"
                                   >
                                        Choisissez une offre et choisissez des modules à l'étape suivante.
                                   </p>
                              </div>

                              <span class="block w-[32px] h-[32px]"></span>
                              <div class="flex flex-row items-center h-[34px]">
                                   <h2 class="mt-0 mb-0 font-medium text-[16px] leading-[20px] tracking-[-0.01em]">
                                        Choisissez les modules complémentaires
                                   </h2>
                              </div>
                              <span class="block w-[16px] h-[16px]"></span>

                              <div class="flex flex-col">
                                   <!-- Filtrer les modules pour ne pas afficher ceux "disabled" -->
                                   <ModuleCard
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

                    <SubscriptionSummary
                         :selectedPlan="store.currentPlan"
                         :billingCycle="store.billingCycle"
                         :selectedModules="store.selectedAddOns"
                         showModules
                         :totalPrice="computedTotalPrice"
                         @updateBillingCycle="store.setBillingCycle"
                         @goNext="handlePaymentClick"
                         nextButtonLabel="Paiement"
                         :disableIfZero="true"
                    />

                    <PaymentModal
                         v-if="showPaymentModal"
                         :total="computedTotalPrice"
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
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUpgradeStore } from '@/stores/upgradeStore'

import StepperHeader from '~/components/panel/upgrade/StepperHeader.vue'
import ModuleCard from '~/components/panel/upgrade/ModuleCard.vue'
import SubscriptionSummary from '~/components/panel/upgrade/SubscriptionSummary.vue'
import LoadingOverlay from '~/components/panel/common/loadingOverlay.vue'
import PaymentModal from '~/components/panel/upgrade/PaymentModal.vue'

const store = useUpgradeStore()
const router = useRouter()
const isChecking = ref(true)
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

     isChecking.value = false
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
     if (computedTotalPrice.value <= 0) return
     showPaymentModal.value = true
}

function submitPayment(cardDetails: any) {
     // 1) Envoyer la requête vers ton backend (ou Stripe direct si usage client-only)
     // 2) En cas de succès, tu fermes la modal
     showPaymentModal.value = false
     // 3) Gérer la suite (e.g. router.push('/panel/upgrade/success'))
}


function goStep(step: number) {
     if (step === 1) router.push('/panel/upgrade')
     else if (step === 2) {}
     else if (step === 3) goNext()
}

function closePanel() {
     router.push('/panel')
}
</script>

<!--
{{ t('panel.upgrade.ModulesPage.trialRemaining', { count: 0 }) }}
{{ t('panel.upgrade.ModulesPage.title') }}
{{ t('panel.upgrade.ModulesPage.description') }}
{{ t('panel.upgrade.ModulesPage.chooseModules') }}
{{ t('panel.upgrade.ModulesPage.nextButtonLabel') }}
-->
