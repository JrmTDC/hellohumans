<template>
     <div>
          <ul v-if="items.length">
               <li
                    v-for="item in items"
                    :key="item.id"
                    class="relative max-h-[130px]"
               >
                    <NuxtLink
                         :to="item.link"
                         class="m-[0px_12px_4px] p-[12px_12px_12px_40px] block relative rounded-[8px] text-[#080f1a] bg-[#f5f7f9]"
                    >
                         <div class="flex flex-row justify-start items-center h-[20px]">
                              <p class="mt-0 mb-0 mr-auto font-normal text-[12px] leading-[16px] tracking-[-0.01em] overflow-hidden text-ellipsis whitespace-nowrap">
                                   {{ item.id }}
                              </p>
                              <p class="mt-0 mb-0 ml-[12px] font-normal text-[12px] leading-[16px] tracking-[-0.01em] overflow-hidden text-ellipsis whitespace-nowrap text-right flex-shrink-0">
                                   {{ item.timeAgo }}
                              </p>
                         </div>
                         <p class="mt-0 mb-0 font-normal text-[12px] leading-[16px] tracking-[-0.01em] overflow-hidden text-ellipsis whitespace-nowrap text-[rgb(100,116,145)]">
                              Chat en direct
                         </p>
                         <div class="flex flex-row justify-start items-center mt-[4px]">
                              <p class="mt-0 mb-0 mr-auto font-semibold text-[14px] leading-[18px] tracking-[-0.01em] overflow-hidden text-ellipsis whitespace-nowrap">
                                   {{ item.lastMessage }}
                              </p>
                              <div v-if="item.agent" class="flex ml-[8px]">
                                   <PanelCommonTooltip
                                        :text="`Assigné à ${item.agent}`"
                                        left-ajust="-10"
                                        placement="bottom"
                                        variant="white"
                                   >
                                        <div class="list-none m-0 p-0 flex items-center text-[14px]">
                                             {{ item.agent }}
                                        </div>
                                   </PanelCommonTooltip>
                              </div>
                         </div>
                    </NuxtLink>
               </li>
          </ul>

          <!-- Si aucune conversation -->
          <div
               v-else
               class="bg-no-repeat bg-[position:20px_16px] min-h-[264px] block text-[rgb(100,116,145)] text-center px-[20px] py-[240px] mt-[10px] relative text-[14px] leading-[1.28571429] tracking-[-0.01em]"
               :style="background ? { backgroundImage: `url('${background}')` } : {}"
          >
               {{ emptyMessage || 'Vous n’avez pas de conversations à afficher pour le moment.' }}
          </div>
     </div>
</template>

<script setup lang="ts">
const props = defineProps<{
     items: Array<{
          id: string
          timeAgo: string
          lastMessage: string
          agent?: string
          link: string
     }>
     emptyMessage?: string
     background?: string
}>()
</script>
