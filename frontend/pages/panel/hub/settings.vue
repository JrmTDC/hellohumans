<template>
     <div class="grid grid-cols-[232px_1fr] grid-rows-1 gap-0 h-full max-h-full overflow-hidden">
          <PanelHubChildSideMenu />

          <div data-radix-scroll-area-viewport class="overflow-hidden">
               <div class="overflow-x-hidden w-full h-full">
                    <div class="min-h-full h-full">
                         <div class="min-h-full h-full pr-[12px]">
                              <div class="p-[24px_28px] border border-[#e2e8ef] bg-white rounded-[16px] min-h-[calc(100%-12px)] flex-[1_1_0%]">
                                   <div class="flex flex-col justify-start items-stretch">
                                        <div class="flex flex-row justify-start items-center w-full">
                                             <h2 class="mr-auto mt-0 mb-0 font-medium text-[24px] leading-[34px] tracking-[-0.01em]">Configurer</h2>
                                             <div class="flex flex-row justify-start items-center ml-[60px]">
                                                  <div>
                                                       <button class="rounded-[8px] text-[14px] h-[34px] leading-[18px] min-w-[64px] px-[14px] py-0 select-none align-middle whitespace-nowrap text-center touch-manipulation bg-[#0566ff] border border-[#0566ff] text-white ml-[12px] hover:bg-[#0049bd] hover:border-[#0049bd] hover:text-white inline-flex items-center justify-center disabled:border-transparent disabled:shadow-none disabled:text-[#acb8cb] disabled:cursor-not-allowed disabled:bg-[#eff2f6]" disabled>
                                                            <SvgoPanelHubIconPlay class="h-[20px] w-[20px] fill-current ml-[-2px] mr-[6px]" />
                                                            <span>Activé</span>
                                                       </button>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>

                                   <!-- Menu -->
                                   <div class="mt-[20px] flex items-center relative flex-row-reverse flex-wrap justify-start">
                                        <div class="flex flex-row justify-start items-center flex-[1_1_0%] border-b border-b-[#e2e8ef]">
                                             <div class="relative px-[12px] pt-[16px] pb-[20px] text-[16px] text-[#0566ff] hover:cursor-default hover:text-[#0566ff] active:cursor-default active:text-[#0566ff] border-b-[3px] border-b-[#0566ff]">
                                                  <div class="flex flex-row justify-center items-center">
                                                       <div class="flex flex-row justify-start items-center">Général</div>
                                                  </div>
                                             </div>
                                             <div class="relative px-[12px] pt-[16px] pb-[20px] text-[16px] cursor-pointer text-[#080f1a] hover:cursor-default hover:text-[#0566ff] active:cursor-default active:text-[#0566ff] border-b-[3px] border-b-transparent">
                                                  <div class="flex flex-row justify-center items-center">
                                                       <div class="flex flex-row justify-start items-center">Personnalité</div>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>

                                   <!-- Contenu (Général) -->
                                   <div class="mt-[20px] ml-[-20px] mr-[-20px] pt-[12px]]">
                                        <section class="mr-[20px] ml-[20px]">
                                             <h3 class="flex items-center mt-0 mb-0 pt-0 pb-0 text-[18px] leading-[23px] tracking-[-0.01em] w-auto max-w-[750px] font-medium">Principal</h3>
                                             <div class="pt-[20px] pb-[20px]">
                                                  <div class="relative px-[20px] py-[13px] pr-[20px] pl-[44px] mb-[20px] rounded-[8px] bg-[#ffdda7] text-[#3a2300] text-[14px]">
                                                       <div class="absolute top-[10px] left-[12px] flex items-center justify-center w-[24px] h-[24px]">
                                                            <SvgoPanelHubIconWarling class="w-[24px] h-[24px] min-w-[24px] min-h-[24px] fill-[#d48200]" />
                                                       </div>
                                                       Pour activer ou tester  {{ config.public.chatBotName }}, vous devez d'abord lui fournir des connaissances.
                                                       <NuxtLink to="/panel/hub/data-sources/added" class="text-current underline font-medium hover:text-[#a16300]">Accéder à Sources de données pour ajouter</NuxtLink>
                                                  </div>
                                                  <div class="flex flex-col justify-start items-[normal] max-w-[750px] pt-0 mt-[20px]">
                                                       <div class="flex flex-row justify-start items-start">
                                                            <label for="" class="flex-[1_0_145px] min-w-[145px] max-w-[min(180px,12vw)] inline-block font-normal text-[14px]">Activer</label>
                                                            <em aria-label="Activer" class="ml-[20px] flex flex-row justify-start items-start">
                                                                 <label class="relative inline-block align-top rounded-[17px] border border-[#d3dbe5] bg-[#f5f7f9] cursor-not-allowed flex-[0_0_auto] w-[36px] max-w-[36px] h-[22px] opacity-60 font-normal">
                                                                      <input type="checkbox" role="switch" disabled class="absolute w-[1px] h-[1px] m-[-1px] p-0 overflow-hidden clip-[rect(0,0,0,0)] border-0">
                                                                      <div class="absolute left-[1px] top-[1px] bottom-[1px] w-[18px] rounded-full bg-white transition-[left,transform] duration-200 ease-in-out shadow-[0_2px_8px_rgba(0,20,51,0.28)]"></div>
                                                                 </label>
                                                            </em>
                                                       </div>
                                                  </div>
                                             </div>
                                        </section>
                                        <section class="border-t border-t-[#e2e8ef] mt-[12px] mr-[20px] ml-[20px]">
                                             <div class="pt-[32px]">
                                                  <h3 class="flex items-center mt-0 mb-0 pb-0 text-[18px] leading-[23px] tracking-[-0.01em] w-auto max-w-[750px] font-medium">Langues</h3>
                                                  <p class="mb-0 mt-[8px] font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[#647491]">{{ config.public.chatBotName }} répond automatiquement dans la langue du widget de chat du visiteur. Vous pouvez définir ou ajouter d'autres langues dans les <NuxtLink to="/panel/settings" class="text-[#0566ff] no-underline hover:text-[#0047b7]">paramètres multilingues du widget</NuxtLink></p>
                                             </div>
                                             <div class="pt-[20px] pb-[20px]">
                                                  <div class="flex flex-col justify-start items-[normal] max-w-[750px] pt-0">
                                                       <div class="flex flex-col justify-start items-[normal]">
                                                            <div class="flex flex-row justify-start items-center [&>*:only-child]:w-full">
                                                                 <SvgoPanelHubIconFlag class="min-w-[24px] min-h-[24px] w-[24px] h-[24px] fill-[rgb(100,116,145)]"/>
                                                                 <p class="mt-0 mb-0 ml-[12px] font-normal text-[14px] leading-[18px] tracking-[-0.01em] [&:nth-child(2)]:mr-auto">FR - Français (par défaut)</p>
                                                            </div>
                                                       </div>
                                                       <p class="mt-[20px] font-[400] text-[14px] leading-[18px] tracking-[-0.01em]">
                                                            Les langues prises en charge pour {{ config.public.chatBotName }} sont les suivantes : anglais, espagnol, allemand, portugais, français et italien.
                                                            <NuxtLink to="/panel/" class="font-normal text-[14px] text-[#0566ff] no-underline hover:text-[#0047b7]">En savoir plus</NuxtLink>
                                                       </p>
                                                  </div>

                                             </div>
                                        </section>
                                   </div>

                                   <!-- Contenu (Personnalité) -->
                                   <div class="mt-[20px] ml-[-20px] mr-[-20px] pt-[12px]]">
                                        <section class="mr-[20px] ml-[20px]">
                                             <div>
                                                  <h3 class="flex items-center mt-0 mb-0 pb-0 text-[18px] leading-[23px] tracking-[-0.01em] w-auto max-w-[750px] font-medium">Identité</h3>
                                                  <p class="mb-0 mt-[8px] font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[#647491]">Modifiez le nom de votre Agent IA et ajoutez la description de votre entreprise.</p>
                                             </div>
                                             <div class="pt-[20px] pb-[20px]">
                                                  <div class="flex flex-col justify-start items-[normal] max-w-[750px] pt-0">

                                                       <div class="flex flex-row justify-start items-start">
                                                            <label for="" class="flex-[1_0_145px] min-w-[145px] max-w-[min(180px,12vw)] inline-block font-normal">
                                                                 <div class="flex flex-col justify-start items-[normal]">
                                                                      <p class="font-normal text-[14px] leading-[18px] tracking-[-0.01em]">Nom de l'Agent IA</p>
                                                                      <p class="mt-[4px] font-normal text-[12px] leading-[16px] tracking-[-0.01em] text-[rgb(100,116,145)]">Agent IA utilise ce nom lorsqu'il répond à des questions sur son identité</p>
                                                                 </div>
                                                            </label>
                                                            <div class="flex-[1_1_0%] relative ml-[24px]">
                                                                 <input :placeholder="config.public.chatBotName" type="text" disabled class="block w-full border-solid border-2 border-[rgb(226,232,239)] text-[rgb(100,116,145)] bg-[rgb(239,242,246)] rounded-[8px] px-[14px] py-[16px] outline-none text-[14px] leading-[18px] tracking-[-0.01em] h-[34px]">
                                                            </div>
                                                       </div>

                                                       <hr class="w-full border-t border-t-[rgb(239,242,246)] mt-[20px] mb-0">

                                                       <div class="mt-[20px] flex flex-row justify-start items-start">
                                                            <label for="" class="flex-[1_0_145px] min-w-[145px] max-w-[min(180px,12vw)] inline-block font-normal">
                                                                 <div class="flex flex-col justify-start items-[normal]">
                                                                      <p class="font-normal text-[14px] leading-[18px] tracking-[-0.01em]">Description de l'entreprise</p>
                                                                      <p class="mt-[4px] font-normal text-[12px] leading-[16px] tracking-[-0.01em] text-[rgb(100,116,145)]">Décrivez votre entreprise pour que l'Agent IA puisse adapter les réponses à vos clients</p>
                                                                 </div>
                                                            </label>
                                                            <div class="flex-[1_1_0%] relative ml-[24px]">
                                                                 <textarea rows="4" placeholder="" class="resize-none w-full min-h-auto text-[rgb(8,15,26)] border-solid border-2 border-[rgb(211,219,229)] rounded-[8px] outline-none overflow-visible text-[14px] leading-[18px] tracking-[-0.01em] px-[12px] py-[8px]"></textarea>
                                                            </div>
                                                       </div>

                                                  </div>
                                             </div>
                                        </section>

                                        <section class="mr-[20px] ml-[20px] border-t border-t-[rgb(226,232,239)] mt-[12px]">
                                             <div class="pt-[32px]">
                                                  <h3 class="flex items-center mt-0 mb-0 pb-0 text-[18px] leading-[23px] tracking-[-0.01em] w-auto max-w-[750px] font-medium">Personnalisation des réponses</h3>
                                                  <p class="mb-0 mt-[8px] font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[#647491]">Personnalisez le style des réponses</p>
                                             </div>
                                             <div class="pt-[20px] pb-[20px]">
                                                  <div class="flex flex-col justify-start items-[normal] max-w-[750px] pt-0 pb-[32px]">

                                                       <div class="flex flex-row justify-start items-start">
                                                            <label for="" class="flex-[1_0_145px] min-w-[145px] max-w-[min(180px,12vw)] inline-block font-normal">
                                                                 <div class="flex flex-col justify-start items-[normal]">
                                                                      <p class="font-normal text-[14px] leading-[18px] tracking-[-0.01em]">Style de communication</p>
                                                                 </div>
                                                            </label>
                                                            <div class="flex-[1_1_0%] relative ml-[24px] group cursor-pointer">
                                                                 <fieldset class="absolute inset-[0_0_0_0] m-0 pl-[5px] overflow-hidden pointer-events-none rounded-[8px] border-2 border-[rgb(211,219,229)] group-hover:border-[rgb(172,184,203)]"></fieldset>
                                                                 <div class="flex justify-between items-center h-[34px] text-[14px] leading-[18px] tracking-[-0.01em] rounded-[8px] outline-none px-[14px] py-[6px] pr-[7px] min-w-0 bg-white overflow-hidden ">
                                                                      <div class="overflow-hidden text-ellipsis whitespace-nowrap cursor-default pointer-events-none text-[14px] leading-[18px] tracking-[-0.01em]">Neutre - Style {{ config.public.chatBotName }} équilibré et normal</div>
                                                                      <div class="flex flex-row justify-start items-center">
                                                                           <SvgoPanelHubIconArrowSelect class="min-w-[24px] min-h-[24px] w-[24px] h-[24px] fill-[rgb(8,15,26)]" />
                                                                      </div>
                                                                 </div>
                                                                 <div class="min-w-[581px] max-w-[256px] shadow-[0_8px_20px_rgba(0,20,51,0.24)] bg-white rounded-[8px] absolute top-[38px] z-[2] max-h-[280px] flex mt-0 overflow-auto">
                                                                      <ul class="p-[8px]">
                                                                           <li class="px-[8px] py-[9px] rounded-[4px] text-[rgb(8,15,26)] cursor-pointer bg-white overflow-hidden text-ellipsis whitespace-nowrap flex items-center gap-[8px] text-[14px] leading-[18px] tracking-[-0.01em] hover:bg-[rgb(220,233,255)]">
                                                                                <div class="flex flex-col justify-start items-[normal] [text-wrap:wrap]">
                                                                                     <p class="font-normal text-[14px] leading-[18px] tracking-[-0.01em]">Neutre - Style {{ config.public.chatBotName }}  équilibré et normal</p>
                                                                                     <p class="font-normal text-[12px] leading-[16px] tracking-[-0.01em] text-[rgb(100,116,145)] mt-[4px]">Exemple de réponse : « Nous appliquons une politique de remboursement de 30 jours. À condition que l'article soit dans son état d'origine, vous pouvez le retourner dans les 30 jours suivant l'achat. Si vous avez besoin de plus de détails, n'hésitez pas à nous demander ou à consulter notre page dédiée ! »</p>
                                                                                </div>
                                                                           </li>

                                                                           <li class="px-[8px] py-[9px] rounded-[4px] text-[rgb(8,15,26)] cursor-pointer bg-white overflow-hidden text-ellipsis whitespace-nowrap flex items-center gap-[8px] text-[14px] leading-[18px] tracking-[-0.01em] hover:bg-[rgb(220,233,255)]">
                                                                                <div class="flex flex-col justify-start items-[normal] [text-wrap:wrap]">
                                                                                     <p class="font-normal text-[14px] leading-[18px] tracking-[-0.01em]">Amical - Idéal pour des rapports humains et une attitude positive</p>
                                                                                     <p class="font-normal text-[12px] leading-[16px] tracking-[-0.01em] text-[rgb(100,116,145)] mt-[4px]">Exemple de réponse : « Vous avez changé d'avis ? Pas de problème ! Vous pouvez retourner vos articles dans les 30 jours, à condition qu'ils soient dans leur état d'origine. Consultez nos conditions générales pour plus de détails ou posez-nous vos questions ! »</p>
                                                                                </div>
                                                                           </li>

                                                                           <li class="px-[8px] py-[9px] rounded-[4px] text-[rgb(8,15,26)] cursor-pointer bg-white overflow-hidden text-ellipsis whitespace-nowrap flex items-center gap-[8px] text-[14px] leading-[18px] tracking-[-0.01em] hover:bg-[rgb(220,233,255)]">
                                                                                <div class="flex flex-col justify-start items-[normal] [text-wrap:wrap]">
                                                                                     <p class="font-normal text-[14px] leading-[18px] tracking-[-0.01em]">Formel - Idéal pour les contextes officiels et professionnels</p>
                                                                                     <p class="font-normal text-[12px] leading-[16px] tracking-[-0.01em] text-[rgb(100,116,145)] mt-[4px]">Exemple de réponse : « Notre politique de remboursement autorise les retours dans les 30 jours suivant l'achat, à condition que l'article soit dans son état d'origine. Pour plus d'informations, veuillez consulter notre documentation officielle sur la politique de remboursement ou contacter notre service client. »</p>
                                                                                </div>
                                                                           </li>


                                                                      </ul>
                                                                 </div>
                                                            </div>

                                                       </div>

                                                       <hr class="w-full border-t border-t-[rgb(239,242,246)] mt-[20px] mb-0">

                                                       <div class="mt-[20px] flex flex-row justify-start items-start">
                                                            <label for="" class="flex-[1_0_145px] min-w-[145px] max-w-[min(180px,12vw)] inline-block font-normal">
                                                                 <div class="flex flex-col justify-start items-[normal]">
                                                                      <p class="font-normal text-[14px] leading-[18px] tracking-[-0.01em]">Liens « En savoir plus »</p>
                                                                      <p class="mt-[4px] font-normal text-[12px] leading-[16px] tracking-[-0.01em] text-[rgb(100,116,145)]">L'Agent IA ajoute des liens « En savoir plus » vers des sources externes dans ses réponses, lorsque ces sources sont disponibles.</p>
                                                                 </div>
                                                            </label>
                                                            <div class="flex-[1_1_0%] relative ml-[24px]">
                                                                 <em aria-label="Activer" class="ml-[20px] flex flex-row justify-start items-start">
                                                                      <label class="relative inline-block align-top rounded-[17px] border border-[rgb(5,102,255)] bg-[rgb(5,102,255)] cursor-pointer flex-[0_0_auto] w-[36px] max-w-[36px] h-[22px] shadow-[inset_0_0_0_11px_rgb(5,102,255)]">
                                                                           <input type="checkbox" role="switch" class="absolute w-[1px] h-[1px] m-[-1px] p-0 overflow-hidden clip-[rect(0,0,0,0)] border-0">
                                                                           <div class="absolute left-[calc(100%-1px)] top-[1px] bottom-[1px] w-[18px] rounded-full bg-white transition-[left,transform] duration-200 ease-in-out shadow-[0_2px_8px_rgba(0,20,51,0.28)] translate-x-[-100%] translate-y-0"></div>
                                                                      </label>
                                                                 </em>
                                                            </div>
                                                       </div>

                                                  </div>
                                             </div>
                                        </section>

                                   </div>


                              </div>
                         </div>
                    </div>
               </div>
          </div>
     </div>
</template>
<script setup lang="ts">
const { t } = useI18n()
const layoutLoadingPanel = useState('layoutLoadingPanel')

onMounted(async () => {
     layoutLoadingPanel.value = false
})

definePageMeta({
     layout: 'panel'
})

const config = useRuntimeConfig()

</script>
