<template>
     <PanelTaskLayout title="Tâches">

     </PanelTaskLayout>
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
