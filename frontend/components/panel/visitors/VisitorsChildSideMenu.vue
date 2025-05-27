<template>
     <div class="relative overflow-hidden bg-[#f5f7f9] z-[1]">
          <div class=" overflow-x-hidden w-full h-full">
               <div class="min-w-full table min-h-full h-full">
                    <PanelCommonChildSideMenu :items="menuItems" :groups="menuGroups" />
               </div>
          </div>
     </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const panelStore = usePanelStore()
const menuGroups = ref([
     {
          id: 'visitors',
          name: 'Visiteurs'
     },
     {
          id: 'leads',
          name: 'Leads'
     }
])

const menuItems = ref([
     {
          id: 'visitors',
          group:'visitors',
          type: 'link',
          routeURL: '/panel/customers/visitors',
          name: 'Disponible',
          isActive: undefined,
          beta: false,
          disabled: false,
          count: panelStore.visitors.count
     },
     {
          id: 'leadsAll',
          group: 'leads',
          type: 'link',
          routeURL: '/panel/customers/leads',
          name: 'Tous les contacts',
          isActive: undefined,
          beta: false,
          disabled: false
     }
])

const { pageHeaderTitle, pageHeaderBilled, pageHeaderPaid, pageMenuPanel, setMeta } = usePanelPageMeta()
const pageTitle = computed(() => t('panel.pages.customers.metaTitle'));
const pageDescription = computed(() => t('panel.pages.customers.metaDescription'));
const config = useRuntimeConfig()
watchEffect(() => {
     setMeta({
          title: pageTitle.value,
          description: pageDescription.value
     });
})
watch(() =>  t('panel.pages.customers.title', { botName: config.public.chatBotName }), (newValue) => {
     pageHeaderTitle.value = newValue
})
pageHeaderTitle.value = t('panel.pages.customers.title')
pageHeaderBilled.value = false
pageHeaderPaid.value = false
pageMenuPanel.value = true
</script>
