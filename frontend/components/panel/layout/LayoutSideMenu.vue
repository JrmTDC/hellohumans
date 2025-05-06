<template>
     <div ref="menuRef" class="fixed left-0 bottom-0 transform translate-x-[64px] min-w-max z-[100]">
          <div class="p-[8px] rounded-[8px] bg-white shadow-[0_8px_20px_rgba(0,20,51,0.24)] w-[256px] max-w-[256px] translate-x-[-10px] translate-y-[-10px]">
               <div class="w-full flex items-center text-[#080f1a] bg-transparent border-none rounded-[4px] m-0 min-h-[36px] cursor-pointer outline-none px-[8px] py-[6px]">
                    <div class="rounded-full text-white cursor-default shrink-0 float-left text-[18px] h-[30px] leading-[1.66] text-center select-none w-[30px]">
                         <svgo-panel-icon-menu-user-picture class="w-[30px] h-[30px]" />
                    </div>
                    <div class="flex flex-col justify-start items-[normal] min-w-0 ml-[12px]">
                         <div class="font-normal text-[14px] leading-[18px] tracking-[-0.01em] overflow-hidden text-ellipsis whitespace-nowrap mt-0 mb-0">
                              {{ userDisplayName }}</div>
                         <div class="mt-0 mb-0 font-normal text-[12px] leading-[16px] tracking-[-0.01em] text-[#647491]">{{ userEmail }}</div>
                    </div>
               </div>

               <div class="m-[8px] bg-[rgb(226,232,239)] h-[1px]"></div>

               <div class="text-[#647491] text-[12px] leading-[16px] tracking-[-0.01em] pt-[12px] px-[8px] pb-[4px]">{{ t('panel.components.layout.sideMenu.project') }}</div>
               <div class="w-full flex items-center text-[#080f1a] bg-transparent border-none rounded-[4px] m-0 min-h-[36px] px-[8px] py-[6px] cursor-pointer outline-none hover:bg-[#dce9ff] hover:text-[#001433] group" @click="toggleProjectMenu">
                    <span class="whitespace-nowrap overflow-hidden text-ellipsis flex-[1_1_0%] text-left text-[14px]">{{ currentProjectName }}</span>
                    <span class="flex items-center ml-[12px]">
                         <svgo-panel-icon-arrow-to class="w-[24px] h-[24px] fill-[#647491] group-hover:fill-[#0566ff]" />
                    </span>
               </div>

               <PanelLayoutSideMenuProjects
                    v-if="showProjectsMenu"
                    @close="showProjectsMenu = false"
                    @open-create-project="handleOpenCreateProject"
                    @closeAllMenus="emits('closeSideUserMenu')"
               />
               <div class="text-[#647491] text-[12px] leading-[16px] tracking-[-0.01em] pt-[12px] px-[8px] pb-[4px]">{{ t('panel.components.layout.sideMenu.language') }}</div>
               <div class="w-full flex items-center text-[#080f1a] bg-transparent border-none rounded-[4px] m-0 min-h-[36px] px-[8px] py-[6px] cursor-pointer outline-none hover:bg-[#dce9ff] hover:text-[#001433] group" @click="toggleLangMenu">
                    <span class="whitespace-nowrap overflow-hidden text-ellipsis flex-[1_1_0%] text-left text-[14px]">{{ currentLangLabel }}</span>
                    <span class="flex items-center ml-[12px]">
                         <svgo-panel-icon-arrow-to class="w-[24px] h-[24px] fill-[#647491] group-hover:fill-[#0566ff]" />
                    </span>
               </div>

               <PanelLayoutSideMenuLanguages
                    v-if="showLangMenu"
                    @close="showLangMenu = false"
                    @closeAllMenus="emits('closeSideUserMenu')" />

               <div class="m-[8px] bg-[rgb(226,232,239)] h-[1px]"></div>
               <div @click="logout" class="w-full flex items-center text-[rgb(8,15,26)] bg-transparent border-none rounded-[4px] m-0 min-h-[36px] p-[6px_8px] cursor-pointer outline-none hover:bg-[#dce9ff] hover:text-[rgb(0,20,51)]">
                    <span class="whitespace-nowrap overflow-hidden text-ellipsis flex-[1_1_0%] text-left text-[14px]">{{ t('panel.components.layout.sideMenu.logout') }}</span>
               </div>
          </div>
     </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePanelStore } from '~/stores/panelStore'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const panelStore = usePanelStore()
const { locale, locales } = useI18n()

const currentLangLabel = computed(() => {
     return locales.value.find((l: any) => l.code === locale.value)?.name || locale.value.toUpperCase()
})

const userDisplayName = computed(() => {
     return panelStore.user?.display_name || 'Utilisateur inconnu'
})

const userEmail = computed(() => {
     return panelStore.user?.email || 'Email inconnu'
})

const currentProjectName = computed(() => {
     return panelStore.project?.website || 'Projet inconnu'
})

const showLangMenu = ref(false)
const showProjectsMenu = ref(false)

const toggleLangMenu = () => {
     showLangMenu.value = !showLangMenu.value
     showProjectsMenu.value = false
}

const toggleProjectMenu = () => {
     showProjectsMenu.value = !showProjectsMenu.value
     showLangMenu.value = false
}

const emits = defineEmits(['closeSideUserMenu', 'openCreateProjectModal'])
const menuRef = ref<HTMLElement | null>(null)
let skipNextClick = true

const handleClickOutside = (event: MouseEvent) => {
     if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
          emits('closeSideUserMenu')
          showLangMenu.value = false
          showProjectsMenu.value = false
     }
}
const handleOpenCreateProject = () => {
     showProjectsMenu.value = false
     showLangMenu.value = false
     emits('openCreateProjectModal','closeSideUserMenu')
}

onMounted(() => {
     skipNextClick = true
     setTimeout(() => {
          skipNextClick = false
     }, 100)
     document.addEventListener('click', (e) => {
          if (skipNextClick) return
          handleClickOutside(e)
     })
})

onUnmounted(() => {
     document.removeEventListener('click', handleClickOutside)
})

const logout = () => {
     panelStore.logout()
     router.push('/panel/login')
}
</script>
