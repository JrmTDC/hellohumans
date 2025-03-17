<template>
     <div class="relative rounded-[12px] border border-[rgb(226,232,239)] mb-[20px]">
          <!-- Bouton d'ouverture/fermeture -->
          <button
               class="bg-transparent border-none m-0 p-0 w-full h-[62px] cursor-pointer flex"
               @click="toggleOpen">
               <h3 class="flex items-center mt-0 mb-0 text-[18px] leading-[23px] tracking-[-0.01em] w-auto max-w-[750px] rounded-t-[12px] p-[20px_20px_18px] font-medium"
               >{{ title }}</h3>
               <svgoIconErrgel class="w-[24px] h-[24px] ml-auto rotate-0 transition-transform duration-300 ease-in-out mr-[20px] mt-[20px]" :class="isOpen ? 'rotate-0' : 'rotate-180'" />
          </button>

          <!-- Contenu affiché si ouvert -->
          <div v-show="isOpen" class="h-auto transition-[height] duration-[421ms] ease-in-out border-t border-[rgb(239,242,246)] overflow-visible visible" v-auto-animate>
               <div class="p-[20px]">
                    <slot></slot>
               </div>
          </div>
     </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
     title: String
})

const isOpen = ref(false)

const toggleOpen = () => {
     isOpen.value = !isOpen.value
}
</script>
