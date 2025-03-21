<template>
     <div class="relative rounded-[12px] border border-[rgb(226,232,239)] mb-[20px]">
          <!-- Bouton d'ouverture/fermeture -->
          <button
               class="bg-transparent border-none m-0 p-0 w-full h-[62px] cursor-pointer flex"
               @click="toggleOpen">
               <h3 class="flex items-center mt-0 mb-0 text-[18px] leading-[23px] tracking-[-0.01em] w-auto max-w-[750px] rounded-t-[12px] p-[20px_20px_18px] font-medium"
               >{{ title }} <div v-if="isBilled" :class="isPaid ? 'bg-[rgb(190,255,203)]' : 'bg-[rgb(255,219,186)]'" class="p-[3px_5px] rounded-[4px] block ml-[8px]" > <div class="flex flex-row justify-start items-center"> <svgoIconPremium class="w-[14px] h-[14px] block fill-[rgb(8,15,26)] transition-none mr-0" /> <p class="mt-0 mb-0 ml-[2px] font-normal text-[12px] leading-[16px] tracking-[-0.01em]"> {{ isPaid ? 'Payé' : 'Payant' }} </p> </div> </div></h3>
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

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
     title: String,
     isBilled: Boolean, // Indique si le module est facturé
     isPaid: Boolean // Indique si le module est payé
})

const isOpen = ref(false)

const toggleOpen = () => {
     isOpen.value = !isOpen.value
}
</script>
