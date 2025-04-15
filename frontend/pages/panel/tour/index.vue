<template>
     <div id="app-content" class="absolute inset-0 grid grid-cols-[1fr] h-full max-h-full overflow-hidden">
          <div class="flex flex-col justify-start items-[normal] h-full max-h-full overflow-hidden relative">
               <div class="mt-0 mb-0 flex flex-col absolute inset-0">

                    <!--  BOX CONTENU TOUR -->
                    <div class="overflow-auto flex flex-[1_1_0%] flex-col items-stretch bg-white scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#acb8cb]">

                         <!--  HEADER (logo et lang) -->
                         <div class="h-[100px] flex-[0_0_100px] px-[40px] justify-start w-full flex items-center">
                              <svgo-logo-hello-humans-full class="w-[180px] fill-[#3886ff]"/>
                              <div class="ml-auto">
                                   <PanelCommonLanguageSelector />
                              </div>
                         </div>

                         <!--  CONTENU DES PARTIE -->
                         <div class="flex flex-col gap-[24px] px-[16px] pb-[24px] mx-auto w-[840px] max-w-full flex-grow sm:gap-[40px] sm:px-[40px] sm:pb-[40px]">
                              <span class="block w-[8px] min-w-[8px] h-[8px] min-h-[8px]"></span>

                              <!--  Contenu du des parties, l'idée et d'afficher la première partie et pas les autres tant qu'il n'a pas remplie toutes les séctions, une fois toutes les séctions remplie cela active le bouton suivant, et si il clique il se trouve dans la partie suivante etc ...    -->
                              <form action="">

                                   <!--  --- PARTIE 1 ---  -->
                                   <div class="flex flex-col gap-[32px] sm:gap-[48px]">

                                        <!--  SECTION 1 -->
                                        <div class="hhcss_onboardingBox flex flex-col justify-start items-[normal]">
                                             <div class="flex flex-col justify-start items-[normal] mt-0 mb-0">
                                                  <h2 class="mt-0 mb-0 font-medium text-[16px] leading-[20px] tracking-[-0.01em] sm:text-[20px] sm:leading-[26px]">Quelle est l'adresse URL de votre site web</h2>
                                                  <p class="mt-[2px] mb-0 font-normal text-[16px] leading-[20px] tracking-[-0.01em] text-[#647491]">Vos réponses nous aideront à personnaliser votre expérience</p>
                                             </div>
                                             <div class="mt-0 mb-0 mt-[16px] ">
                                                  <div class="text-[16px] leading-[20px] tracking-[-0.01em] w-full text-left text-[#647491] relative">

                                                       <!--  Champ input (url) -->
                                                       <label class="font-normal max-w-full flex flex-col relative">
                                                            <input name="name" type="text" placeholder="Votre nom" class="block w-full text-[16px] leading-[20px] tracking-[-0.01em] h-[51px] text-[#080f1a] border-2 border-solid border-[#d3dbe5] rounded-[8px] px-[14px] py-[16px] outline-none">
                                                       </label>
                                                  </div>
                                             </div>
                                        </div>

                                        <!--  SECTION 2 -->
                                        <div class="hhcss_onboardingBox flex flex-col justify-start items-[normal]">
                                             <div class="flex flex-col justify-start items-[normal] mt-0 mb-0">
                                                  <h2 class="mt-0 mb-0 font-medium text-[16px] leading-[20px] tracking-[-0.01em] sm:text-[20px] sm:leading-[26px]">Dans quel service travaillez-vous ?</h2>
                                             </div>
                                             <div class="mt-0 mb-0 mt-[16px] ">

                                                  <!--  SELECTION VIA BOUTTON (Un seul choix possible) -->
                                                  <div class="flex flex-wrap gap-[12px]">

                                                       <!--  BOUTON Séléction -->
                                                       <div class="flex flex-col justify-start items-[normal]">
                                                            <div class="select-none min-w-[120px] bg-white p-[12px] border border-[#e2e8ef] outline-none rounded-[8px] relative flex items-center hover:border-[#0566ff] hover:bg-white hover:text-[#080f1a] sm:p-[20px]">
                                                                 <svgo-panel-onboarding-icon-dev-web-site class="w-[24px] h-[24px] fill-[#647491]"/>
                                                                 <label class="text-[16px] leading-[20px] tracking-[-0.01em] font-medium text-[#080f1a]">
                                                                      <input type="radio" class="absolute w-[1px] h-[1px] m-[-1px] p-0 overflow-hidden clip-[rect(0px,_0px,_0px,_0px)] border-0">
                                                                      <span class="ml-[8px]">Développement de sites</span>
                                                                 </label>
                                                            </div>
                                                       </div>

                                                       <!--  BOUTON Séléction -->
                                                       <div class="flex flex-col justify-start items-[normal]">
                                                            <div class="select-none min-w-[120px] bg-white p-[12px] border border-[#e2e8ef] outline-none rounded-[8px] relative flex items-center hover:border-[#0566ff] hover:bg-white hover:text-[#080f1a] sm:p-[20px]">
                                                                 <svgo-panel-onboarding-icon-sale class="w-[24px] h-[24px] fill-[#647491]"/>
                                                                 <label class="text-[16px] leading-[20px] tracking-[-0.01em] font-medium text-[#080f1a]">
                                                                      <input type="radio" class="absolute w-[1px] h-[1px] m-[-1px] p-0 overflow-hidden clip-[rect(0px,_0px,_0px,_0px)] border-0">
                                                                      <span class="ml-[8px]">Vente</span>
                                                                 </label>
                                                            </div>
                                                       </div>

                                                       <!--  BOUTON Séléction -->
                                                       <div class="flex flex-col justify-start items-[normal]">
                                                            <div class="select-none min-w-[120px] bg-white p-[12px] border border-[#e2e8ef] outline-none rounded-[8px] relative flex items-center hover:border-[#0566ff] hover:bg-white hover:text-[#080f1a] sm:p-[20px]">
                                                                 <svgo-panel-onboarding-icon-marketing class="w-[24px] h-[24px] fill-[#647491]"/>
                                                                 <label class="text-[16px] leading-[20px] tracking-[-0.01em] font-medium text-[#080f1a]">
                                                                      <input type="radio" class="absolute w-[1px] h-[1px] m-[-1px] p-0 overflow-hidden clip-[rect(0px,_0px,_0px,_0px)] border-0">
                                                                      <span class="ml-[8px]">Marketing</span>
                                                                 </label>
                                                            </div>
                                                       </div>

                                                  </div>
                                             </div>
                                        </div>

                                        <!--  SECTION 3 -->
                                        <div class="hhcss_onboardingBox flex flex-col justify-start items-[normal]">
                                             <div class="flex flex-col justify-start items-[normal] mt-0 mb-0">
                                                  <h2 class="mt-0 mb-0 font-medium text-[16px] leading-[20px] tracking-[-0.01em] sm:text-[20px] sm:leading-[26px]">Actuellement comment vous communiquer avec vos clients ?</h2>
                                                  <p class="mt-[2px] mb-0 font-normal text-[16px] leading-[20px] tracking-[-0.01em] text-[#647491]">Sélectionnez tout ce qui s'applique</p>
                                             </div>
                                             <div class="mt-0 mb-0 mt-[16px] ">

                                                  <!--  SELECTION VIA BOUTTON (Un seul choix possible) -->
                                                  <div class="flex flex-wrap gap-[12px]">

                                                       <!--  BOUTON Séléction -->
                                                       <div class="flex flex-col justify-start items-[normal]">
                                                            <div class="select-none min-w-[120px] bg-white p-[12px] border border-[#e2e8ef] outline-none rounded-[8px] relative flex items-center hover:border-[#0566ff] hover:bg-white hover:text-[#080f1a] sm:p-[20px]">
                                                                 <svgo-panel-onboarding-icon-mail class="w-[24px] h-[24px] fill-[#647491]"/>
                                                                 <label class="text-[16px] leading-[20px] tracking-[-0.01em] font-medium text-[#080f1a]">
                                                                      <input type="radio" class="absolute w-[1px] h-[1px] m-[-1px] p-0 overflow-hidden clip-[rect(0px,_0px,_0px,_0px)] border-0">
                                                                      <span class="ml-[8px]">Par e-mail</span>
                                                                 </label>
                                                            </div>
                                                       </div>

                                                       <!--  BOUTON Séléction -->
                                                       <div class="flex flex-col justify-start items-[normal]">
                                                            <div class="select-none min-w-[120px] bg-white p-[12px] border border-[#e2e8ef] outline-none rounded-[8px] relative flex items-center hover:border-[#0566ff] hover:bg-white hover:text-[#080f1a] sm:p-[20px]">
                                                                 <svgo-panel-onboarding-icon-phone class="w-[24px] h-[24px] fill-[#647491]"/>
                                                                 <label class="text-[16px] leading-[20px] tracking-[-0.01em] font-medium text-[#080f1a]">
                                                                      <input type="radio" class="absolute w-[1px] h-[1px] m-[-1px] p-0 overflow-hidden clip-[rect(0px,_0px,_0px,_0px)] border-0">
                                                                      <span class="ml-[8px]">Par téléphone</span>
                                                                 </label>
                                                            </div>
                                                       </div>

                                                       <!--  BOUTON Séléction -->
                                                       <div class="flex flex-col justify-start items-[normal]">
                                                            <div class="select-none min-w-[120px] bg-white p-[12px] border border-[#e2e8ef] outline-none rounded-[8px] relative flex items-center hover:border-[#0566ff] hover:bg-white hover:text-[#080f1a] sm:p-[20px]">
                                                                 <svgo-panel-onboarding-icon-marketing class="w-[24px] h-[24px] fill-[#647491]"/>
                                                                 <label class="text-[16px] leading-[20px] tracking-[-0.01em] font-medium text-[#080f1a]">
                                                                      <input type="radio" class="absolute w-[1px] h-[1px] m-[-1px] p-0 overflow-hidden clip-[rect(0px,_0px,_0px,_0px)] border-0">
                                                                      <span class="ml-[8px]">Sur place</span>
                                                                 </label>
                                                            </div>
                                                       </div>

                                                       <!--  BOUTON Séléction -->
                                                       <div class="flex flex-col justify-start items-[normal]">
                                                            <div class="select-none min-w-[120px] bg-white p-[12px] border border-[#e2e8ef] outline-none rounded-[8px] relative flex items-center hover:border-[#0566ff] hover:bg-white hover:text-[#080f1a] sm:p-[20px]">
                                                                 <svgo-panel-onboarding-icon-marketing class="w-[24px] h-[24px] fill-[#647491]"/>
                                                                 <label class="text-[16px] leading-[20px] tracking-[-0.01em] font-medium text-[#080f1a]">
                                                                      <input type="radio" class="absolute w-[1px] h-[1px] m-[-1px] p-0 overflow-hidden clip-[rect(0px,_0px,_0px,_0px)] border-0">
                                                                      <span class="ml-[8px]">Siteweb / Blog</span>
                                                                 </label>
                                                            </div>
                                                       </div>

                                                       <!--  BOUTON Séléction -->
                                                       <div class="flex flex-col justify-start items-[normal]">
                                                            <div class="select-none min-w-[120px] bg-white p-[12px] border border-[#e2e8ef] outline-none rounded-[8px] relative flex items-center hover:border-[#0566ff] hover:bg-white hover:text-[#080f1a] sm:p-[20px]">
                                                                 <svgo-panel-onboarding-icon-marketing class="w-[24px] h-[24px] fill-[#647491]"/>
                                                                 <label class="text-[16px] leading-[20px] tracking-[-0.01em] font-medium text-[#080f1a]">
                                                                      <input type="radio" class="absolute w-[1px] h-[1px] m-[-1px] p-0 overflow-hidden clip-[rect(0px,_0px,_0px,_0px)] border-0">
                                                                      <span class="ml-[8px]">Aucun</span>
                                                                 </label>
                                                            </div>
                                                       </div>

                                                  </div>
                                             </div>
                                        </div>

                                   </div>


                                   <!--  --- PARTIE 2 ---  -->

                                   <div class="flex flex-col gap-[32px] sm:gap-[48px]">

                                        <!--  SECTION 1 -->
                                        <div class="hhcss_onboardingBox flex flex-col justify-start items-[normal]">
                                             <div class="flex flex-col justify-start items-[normal] mt-0 mb-0">
                                                  <h2 class="mt-0 mb-0 font-medium text-[16px] leading-[20px] tracking-[-0.01em] sm:text-[20px] sm:leading-[26px]">Quel est votre principal modèle économique ?</h2>
                                             </div>
                                             <div class="mt-0 mb-0 mt-[16px] ">

                                                  <!--  SELECTION VIA BOUTTON (Un seul choix possible) -->
                                                  <div class="flex flex-wrap gap-[12px]">


                                                       <!--  BOUTON Séléction -->
                                                       <div class="flex flex-col justify-start items-[normal]">
                                                            <div class="select-none min-w-[120px] bg-white p-[12px] border border-[#e2e8ef] outline-none rounded-[8px] relative flex items-center hover:border-[#0566ff] hover:bg-white hover:text-[#080f1a] sm:p-[20px]">
                                                                 <svgo-panel-onboarding-icon-service class="w-[24px] h-[24px] fill-[#647491]"/>
                                                                 <label class="text-[16px] leading-[20px] tracking-[-0.01em] font-medium text-[#080f1a]">
                                                                      <input type="radio" class="absolute w-[1px] h-[1px] m-[-1px] p-0 overflow-hidden clip-[rect(0px,_0px,_0px,_0px)] border-0">
                                                                      <span class="ml-[8px]">Je fournis des services</span>
                                                                 </label>
                                                            </div>
                                                       </div>

                                                       <!--  BOUTON Séléction -->
                                                       <div class="flex flex-col justify-start items-[normal]">
                                                            <div class="select-none min-w-[120px] bg-white p-[12px] border border-[#e2e8ef] outline-none rounded-[8px] relative flex items-center hover:border-[#0566ff] hover:bg-white hover:text-[#080f1a] sm:p-[20px]">
                                                                 <svgo-panel-onboarding-icon-ecommerce class="w-[24px] h-[24px] fill-[#647491]"/>
                                                                 <label class="text-[16px] leading-[20px] tracking-[-0.01em] font-medium text-[#080f1a]">
                                                                      <input type="radio" class="absolute w-[1px] h-[1px] m-[-1px] p-0 overflow-hidden clip-[rect(0px,_0px,_0px,_0px)] border-0">
                                                                      <span class="ml-[8px]">E-commerce</span>
                                                                 </label>
                                                            </div>
                                                       </div>

                                                       <!--  BOUTON Séléction -->
                                                       <div class="flex flex-col justify-start items-[normal]">
                                                            <div class="select-none min-w-[120px] bg-white p-[12px] border border-[#e2e8ef] outline-none rounded-[8px] relative flex items-center hover:border-[#0566ff] hover:bg-white hover:text-[#080f1a] sm:p-[20px]">
                                                                 <label class="text-[16px] leading-[20px] tracking-[-0.01em] font-medium text-[#080f1a]">
                                                                      <input type="radio" class="absolute w-[1px] h-[1px] m-[-1px] p-0 overflow-hidden clip-[rect(0px,_0px,_0px,_0px)] border-0">
                                                                      <span class="ml-[8px]">Autre</span>
                                                                 </label>
                                                            </div>
                                                       </div>

                                                  </div>


                                             </div>
                                        </div>

                                        <!--  SECTION 2 -->
                                        <div class="hhcss_onboardingBox flex flex-col justify-start items-[normal]">
                                             <div class="flex flex-col justify-start items-[normal] mt-0 mb-0">
                                                  <h2 class="mt-0 mb-0 font-medium text-[16px] leading-[20px] tracking-[-0.01em] sm:text-[20px] sm:leading-[26px]">Quel est le secteur d'activité de votre entreprise ?</h2>
                                             </div>
                                             <div class="mt-0 mb-0 mt-[16px] ">

                                                  <!--  Contenu du select -->
                                                  <div class="relative text-left h-fit pointer-events-auto rounded-[8px]">
                                                       <fieldset class="absolute inset-[-7px_0px_0px] m-0 pl-[5px] overflow-hidden pointer-events-none rounded-[8px] border-[2px] border-[#d3dbe5]">
                                                            <legend class="text-[12px] leading-[16px] tracking-[-0.01em] invisible w-auto block p-0 max-w-0 border-none m-0 whitespace-nowrap font-normal transition-[max-width] duration-[100ms] ease-[cubic-bezier(0,_0,_0.2,_1)]">
                                                                 <span class="inline-block px-[8px] max-w-full"
                                                                 ></span>
                                                            </legend>
                                                       </fieldset>
                                                       <!--  Trigangle flésh à inversé en hauteur quand on clique sur input (pour dire qu'on séléctionne) -->
                                                       <div class="flex justify-between items-center h-[52px] text-[16px] leading-[20px] tracking-[-0.01em] rounded-[8px] outline-none min-w-0">
                                                            <div class="left-[2px] top-[8px] bg-white overflow-hidden absolute text-ellipsis whitespace-nowrap cursor-default pointer-events-none block px-0 pt-[8px] pb-[12px] pl-[12px] w-[calc(100%-29px)] text-[16px] leading-[20px] tracking-normal">
                                                                 Accessoires de vapotage et pour fumeurs
                                                            </div>
                                                            <input placeholder="Sélectionnez votre secteur d'activité" value="Accessoires de vapotage et pour fumeurs" class="border-none outline-none w-full overflow-hidden text-ellipsis whitespace-nowrap pt-[16px] pr-0 pb-[16px] pl-[14px]">
                                                            <div class="h-[52px] pr-[7px] flex items-center">
                                                                 <div class="flex flex-row justify-start items-center">
                                                                      <svgo-panel-icon-triangle-caret-down class="w-[24px] h-[24px] fill-[#080f1a]"/>
                                                                 </div>
                                                            </div>
                                                       </div>
                                                  </div>

                                                  <!--  Box quand on clique sur l'input Sélectionnez votre secteur d'activité, elle permet de selectionner une activité une fois séléctionner sa met à jour et ferme la box, cette partie est améliorer, l'idée et de garder le principe mais d'améliorer ce code  -->
                                                  <div class="min-w-[650.6px] max-w-[256px] shadow-[0px_8px_20px_rgba(0,20,51,0.24)] bg-white rounded-[8px] absolute top-[56px] z-[2] max-h-[280px] flex mt-0">
                                                       <div class="relative flex-[1_1_0%] overflow-hidden">
                                                            <div class="scrollbar-none overflow-scroll scrollbar-none overflow-y-scroll overflow-x-hidden w-full h-full">
                                                                 <div class="min-w-full table">
                                                                      <ul class="list-none outline-none p-0 m-0">
                                                                           <div class="scrollbar-thin scrollbar-thumb-[#d3dbe5] scrollbar-track-transparent h-[280px] outline-none overflow-y-auto relative">
                                                                                <div class="px-[8px]">
                                                                                     <span class="block w-[8px] min-w-[8px] h-[8px] min-h-[8px]"></span>
                                                                                     <li class="px-[8px] py-[9px] rounded-[4px] text-[#080f1a] cursor-pointer bg-white overflow-hidden text-ellipsis whitespace-nowrap flex gap-[8px] items-center text-[14px] leading-[18px] tracking-[-0.01em] hover:bg-[#dce9ff]">Accessoires de vapotage et pour fumeurs</li>
                                                                                     <li class="px-[8px] py-[9px] rounded-[4px] text-[#080f1a] cursor-pointer bg-white overflow-hidden text-ellipsis whitespace-nowrap flex gap-[8px] items-center text-[14px] leading-[18px] tracking-[-0.01em] hover:bg-[#dce9ff]">Alimentation et boissons</li>
                                                                                     <span class="block w-[8px] min-w-[8px] h-[8px] min-h-[8px]"></span>
                                                                                </div>
                                                                           </div>
                                                                      </ul>
                                                                 </div>
                                                            </div>
                                                       </div>
                                                  </div>


                                             </div>
                                        </div>

                                        <!--  SECTION 3 -->
                                        <div class="hhcss_onboardingBox flex flex-col justify-start items-[normal]">
                                             <div class="flex flex-col justify-start items-[normal] mt-0 mb-0">
                                                  <h2 class="mt-0 mb-0 font-medium text-[16px] leading-[20px] tracking-[-0.01em] sm:text-[20px] sm:leading-[26px]">Combien de conversations avec les clients votre entreprise traite-t-elle par mois ?</h2>
                                             </div>
                                             <div class="mt-0 mb-0 mt-[16px] ">
                                                  <!--  SELECTION VIA BOUTTON (Un seul choix possible) -->
                                                  <div class="flex flex-wrap gap-[12px]">

                                                       <!--  BOUTON Séléction -->
                                                       <div class="flex flex-col justify-start items-[normal]">
                                                            <div class="select-none min-w-[120px] bg-white p-[12px] border border-[#e2e8ef] outline-none rounded-[8px] relative flex items-center hover:border-[#0566ff] hover:bg-white hover:text-[#080f1a] sm:p-[20px]">
                                                                 <label class="text-[16px] leading-[20px] tracking-[-0.01em] font-medium text-[#080f1a]">
                                                                      <input type="radio" class="absolute w-[1px] h-[1px] m-[-1px] p-0 overflow-hidden clip-[rect(0px,_0px,_0px,_0px)] border-0">
                                                                      <span class="ml-[8px]">Jusqu'a 200</span>
                                                                 </label>
                                                            </div>
                                                       </div>

                                                       <!--  BOUTON Séléction -->
                                                       <div class="flex flex-col justify-start items-[normal]">
                                                            <div class="select-none min-w-[120px] bg-white p-[12px] border border-[#e2e8ef] outline-none rounded-[8px] relative flex items-center hover:border-[#0566ff] hover:bg-white hover:text-[#080f1a] sm:p-[20px]">
                                                                 <label class="text-[16px] leading-[20px] tracking-[-0.01em] font-medium text-[#080f1a]">
                                                                      <input type="radio" class="absolute w-[1px] h-[1px] m-[-1px] p-0 overflow-hidden clip-[rect(0px,_0px,_0px,_0px)] border-0">
                                                                      <span class="ml-[8px]">200 - 999</span>
                                                                 </label>
                                                            </div>
                                                       </div>

                                                       <!--  BOUTON Séléction -->
                                                       <div class="flex flex-col justify-start items-[normal]">
                                                            <div class="select-none min-w-[120px] bg-white p-[12px] border border-[#e2e8ef] outline-none rounded-[8px] relative flex items-center hover:border-[#0566ff] hover:bg-white hover:text-[#080f1a] sm:p-[20px]">
                                                                 <label class="text-[16px] leading-[20px] tracking-[-0.01em] font-medium text-[#080f1a]">
                                                                      <input type="radio" class="absolute w-[1px] h-[1px] m-[-1px] p-0 overflow-hidden clip-[rect(0px,_0px,_0px,_0px)] border-0">
                                                                      <span class="ml-[8px]">1 000 - 4 999</span>
                                                                 </label>
                                                            </div>
                                                       </div>

                                                       <!--  BOUTON Séléction -->
                                                       <div class="flex flex-col justify-start items-[normal]">
                                                            <div class="select-none min-w-[120px] bg-white p-[12px] border border-[#e2e8ef] outline-none rounded-[8px] relative flex items-center hover:border-[#0566ff] hover:bg-white hover:text-[#080f1a] sm:p-[20px]">
                                                                 <label class="text-[16px] leading-[20px] tracking-[-0.01em] font-medium text-[#080f1a]">
                                                                      <input type="radio" class="absolute w-[1px] h-[1px] m-[-1px] p-0 overflow-hidden clip-[rect(0px,_0px,_0px,_0px)] border-0">
                                                                      <span class="ml-[8px]">5 000 - 10 000</span>
                                                                 </label>
                                                            </div>
                                                       </div>

                                                       <div class="flex flex-col justify-start items-[normal]">
                                                            <div class="select-none min-w-[120px] bg-white p-[12px] border border-[#e2e8ef] outline-none rounded-[8px] relative flex items-center hover:border-[#0566ff] hover:bg-white hover:text-[#080f1a] sm:p-[20px]">
                                                                 <label class="text-[16px] leading-[20px] tracking-[-0.01em] font-medium text-[#080f1a]">
                                                                      <input type="radio" class="absolute w-[1px] h-[1px] m-[-1px] p-0 overflow-hidden clip-[rect(0px,_0px,_0px,_0px)] border-0">
                                                                      <span class="ml-[8px]">10 000 ou plus</span>
                                                                 </label>
                                                            </div>
                                                       </div>

                                                       <!--  BOUTON Séléction -->
                                                       <div class="flex flex-col justify-start items-[normal]">
                                                            <div class="select-none min-w-[120px] bg-white p-[12px] border border-[#e2e8ef] outline-none rounded-[8px] relative flex items-center hover:border-[#0566ff] hover:bg-white hover:text-[#080f1a] sm:p-[20px]">
                                                                 <label class="text-[16px] leading-[20px] tracking-[-0.01em] font-medium text-[#080f1a]">
                                                                      <input type="radio" class="absolute w-[1px] h-[1px] m-[-1px] p-0 overflow-hidden clip-[rect(0px,_0px,_0px,_0px)] border-0">
                                                                      <span class="ml-[8px]">Je ne sais pas</span>
                                                                 </label>
                                                            </div>
                                                       </div>

                                                  </div>
                                             </div>
                                        </div>

                                   </div>

                                   <!--  --- PARTIE 3 ---  -->

                                   <div class="flex flex-col gap-[32px] sm:gap-[48px]">

                                        <!--  SECTION 1 -->
                                        <div class="hhcss_onboardingBox flex flex-col justify-start items-[normal]">
                                             <div class="flex flex-col justify-start items-[normal] mt-0 mb-0">
                                                  <h2 class="mt-0 mb-0 font-medium text-[16px] leading-[20px] tracking-[-0.01em] sm:text-[20px] sm:leading-[26px]">Combien de visiteurs votre site Web attire-t-il chaque mois ?</h2>
                                             </div>
                                             <div class="mt-0 mb-0 mt-[16px] ">

                                                  <!--  SELECTION VIA BOUTTON (Un seul choix possible) -->
                                                  <div class="flex flex-wrap gap-[12px]">

                                                       <!--  BOUTON Séléction -->
                                                       <div class="flex flex-col justify-start items-[normal]">
                                                            <div class="select-none min-w-[120px] bg-white p-[12px] border border-[#e2e8ef] outline-none rounded-[8px] relative flex items-center hover:border-[#0566ff] hover:bg-white hover:text-[#080f1a] sm:p-[20px]">
                                                                 <label class="text-[16px] leading-[20px] tracking-[-0.01em] font-medium text-[#080f1a]">
                                                                      <input type="radio" class="absolute w-[1px] h-[1px] m-[-1px] p-0 overflow-hidden clip-[rect(0px,_0px,_0px,_0px)] border-0">
                                                                      <span class="ml-[8px]">Jusqu'a 1 000</span>
                                                                 </label>
                                                            </div>
                                                       </div>

                                                       <!--  BOUTON Séléction -->
                                                       <div class="flex flex-col justify-start items-[normal]">
                                                            <div class="select-none min-w-[120px] bg-white p-[12px] border border-[#e2e8ef] outline-none rounded-[8px] relative flex items-center hover:border-[#0566ff] hover:bg-white hover:text-[#080f1a] sm:p-[20px]">
                                                                 <label class="text-[16px] leading-[20px] tracking-[-0.01em] font-medium text-[#080f1a]">
                                                                      <input type="radio" class="absolute w-[1px] h-[1px] m-[-1px] p-0 overflow-hidden clip-[rect(0px,_0px,_0px,_0px)] border-0">
                                                                      <span class="ml-[8px]">1 000 - 10 000</span>
                                                                 </label>
                                                            </div>
                                                       </div>

                                                       <!--  BOUTON Séléction -->
                                                       <div class="flex flex-col justify-start items-[normal]">
                                                            <div class="select-none min-w-[120px] bg-white p-[12px] border border-[#e2e8ef] outline-none rounded-[8px] relative flex items-center hover:border-[#0566ff] hover:bg-white hover:text-[#080f1a] sm:p-[20px]">
                                                                 <label class="text-[16px] leading-[20px] tracking-[-0.01em] font-medium text-[#080f1a]">
                                                                      <input type="radio" class="absolute w-[1px] h-[1px] m-[-1px] p-0 overflow-hidden clip-[rect(0px,_0px,_0px,_0px)] border-0">
                                                                      <span class="ml-[8px]">10 000 - 50 000</span>
                                                                 </label>
                                                            </div>
                                                       </div>

                                                       <!--  BOUTON Séléction -->
                                                       <div class="flex flex-col justify-start items-[normal]">
                                                            <div class="select-none min-w-[120px] bg-white p-[12px] border border-[#e2e8ef] outline-none rounded-[8px] relative flex items-center hover:border-[#0566ff] hover:bg-white hover:text-[#080f1a] sm:p-[20px]">
                                                                 <label class="text-[16px] leading-[20px] tracking-[-0.01em] font-medium text-[#080f1a]">
                                                                      <input type="radio" class="absolute w-[1px] h-[1px] m-[-1px] p-0 overflow-hidden clip-[rect(0px,_0px,_0px,_0px)] border-0">
                                                                      <span class="ml-[8px]">50 000 - 100 000</span>
                                                                 </label>
                                                            </div>
                                                       </div>

                                                       <!--  BOUTON Séléction -->
                                                       <div class="flex flex-col justify-start items-[normal]">
                                                            <div class="select-none min-w-[120px] bg-white p-[12px] border border-[#e2e8ef] outline-none rounded-[8px] relative flex items-center hover:border-[#0566ff] hover:bg-white hover:text-[#080f1a] sm:p-[20px]">
                                                                 <label class="text-[16px] leading-[20px] tracking-[-0.01em] font-medium text-[#080f1a]">
                                                                      <input type="radio" class="absolute w-[1px] h-[1px] m-[-1px] p-0 overflow-hidden clip-[rect(0px,_0px,_0px,_0px)] border-0">
                                                                      <span class="ml-[8px]">100 000 ou plus</span>
                                                                 </label>
                                                            </div>
                                                       </div>

                                                       <!--  BOUTON Séléction -->
                                                       <div class="flex flex-col justify-start items-[normal]">
                                                            <div class="select-none min-w-[120px] bg-white p-[12px] border border-[#e2e8ef] outline-none rounded-[8px] relative flex items-center hover:border-[#0566ff] hover:bg-white hover:text-[#080f1a] sm:p-[20px]">
                                                                 <label class="text-[16px] leading-[20px] tracking-[-0.01em] font-medium text-[#080f1a]">
                                                                      <input type="radio" class="absolute w-[1px] h-[1px] m-[-1px] p-0 overflow-hidden clip-[rect(0px,_0px,_0px,_0px)] border-0">
                                                                      <span class="ml-[8px]">Je ne sais pas</span>
                                                                 </label>
                                                            </div>
                                                       </div>

                                                  </div>
                                             </div>
                                        </div>

                                        <!--  SECTION 2 -->
                                        <div class="hhcss_onboardingBox flex flex-col justify-start items-[normal]">
                                             <div class="flex flex-col justify-start items-[normal] mt-0 mb-0">
                                                  <h2 class="mt-0 mb-0 font-medium text-[16px] leading-[20px] tracking-[-0.01em] sm:text-[20px] sm:leading-[26px]">Quelle plateforme héberge votre site Web ?</h2>
                                             </div>
                                             <div class="mt-0 mb-0 mt-[16px] ">

                                                  <!--  SELECTION VIA BOUTTON (Un seul choix possible) -->
                                                  <div class="flex flex-wrap gap-[12px]">

                                                       <!--  BOUTON Séléction -->
                                                       <div class="flex flex-col justify-start items-[normal]">
                                                            <div class="select-none min-w-[120px] bg-white p-[12px] border border-[#e2e8ef] outline-none rounded-[8px] relative flex items-center hover:border-[#0566ff] hover:bg-white hover:text-[#080f1a] sm:p-[20px]">
                                                                 <svgo-panel-onboarding-icon-website class="w-[24px] h-[24px] fill-[#647491]"/>
                                                                 <label class="text-[16px] leading-[20px] tracking-[-0.01em] font-medium text-[#080f1a]">
                                                                      <input type="radio" class="absolute w-[1px] h-[1px] m-[-1px] p-0 overflow-hidden clip-[rect(0px,_0px,_0px,_0px)] border-0">
                                                                      <span class="ml-[8px]">Site web personnalisé</span>
                                                                 </label>
                                                            </div>
                                                       </div>

                                                       <!--  BOUTON Séléction -->
                                                       <div class="flex flex-col justify-start items-[normal]">
                                                            <div class="select-none min-w-[120px] bg-white p-[12px] border border-[#e2e8ef] outline-none rounded-[8px] relative flex items-center hover:border-[#0566ff] hover:bg-white hover:text-[#080f1a] sm:p-[20px]">
                                                                 <svgo-panel-onboarding-icon-presta-shop class="w-[24px] h-[24px] fill-[#647491]"/>
                                                                 <label class="text-[16px] leading-[20px] tracking-[-0.01em] font-medium text-[#080f1a]">
                                                                      <input type="radio" class="absolute w-[1px] h-[1px] m-[-1px] p-0 overflow-hidden clip-[rect(0px,_0px,_0px,_0px)] border-0">
                                                                      <span class="ml-[8px]">PrestaShop</span>
                                                                 </label>
                                                            </div>
                                                       </div>

                                                       <!--  BOUTON Séléction -->
                                                       <div class="flex flex-col justify-start items-[normal]">
                                                            <div class="select-none min-w-[120px] bg-white p-[12px] border border-[#e2e8ef] outline-none rounded-[8px] relative flex items-center hover:border-[#0566ff] hover:bg-white hover:text-[#080f1a] sm:p-[20px]">
                                                                 <svgo-panel-onboarding-icon-woo-commerce class="w-[24px] h-[24px] fill-[#647491]"/>
                                                                 <label class="text-[16px] leading-[20px] tracking-[-0.01em] font-medium text-[#080f1a]">
                                                                      <input type="radio" class="absolute w-[1px] h-[1px] m-[-1px] p-0 overflow-hidden clip-[rect(0px,_0px,_0px,_0px)] border-0">
                                                                      <span class="ml-[8px]">WooCommerce</span>
                                                                 </label>
                                                            </div>
                                                       </div>

                                                       <!--  BOUTON Séléction -->
                                                       <div class="flex flex-col justify-start items-[normal]">
                                                            <div class="select-none min-w-[120px] bg-white p-[12px] border border-[#e2e8ef] outline-none rounded-[8px] relative flex items-center hover:border-[#0566ff] hover:bg-white hover:text-[#080f1a] sm:p-[20px]">
                                                                 <svgo-panel-onboarding-icon-shopify class="w-[24px] h-[24px] fill-[#647491]"/>
                                                                 <label class="text-[16px] leading-[20px] tracking-[-0.01em] font-medium text-[#080f1a]">
                                                                      <input type="radio" class="absolute w-[1px] h-[1px] m-[-1px] p-0 overflow-hidden clip-[rect(0px,_0px,_0px,_0px)] border-0">
                                                                      <span class="ml-[8px]">Shopify</span>
                                                                 </label>
                                                            </div>
                                                       </div>

                                                       <!--  BOUTON Séléction -->
                                                       <div class="flex flex-col justify-start items-[normal]">
                                                            <div class="select-none min-w-[120px] bg-white p-[12px] border border-[#e2e8ef] outline-none rounded-[8px] relative flex items-center hover:border-[#0566ff] hover:bg-white hover:text-[#080f1a] sm:p-[20px]">
                                                                 <svgo-panel-onboarding-icon-wordpress class="w-[24px] h-[24px] fill-[#647491]"/>
                                                                 <label class="text-[16px] leading-[20px] tracking-[-0.01em] font-medium text-[#080f1a]">
                                                                      <input type="radio" class="absolute w-[1px] h-[1px] m-[-1px] p-0 overflow-hidden clip-[rect(0px,_0px,_0px,_0px)] border-0">
                                                                      <span class="ml-[8px]">WordPress</span>
                                                                 </label>
                                                            </div>
                                                       </div>

                                                       <!--  BOUTON Séléction -->
                                                       <div class="flex flex-col justify-start items-[normal]">
                                                            <div class="select-none min-w-[120px] bg-white p-[12px] border border-[#e2e8ef] outline-none rounded-[8px] relative flex items-center hover:border-[#0566ff] hover:bg-white hover:text-[#080f1a] sm:p-[20px]">
                                                                 <label class="text-[16px] leading-[20px] tracking-[-0.01em] font-medium text-[#080f1a]">
                                                                      <input type="radio" class="absolute w-[1px] h-[1px] m-[-1px] p-0 overflow-hidden clip-[rect(0px,_0px,_0px,_0px)] border-0">
                                                                      <span class="ml-[8px]">Autre</span>
                                                                 </label>
                                                            </div>
                                                       </div>

                                                  </div>
                                             </div>
                                        </div>

                                   </div>

                                   <!--  --- PARTIE 4 ---  -->

                                   <div class="flex flex-col gap-[32px] sm:gap-[48px]">

                                        <!--  SECTION 1 -->
                                        <div class="hhcss_onboardingBox flex flex-col justify-start items-[normal]">
                                             <div class="flex flex-col justify-start items-[normal] mt-0 mb-0">
                                                  <h2 class="mt-0 mb-0 font-medium text-[16px] leading-[20px] tracking-[-0.01em] sm:text-[20px] sm:leading-[26px]">J'utilise Hellohumans avant tout pour…</h2>
                                             </div>
                                             <div class="mt-0 mb-0 mt-[16px] ">

                                                  <!--  SELECTION VIA BOX (Un seul choix possible) -->
                                                  <div class="flex flex-col justify-start items-[normal] min-w-full w-full gap-[12px] sm:grid sm:p-0 sm:grid-cols-2 [1366px]:grid-cols-1 [1440px]:grid-cols-2">

                                                       <!--  BOX Séléction -->
                                                       <div class="flex flex-col justify-start items-[normal]">
                                                            <div class="select-none min-w-[120px] bg-white p-[12px] border border-[#e2e8ef] outline-none rounded-[8px] relative flex flex-col flex-nowrap content-center items-start justify-center hover:border-[#0566ff] hover:bg-white hover:text-[#080f1a] sm:p-[20px]">

                                                                 <div class="flex flex-row justify-start items-center">
                                                                      <svgo-panel-onboarding-icon-bot  class="w-[24px] h-[24px] fill-[#647491] min-w-[24px]"/>
                                                                      <p class="mt-0 mb-0 ml-[8px] font-medium text-[16px] leading-[20px] tracking-[-0.01em]">Automatiser mon système d'assistance grâce au AI Agent</p>
                                                                 </div>
                                                                 <span class="block w-[8px] min-w-[8px] h-[8px] min-h-[8px]"></span>
                                                                 <div class="flex flex-row justify-start items-center">
                                                                      <span class="block w-[24px] min-w-[24px] h-[24px] min-h-[24px]"></span>
                                                                      <p class="mt-0 mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[#647491] ml-[8px]">Répondez aux questions des clients et automatisez les tâches répétitives grâce à Hellohumans AI Agent</p>
                                                                 </div>
                                                            </div>
                                                       </div>

                                                       <!--  BOX Séléction -->
                                                       <div class="flex flex-col justify-start items-[normal]">
                                                            <div class="select-none min-w-[120px] bg-white p-[12px] border border-[#e2e8ef] outline-none rounded-[8px] relative flex flex-col flex-nowrap content-center items-start justify-center hover:border-[#0566ff] hover:bg-white hover:text-[#080f1a] sm:p-[20px]">

                                                                 <div class="flex flex-row justify-start items-center">
                                                                      <svgo-panel-onboarding-icon-bot  class="w-[24px] h-[24px] min-w-[24px] fill-[#647491]"/>
                                                                      <p class="mt-0 mb-0 ml-[8px] font-medium text-[16px] leading-[20px] tracking-[-0.01em]">Automatiser mon système d'assistance grâce au AI Agent</p>
                                                                 </div>
                                                                 <span class="block w-[8px] min-w-[8px] h-[8px] min-h-[8px]"></span>
                                                                 <div class="flex flex-row justify-start items-center">
                                                                      <span class="block w-[24px] min-w-[24px] h-[24px] min-h-[24px]"></span>
                                                                      <p class="mt-0 mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[#647491] ml-[8px]">Répondez aux questions des clients et automatisez les tâches répétitives grâce à Hellohumans AI Agent</p>
                                                                 </div>
                                                            </div>
                                                       </div>

                                                  </div>
                                             </div>
                                        </div>

                                   </div>

                              </form>
                         </div>
                    </div>

                    <!--  FOOTER (NavBar) -->
                    <div class="pointer-events-auto sticky bottom-0 w-full bg-white z-[3] text-center shadow-none p-5 pt-6">
                         <div class="absolute top-0 left-0 right-0 h-[6px] bg-[#dce9ff]">
                              <div class="absolute top-0 left-0 w-[4%] bg-[#3886ff] h-[6px] transition-[width] duration-300"></div>
                         </div>
                         <div class="flex flex-row justify-center">

                              <!--  Bouton pour revenir à une partie précédent, dans la partie 1 ce bouton n'est pas affiché -->
                              <div class="mx-[5px] sm:w-[200px]">
                                   <button class="inline-flex items-center justify-center px-[20px] rounded-[8px] text-[18px] h-[46px] leading-[23px] border-transparent bg-transparent text-[#0566ff] font-normal hover:bg-transparent hover:text-[#0566ff] hover:underline">Retour</button>
                              </div>

                              <div class="flex-[0_0_auto] w-auto mx-[5px] ml-auto mr-[20px]">
                                   <!-- Bouton disabled (Le texte pour la dernière page "C'est parti !")-->
                                   <button class="rounded-[8px] text-[18px] h-[46px] leading-[23px] min-w-auto max-w-full w-full px-[20px] bg-[#eff2f6] inline-flex items-center justify-center text-[#acb8cb] cursor-not-allowed">Suivant</button>
                                   <!-- Bouton enabled (Le texte pour la dernière page "C'est parti !")-->
                                   <button class="rounded-[8px] text-[18px] h-[46px] leading-[23px] min-w-auto max-w-full w-full px-[20px] inline-flex items-center justify-center  bg-[#0566ff] border-[#0566ff] text-white hover:bg-[#0049bd] hover:border-[#0049bd] hover:text-white">Suivant</button>

                              </div>
                         </div>
                    </div>

               </div>
          </div>
     </div>
</template>

<script setup lang="ts">
</script>
