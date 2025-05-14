<template>
     <label class="relative inline-flex items-center h-[22px] w-[36px]" :class="{ 'cursor-pointer': !disabled, 'cursor-not-allowed opacity-60': disabled }" @click="!disabled && toggle()">
          <!-- Input caché pour l'accessibilité -->
          <input type="checkbox" :checked="modelValue" :disabled="disabled" class="sr-only peer" @change="!disabled && toggle()">
          <!-- Track du toggle -->
          <div class="w-full h-full rounded-[17px] transition-colors duration-200 ease-in-out" :class="[modelValue ? 'border border-[#0566ff] bg-[#0566ff] shadow-[inset_0_0_0_11px_rgb(5,102,255)]' : 'border border-[#d3dbe5] bg-[#f5f7f9]',{ 'opacity-60': disabled }]">
               <!-- Handle du toggle -->
               <div class="absolute top-[2px] bottom-[2px] w-[18px] rounded-full bg-white transition-all duration-200 ease-in-out shadow-[0_2px_8px_rgba(0,20,51,0.28)]" :class="modelValue ? 'left-[calc(100%-20px)]' : 'left-[2px]'"></div>
          </div>
     </label>
</template>
<script setup lang="ts">
const props = defineProps({
     modelValue: {
          type: Boolean,
          required: true
     },
     disabled: {
          type: Boolean,
          default: false
     }
})
const emit = defineEmits(['update:modelValue'])
const toggle = () => {
     if (!props.disabled) {
          emit('update:modelValue', !props.modelValue)
     }
}
</script>
