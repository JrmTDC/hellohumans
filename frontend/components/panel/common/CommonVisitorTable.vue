<template>
     <div class="mt-[20px]">
          <div class="flex flex-row items-center h-[32px] mr-auto">
               <!-- Filter (placeholder, à connecter à des filtres réels plus tard) -->
               <div class="mr-[8px] relative cursor-pointer">
                    <div class="relative box-border">
                         <div class="flex items-center justify-between w-[174px] h-[28px] rounded-[12px] bg-[rgba(100,116,145,0.08)] border-[2px] border-transparent cursor-pointer">
                              <div class="flex flex-row justify-start items-center overflow-hidden">
                                   <span class="ml-[10px] mr-[6px] whitespace-nowrap text-[14px] leading-[18px] text-[#001b47]">Tous les pays</span>
                              </div>
                              <div class="flex items-center self-stretch flex-shrink-0 box-border">
                                   <div class="pr-[4px]">
                                        <div class="flex items-center justify-center">
                                             <SvgoPanelCustomersIconArrowDown class="rotate-0 w-[20px] h-[20px]" />
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
          </div>

          <div class="mt-[20px] flex flex-[1_1_0%] flex-col h-[calc(100vh-270px)]">
               <!-- Header -->
               <div class="font-bold uppercase flex flex-row items-center h-[48px] overflow-hidden bg-white rounded-t-[6px]">
                    <div class="flex w-full h-full px-[4px] rounded-t-[12px] border-t border-l border-r border-[rgb(226,232,239)] border-b-0">
                         <div class="ml-[16px] mr-[16px] flex-[2_1_0px] min-w-[200px]">
                              <div class="flex items-center text-[14px] leading-[18px] tracking-[-0.01em] text-[#647491] pt-[16px] font-normal capitalize">Nom</div>
                         </div>
                         <div class="ml-[16px] mr-[16px] flex-[1_1_0px] max-w-[170px] min-w-[96px]">
                              <div class="flex items-center text-[14px] leading-[18px] text-[#647491] pt-[16px] font-normal capitalize">Première visite</div>
                         </div>
                         <div class="ml-[16px] mr-[16px] flex-[1_1_0px] max-w-[93px] min-w-[83px]">
                              <div class="flex items-center text-[14px] text-[#647491] pt-[16px] font-normal capitalize">
                                   <SvgoPanelCustomersIconEart class="h-[16px] w-[17px] fill-[#647491]" />
                                   <span class="px-[4px] pl-[3px] py-0 text-[rgb(211,219,229)]">/</span>
                                   <SvgoPanelCustomersIconDesktop class="h-[16px] w-[17px] fill-[#647491]" />
                              </div>
                         </div>
                         <div class="ml-[16px] mr-[16px] flex-[1_1_0px] min-w-[200px]">
                              <div class="flex items-center text-[14px] text-[#647491] pt-[16px] font-normal capitalize">Dernière page visitée</div>
                         </div>
                         <div class="ml-[16px] mr-[16px] !flex-[0_1_auto]"></div>
                    </div>
               </div>

               <!-- Body -->
               <div class="outline-none bg-white border border-[rgb(226,232,239)] rounded-b-[12px] min-h-[66px] box-border direction-ltr relative will-change-transform overflow-hidden">
                    <div v-for="visitor in visitors" :key="visitor.id" class="w-auto h-[56px] max-h-[56px] overflow-hidden relative">
                         <div class="flex flex-row items-center h-[56px] left-0 top-0 absolute w-full overflow-hidden px-[4px] cursor-pointer outline-none">
                              <div class="ml-[16px] mr-[16px] overflow-hidden flex-[2_1_0px] min-w-[200px]">
                                   <div class="flex flex-row justify-start items-center">
                                        <div class="w-[10px] h-[10px] flex-[0_0_10px] bg-[rgb(52,184,87)] rounded-full"></div>
                                        <div class="ml-[8px] flex-[0_0_30px]">
                                             <div class="bg-[#cbd852] rounded-full text-white flex-shrink-0 text-[18px] h-[30px] leading-[1.66] mr-[10px] text-center w-[30px]">
                                                  {{ visitor.initial }}
                                             </div>
                                        </div>
                                        <div class="flex flex-col justify-center flex-[2_1_auto] min-w-0 ml-[8px]">
                                             <div class="text-[16px] font-bold text-[#080f1a] truncate">{{ visitor.email || 'Visiteur inconnu' }}</div>
                                             <div class="text-[12px] text-[#647491] mt-[2px]">{{ visitor.type || 'Nouveau' }}</div>
                                        </div>
                                   </div>
                              </div>
                              <div class="ml-[16px] mr-[16px] overflow-hidden flex-[1_1_0px] max-w-[170px] min-w-[96px]">
                                   <div class="text-[#080f1a] text-[14px]">{{ visitor.connected_at ? formatRelativeTime(visitor.connected_at) : '—' }}</div>
                              </div>
                              <div class="ml-[16px] mr-[16px] overflow-hidden flex-[1_1_0px] max-w-[93px] min-w-[83px]">
                                   <div class="flex">
                                        <SvgoPanelFlagsFr class="h-[18px] w-[18px]" />
                                        <SvgoPanelBrowsersChrome class="ml-[12px] h-[18px] w-[18px]" />
                                   </div>
                              </div>
                              <div class="ml-[16px] mr-[16px] overflow-hidden flex-[1_1_0px] min-w-[200px]">
                                   <NuxtLink
                                        :to="visitor.url || '#'"
                                        target="_blank"
                                        class="ml-[3px] text-[14px] text-[rgb(5,102,255)] hover:text-[#0047b7] hover:underline truncate block"
                                   >
                                        {{ visitor.url ? stripDomain(visitor.url) : '—' }}
                                   </NuxtLink>
                              </div>
                              <div class="ml-[16px] mr-[16px] overflow-hidden flex-[0_1_0px]"></div>
                         </div>
                    </div>
               </div>
          </div>
     </div>
</template>

<script setup lang="ts">
defineProps<{
     visitors: Array<{
          id: string
          email?: string
          initial?: string
          type?: string
          connected_at?: string // format ISO
          url?: string
     }>
}>()

function stripDomain(url: string) {
     try {
          const { pathname, search, hash } = new URL(url)
          return pathname + search + hash
     } catch {
          return url
     }
}
</script>
