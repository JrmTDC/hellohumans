<template>
     <Draggable
          v-model="modelValue"
          item-key="id"
          tag="div"
          :component-data="{ class: 'w-full space-y-[8px]' }"
          @end="onSorted"
     >
          <template #item="{ element }">
               <slot name="item" :item="element" />
          </template>
     </Draggable>
</template>

<script setup lang="ts">
import Draggable from 'vuedraggable'
const props = defineProps<{ modelValue: any[] }>()
const emit = defineEmits(['update:modelValue', 'sorted'])

const modelValue = computed({
     get: () => props.modelValue,
     set: (v) => emit('update:modelValue', v),
})

function onSorted() {
     emit('sorted', [...modelValue.value])
}
</script>
