<template>
     <PanelModalBaseMini :title="t('panel.components.modal.upgradeAddCard.title')" @close="handleClose">
          <form @submit.prevent="submit">
               <div class="py-4 px-4 md:px-5">
                    <div ref="paymentElementRef" />
               </div>
               <div v-if="showBottomButton" class="border-t py-4 px-4 md:px-5 space-x-2 flex flex-row flex-nowrap justify-between">
                    <button type="button" @click="handleClose" class="text-[#647491] hover:underline" :disabled="loading">
                         {{ t('panel.components.modal.upgradeAddCard.cancel') }}
                    </button>
                    <button type="submit" :disabled="loading || !!error" class="px-6 py-2 rounded-md" :class="loading ? 'bg-[#eff2f6] text-[#acb8cb] cursor-not-allowed' : 'bg-[#0566ff] hover:bg-[#0049bd] text-[#fff]'">
                         <span v-if="!loading">{{ t('panel.components.modal.upgradeAddCard.confirm') }}</span>
                         <span v-else>{{ t('panel.components.modal.upgradeAddCard.processing') }}</span>
                    </button>
               </div>
          </form>
     </PanelModalBaseMini>
</template>

<script setup lang="ts">
const { t } = useI18n()
const panelStore = usePanelStore()
const emit = defineEmits(['close', 'added'])

const loading = ref(true)
const error = ref<string | null>(null)

const stripeInstance = ref<any>(null)
const elements = ref<any>(null)
const paymentElement = ref<any>(null)

// Configuration du formulaire Stripe
const paymentMethodTypes = ['card']
const paymentElementRef = ref<HTMLElement>()
const showBottomButton = ref(false)

onMounted(async () => {
     try {
          await panelStore.fetchStripeSetupIntent()
          const clientSecret = panelStore.stripe?.setup_intent?.client_secret

          if (!clientSecret) {
               error.value = 'Impossible de récupérer la clé Stripe.'
               return
          }

          const { stripeInstance: stripe, elementsInstance } = await useStripeElements(clientSecret)
          if (!stripe || !elementsInstance) {
               error.value = 'Erreur Stripe.'
               return
          }

          stripeInstance.value = stripe
          elements.value = elementsInstance

          await nextTick()

          // Créer l'élément et le monter
          paymentElement.value = elementsInstance.create('payment', {
               allowedPaymentMethods: paymentMethodTypes,
               layout: 'tabs'
          })

          // Ajouter un listener pour détecter quand l'élément est prêt
          paymentElement.value.on('ready', () => {
               showBottomButton.value = true
          })

          paymentElement.value.mount(paymentElementRef.value!)
     } catch (e) {
          error.value = 'Erreur pendant l’initialisation.'
          console.error(e)
     } finally {
          loading.value = false
     }
})

function handleClose() {
     if (!loading.value) emit('close')
}

async function submit() {
     if (!stripeInstance.value || !elements.value) {
          error.value = 'Stripe non prêt.'
          return
     }

     loading.value = true
     error.value = null

     try {
          const { error: stripeError } = await stripeInstance.value.confirmSetup({
               elements: elements.value,
               confirmParams: { return_url: window.location.href },
               redirect: 'if_required'
          })

          if (stripeError) {
               error.value = stripeError.message || 'Erreur lors de l’ajout de la carte.'
               return
          }

          emit('added')
          handleClose()
     } catch (err: any) {
          error.value = err.message || 'Erreur inconnue'
     } finally {
          loading.value = false
     }
}
</script>
