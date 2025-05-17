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

</script>
