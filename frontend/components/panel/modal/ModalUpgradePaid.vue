<template>
     <PanelModalBase :title="t('panel.components.modal.upgradePayment.title')" @close="handleClose">
          <div class="flex flex-row gap-[24px]">
               <!-- Bloc gauche : paiement -->
               <div class="flex-1">
                    <div class="mb-[24px]">
                         <h2 class="text-[20px] font-semibold text-[#080f1a]">{{ selectedPlanName }}</h2>
                         <p class="text-[14px] text-[#647491] mb-1">{{ t('panel.components.modal.upgradePayment.chargeToday') }}: <strong>{{ total }}€</strong></p>
                         <div class="text-[12px] text-[#647491] flex items-center gap-2">
                            xx
                              <span>{{ t('panel.components.modal.upgradePayment.monthlyEstimate') }} {{ total }}€</span>
                         </div>
                    </div>

                    <div v-if="paymentMethods.length === 0" class="mb-4 p-4 bg-[#f5f7f9] rounded-[6px] flex items-center justify-between">
                         <div class="text-sm text-[#647491]">
                              {{ t('panel.components.modal.upgradePayment.noPaymentMethod') }}
                         </div>
                         <button class="text-[#0566ff] text-sm font-medium" @click="showAddCard = true">{{ t('panel.components.modal.upgradePayment.addNew') }}</button>
                    </div>
                    <div v-else class="mb-4">
                         <label class="block text-sm font-medium text-[#647491] mb-2">{{ t('panel.components.modal.upgradePayment.choosePayment') }}</label>
                         <select v-model="selectedPaymentMethod" class="w-full border border-[#dce0e6] rounded px-3 py-2">
                              <option v-for="method in paymentMethods" :key="method.id" :value="method.id">
                                   **** {{ method.last4 }}
                              </option>
                              <option value="add_new">{{ t('panel.components.modal.upgradePayment.addNewOption') }}</option>
                         </select>
                    </div>

                    <div class="flex justify-between gap-2 mt-6">
                         <button class="btn-secondary w-1/2" type="button" @click="handleClose">{{ t('common.cancel') }}</button>
                         <button class="btn-primary w-1/2" type="button" :disabled="loading" @click="submit">
                              <span v-if="loading">{{ t('common.loading') }}</span>
                              <span v-else>{{ t('common.confirm') }}</span>
                         </button>
                    </div>
               </div>

               <!-- Bloc droit : détails plan et modules -->
               <div class="w-[300px] p-4 bg-[#f9fafb] rounded-[8px]">
                    <h3 class="font-semibold text-[#080f1a] text-[16px] mb-3">{{ t('panel.components.modal.upgradePayment.features') }}</h3>
                    <ul class="text-sm text-[#3c4a5d] list-disc list-inside space-y-2">
                         <li v-for="f in features" :key="f">{{ f }}</li>
                    </ul>
               </div>
          </div>

          <PanelModalUpgradeAddCard v-if="showAddCard" @close="showAddCard = false" />
     </PanelModalBase>
</template>

<script setup lang="ts">
const { t } = useI18n()
const emit = defineEmits(['close', 'submit'])

const props = defineProps<{
     billingCycle: 'monthly' | 'annual'
     total: number
     features: string[]
     selectedPlanName: string
}>()

const loading = ref(false)
const showAddCard = ref(false)
const paymentMethods = ref([{ id: 'card_1', last4: '7844' }]) // À remplacer par les données Stripe
const selectedPaymentMethod = ref('card_1')

const handleClose = () => {
     if (!loading.value) emit('close')
}

const submit = async () => {
     loading.value = true
     try {
          // Intégration paiement ici
          emit('submit')
     } catch (err) {
          console.error(err)
     } finally {
          loading.value = false
     }
}
</script>
