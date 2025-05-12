<template>
     <div class="grid grid-cols-[232px_1fr] grid-rows-1 gap-0 h-full max-h-full overflow-hidden">
          <PanelHubChildSideMenu />

          <div data-radix-scroll-area-viewport class="overflow-hidden">
               xxxxxxxxxxxx
          </div>
     </div>
</template>
<script setup lang="ts">
const { t } = useI18n()
const layoutLoadingPanel = useState('layoutLoadingPanel')

onMounted(async () => {
     layoutLoadingPanel.value = false
})

definePageMeta({
     layout: 'panel'
})
</script>
