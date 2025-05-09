<template>
     <div class="relative overflow-hidden bg-[#f5f7f9] z-[1]">
          <div class=" overflow-x-hidden w-full h-full">
               <div class="min-w-full table min-h-full h-full">
                    <PanelCommonChildSideMenu :items="menuItems"/>
               </div>
          </div>
     </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
import iconTemp from "assets/icons/panel/iconUsageMenu.svg";
const menuItems = ref([
     { type: 'link', icon: rawIcon(iconTemp), routeURL: '/panel/hub', name: t('panel.components.hubChildSideMenu.menu.page1') },
     { type: 'link', icon: rawIcon(iconTemp), routeURL: '/panel/hub/pageUrls', name: t('panel.components.hubChildSideMenu.menu.page2') },
     { type: 'link', icon: rawIcon(iconTemp), routeURL: '/panel/hub/contenu', name: t('panel.components.hubChildSideMenu.menu.page3') },
     { type: 'link', icon: rawIcon(iconTemp), routeURL: '/panel/hub/questions', name: t('panel.components.hubChildSideMenu.menu.page4') }
])
const { pageHeaderTitle, pageHeaderBilled, pageHeaderPaid, pageMenuPanel, setMeta } = usePanelPageMeta()
const pageTitle = computed(() => t('panel.components.hubChildSideMenu.metaTitle'));
const pageDescription = computed(() => t('panel.components.hubChildSideMenu.metaDescription'));

watchEffect(() => {
     setMeta({
          title: pageTitle.value,
          description: pageDescription.value
     });
})
watch(() =>  t('panel.components.hubChildSideMenu.title'), (newValue) => {
     pageHeaderTitle.value = newValue
})
pageHeaderTitle.value = t('panel.components.hubChildSideMenu.title')
pageHeaderBilled.value = false
pageHeaderPaid.value = false
pageMenuPanel.value = true
</script>

