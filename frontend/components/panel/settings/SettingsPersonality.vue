<template>
     <div class="ml-[-20px] mr-[-20px] pt-[12px] mt-[20px]">
          <!-- Section Identité -->
          <section class="mr-[20px] ml-[20px]">
               <div>
                    <h3 class="flex items-center mt-0 mb-0 pb-0 text-[18px] leading-[23px] tracking-[-0.01em] w-auto max-w-[750px] font-medium">Identité</h3>
                    <p class="mb-0 mt-[8px] font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[#647491]">Modifiez le nom de votre Agent IA et ajoutez la description de votre entreprise.</p>
               </div>
               <div class="pt-[20px] pb-[20px]">
                    <div class="flex flex-col justify-start items-[normal] max-w-[750px] pt-0">
                         <!-- Champ Nom de l'Agent IA -->
                         <div class="flex flex-row justify-start items-start">
                              <div class="w-full">
                                   <PanelCommonInputField v-model="chatBotName" label="Nom de l'Agent IA" :placeholder="config.public.chatBotName" helper-text="Agent IA utilise ce nom lorsqu'il répond à des questions sur son identité" disabled/>
                              </div>
                         </div>
                         <hr class="w-full border-t border-t-[rgb(239,242,246)] mt-[20px] mb-0">
                         <!-- Champ Description de l'entreprise -->
                         <div class="mt-[20px] flex flex-row justify-start items-start">
                              <div class="w-full">
                                   <PanelCommonTextareaField v-model="companyDescription" label="Description de l'entreprise" helper-text="Décrivez votre entreprise pour que l'Agent IA puisse adapter les réponses à vos clients" placeholder="Entrez la description de votre entreprise..." :rows="4" :show-character-count="true" :max-length="500"/>
                              </div>
                         </div>
                    </div>
               </div>
          </section>
          <!-- Section Personnalisation des réponses -->
          <section class="mr-[20px] ml-[20px] border-t border-t-[rgb(226,232,239)] mt-[12px]">
               <div class="pt-[32px]">
                    <h3 class="flex items-center mt-0 mb-0 pb-0 text-[18px] leading-[23px] tracking-[-0.01em] w-auto max-w-[750px] font-medium">Personnalisation des réponses</h3>
                    <p class="mb-0 mt-[8px] font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[#647491]">Personnalisez le style des réponses</p>
               </div>
               <div class="pt-[20px] pb-[20px]">
                    <div class="flex flex-col justify-start items-[normal] max-w-[750px] pt-0 pb-[32px]">
                         <!-- Sélecteur de style de communication -->

                         <PanelCommonCustomSelect v-model="selectedStyle" :options="communicationStyles" option-key="value" option-label="label" placeholder="Sélectionnez un style de communication" dropdown-class="min-w-[581px] max-w-[256px]" @change="handleStyleChange" label="Style de communication">
                              <template #option="{ option }">
                                   <div class="flex flex-col">
                                        <span class="text-[14px] leading-[18px]">{{ option.label }}</span>
                                        <span v-if="option.description" class="text-[12px] text-[rgb(100,116,145)] mt-1">{{ option.description }}</span>
                                   </div>
                              </template>
                         </PanelCommonCustomSelect>

                         <hr class="w-full border-t border-t-[rgb(239,242,246)] mt-[20px] mb-0">
                         <!-- Toggle Liens "En savoir plus" -->
                         <div class="mt-[20px] flex flex-row justify-start items-start">
                              <label for="" class="flex-[1_0_145px] min-w-[145px] max-w-[min(180px,12vw)] inline-block font-normal">
                                   <div class="flex flex-col justify-start items-[normal]">
                                        <p class="font-normal text-[14px] leading-[18px] tracking-[-0.01em]">Liens « En savoir plus »</p>
                                        <p class="mt-[4px] font-normal text-[12px] leading-[16px] tracking-[-0.01em] text-[rgb(100,116,145)]">L'Agent IA ajoute des liens « En savoir plus » vers des sources externes dans ses réponses, lorsque ces sources sont disponibles.</p>
                                   </div>
                              </label>
                              <div class="flex-[1_1_0%] flex flex-row justify-start items-center">
                                   <div class="relative flex flex-row items-center ml-[24px]">
                                        <PanelCommonToggleSwitch v-model="showLearnMoreLinks" />
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
          </section>
     </div>
</template>
<script setup lang="ts">
const config = useRuntimeConfig()

// Données du formulaire
const chatBotName = ref(config.public.chatBotName)
const companyDescription = ref('')
const showLearnMoreLinks = ref(true)

// Gestion du style de communication
const selectedStyle = ref('neutral')
const communicationStyles = [
     {
          value: 'neutral',
          label: `Neutre - Style ${config.public.chatBotName} équilibré et normal`,
          description: 'Exemple de réponse : « Nous appliquons une politique de remboursement de 30 jours. À condition que l\'article soit dans son état d\'origine, vous pouvez le retourner dans les 30 jours suivant l\'achat. Si vous avez besoin de plus de détails, n\'hésitez pas à nous demander ou à consulter notre page dédiée ! »'
     },
     {
          value: 'friendly',
          label: 'Amical - Idéal pour des rapports humains et une attitude positive',
          description: 'Exemple de réponse : « Vous avez changé d\'avis ? Pas de problème ! Vous pouvez retourner vos articles dans les 30 jours, à condition qu\'ils soient dans leur état d\'origine. Consultez nos conditions générales pour plus de détails ou posez-nous vos questions ! »'
     },
     {
          value: 'formal',
          label: 'Formel - Idéal pour les contextes officiels et professionnels',
          description: 'Exemple de réponse : « Notre politique de remboursement autorise les retours dans les 30 jours suivant l\'achat, à condition que l\'article soit dans son état d\'origine. Pour plus d\'informations, veuillez consulter notre documentation officielle sur la politique de remboursement ou contacter notre service client. »'
     }
]

const handleStyleChange = (option) => {
     selectedStyle.value = option.value
}
</script>
