<template>
     <div id="hellohumans-loading" class="fixed inset-0 bg-[#001433] z-[2147483647] grid place-items-center transition-opacity duration-300">
     </div>
</template>
<script setup lang="ts">
const { t } = useI18n()
const router = useRouter()

onMounted(async () => {
     await nextTick(() => {
          window.location.href = '/panel/dashboard'
     })
})

usePanelPageMeta().setMeta({
     title: t('panel.layout.menu.metaTitle'),
})
</script>
