<template>
     <PanelModalBaseUpgrade @close="handleClose">

          <div class="p-8 pb-8 flex flex-col">
               <div class="flex-1">
                    <h2 class="text-xl font-semibold mb-2">Frais de votre abonnement</h2>

                    <!-- Prix -->
                    <div class="flex justify-between mt-4 text-sm">
                         <span class="pt-[8px] pb-[8px] flex items-center">Frais aujourd’hui</span>
                         <span class="pt-[8px] pb-[8px] flex items-center">
                              <span v-if="loadingAmount" class="h-[20px] w-[60px] bg-gray-200 animate-pulse rounded-md"></span>
                              <span v-else>{{ todayAmount.toFixed(2) }} €</span>
                         </span>
                    </div>

                    <div class="flex justify-between text-sm text-[#647491] mb-4">
                         <span  class="pt-[8px] pb-[8px] flex items-center">{{ upgradeStore.billingCycle === 'year' ?  t('panel.components.modal.upgradePayment.ChargeCycleYear') : t('panel.components.modal.upgradePayment.ChargeCycleMonth') }}</span>
                         <span class="pt-[8px] pb-[8px] flex items-center">
                              <span v-if="loadingAmount" class="h-[20px] w-[60px] bg-gray-200 animate-pulse rounded-md"></span>
                              <span v-else>{{ cycleAmount.toFixed(2) }} €</span>
                         </span>

                    </div>
               </div>
               <div class="mt-4 pt-4">
                    <!-- Méthodes de paiement -->
                    <div class="my-4">
                         <label class="block mb-1 text-sm text-[#647491]">Méthode de paiement</label>
                         <div v-if="paymentMethodLoading" class="h-[50px] bg-gray-200 animate-pulse rounded-md"></div>
                         <template v-else>
                              <div v-if="paymentMethods.length === 0" class="flex items-center justify-between border p-3 rounded-md bg-[#f5f7fa]">
                                   <span class="text-sm text-[#647491]">{{ t('panel.components.modal.upgradePayment.NoCardRegistered') }}</span>
                                   <button @click="showAddCard = true" class="text-[#0566ff] text-sm hover:underline">{{ t('panel.components.modal.upgradePayment.addNewCard') }}</button>
                              </div>

                              <div ref="dropdownRef" v-else>
                                   <div class="relative inline-block w-full">
                                        <div class="flex items-center justify-between border-2 rounded-[8px] px-3 py-2 cursor-pointer" :class="isOpen ? 'border-[#3886ff]' : 'border-[#d3dbe5]'" @click="toggleOpenSelect">
                                             <span v-if="selectedMethod" class="flex items-center">
                                                  <PanelCommonCreditCardIcon :brand="selectedMethod.card.brand" class="mr-[8px] h-[18px] w-auto" />

                                                  <span>•••• •••• •••• {{ selectedMethod.card.last4 }}</span>
                                             </span>
                                             <span v-else>{{ t('panel.components.modal.upgradePayment.SelectCreditCard') }}</span>
                                             <svgo-panel-icon-triangle-caret-down class="w-[24px] h-[24px] fill-[#080f1a]" :class="{ 'rotate-180': isOpen }" />
                                        </div>
                                        <div v-if="isOpen" class="absolute left-0 right-0 mt-1 z-10 shadow-[0px_8px_20px_rgba(0,20,51,0.24)] bg-white rounded-[8px]">
                                             <div class="px-[8px] border-b border-[#e0e6ed]">
                                                  <div class="scrollbar-none overflow-scroll scrollbar-none overflow-y-scroll overflow-x-hidden w-full h-full">
                                                       <div class="block w-[8px] min-w-[8px] h-[8px] min-h-[8px]"></div>
                                                       <ul class="max-h-[200px] list-none outline-none p-0 m-0">
                                                            <li v-for="method in paymentMethods" :key="method.id" class="px-[8px] py-[9px] rounded-[4px] text-[#080f1a] cursor-pointer bg-white overflow-hidden text-ellipsis whitespace-nowrap flex gap-[8px] items-center text-[14px] leading-[18px] tracking-[-0.01em] hover:bg-[#dce9ff] flex flex-row flex-nowrap justify-between" @click="selectPaymentMethod(method.id)">
                                                                 <span class="flex items-center justify-start">
                                                                      <PanelCommonCreditCardIcon :brand="method.card.brand" class="mr-[8px] h-[18px] w-auto" />
                                                                      <span>•••• •••• •••• {{ method.card.last4 }}</span>
                                                                 </span>
                                                                 <span v-if="method.id === selectedMethod.id" class="flex justify-end">
                                                                      <svgo-panel-icon-checked class="h-[20px] w-[20px] fill-[#0566ff]" />
                                                                 </span>
                                                            </li>
                                                       </ul>
                                                       <div class="block w-[8px] min-w-[8px] h-[8px] min-h-[8px]"></div>
                                                  </div>
                                             </div>
                                             <div class="flex items-center text-[#080f1a] bg-transparent border-none rounded-[4px] min-h-[36px] px-[8px] py-[6px] cursor-pointer outline-none hover:bg-[#dce9ff] hover:text-[#001433] m-[8px] group" @click="() => { showAddCard = true; isOpen = false }">
                                                  <span class="flex items-center"><svgo-panel-icon-add class="w-[24px] h-[24px] fill-[#647491] group-hover:fill-[#0566ff]" /></span>
                                                  <span class="ml-[12px] text-[14px]">{{ t('panel.components.modal.upgradePayment.AddPaymentMethode') }}</span>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </template>

                    </div>

                    <!-- Actions -->
                    <div class="mt-6 flex justify-between">
                         <button @click="emit('close')" class="text-[#647491] hover:underline">{{ t('panel.components.modal.upgradePayment.btnCancel') }}</button>
                         <button @click="submitUpgrade" class="px-6 py-2 rounded-md" :class="(isDisabled || loading) ? 'bg-[#eff2f6] text-[#acb8cb] cursor-not-allowed' : 'bg-[#0566ff] hover:bg-[#0049bd] text-[#fff]'" :disabled="isDisabled || loading" >
                              <span v-if="!loading">{{ t('panel.components.modal.upgradePayment.btnConfirm') }}</span>
                              <span v-else>{{ t('panel.components.modal.upgradePayment.processing') }}</span>
                         </button>
                    </div>

               </div>


          </div>
          <div class="bg-surface-100 p-8 flex flex-col border-l justify-between">
               <PanelModalUpgradeRecap v-if="upgradePreview" :changes="upgradePreview.changes" :total-now="todayAmount" :total-cycle="cycleAmount" />
          </div>
     </PanelModalBaseUpgrade>
     <!-- Modal ajout carte -->
     <PanelModalUpgradeAddCard v-if="showAddCard" @close="showAddCard = false" @added="refreshCard" />
