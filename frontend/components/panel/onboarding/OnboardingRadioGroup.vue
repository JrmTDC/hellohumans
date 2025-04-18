<template>
     <div class="flex flex-wrap gap-[12px] sm:gap-[16px]">
          <div v-for="option in options" :key="option.value" class="select-none min-w-[120px] bg-white p-[20px] border-[2px] rounded-[8px] flex items-center cursor-pointer transition-all duration-150" :class="{ 'border-[#0566ff]': isSelected(option.value), 'border-[#e2e8ef] hover:border-[#0566ff]': !isSelected(option.value) }" @click="toggle(option.value)">
               <component :is="option.icon" class="w-[24px] h-[24px] fill-[#647491] mr-[8px]" v-if="option.icon"/>
               <span class="text-[16px] leading-[20px] tracking-[-0.01em] font-medium text-[#080f1a]">{{ option.label }}</span>
          </div>
     </div>
</template>

<script setup lang="ts">
const props = defineProps<{
     modelValue: string | string[]
     options: { value: string; label: string; icon?: any }[]
     multiple?: boolean
}>()

const emit = defineEmits<{
     (e: 'update:modelValue', value: string | string[]): void
}>()

const isSelected = (value: string) => {
     return props.multiple
          ? (props.modelValue as string[]).includes(value)
          : props.modelValue === value
}

const toggle = (value: string) => {
     if (props.multiple) {
          const current = props.modelValue as string[]
          const newValue = current.includes(value)
               ? current.filter((v) => v !== value)
               : [...current, value]
          emit('update:modelValue', newValue)
     } else {
          emit('update:modelValue', value)
     }
}
</script>
