<template>
     <nav class="app-nav z-[650] text-[#8796af] flex flex-row items-stretch justify-start">
          <ul class="w-[65px] border-r border-[#e2e8ef] m-0 p-[4px] list-none bg-[#f5f7f9] flex flex-col z-[650]">

               <!-- Éléments du haut -->
               <li v-for="item in topItems" >
                    <PanelCommonTooltip :text="item.tooltip" left-ajust="-10" placement="right" variant="blue" uppercase >
                         <NuxtLink v-if="item.type === 'link'" :to="item.routeURL" :class="{ 'text-white bg-[#dce9ff]': route.path.startsWith(item.routeURL)}" class="nav-link w-[56px] h-[56px] rounded-[12px] border-[4px] border-[#f5f7f9] block text-center relative hover:bg-[#e2e8ef] outline-none">
                              <span class="absolute inset-0 outline-none flex items-center justify-center flex-col">
                                   <component :is="item.icon" class="fill-[rgb(53,72,105)] w-[24px] h-[24px]" />
                                   <span v-if="item.count" class="flex items-center justify-center font-medium flex-shrink-0 bg-[#647491] text-white min-w-[14px] h-[14px] rounded-[5px] px-[4px] py-0 text-[9px] leading-[12px] tracking-[0em] absolute right-[6px] top-[6px]">{{ item.count }}</span>
                              </span>
                         </NuxtLink>
                    </PanelCommonTooltip>
               </li>

               <!-- Séparateur -->
               <div class="m-auto"></div>

               <!-- Éléments du bas -->
               <li v-for="item in bottomItems">
                    <PanelCommonTooltip :text="item.tooltip" left-ajust="-10" placement="right" variant="blue" uppercase>
                         <NuxtLink v-if="item.type === 'link'" :to="item.routeURL" :class="{ 'text-white bg-[#dce9ff]': route.path.startsWith(item.routeURL)}" class="nav-link w-[56px] h-[56px] rounded-[12px] border-[4px] border-[#f5f7f9] block text-center relative hover:bg-[#e2e8ef]">
                              <span class="absolute inset-0 outline-none flex items-center justify-center flex-col">
                                   <component :is="item.icon" class="fill-[rgb(53,72,105)] w-[24px] h-[24px]" />
                                   <span v-if="item.count && item.count > 0" class="flex items-center justify-center font-medium flex-shrink-0 bg-[#647491] text-white min-w-[14px] h-[14px] rounded-[5px] px-[4px] py-0 text-[9px] leading-[12px] tracking-[0em] absolute right-[6px] top-[6px]">{{ item.count }}</span>
                              </span>
                         </NuxtLink>
                         <button v-else @click="toggleSideMenuUser" class="nav-link w-[56px] h-[56px] rounded-[12px] border-[4px] border-[#f5f7f9] block text-center relative">
                              <span class="absolute inset-0 outline-none flex items-center justify-center flex-col">
                                   <component :is="item.icon" class="fill-[rgb(53,72,105)] w-[32px] h-[32px]" />
                              </span>
                         </button>
                    </PanelCommonTooltip>
               </li>
          </ul>
          <PanelLayoutSideMenu
               v-if="showSideUserMenu"
               @closeSideUserMenu="showSideUserMenu = false"
               @openCreateClient="handleCreateClient"
               @openCreateProjectModal="openCreateProjectModal" />
     </nav>
     <PanelModalCreateProject
          v-if="showCreateProjectModal"
          @close="showCreateProjectModal = false"
          @create="handleCreateProject"
     />
</template>

