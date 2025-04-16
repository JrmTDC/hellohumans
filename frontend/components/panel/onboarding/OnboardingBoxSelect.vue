<template>
     <div class="flex flex-col gap-[12px] sm:grid sm:grid-cols-2">
          <div v-for="option in options" :key="option.value" class="flex flex-col justify-start items-start select-none bg-white p-[12px] sm:p-[20px] border-[2px]  rounded-[8px] cursor-pointer transition-all duration-150" :class="{'border-[#0566ff]': isSelected(option.value),'border-[1px] border-[#e2e8ef] hover:border-[#0566ff]': !isSelected(option.value)}" @click="toggle(option.value)">
               <div class="flex items-center">
                    <component :is="option.icon" class="w-[24px] h-[24px] fill-[#647491] min-w-[24px]" v-if="option.icon" />
                    <p class="ml-[8px] mt-0 mb-0 font-medium text-[16px] leading-[20px] tracking-[-0.01em] text-[#080f1a]">
                         {{ option.label }}
                    </p>
               </div>
               <span class="block w-[8px] min-w-[8px] h-[8px] min-h-[8px]" />
               <div class="flex items-start">
                    <span class="block w-[24px] min-w-[24px] h-[24px] min-h-[24px]" />
                    <p class="ml-[8px] mt-0 mb-0 text-[14px] leading-[18px] tracking-[-0.01em] text-[#647491]">
                         {{ option.description }}
                    </p>
               </div>
          </div>
     </div>
</template>

<script setup lang="ts">
interface BoxSelectOption {
     value: string
     label: string
     description?: string
     icon?: any
}

const props = defineProps<{
     modelValue: string | string[]
     options: BoxSelectOption[]
     multiple?: boolean
}>()

const emit = defineEmits<{
     (e: 'update:modelValue', value: string | string[]): void
}>()

function isSelected(value: string) {
     return props.multiple
          ? (props.modelValue as string[]).includes(value)
          : props.modelValue === value
}

function toggle(value: string) {
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
