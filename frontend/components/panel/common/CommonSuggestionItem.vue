<template>
     <div class="flex items-center p-3 rounded-xl mb-2 bg-[#f5f7f9]">
          <SvgoPanelSettingsIconDragDrop class="drag-handle w-6 h-6 fill-[#647491] cursor-grab"/>
          <PanelCommonTooltip :text="item.enabled ? 'Désactiver' : 'Activer'" left-ajust="-10" placement="bottom" variant="white" >
               <PanelCommonToggleSwitch class="ml-3" v-model="item.enabled" />
          </PanelCommonTooltip>
          <input v-model="item.label" placeholder="Libellé…" maxlength="500" class="flex-1 ml-3 h-[34px] px-3 text-sm text-[#080f1a] border-2 border-[#d3dbe5] rounded-lg bg-white outline-none focus:border-[#0566ff] hover:border-[#acb8cb]"/>
          <button @click="$emit('delete', item.id)" class="ml-3 p-1 rounded hover:bg-[#FCD9DE] active:bg-[#f8a6b2]">
               <SvgoPanelSettingsIconTrash class="w-5 h-5 fill-[#647491] hover:fill-[rgb(232,19,50)]"/>
          </button>
     </div>
</template>
<script setup lang="ts">
interface Suggestion {
     id: string
     label: string
     enabled: boolean
     order: number
}
defineProps<{
     item: Suggestion
}>()

defineEmits<{
     (e: 'delete', id: string): void
}>()
</script>
