<template>
     <div>
     </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
definePageMeta({
     layout: 'panel'
})

const router = useRouter()

onMounted(() => {
     const token = localStorage.getItem('token')
     if (!token) {
          router.push('/panel/login')
     }
     const pageTitle = useState('pageTitle')
     pageTitle.value = 'Paramètres'
})
</script>
