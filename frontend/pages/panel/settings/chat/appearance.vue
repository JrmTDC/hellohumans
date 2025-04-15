<template>
     <div>
     </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'

const { t } = useI18n()
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
usePanelPageMeta( t('panel.pages.settings.chat.appearance.megaTitle'), t('panel.pages.settings.chat.appearance.megaDescription'))
</script>
