<template></template>
<script setup lang="ts">
const layoutLoadingPanel = useState('layoutLoadingPanel')
const router = useRouter()
onMounted(async () => {
     layoutLoadingPanel.value = false
     await router.replace('/panel/hub/tasks/list')
})
definePageMeta({
     layout: 'panel',
})
</script>
