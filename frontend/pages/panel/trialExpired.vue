<template>
     <div id="app-content" class="flex-1 overflow-x-hidden overflow-y-auto relative h-full">
          <div class="fixed inset-0 z-[100] flex flex-col justify-start items-center bg-[#f5f7f9]">
               <div class="bg-white w-full mt-0 mb-0">
                    <div class="grid place-items-center">
                         <div class="flex flex-col justify-start items-center w-[560px] text-center pt-10 pb-8">
                              <span class="block w-6 min-w-[24px] h-6 min-h-[24px] mt-0 mb-0"></span>
                              <h2 class="mt-0 mb-0 font-medium text-[32px] leading-[41px] tracking-[-0.01em]">Continuez à exploiter pleinement Hellohumans</h2>
                              <span class="block w-3 min-w-[12px] h-3 min-h-[12px]"></span>
                              <p class="mt-0 mb-0 font-normal text-[18px] leading-[23px] tracking-[-0.01em] text-[#647491]">Votre essai du <strong>avec toutes les fonctionnalités</strong> a expiré le <strong>24/03/2025</strong>. Continuez sur votre lancée. Comparez les plans et choisissez l'option idéale pour votre entreprise.</p>
                              <span class="block w-5 min-w-[20px] h-5 min-h-[20px]"></span>
                              <a href="/panel/upgrade" class="inline-flex justify-center items-center bg-[#0566ff] border border-[#0566ff] text-white w-auto rounded-[8px] text-[16px] h-[38px] leading-[20px] px-4 py-0 hover:bg-[#0049bd] hover:border-[#0049bd] hover:text-white ">Comparer les offres</a>
                         </div>
                    </div>
               </div>
               <div class="flex flex-col justify-start items-center w-[764px] text-center pt-14 pb-14">
                    <div class="flex flex-col justify-start items-start w-[560px]">
                         <h2 class="w-full mt-0 mb-0 font-medium text-[28px] leading-[33px] tracking-[-0.01em]">Passer à offre Free</h2>
                         <p class="mt-[8px] mb-0 font-normal text-[16px] leading-[20px] tracking-[-0.01em] text-[#647491]">Vous pouvez à tout moment revenir à une offre inférieure et utiliser notre offre gratuite à vie. Vous pouvez la modifier quand vous le souhaitez.</p>
                    </div>
                    <div class="mt-5 flex flex-[1_1_0%] flex-wrap w-full gap-1">
                         <div class="flex flex-row justify-start items-center w-[calc(50%-2px)] shrink border border-[#e2e8ef] rounded-[4px] p-4 bg-white">

                              <svgo-panel-icon-chat-bull class="w-[20px] h-[20px] fill-[#647491]"/>
                              <div class="inline-flex flex-grow max-w-full overflow-hidden ml-[16px]">
                                   <div class="flex flex-row justify-start items-center max-w-full">
                                        <div class="w-full">
                                             <p class="mt-0 mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-left overflow-hidden text-ellipsis whitespace-nowrap text-[#080f1a] border-b border-dashed border-[#acb8cb] cursor-default">Conversations traitées - <strong>JUSQU’À 50</strong></p>
                                        </div>
                                   </div>
                              </div>
                              <div class="grid place-items-center bg-[#dce9ff] w-5 h-5 rounded-full self-end ml-4">
                                   <svgo-panel-icon-offer-included class="w-[16px] h-[16px] fill-[#00378e]"/>
                              </div>
                         </div>
                         <div class="flex flex-row justify-start items-center w-[calc(50%-2px)] shrink border border-[#e2e8ef] rounded-[4px] p-4 bg-white">
                              <svgo-panel-icon-chat-bull class="w-[20px] h-[20px] fill-[#647491]"/>
                              <div class="inline-flex flex-grow max-w-full overflow-hidden ml-[16px]">
                                   <div class="flex flex-row justify-start items-center max-w-full">
                                        <div class="w-full">
                                             <p class="mt-0 mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-left overflow-hidden text-ellipsis whitespace-nowrap text-[#080f1a] border-b border-dashed border-[#acb8cb] cursor-default">Conversations traitées - <strong>JUSQU’À 50</strong></p>
                                        </div>
                                   </div>
                              </div>
                              <div class="grid place-items-center bg-[#dce9ff] w-5 h-5 rounded-full self-end ml-4">
                                   <svgo-panel-icon-offer-included class="w-[16px] h-[16px] fill-[#00378e]"/>
                              </div>
                         </div>

                         <div class="flex flex-row justify-start items-center w-[calc(50%-2px)] shrink border border-[#e2e8ef] rounded-[4px] bg-[#f5f7f9] p-4">
                              <svgo-panel-icon-chat-bull class="w-[20px] h-[20px] fill-[#647491]"/>
                              <div class="inline-flex flex-grow max-w-full overflow-hidden ml-[16px]">
                                   <div class="flex flex-row justify-start items-center max-w-full">
                                        <Tooltip text="Les conversations représentent le nombre total de conversations dans le chat en direct" placement="top" variant="white" :arrow="true">
                                             <div class="w-full">
                                                  <p class="mt-0 mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-left overflow-hidden text-ellipsis whitespace-nowrap text-[#080f1a] border-b border-dashed border-[#acb8cb] cursor-default">Conversations traitées - <strong>JUSQU’À 50</strong></p>
                                             </div>
                                        </Tooltip>
                                   </div>
                              </div>
                              <div class="grid place-items-center bg-[#e2e8ef] w-5 h-5 rounded-full self-end ml-4">
                                   <svgo-panel-icon-offer-excluded class="w-[16px] h-[16px] fill-[#acb8cb]"/>
                              </div>


                         </div>
                         <div class="flex flex-row justify-start items-center w-[calc(50%-2px)] shrink border border-[#e2e8ef] rounded-[4px] bg-[#f5f7f9] p-4">

                              <svgo-panel-icon-chat-bull class="w-[20px] h-[20px] fill-[#647491]"/>
                              <div class="inline-flex flex-grow max-w-full overflow-hidden ml-[16px]">
                                   <div class="flex flex-row justify-start items-center max-w-full">
                                        <Tooltip text="Les conversations représentent le nombre total de conversations dans le chat en direct" placement="top" variant="white" :arrow="true">
                                             <div class="w-full">
                                                  <p class="mt-0 mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-left overflow-hidden text-ellipsis whitespace-nowrap text-[#080f1a] border-b border-dashed border-[#acb8cb] cursor-default">Conversations traitées - <strong>JUSQU’À 50</strong></p>
                                             </div>
                                        </Tooltip>
                                   </div>
                              </div>
                              <div class="grid place-items-center bg-[#e2e8ef] w-5 h-5 rounded-full self-end ml-4">
                                   <svgo-panel-icon-offer-excluded class="w-[16px] h-[16px] fill-[#acb8cb]"/>
                              </div>


                         </div>

                    </div>
                    <button class="mt-5 rounded-[8px] text-[16px] leading-[20px] h-[38px] min-w-[80px] px-4 py-0
                         bg-[rgba(136,148,171,0)] border border-[#d1d9e0] text-[#333]">
                         <span>Passer à une version antérieure</span>
                    </button>
               </div>
          </div>
     </div>
</template>
<script setup lang="ts">
import Tooltip from "@/components/panel/common/Tooltip.vue";

</script>

<!--
{{ t('panel.trialExpiredPage.title') }}
{{ t('panel.trialExpiredPage.trialExpired', { date: '24/03/2025' })
{{ t('panel.trialExpiredPage.comparePlans') }}
{{ t('panel.trialExpiredPage.downgradeTitle') }}
{{ t('panel.trialExpiredPage.downgradeDescription') }}
{{ t('panel.trialExpiredPage.processedConversations', { count: 50 })
{{ t('panel.trialExpiredPage.tooltipProcessedConversations') }}
{{ t('panel.trialExpiredPage.downgradeButton') }}
-->
