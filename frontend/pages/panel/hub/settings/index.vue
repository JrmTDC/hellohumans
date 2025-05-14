<template>
     <div>
          <p>Redirection vers les paramètres généraux...</p>
     </div>
</template>

<script setup lang="ts">
const layoutLoadingPanel = useState('layoutLoadingPanel')
const router = useRouter()
onMounted(async () => {
     layoutLoadingPanel.value = false
     await router.replace('/panel/hub/settings/general')
})
definePageMeta({
     layout: 'panel',
})
</script>
