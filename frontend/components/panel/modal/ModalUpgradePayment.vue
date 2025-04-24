<template>
     <PanelModalBaseUpgrade @close="handleClose">

          <div class="p-8 pb-8 flex flex-col none">
               <div class="flex-1">
                    <h2 class="text-xl font-semibold mb-2">
                         Upgrade vers le plan {{ currentPlan.name }}
                         <span v-if="planLabel" class="ml-2 text-sm px-2 py-1 rounded bg-[#dce9ff] text-[#303f9f]">{{ planLabel }}</span>
                    </h2>

                    <!-- Prix -->
                    <div class="flex justify-between mt-4 text-sm">
                         <span>Frais aujourd’hui</span>
                         <span>{{ todayAmount.toFixed(2) }} €</span>
                    </div>

                    <div class="flex justify-between text-sm text-[#647491] mb-4">
                         <span>Frais mensuelle</span>
                         <span>{{ monthlyAmount.toFixed(2) }} €</span>
                    </div>
               </div>
               <div class="mt-4 pt-4">
                    <!-- Méthodes de paiement -->
                    <div class="my-4">
                         <label class="block mb-1 text-sm text-[#647491]">Méthode de paiement</label>

                         <div v-if="paymentMethods.length === 0" class="flex items-center justify-between border p-3 rounded-md bg-[#f5f7fa]">
                              <span class="text-sm text-[#647491]">Aucune carte enregistrée</span>
                              <button @click="showAddCard = true" class="text-[#0566ff] text-sm hover:underline">Ajouter</button>
                         </div>

                         <select
                              v-else
                              v-model="selectedPaymentMethod"
                              class="w-full mt-1 p-2 border rounded-md text-sm"
                         >
                              <option
                                   v-for="method in paymentMethods"
                                   :key="method.id"
                                   :value="method.id"
                              >
                                   {{ method.brand }} •••• {{ method.last4 }}
                              </option>
                              <option value="new">➕ Ajouter une nouvelle carte</option>
                         </select>
                    </div>

                    <!-- Actions -->
                    <div class="mt-6 flex justify-between">
                         <button @click="emit('close')" class="text-[#647491] hover:underline">Annuler</button>
                         <button @click="submitUpgrade" class="bg-[#0566ff] hover:bg-[#0049bd] text-white px-6 py-2 rounded-md" :disabled="loading">
                              Confirmer
                         </button>
                    </div>

               </div>


          </div>
          <div class="bg-surface-100 p-8 flex flex-col border-l">
               <PanelModalUpgradeFeaturesSummary :features="store.currentPlan?.includedFeatures || []" />
          </div>
     </PanelModalBaseUpgrade>
     <!-- Modal ajout carte -->
     <PanelModalUpgradeAddCard v-if="showAddCard" @close="showAddCard = false" @added="refreshCards" />
</template>

<script setup lang="ts">
const { t } = useI18n()
interface StripeCard {
     id: string
     brand: string
     last4: string
}
const emit = defineEmits(['close', 'submit'])
const store = useUpgradeStore()
const panelStore = usePanelStore()

const showAddCard = ref(false)
const paymentMethods = ref<StripeCard[]>([])
const selectedPaymentMethod = ref<string | null>(null)

const currentPlan = computed(() => store.currentPlan!)
const selectedAddOns = computed(() => store.selectedAddOns)

const todayAmount = ref(29.00)
const monthlyAmount = ref(29.00)
const loading = ref(false)

const planLabel = computed(() => {
     if (!panelStore.project?.subscription) return 'Nouveau'
     if (store.isSameAsCurrent) return 'Identique'
     return 'Mise à jour'
})

const handleClose = () => {
     if (!loading.value) emit('close')
}
onMounted(() => {
     fetchPaymentMethods()
})

async function fetchPaymentMethods() {
     /*
     const res = await usePanelApi().apiFetch('/stripe/payment-methods')
     paymentMethods.value = res.success?.methods || []
     if (paymentMethods.value.length > 0) {
          selectedPaymentMethod.value = paymentMethods.value[0].id
     }
     */
}

async function refreshCards() {
     await fetchPaymentMethods()
     showAddCard.value = false
}

async function submitUpgrade() {
     if (selectedPaymentMethod.value === 'new') {
          showAddCard.value = true
          return
     }

     try {
          /*
          const result = await panelStore.confirmUpgrade(selectedPaymentMethod.value)
          if (result === 'stripe' || result === 'free') {
               emit('submit')
          }

           */
     } catch (e: any) {
          console.error(e)
     }
}
</script>
