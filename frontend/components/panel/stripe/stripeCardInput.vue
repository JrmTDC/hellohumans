<template>
     <div>
          <div
               ref="cardElementRef"
               class="stripe-card-element w-full min-h-[50px] px-[14px] py-[12px] border-2 rounded-[8px]"
               :class="error ? 'border-[#e81332]' : 'border-[#d3dbe5]'"
          ></div>

          <p v-if="error" class="text-[12px] text-[#e81332] pt-[6px] pl-[4px]">{{ error }}</p>
     </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useStripeElements } from '~/composables/useStripeElements'

const props = defineProps<{ modelValue: any }>()
const emit = defineEmits(['update:modelValue', 'error'])

const cardElementRef = ref<HTMLDivElement | null>(null)
const card = ref<any>(null)
const error = ref<string | null>(null)

onMounted(async () => {
     const { stripeInstance, elementsInstance } = await useStripeElements()
     if (!stripeInstance || !elementsInstance) return

     if (card.value) {
          card.value.destroy()
     }

     card.value = elementsInstance.create('card', {
          style: {
               base: {
                    color: '#080f1a',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    '::placeholder': {
                         color: '#647491',
                    },
               },
               invalid: {
                    color: '#e81332',
               },
          },
     })

     card.value.mount(cardElementRef.value)

     // Écoute des erreurs
     card.value.on('change', (event: any) => {
          error.value = event.error?.message || null
          emit('error', error.value)
     })

     emit('update:modelValue', card.value)
})

onBeforeUnmount(() => {
     if (card.value) {
          card.value.destroy()
          card.value = null
     }
})
</script>
