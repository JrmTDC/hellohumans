<template>
     <div class="relative overflow-hidden bg-[#f5f7f9] z-[1]">
          <div class=" overflow-x-hidden w-full h-full">
               <div class="min-w-full table min-h-full h-full">
                    <PanelCommonChildSideMenu :items="menuItems" :subs="menuSubs" :extLinks="menuExtLinks"/>
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
     {
          id: 'hub',
          type: 'link',
          icon: rawIcon(iconHub),
          routeURL: '/panel/hub',
          name: t('panel.components.hubChildSideMenu.menuItems.hub'),
          isActive: undefined,
          beta: false,
          disabled: false
     },
     {
          id:'knowledge',
          type: 'submenu',
          icon: rawIcon(iconKnowledge),
          routeURL: '',
          name: t('panel.components.hubChildSideMenu.menuItems.knowledge'),
          isActive: undefined,
          beta: false,
          disabled: false
     },
     {
          id:'playground',
          type: 'link',
          icon: rawIcon(iconPlayground),
          routeURL: '/panel/hub/playground',
          name: t('panel.components.hubChildSideMenu.menuItems.playground'),
          isActive: (route: { path: string }) => route.path.startsWith('/panel/hub/playground/live-chat'),
          beta: false,
          disabled: false
     },
     {
          id:'task',
          type: 'link',
          icon: rawIcon(iconTask),
          routeURL: '/panel/hub/tasks',
          name: t('panel.components.hubChildSideMenu.menuItems.task'),
          isActive: undefined,
          beta:true,
          disabled: true,
     },
     {
          id:'setup',
          type: 'link',
          icon: rawIcon(iconSetup),
          routeURL: '/panel/hub/settings/general',
          name: t('panel.components.hubChildSideMenu.menuItems.setup'),
          isActive: (route: { path: string }) => route.path.startsWith('/panel/hub/settings'),
          beta: false,
          disabled: false
     }
])

const menuSubs = ref([
     {
          sub: 'knowledge',
          icon: rawIcon(iconDataSource),
          routeURL: '/panel/hub/data-sources/added',
          name: 'Source de données' },
     {
          sub: 'knowledge',
          icon: rawIcon(iconDataSuggestion),
          routeURL: '/panel/hub/data-sources/suggestions',
          name: 'Suggestions de données'
     },
])
const menuExtLinks = ref([
     {
          routeURL: '/panel/analytics',
          name: 'Analytique'
     }
])

const { pageHeaderTitle, pageHeaderBilled, pageHeaderPaid, pageMenuPanel, setMeta } = usePanelPageMeta()
const pageTitle = computed(() => t('panel.components.hubChildSideMenu.metaTitle'));
const pageDescription = computed(() => t('panel.components.hubChildSideMenu.metaDescription'));
const config = useRuntimeConfig()
watchEffect(() => {
     setMeta({
          title: pageTitle.value,
          description: pageDescription.value
     });
})
watch(() =>  t('panel.components.hubChildSideMenu.title', { botName: config.public.chatBotName }), (newValue) => {
     pageHeaderTitle.value = newValue
})
pageHeaderTitle.value = t('panel.components.hubChildSideMenu.title', { botName: config.public.chatBotName })
pageHeaderBilled.value = false
pageHeaderPaid.value = false
pageMenuPanel.value = true
</script>

