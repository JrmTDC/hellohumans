<template>
     <PanelModalBase title="t('panel.components.modal.upgradePayment.title')" @close="handleClose">
          <form @submit.prevent="submit">
               <!-- Carte de paiement -->
               <div class="mb-[24px]">
                    <label class="block text-[#647491] text-[14px] leading-[18px] mb-[6px]">{{ t('panel.components.modal.upgradePayment.cardLabel') }}</label>
                    <PanelStripeCardInput v-model="cardDetails" @error="cardError = $event" />
               </div>

               <!-- Total -->
               <div class="flex flex-row items-center justify-center mb-[24px]">
                    <span class="text-[16px] leading-[31px] mr-[5px]"> {{ t('panel.components.modal.upgradePayment.totalLabel') }}</span>
                    <span class="text-[32px] leading-[41px] font-semibold text-[#080f1a]">{{ total }}€</span>
                    <span class="text-[15px] text-[#080f1a] font-semibold ml-[4px]">{{ billingCycle === 'monthly' ? t('panel.components.modal.upgradePayment.monthly') : t('panel.components.modal.upgradePayment.annual') }}</span>
               </div>

               <!-- Aperçu des montants -->
               <div class="mb-[24px] text-center text-sm text-[#647491]">
                    <p><strong>{{ t('panel.components.modal.upgradePayment.todayLabel') }}</strong> {{ todayAmount.toFixed(2) }} €</p>
                    <p><strong>{{ t('panel.components.modal.upgradePayment.monthlyLabel') }}</strong> {{ monthlyAmount.toFixed(2) }} €</p>
               </div>

               <!-- Message d'erreur -->
               <div v-if="errorMessage" class="text-red-600 text-sm text-center mb-[12px]">
                    {{ errorMessage }}
               </div>

               <!-- Actions -->
               <div class="flex flex-col items-center justify-center">
                    <button
                         type="submit"
                         :disabled="!!cardError || loading"
                         :class="['w-full rounded-[8px] text-[18px] h-[46px] px-[20px] flex items-center justify-center',loading ? 'bg-[#d3dbe5] text-[#647491] cursor-not-allowed' : 'bg-[#0566ff] text-white hover:bg-[#0049bd]']">
                         <span v-if="!loading">{{ t('panel.components.modal.upgradePayment.submitLabel') }}</span>
                         <span v-else>{{ t('panel.components.modal.upgradePayment.processing') }}</span>
                    </button>

                    <button
                         type="button"
                         @click="handleClose"
                         :disabled="loading"
                         class="bg-white text-[#647491] text-[14px] mt-[10px] h-[26px] flex items-center justify-center border-none rounded-[4px] cursor-pointer"
                    >
                         {{ t('panel.components.modal.upgradePayment.back') }}
                    </button>
               </div>
          </form>
     </PanelModalBase>
</template>

<script setup lang="ts">
const emit = defineEmits(['close', 'submit'])
const props = defineProps<{
     billingCycle: 'monthly' | 'annual'
}>()

const { t } = useI18n()
const panelStore = usePanelStore()
const upgradeStore = useUpgradeStore()

const cardDetails = ref<any>(null)
const cardError = ref<string | null>(null)
const loading = ref(false)
const errorMessage = ref('')
const todayAmount = ref(0)
const monthlyAmount = ref(0)

onMounted(() => {
     preview()
})

async function preview() {

     const projectId = panelStore.project?.id
     const planId = upgradeStore.selectedPlanId
     const modules = upgradeStore.billableAddOns.map((m) => m.id)

     if (!projectId || !planId) return

     try {
          const preview = await panelStore.previewSubscription(projectId, planId, modules, props.billingCycle)
          todayAmount.value = preview.todayAmount
          monthlyAmount.value = preview.monthlyAmount
     } catch (err) {
          errorMessage.value = t('panel.components.modal.upgradePayment.errorPreview')
     }
}

const submit = async () => {
     if (!cardDetails.value || cardError.value) return

     loading.value = true
     errorMessage.value = ''

     const projectId = panelStore.project?.id
     const planId = upgradeStore.selectedPlanId
     const modules = upgradeStore.billableAddOns.map((m) => m.id)

     if (!projectId || !planId) {
          errorMessage.value = t('panel.components.modal.upgradePayment.errorMissingInfo')
          loading.value = false
          return
     }

     const result = await panelStore.createSubscriptionWithCard({
          projectId,
          planId,
          modules,
          billingCycle: props.billingCycle,
          paymentMethod: cardDetails.value,
     })

     if (result.success) {
          emit('submit', result.subscription)
          emit('close')
     } else {
          errorMessage.value = result.error || t('panel.components.modal.upgradePayment.errorGeneric')
     }

     loading.value = false
}

const handleClose = () => {
     if (!loading.value) emit('close')
}
</script>