</template>
<script setup lang="ts">
import { loadStripe } from '@stripe/stripe-js'
const { t } = useI18n()
const emit = defineEmits(['close'])
const upgradeStore = useUpgradeStore()
const panelStore = usePanelStore()
const upgradePreview = ref<any | null>(null)
const showAddCard = ref(false)
const paymentMethods = ref<any[]>([])
const selectedPaymentMethod = ref<string | null>(null)
const paymentMethodLoading = ref(true)
let skipNextClick = true
const dropdownRef = ref<HTMLElement | null>(null)
const currentPlan = computed(() => upgradeStore.currentPlan!)
const selectedAddOns = computed(() => upgradeStore.selectedAddOns)
const isOpen = ref(false)
const todayAmount = ref(0)
const cycleAmount = ref(0)
const loading = ref(false)
const loadingAmount = ref(true)
const subscriptionEndsAt = ref<Date | null>(null)
const config = useRuntimeConfig()
const router = useRouter()

const subscriptionPaiement = useState('subscriptionPaiement', () => false)

// Logique de désactivation du bouton
const isDisabled = computed(() => {
     // Si les données ne sont pas encore chargées
     if (paymentMethodLoading.value || loadingAmount.value) {
          return true
     }

     // Si il y a un montant à payer (aujourd'hui ou à la prochaine échéance)
     if (todayAmount.value > 0 || cycleAmount.value > 0) {
          // Il faut une carte sélectionnée
          return !selectedPaymentMethod.value
     }

     // Si tout est à 0, pas besoin de carte, on peut valider
     return false
})

