<template>
     <PanelModalBaseAddCard :title="t('panel.components.modal.upgradeAddCard.title')" @close="handleClose">
          <form @submit.prevent="submit">
               <div class="py-4 px-4 md:px-5 overflow-hidden transition opacity-100">
                    <div class="mb-6">
                         <div ref="paymentEl" class="min-h-[200px]" />
                    </div>

                    <p class="u-lh u-fs-sm u-color-textSecondary u-mt-2 p-TermsText TermsText Text--terms">
                         {{ t('panel.components.modal.upgradeAddCard.terms') }}
                    </p>
               </div>

               <div class="w-full h-px bg-border" />

               <div class="py-4 px-4 md:px-5 overflow-hidden flex items-center space-x-2">
                    <button
                         type="button"
                         @click="handleClose"
                         class="relative w-full h-[34px] flex items-center justify-center text-sm leading-4 px-3 py-2 rounded-md border bg-alternative hover:bg-selection text-foreground border-strong"
                         :disabled="loading"
                    >
                         {{ t('panel.components.modal.upgradeAddCard.cancel') }}
                    </button>

                    <button
                         type="submit"
                         :disabled="loading || !!error"
                         class="relative w-full h-[34px] flex items-center justify-center text-sm leading-4 px-3 py-2 rounded-md border bg-brand-500 text-white hover:bg-brand-600 border-brand-600"
                    >
                         <span v-if="!loading">{{ t('panel.components.modal.upgradeAddCard.confirm') }}</span>
                         <span v-else>{{ t('panel.components.modal.upgradeAddCard.processing') }}</span>
                    </button>
               </div>
          </form>
     </PanelModalBaseAddCard>
</template>

<script setup lang="ts">
const emit = defineEmits(['close', 'added'])
const { t } = useI18n()

const loading = ref(false)
const error = ref<string | null>(null)

const paymentEl = ref<HTMLDivElement | null>(null)
const paymentElement = ref<any>(null)

// Simulé ici → tu dois appeler ton API pour récupérer le `client_secret`
const clientSecret = ref<string>('')

// 👉 Simuler un appel à ton backend pour obtenir un SetupIntent
async function fetchClientSecret() {
     //const res = await $fetch('/api/stripe/setup-intent') // Exemple
     //clientSecret.value = res.client_secret
}

onMounted(async () => {
     await fetchClientSecret()

     const { stripeInstance, elementsInstance } = await useStripeElements(clientSecret.value)
     if (!stripeInstance || !elementsInstance) return

     paymentElement.value = elementsInstance.create('payment')
     paymentElement.value.mount(paymentEl.value)
})

function handleClose() {
     if (!loading.value) emit('close')
}

async function submit() {
     loading.value = true
     error.value = null

     try {
          const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!)
          const { error: stripeError } = await stripe!.confirmSetup({
               elements: paymentElement.value._elements,
               confirmParams: {
                    return_url: window.location.href
               },
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
