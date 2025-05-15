<template>
     <PanelModalBaseAds v-if="showModal" @close="closeModal">
          <div class="text-center">
               <p class="mb-6 text-gray-700">
                    <slot name="content"></slot>
               </p>
               <button @click="closeModal" class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">ssss</button>
               <button v-if="showLearnMore" @click="handleLearnMore" class="ml-4 px-6 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors">qsdsqd</button>
          </div>
     </PanelModalBaseAds>
</template>

<script setup lang="ts">
const { t } = useI18n()
const props = defineProps({
     modalId: {
          type: String,
          required: true
     },
     title: {
          type: String,
          default: () => "sdqdqs"
     },
     showLearnMore: {
          type: Boolean,
          default: false
     },
     delay: {
          type: Number,
          default: 1000
     }
})

const emit = defineEmits(['learn-more'])
const showModal = ref(false)
const modalShownKey = `modal_shown_${props.modalId}`
onMounted(() => {
     const hasModalBeenShown = localStorage.getItem(modalShownKey)
     if (!hasModalBeenShown) {
          setTimeout(() => {
               showModal.value = true
          }, props.delay)
     }
})

const closeModal = () => {
     localStorage.setItem(modalShownKey, 'true')
     showModal.value = false
}

const handleLearnMore = () => {
     emit('learn-more')
     closeModal()
}
</script>
