<template>
     <label class="flex cursor-pointer relative">
          <input
               type="checkbox"
               class="absolute w-0 h-0 m-[-1px] p-0 overflow-hidden clip-[rect(0px,0px,0px,0px)] border-0"
               :checked="modelValue"
               @change="$emit('update:modelValue', $event.target.checked)"
          />
          <div class="flex flex-row justify-start items-center">
               <div class="flex items-start justify-start rounded-[5px]">
                    <component
                         :is="modelValue ? checkedIcon : uncheckedIcon"
                         class="min-w-[24px] min-h-[24px] w-[24px] h-[24px] self-baseline"
                    />
               </div>
          </div>
     </label>
</template>

<script setup lang="ts">
defineProps<{
     modelValue: boolean
     checkedIcon?: any
     uncheckedIcon?: any
}>()

defineEmits(['update:modelValue'])

const selectedLeadIds = ref<string[]>([])

const allSelected = computed({
     get: () => leads.length > 0 && selectedLeadIds.value.length === leads.length,
     set: (val) => {
          selectedLeadIds.value = val ? leads.map(l => l.id) : []
     }
})

const isSelected = (id: string) => selectedLeadIds.value.includes(id)

const toggleSelection = (id: string, checked: boolean) => {
     selectedLeadIds.value = checked
          ? [...selectedLeadIds.value, id]
          : selectedLeadIds.value.filter(i => i !== id)
}


</script>
