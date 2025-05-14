<template>
</template>
<script setup lang="ts">
const layoutLoadingPanel = useState('layoutLoadingPanel')
const router = useRouter()
onMounted(async () => {
     await router.replace('/panel/hub/settings/general')
})
definePageMeta({
     layout: 'panel'
})
</script>
