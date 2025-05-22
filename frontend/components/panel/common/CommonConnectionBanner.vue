<template>
     <div v-if="show" class="fixed top-0 left-1/2 transform -translate-x-1/2 text-[rgb(8,15,26)] z-[999999] bg-[rgb(255,194,97)] text-center text-[14px] leading-[18px] tracking-[-0.01em] rounded-b-[3px] shadow-[0_1px_3px_rgba(0,20,51,0.24)] px-[20px] py-[7px] transition-all duration-300">
          Toutes nos excuses. <strong>HelloHumans a rencontré des problèmes de connexion.</strong>
          <span v-if="countdown > 0">Nouvelle tentative dans {{ countdown }}s.</span>
     </div>
</template>
<script setup lang="ts">
     const props = defineProps<{ show: boolean; countdown: number }>()
</script>
