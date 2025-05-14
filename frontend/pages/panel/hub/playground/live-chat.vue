<template>
     <PanelPlaygroundLayout title="Playground">
          <PanelPlaygroundLiveChat />
     </PanelPlaygroundLayout>
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
