<template>
     <PanelModalBaseAddCard :title="t('panel.components.modal.upgradeAddCard.title')" @close="handleClose">
          <form @submit.prevent="submit">
               <div class="py-4 px-4 md:px-5">
                    <div class="min-h-[240px]" ref="paymentElementRef" />
               </div>

               <div class="w-full h-px bg-border" />

               <div class="py-4 px-4 md:px-5 flex items-center space-x-2">
                    <button type="button" @click="handleClose" class="btn-secondary w-full" :disabled="loading">
                         {{ t('panel.components.modal.upgradeAddCard.cancel') }}
                    </button>
                    <button type="submit" :disabled="loading || !!error" class="btn-primary w-full">
                         <span v-if="!loading">{{ t('panel.components.modal.upgradeAddCard.confirm') }}</span>
                         <span v-else>{{ t('panel.components.modal.upgradeAddCard.processing') }}</span>
                    </button>
               </div>
          </form>
     </PanelModalBaseAddCard>
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
const paymentElementRef = ref<HTMLElement | null>(null)

onMounted(async () => {
     try {
          await panelStore.fetchStripeSetupIntent()
          const clientSecret = panelStore.stripe?.client_secret
          if (!clientSecret) {
               error.value = 'Impossible de récupérer la clé Stripe.'
               return
          }

          const { stripeInstance: stripe, elementsInstance } = await useStripeElements(clientSecret, 'setup')
          if (!stripe || !elementsInstance) {
               error.value = 'Erreur Stripe.'
               return
          }

          stripeInstance.value = stripe
          elements.value = elementsInstance

          await nextTick()

          paymentElement.value = elementsInstance.create('payment')
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