const handleClose = () => {
     if (!loading.value) emit('close')
}
const toggleOpenSelect = () => {
     isOpen.value = !isOpen.value
}
onMounted(() => {
     fetchPaymentMethods()
     fetchUpgradePreview()

     skipNextClick = true
     setTimeout(() => {
          skipNextClick = false
     }, 100)
     document.addEventListener('click', (e) => {
          if (skipNextClick) return
          handleClickOutsideSelect(e)
     })
})

const selectedMethod = computed(() => {
     return paymentMethods.value.find((c) => c.id === selectedPaymentMethod.value) || null
})

const handleClickOutsideSelect = (event: MouseEvent) => {
     if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
          isOpen.value = false
     }
}

async function selectPaymentMethod(id: string) {
     selectedPaymentMethod.value = id
     isOpen.value = false
}

async function fetchPaymentMethods() {
     paymentMethodLoading.value = true
     try {
          await panelStore.fetchStripePaymentMethods()
          paymentMethods.value = panelStore.stripe_customer?.payment_methods || []
          if (paymentMethods.value.length > 0) {
               selectedPaymentMethod.value = paymentMethods.value[0].id
          }
     } finally {
          paymentMethodLoading.value = false
     }
}

async function fetchUpgradePreview() {
     loadingAmount.value = true
     try {
          const res = await panelStore.fetchUpgradePreview({
               plan_id: currentPlan.value.id,
               modules: selectedAddOns.value.map((m) =>
                    typeof m === 'string' ? m : m.id
               ),
               billing_cycle: upgradeStore.billingCycle,
          })
          upgradePreview.value  = res
          todayAmount.value     = res.today_amount ?? 0
          cycleAmount.value     = res.cycle_amount ?? 0

          subscriptionEndsAt.value = res.ends_at
               ? new Date(res.ends_at * 1000)
               : null
     } catch (error) {
          console.error('Erreur preview upgrade :', error)
          emit('close')
     } finally {
          loadingAmount.value = false
     }
}

async function refreshCard() {
     paymentMethodLoading.value = true
     await fetchPaymentMethods()
     showAddCard.value = false

     // Réactiver par défaut la première carte si ajoutée
     if (paymentMethods.value.length > 0) {
          selectedPaymentMethod.value = paymentMethods.value[0].id
     }

     paymentMethodLoading.value = false
}

async function submitUpgrade() {
     // Si les montants sont à 0, on passe null comme payment_method_id
     const paymentMethodId = todayAmount.value === 0 && cycleAmount.value === 0 ? true : selectedPaymentMethod.value

     // Si aucune carte sélectionnée et qu'il y a un montant à payer
     if (!paymentMethodId) {
          showAddCard.value = true
          return
     }

     loading.value = true

     try {
          // Appel backend
          const res = await panelStore.confirmUpgrade(selectedPaymentMethod.value)

          if (res.requiresAction && res.clientSecret) {
               const stripe = await loadStripe(config.public.stripeKey!)

               if (!stripe) {
                    throw new Error('Impossible de charger Stripe')
               }

               const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(res.clientSecret)

               if (stripeError) {
                    console.error('Erreur Stripe:', stripeError)
                    return
               }

               if (paymentIntent.status === 'succeeded') {  
                    subscriptionPaiement.value = true
                    await router.push('/panel/upgrade/confirmation')
                    return
               } else {
                    console.warn('Le paiement n’a pas pu être validé :', paymentIntent.status)
               }
          } else if (res.status === 'active') {
               subscriptionPaiement.value = true
               await router.push('/panel/upgrade/confirmation')
               return
          }
     } catch (e: any) {
          console.error(e)
     } finally {
          const ok = await panelStore.initPanelAccessSession()
          if (!ok) return navigateTo('/panel/login')
          loading.value = false
     }
}
</script>