<script setup lang="ts">
import iconMenuLogo from '~/assets/icons/panel/logoHelloHumansMini.svg'
import iconMenuRobot from '~/assets/icons/panel/iconMenuRobot.svg'
import iconMenuFlow from '~/assets/icons/panel/iconMenuFlow.svg'
import iconMenuSetting from '~/assets/icons/panel/iconMenuSetting.svg'
import iconUserPicture from '~/assets/icons/panel/iconMenuUserPicture.svg'
import iconMenuModule from '~/assets/icons/panel/iconMenuModule.svg'
import iconMenuBulb from '~/assets/icons/panel/iconMenuBulb.svg'
import iconMenuAnalytic from '~/assets/icons/panel/iconMenuAnalytic.svg'
import iconMenuCustomerVisitors from '~/assets/icons/panel/iconMenuCustomerVisitors.svg'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const panelStore = usePanelStore()
/*
     { position: 'bottom', type: 'link', icon: rawIcon(iconMenuBulb), routeURL: '/panel/getting-started', tooltip: t('panel.components.layout.menuNavPage.gettingStarted') },
     { position: 'bottom', type: 'link', icon: rawIcon(iconMenuModule), routeURL: '/panel/integrations', tooltip: t('panel.components.layout.menuNavPage.integrations') },
 */
const menuItems = ref([
     {
          position: 'top',
          type: 'link',
          icon: rawIcon(iconMenuLogo),
          routeURL: '/panel/dashboard',
          tooltip: t('panel.components.layout.menuNavPage.dashboard'),
          tooltipKey: 'panel.components.layout.menuNavPage.dashboard'
     },
     {
          position: 'top',
          type: 'link',
          icon: rawIcon(iconMenuRobot),
          routeURL: '/panel/hub',
          tooltip: t('panel.components.layout.menuNavPage.siteAnalysis', { botName: config.public.chatBotName }),
          tooltipKey: 'panel.components.layout.menuNavPage.siteAnalysis'
     },
     {
          position: 'top',
          type: 'link',
          icon: rawIcon(iconMenuCustomerVisitors),
          routeURL: '/panel/customers',
          tooltip: t('panel.components.layout.menuNavPage.visitors'),
          tooltipKey: 'panel.components.layout.menuNavPage.visitors',
          count: panelStore.visitors.length
     },
     {
          position: 'top',
          type: 'link',
          icon: rawIcon(iconMenuAnalytic),
          routeURL: '/panel/analytics',
          tooltip: t('panel.components.layout.menuNavPage.analytics'),
          tooltipKey: 'panel.components.layout.menuNavPage.analytics'
     },
     {
          position: 'bottom',
          type: 'link',
          icon: rawIcon(iconMenuSetting),
          routeURL: '/panel/settings/chat/appearance',
          tooltip: t('panel.components.layout.menuNavPage.settings'),
          tooltipKey: 'panel.components.layout.menuNavPage.settings' },
     {
          position: 'bottom',
          type: 'button',
          icon: rawIcon(iconUserPicture),
          routeURL: null,
          tooltip: t('panel.components.layout.menuNavPage.account'),
          tooltipKey: 'panel.components.layout.menuNavPage.account'
     }
])

// Watch pour mettre à jour les tooltips lors du changement de langue
watch(() => t('panel.components.layout.menuNavPage.dashboard'), () => {
     menuItems.value = menuItems.value.map(item => ({
         ...item,
         tooltip: t(item.tooltipKey)
     }))
})


// Séparer les éléments "top" et "bottom"
const topItems = computed(() => menuItems.value.filter(item => item.position === 'top'))
const bottomItems = computed(() => menuItems.value.filter(item => item.position === 'bottom'))

const showSideUserMenu = ref(false)
const showCreateProjectModal = ref(false)

const openCreateProjectModal = () => {
     showCreateProjectModal.value = true
     showSideUserMenu.value = false // Ferme le menu utilisateur
}

const toggleSideMenuUser = () => {
     showSideUserMenu.value = !showSideUserMenu.value
}

const onboardingStore = useOnboardingStore()

const handleCreateProject = async (website: string) => {
     onboardingStore.prepareNewFromDashboard({ webSite: website })
     await router.push('/panel/onboarding')
     showCreateProjectModal.value = false
}

const handleCreateClient = () => {
     onboardingStore.prepareNewFromDashboard()
     router.push('/panel/onboarding')
}
</script>
