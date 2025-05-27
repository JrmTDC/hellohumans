<template></template>
<script setup lang="ts">
const layoutLoadingPanel = useState('layoutLoadingPanel')
const router = useRouter()
onMounted(async () => {
     layoutLoadingPanel.value = false
     await router.replace('/panel/settings/billing/subscription')
})
definePageMeta({
     layout: 'panel',
})
</script>
