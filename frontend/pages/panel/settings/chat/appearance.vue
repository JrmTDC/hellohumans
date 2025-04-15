<template>
     <div>
     </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'

const pageTitle = useState('pageTitle', () => '')
const pageIsBilled = useState('pageIsBilled', () => false)
const pageIsPaid = useState('pageIsPaid', () => false)

onMounted(async () => {
     pageTitle.value = 'Paramètres'
     pageIsBilled.value = false
     pageIsPaid.value = false
})
definePageMeta({
     layout: 'panel-menu'
})
</script>
