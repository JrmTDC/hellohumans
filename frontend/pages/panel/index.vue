<template>
     <LoadingOverlay />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import LoadingOverlay from '~/components/panel/common/LoadingOverlay.vue'

const router = useRouter()

onMounted(async () => {
     await router.replace('/panel/dashboard')
})
</script>
