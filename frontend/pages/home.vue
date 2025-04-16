<template>
     <div id="hellohumans-siteweb" class="max-w-[3840px] mx-auto">
          <div class="w-full bg-[#001433] block sm:pt-[18px] sm:pb-[4px] [@media(min-width:1200px)]:pt-[18px] [@media(min-width:1200px)]:pb-[4px]">
               <div class="mx-auto px-[16px] max-w-full sm:px-[40px] md:px-0 md:max-w-[840px] [@media(min-width:1200px)]:px-[92px] [@media(min-width:1200px)]:max-w-full [@media(min-width:1400px)]:px-0 [@media(min-width:1400px)]:max-w-[1216px]">
                    <div class="flex items-center justify-end w-full">
                         <div class="relative">
                              <PanelCommonLanguageSelector />
                         </div>
                         <div class="flex flex-col items-center w-full sm:w-auto">
                              <NuxtLink
                                   to="/panel/logout"
                                   class="w-full inline-flex gap-[8px] items-center justify-center rounded-[8px] cursor-pointer relative text-[16px] leading-[24px] tracking-[-0.01em] no-underline underline-offset-[4px] transition duration-200 font-normal px-[16px] bg-transparent border border-transparent text-[#eff2f6] pointer-events-auto text-center hover:text-[#eff2f6] hover:bg-transparent hover:border-transparent hover:underline hover:decoration-[#eff2f6] active:text-[#eff2f6] active:bg-transparent active:border-transparent"
                              >Se déconnecter</NuxtLink>
                         </div>
                    </div>
               </div>
          </div>
          <header class="sticky top-0 left-0 right-0 z-[998] mx-auto">
               <div class="bg-[#001433] [@media(min-width:1200px)]:transition-[transform,background] [@media(min-width:1200px)]:duration-[500ms,200ms] [@media(min-width:1200px)]:ease-in-out">
                    <div class="h-[70px] px-[16px] mx-auto overflow-y-hidden w-full grid [grid-template:'logo_empty_search_aside_70px_nav_nav_nav_nav_min-content_buttons_buttons_buttons_buttons_min-content'] gap-0 sm:px-[40px] sm:h-[72px] sm:[grid-template-rows:'72px_min-content_min-content'] [@media(min-width:1200px)]:flex [@media(min-width:1200px)]:items-center [@media(min-width:1200px)]:justify-between [@media(min-width:1200px)]:overflow-y-visible [@media(min-width:1200px)]:px-[92px] [@media(min-width:1200px)]:max-w-full [@media(min-width:1400px)]:px-0 [@media(min-width:1400px)]:max-w-[1216px]">
                         <div class="sticky top-0 flex items-center z-[2] [grid-column-start:logo] [grid-column-end:empty] [@media(min-width:1200px)]:bg-transparent [@media(min-width:1200px)]:z-unset [@media(min-width:1200px)]:relative [@media(min-width:1200px)]:top-unset">
                              <NuxtLink to="/" class="flex items-center">
                                   <svgo-logo-hello-humans-full class="h-[34px] w-[auto] fill-[#fff]" />
                              </NuxtLink>
                         </div>
                         <nav class="w-full flex flex-col items-center justify-center [grid-area:nav]  mt-[25px] pb-[200px] [@media(min-width:1200px)]:flex-row [@media(min-width:1200px)]:mt-0 [@media(min-width:1200px)]:overflow-visible [@media(min-width:1200px)]:pb-0  [@media(min-width:1200px)]:gap-[40px] [@media(min-width:1200px)>*]:basis-fit [@media(min-width:1200px)>*]:w-auto">
                              <div class="relative w-auto p-0 mb-0 overflow-hidden">
                                   <div class="flex items-center p-0 cursor-default [@media(min-width:1200px)]:py-[10px] [@media(min-width:1200px)]:px-0">
                                        <NuxtLink to="/" class="text-white no-underline hover:underline [@media(min-width:1200px)]:text-[16px] [@media(min-width:1200px)]:leading-[24px] [@media(min-width:1200px)]:tracking-[-0.01em]">
                                             sdqsd
                                        </NuxtLink>
                                   </div>
                              </div>
                         </nav>
                         <div class="contents [@media(min-width:1200px)]:inline-flex [@media(min-width:1200px)>*]:basis-fit [@media(min-width:1200px)>*]:w-auto">
                              <div class="bg-transparent flex flex-row justify-end m-0 p-0 gap-[16px] w-full relative">
                                   <div class="flex flex-col items-center w-full sm:w-auto [@media(min-width:1200px)>*]:mb-0">
                                        <NuxtLink to="/panel/" class="w-max inline-flex gap-[8px] items-center justify-center p-[7px_16px] rounded-[8px] cursor-pointer relative text-[16px] leading-[24px] tracking-[-0.01em] no-underline underline-offset-[4px] transition-all duration-200 font-normal bg-[#64ED80] border border-[#64ED80] text-[#080F1A] pointer-events-auto text-center hover:bg-[#31E756] hover:border-[#31E756] hover:text-[#080F1A] hover:no-underline hover:[text-decoration-color:transparent] active:bg-[#18CE3D] active:border-[#18CE3D] active:text-[#080F1A]">
                                             Accéder à l’app
                                        </NuxtLink>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
          </header>
          <main class="bg-transparent">
               <section class="bg-[#001433] bg-center bg-cover mx-auto pt-[50px] sm:pt-[80px]">
                    <div class="max-w-full overflow-hidden relative pb-[40px]">
                         <div class="hhcss_waveLandingPage hidden absolute w-[442px] left-[58%] top-[18%] translate-x-[58%]">
                              <svgo-wave-landing-page/>
                         </div>

                         <div class="mx-auto px-[16px] max-w-full flex flex-col gap-[24px] sm:px-[40px] [905px]:px-0 [905px]:max-w-[840px] [905px]:flex-row [905px]:gap-[20px] [@media(min-width:1200px)]:px-[92px] [@media(min-width:1200px)]:max-w-full [@media(min-width:1400px)]:px-0 [@media(min-width:1400px)]:max-w-[1216px]">
                              <div class="flex flex-col items-center basis-full text-center sm:items-center sm:text-center [905px]:block [905px]:basis-1/2 [905px]:text-left">
                                   <div class="flex flex-col justify-start items-[normal]">
                                        <h1 class="text-white font-semibold whitespace-pre-line opacity-0 delay-0 animate-[animation-hg5yfr_0.6s_forwards] [animation-timing-function:cubic-bezier(0.5,0,0,1.2)] text-[52px] leading-[64px] tracking-[-0.03em]">Maximisez le retour sur investissement de votre service client grâce à des conseils avisés</h1>
                                        <p class="text-white whitespace-pre-line opacity-0 [transition-delay:0.24s] [animation-delay:0.24s] animate-[animation-hg5yfr_0.6s_forwards] [animation-timing-function:cubic-bezier(0.5,0,0,1.2)] text-[16px] leading-[24px] tracking-[-0.01em] font-normal mt-[24px]">Améliorez les résultats de votre service client dès la première semaine avec une automatisation sur mesure, des stratégies d'optimisation adaptées et des limites personnalisées.</p>
                                        <div></div>
                                   </div>
                              </div>
                         </div>
                    </div>
               </section>
          </main>
     </div>
</template>
<script setup lang="ts">
</script>
