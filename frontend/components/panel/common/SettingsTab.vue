<template>
  <div 
    class="relative px-[12px] pt-[16px] pb-[20px] text-[16px] transition-colors duration-200"
    :class="{
      'text-[#0566ff] border-b-[3px] border-b-[#0566ff]': active,
      'text-[#080f1a] hover:text-[#0566ff] cursor-pointer': !active,
    }"
    @click="!active && $emit('select')"
  >
    <div class="flex flex-row justify-center items-center">
      <div class="flex flex-row justify-start items-center">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  active: {
    type: Boolean,
    default: false
  }
});

defineEmits(['select']);
</script>
