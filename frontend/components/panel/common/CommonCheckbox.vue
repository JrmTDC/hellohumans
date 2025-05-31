<template>
     <label class="flex cursor-pointer relative">
          <input type="checkbox" class="absolute w-0 h-0 m-[-1px] p-0 overflow-hidden clip-[rect(0px,0px,0px,0px)] border-0" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)"/>
          <div class="flex flex-row justify-start items-center">
               <div class="flex items-start justify-start rounded-[5px]">
                    <component :is="modelValue ?  rawIcon(checkedIcon) : rawIcon(uncheckedIcon)" class="min-w-[24px] min-h-[24px] w-[24px] h-[24px] self-baseline" :class="{'fill-[#0566ff] hover:fill-[#0049bd]': modelValue, 'fill-[rgb(100,116,145)] hover:fill-[#0049bd]': !modelValue}"/>
               </div>
          </div>
     </label>
</template>

<script setup lang="ts">
defineProps<{
     modelValue: boolean
}>()

defineEmits(['update:modelValue'])

import checkedIcon from "assets/icons/panel/customers/iconCheckOn.svg";
import uncheckedIcon from "assets/icons/panel/customers/iconCheckOff.svg";

</script>
