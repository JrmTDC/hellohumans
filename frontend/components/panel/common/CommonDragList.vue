<template>
     <Draggable :list="list"
     item-key="id"
     handle=".drag-handle"
     tag="div"
     :animation="180"
     class="w-full space-y-[8px]"
     ghost-class="drag-ghost"
     @end="emitSorted"
     >
     <!-- La racine du slot DOIT avoir la key -->
     <template #item="{ element }">
          <PanelCommonSuggestionItem
               :key="element.id"
               :item="element"
               @delete="id => $emit('delete', id)"
          />
     </template>
     </Draggable>
</template>

<script setup lang="ts">
import Draggable from 'vuedraggable'

const props = defineProps<{ list: any[] }>()
const emit  = defineEmits(['update:list', 'sorted', 'delete'])

function emitSorted () {
     emit('sorted', props.list)
     emit('update:list', props.list)   // garde le parent synchronisé
}
</script>

<style scoped>
.drag-ghost { opacity: 0.4; }
</style>
