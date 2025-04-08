<template>
     <baseModal title="Payer à l’aide d’une carte" @close="handleClose">
          <form @submit.prevent="submit">
               <!-- Carte de paiement -->
               <div class="mb-[24px]">
                    <label class="block text-[#647491] text-[14px] leading-[18px] mb-[6px]">Carte de crédit</label>
                    <stripeCardInput v-model="cardDetails" @error="cardError = $event" />
               </div>

               <!-- Total -->
               <div class="flex flex-row items-center justify-center mb-[24px]">
                    <span class="text-[16px] leading-[31px] mr-[5px]">Total :</span>
                    <span class="text-[32px] leading-[41px] font-semibold text-[#080f1a]">{{ total }}€</span>
                    <span class="text-[15px] text-[#080f1a] font-semibold ml-[4px]">
          {{ billingCycle === 'monthly' ? '/mois' : '/an' }}
        </span>
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
                         :class="[
            'w-full rounded-[8px] text-[18px] h-[46px] px-[20px] flex items-center justify-center',
            loading ? 'bg-[#d3dbe5] text-[#647491] cursor-not-allowed' : 'bg-[#0566ff] text-white hover:bg-[#0049bd]'
          ]"
                    >
                         <span v-if="!loading">Soumettre la commande</span>
                         <span v-else>Traitement en cours…</span>
                    </button>

                    <button
                         type="button"
                         @click="handleClose"
                         :disabled="loading"
                         class="bg-white text-[#647491] text-[14px] mt-[10px] h-[26px] flex items-center justify-center border-none rounded-[4px] cursor-pointer"
                    >
                         Retour
                    </button>
               </div>
          </form>
     </baseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePanelStore } from '~/stores/panelStore'
import baseModal from '~/components/panel/modal/baseModal.vue'
import stripeCardInput from '~/components/panel/stripe/stripeCardInput.vue'

const emit = defineEmits(['close', 'submit'])
const props = defineProps<{
     total: number
     billingCycle: 'monthly' | 'annual'
}>()

const panelStore = usePanelStore()
const cardDetails = ref<any>(null)
const cardError = ref<string | null>(null)
const loading = ref(false)
const errorMessage = ref('')

const submit = async () => {
     if (!cardDetails.value || cardError.value) return

     loading.value = true
     errorMessage.value = ''

     const result = await panelStore.payWithCard(props.total, cardDetails.value)

     if (result.success) {
          emit('submit', result.intent)
          emit('close')
     } else {
          errorMessage.value = result.error || 'Une erreur est survenue'
     }

     loading.value = false
}

const handleClose = () => {
     if (!loading.value) emit('close')
}
</script>
