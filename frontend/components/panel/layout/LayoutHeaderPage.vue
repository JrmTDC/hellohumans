<template>
     <header class="app-content-header flex items-center bg-[#f5f7f9] flex-[0_0_58px] flex-row h-[58px] justify-start pl-[24px] pr-[12px] relative z-[12]">
          <div class="flex flex-row justify-start items-center flex-grow w-full">
               <h1 class="inline-flex items-center text-[20px] font-medium tracking-[-0.01em] leading-[26px] mb-0 mr-auto mt-0 max-w-[calc(100%-268px)]">
                    {{ title }}
                    <div v-if="isBilled" :class="isPaid ? 'bg-[rgb(190,255,203)]' : 'bg-[rgb(255,219,186)]'" class="p-[3px_5px] rounded-[4px] block ml-[8px]" > <div class="flex flex-row justify-start items-center"> <svgo-panel-icon-premium class="w-[14px] h-[14px] block fill-[rgb(8,15,26)] transition-none mr-0" /> <p class="mt-0 mb-0 ml-[2px] font-normal text-[12px] leading-[16px] tracking-[-0.01em]"> {{ isPaid ? t('panel.components.layout.herderPage.UsageMenu.paid') : t('panel.components.layout.herderPage.UsageMenu.billing') }} </p> </div> </div>
               </h1>
               <div class="relative flex flex-row justify-start items-center ml-[16px]" ref="helpMenuRef">
                    <div @click="toggleHelpMenu" class="inline-flex relative align-top">
                         <button class="bg-transparent border-0 inline-flex shadow-none outline-none px-[4px] py-0 items-center justify-center cursor-pointer rounded-[4px] text-current w-[30px] h-[30px] hover:bg-[#dce9ff] group">
                              <svgo-panel-icon-help class="w-[22px] h-[22px] fill-[#8796af] group-hover:fill-[#0566ff]" />
                         </button>
                    </div>

                    <div v-if="isHelpMenuOpen" class="usage-dropdown">
                         <div class="absolute right-[8px] top-[42px] z-[2]"><svgo-panel-icon-triangle-up class="w-[17px] h-[7px] fill-[#ffff]" /></div>
                         <div class="absolute top-[49px] right-[0] box-content w-fit bg-white p-[8px] shadow-[0_8px_20px_rgba(0,20,51,0.24)] rounded-[8px] overflow-auto max-h-[calc(-150px+100vh)] z-[1]">

                              <NuxtLink to="/help" class="w-full flex items-center text-[#080f1a] bg-transparent border-none rounded-[4px] min-h-[36px] px-[8px] py-[6px] cursor-pointer outline-none hover:bg-[#dce9ff] hover:text-[#001433] group">
                                   <span class="whitespace-nowrap overflow-hidden text-ellipsis flex-1 text-left text-[14px]">
                                        {{ t('panel.components.layout.herderPage.helpMenu.needHelp') }}
                                   </span>
                              </NuxtLink>
                              <div @click="showReportModal = true" class="w-full flex items-center text-[#080f1a] bg-transparent border-none rounded-[4px] min-h-[36px] px-[8px] py-[6px] cursor-pointer outline-none hover:bg-[#dce9ff] hover:text-[#001433] group">
                                   <span class="whitespace-nowrap overflow-hidden text-ellipsis flex-1 text-left text-[14px]">
                                        {{ t('panel.components.layout.herderPage.helpMenu.reportIssue') }}
                                   </span>
                              </div>
                              <NuxtLink to="/contact" class="w-full flex items-center text-[#080f1a] bg-transparent border-none rounded-[4px] min-h-[36px] px-[8px] py-[6px] cursor-pointer outline-none hover:bg-[#dce9ff] hover:text-[#001433] group">
                                   <span class="whitespace-nowrap overflow-hidden text-ellipsis flex-1 text-left text-[14px]">
                                        {{ t('panel.components.layout.herderPage.helpMenu.contactUs') }}
                                   </span>
                              </NuxtLink>
                         </div>
                    </div>
               </div>
               <div class="relative flex flex-row justify-start items-center ml-[16px]" ref="usageMenuRef">

                    <div @click="toggleUsageMenu" class="flex ml-[8px] flex-row justify-start items-center p-[6px] rounded-[6px] cursor-pointer text-[rgb(58,35,0)] bg-transparent hover:bg-[rgb(220,233,255)] group">
                         <svgo-panel-icon-usage-menu class="w-[20px] h-[20px] fill-[#8796af] transition-transform group-hover:fill-[rgb(5,102,255)]" :class="{ 'rotate-180': isUsageMenuOpen }" />
                         <span class="block w-[4px] min-w-[4px] h-[4px] min-h-[4px]"></span>
                         <p class="mt-0 mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[rgb(8,15,26)]"> {{ t('panel.components.layout.herderPage.UsageMenu.usageAndPlan') }}</p>
                         <span class="block w-[8px] min-w-[8px] h-[8px] min-h-[8px]"></span>
                         <svgo-panel-icon-triangle-caret-down class="w-[24px] h-[24px fill-[#8796af] transition-transform group-hover:fill-[rgb(135,150,175)]" :class="{ 'rotate-180': isUsageMenuOpen }" />
                    </div>
                    <div v-if="isUsageMenuOpen" class="usage-dropdown">
                         <div class="absolute right-[8px] top-[42px] z-[2]"><svgo-panel-icon-triangle-up class="w-[17px] h-[7px] fill-[#ffff]" /></div>
                         <div class="absolute top-[49px] right-[0] box-content w-[412px] bg-white p-[24px] shadow-[0_8px_20px_rgba(0,20,51,0.24)] rounded-[8px] overflow-auto max-h-[calc(-150px+100vh)] z-[1]">
                              <PanelCommonHeaderUsageItem
                                   v-for="(item, index) in usages"
                                   :key="index"
                                   :item="item"
                                   :class="index > 0 ? 'mt-[16px]' : ''"
                              />
                              <p class="mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[#647491] mt-[16px]">
                                   <span>{{ t('panel.components.layout.herderPage.UsageMenu.usageNote') }}</span>
                              </p>
                         </div>
                    </div>

               </div>
               <div class="ml-[16px]"></div>

               <NuxtLink to="/panel/upgrade" class="flex-[0_0_auto] bg-[#64ed80] border-[2px] border-[#64ed80] text-[#080f1a] font-normal hover:bg-[#31e756] hover:border-[#31e756] bg-none border border-transparent rounded-[8px] cursor-pointer inline-block text-[14px] leading-[1.28571429] mb-0 min-w-[64px] px-[14px] py-[6px] text-center touch-manipulation select-none align-middle whitespace-nowrap">{{ t('panel.components.layout.herderPage.upgrade') }}</NuxtLink>
          </div>
     </header>
     <PanelModalReportIssue
          v-if="showReportModal"
          @close="showReportModal = false"
     />
</template>

<script setup lang="ts">
const { t } = useI18n()
const showReportModal = ref(false)
const props = defineProps({
     title: String,
     isBilled: Boolean,
     isPaid: Boolean
})

const isUsageMenuOpen = ref(false)
const isHelpMenuOpen = ref(false)
const usageMenuRef = ref(null)
const helpMenuRef = ref(null)

const toggleUsageMenu = () => {
     isUsageMenuOpen.value = !isUsageMenuOpen.value
     isHelpMenuOpen.value = false
}
const toggleHelpMenu = () => {
     isHelpMenuOpen.value = !isHelpMenuOpen.value
     isUsageMenuOpen.value = false
}

const handleClickOutside = (event) => {
     if (usageMenuRef.value && !usageMenuRef.value.contains(event.target)) {
          isUsageMenuOpen.value = false
     }
     if (helpMenuRef.value && !helpMenuRef.value.contains(event.target)) {
          isHelpMenuOpen.value = false
     }
}

const allUsages = useUsageDefinitions()
const usages = computed(() => allUsages.value.filter((u) => u.showInHeader))

onMounted(() => {
     document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
     document.removeEventListener('click', handleClickOutside)
})
</script>
