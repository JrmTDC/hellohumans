<template>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const router = useRouter()

onMounted(async () => {
     await router.replace('/panel/dashboard')
})
</script>
