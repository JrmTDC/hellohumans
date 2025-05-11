<template>
     <div class="relative overflow-hidden bg-[#f5f7f9] z-[1]">
          <div class=" overflow-x-hidden w-full h-full">
               <div class="min-w-full table min-h-full h-full">
                    <PanelCommonChildSideMenu :items="menuItems" :subs="menuSubs"/>
               </div>
          </div>
     </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
import iconHub from "assets/icons/panel/hub/iconHub.svg";
import iconDataSource from "assets/icons/panel/hub/iconDataSource.svg";
import iconDataSuggestion from "assets/icons/panel/hub/iconDataSuggestion.svg";
import iconKnowledge from "assets/icons/panel/hub/iconKnowledge.svg";
import iconPlayground from "assets/icons/panel/hub/iconPlayground.svg";
import iconSetup from "assets/icons/panel/hub/iconSetup.svg";
import iconTask from "assets/icons/panel/hub/iconTask.svg";

const menuItems = ref([
     { type: 'link', icon: rawIcon(iconHub), routeURL: '/panel/hub', name: t('panel.components.hubChildSideMenu.menuItems.hub') },
     { id:'knowledge', type: 'link', icon: rawIcon(iconKnowledge), routeURL: '/panel/hub/a', name: t('panel.components.hubChildSideMenu.menuItems.knowledge') },
     { type: 'link', icon: rawIcon(iconPlayground), routeURL: '/panel/hub/a', name: t('panel.components.hubChildSideMenu.menuItems.playground') },
     { type: 'link', icon: rawIcon(iconTask), routeURL: '/panel/hub/a', name: t('panel.components.hubChildSideMenu.menuItems.task'), beta:true },
     { type: 'link', icon: rawIcon(iconSetup), routeURL: '/panel/hub/a', name: t('panel.components.hubChildSideMenu.menuItems.setup') }
])

const menuSubs = ref([
     { sub:'knowledge', type: 'link', icon: rawIcon(iconDataSource), routeURL: '/panel/hub/a', name: t('panel.components.hubChildSideMenu.menuItems.dataSource') },
     { sub:'knowledge', type: 'link', icon: rawIcon(iconDataSuggestion), routeURL: '/panel/hub/a', name: t('panel.components.hubChildSideMenu.menuItems.dataSuggestion') },
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

