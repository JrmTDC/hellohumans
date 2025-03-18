<template>
     <div id="hellohumans-panel-iframe" class="bg-white flex-1 p-[4px_8px] absolute h-full w-full">
          <div v-if="!chatStore.isLoaded" class="text-center py-6 m-auto   ">Chargement...</div>
          <template v-else>
               <div class="flex flex-row justify-start items-start h-full">
                    <div class="flex flex-col justify-start items-stretch w-full p-[20px] ">
                         <div class="relative p-[13px_20px_13px_44px] mb-0 rounded-[8px] bg-[rgb(255,221,167)] text-[rgb(58,35,0)] mb-[20px]">
                              <div class="absolute top-[10px] left-[12px] flex items-center justify-center w-[24px] h-[24px]"
                              >
                                   <svgoIconWarling class="w-[24px] h-[24px] fill-[#d48200]"/>
                              </div>
                              Le widget de chat n'est pas installé sur le site du client. Les visiteurs ne peuvent pas voir les modifications pour le moment.
                         </div>

                         <div class="flex flex-col justify-start items-stretch mb-[20px]" >
                              <h2 class="mt-0 mb-0 font-medium text-[24px] leading-[34px] tracking-[-0.01em]">Apparence</h2>
                              <p class="mt-0 mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[rgb(100,116,145)] max-w-[750px]">Personnalisez votre widget de chat HelloHuman pour attirer l'attention des visiteurs de votre site Web ou pour adapter l'apparence du widget à votre marque.</p>
                         </div>

                         <!-- SECTION GÉNÉRAL -->
                         <ExpandableSection title="Général" :isBilled="false">
                              <div class="flex flex-col justify-start items-start gap-3">
                                   <label class="block">Couleur d'arrière-plan :</label>
                                   <ColorPicker type="themes" v-model="chatStore.config.backgroundColor" />
                              </div>
                              <div class="flex flex-col justify-start items-start gap-3">
                                   <label class="block">Couleur de l'action :</label>
                                   <ColorPicker type="colors" v-model="chatStore.config.actionColor" />
                              </div>
                         </ExpandableSection>

                         <!-- SECTION CONTENU -->
                         <ExpandableSection title="Contenu" :isBilled="false">
                              <label class="block mb-2">Questions suggérées :</label>
                         </ExpandableSection>

                         <!-- SECTION VISIBILITÉ & POSITION -->
                         <ExpandableSection title="Visibilité et position" :isBilled="false">
                              <label class="block mb-2">Afficher le chat ?</label>
                              <input type="checkbox" v-model="chatStore.showChat" />
                              <textarea v-model="chatStore.suggestedQuestionsString" class="border px-3 py-2 rounded w-full"></textarea>
                         </ExpandableSection>

                         <!-- SECTION PACK NATURE -->
                         <ExpandableSection title="Pack Nature" :isBilled="true" :isPaid="true">
                              <label class="block mb-2">Activer le Pack Nature ? </label>
                              <input type="checkbox" v-model="chatStore.config.has_nature_pack" />
                         </ExpandableSection>

                         <!-- SECTION AVANCÉ -->
                         <ExpandableSection title="Avancé" :isBilled="false">
                              <label class="block mb-2">Clé API Client :</label>
                              <input v-model="chatStore.config.apiKey" type="text" class="border px-3 py-2 rounded w-full" />
                         </ExpandableSection>

                    </div>
                    <div class="self-stretch w-[430px] min-w-[430px]">
                         <div class="h-full sticky top-0 min-h-[628px] bg-[linear-gradient(rgb(255,255,255)_0%,rgba(255,255,255,0)_500px),url(data:image/gif;base64,R0lGODlhEAAQAJEAAAAAAP////X19f///yH5BAEAAAMALAAAAAAQABAAAAIflG+hq4jM3IFLJhqswNly/XkcBpIiVaInlLJr9FZWAQA7)] bg-repeat w-full">
                              <Chat :clientConfig="clientConfig" />
                         </div>
                    </div>
               </div>
          </template>
     </div>
</template>

<script setup lang="ts">
import Chat from '@/components/chat/Chat.vue'
import ExpandableSection from '@/components/Panel/ExpandableSection.vue'
import ColorPicker from '@/components/Panel/ColorPicker.vue'

const chatStore = useChatStore()
const clientConfig = computed(() => chatStore.config)
onMounted(() => {
     chatStore.fetchConfig()
})

</script>
