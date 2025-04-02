<template>
     <LoadingOverlay v-if="isChecking" />
     <div v-else id="app-content" class="w-full h-full overflow-auto fixed left-0 top-0 z-[133] bg-white">
          <div class="flex flex-col justify-start items-[normal] h-full">
               <StepperHeader :step="1" @goStep="goStep" @close="closePanel" />

               <div class="flex flex-row justify-start items-start self-stretch flex-grow">
                    <!-- Liste d'offres -->
                    <div class="flex flex-col justify-start items-center flex-grow">
                         <span class="block w-[32px] min-w-[32px] h-[32px] min-h-[32px]"></span>
                         <div class="flex flex-col justify-start items-[normal] w-[672px]">
                              <div class="flex flex-col justify-start items-[normal] self-start">
                                   <span v-if="trialActive" class="uppercase text-[11px] leading-[14px] tracking-[-0.01em] bg-[#dce9ff] text-[#303f9f] px-[6px] py-[3px] rounded-[4px] font-medium self-start">Votre essai complet se termine dans 0 jours</span>
                                   <h2 class="mt-[8px] mb-0 font-medium text-[28px] leading-[33px] tracking-[-0.01em] text-left">Sélectionner votre offre</h2>
                                   <p class="mb-0 mt-[8px] font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-left text-[#647491]">Choisissez une offre et choisissez des modules à l'étape suivante.</p>
                              </div>

                              <div class="flex flex-col justify-start items-[normal] mt-[32px]">
                                   <div
                                        class="w-max max-w-none grid gap-y-0 gap-x-[20px] [grid-auto-flow:row] [grid-template-columns:326px_326px] p-0"
                                   >
                                        <!-- Boucle sur store.plans -->
                                        <PlanCard
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
                                        <span>Voir toutes les fonctionnalités</span>
                                   </button>
                              </div>
                         </div>
                    </div>

                    <!-- Résumé -->
                    <SubscriptionSummary
                         :selectedPlan="store.currentPlan"
                         :billingCycle="store.billingCycle"
                         :totalPrice="computedTotalPrice"
                         :selectedModules="store.selectedAddOns"
                         nextButtonLabel="Prochaine étape"
                         @updateBillingCycle="store.setBillingCycle"
                         :disableIfZero="false"
                         @goNext="goNext"
                    />
               </div>
          </div>
     </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import { useRouter } from 'vue-router'
import { useUpgradeStore } from '~/stores/upgradeStore'
import StepperHeader from '~/components/panel/upgrade/StepperHeader.vue'
import PlanCard from '~/components/panel/upgrade/PlanCard.vue'
import SubscriptionSummary from '~/components/panel/upgrade/SubscriptionSummary.vue'
import LoadingOverlay from "~/components/panel/common/loadingOverlay.vue";

const store = useUpgradeStore()
const router = useRouter()
const trialActive = ref(false)
const isChecking = ref(true)

onMounted(async () => {
     if (!store.plans.length) await store.fetchPlans()

     store.restore()

     // Si aucune offre sélectionnée, on prend la première
     if (!store.selectedPlanId && store.plans.length) {
          store.setPlan(store.plans[0].id)
     }

     isChecking.value = false
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
     router.push('/panel')
}
</script>
