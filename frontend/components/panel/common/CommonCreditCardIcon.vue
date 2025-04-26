<template>
     <component :is="resolvedComponent" :class="props.class" />
</template>

<script setup lang="ts">
import { computed, resolveComponent } from 'vue'

const props = defineProps<{
     brand: string
     class?: string
}>()

const availableIcons = [
     'visa',
     'mastercard',
     'amex',
     'discover',
     'amazon',
     'apple-pay',
     'diners-club',
     'paypal',
     'bitcoin',
     'maestro'
]

const brandSlug = computed(() => props.brand.toLowerCase())

const resolvedComponent = computed(() => {
     const dynamicName = `svgo-panel-credit-cards-${brandSlug.value}`
     const fallbackName = 'svgo-panel-credit-cards-generic'

     try {
          return availableIcons.includes(brandSlug.value)
               ? resolveComponent(dynamicName)
               : resolveComponent(fallbackName)
     } catch (e) {
          return resolveComponent(fallbackName)
     }
})
</script>
