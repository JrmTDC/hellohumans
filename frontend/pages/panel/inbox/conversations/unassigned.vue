<template>
     <div class="grid grid-cols-[232px_1fr] grid-rows-1 gap-0 h-full max-h-full overflow-hidden">
          <div class="relative overflow-hidden bg-[#f5f7f9] z-[1]">
               <PanelInboxChildSideMenu />
          </div>
          <div class="flex w-full">


               <div class="w-[320px] min-w-[320px] bg-white border border-r-0 border-[rgb(226,232,239)] rounded-l-[16px] text-[rgb(8,15,26)] flex flex-col h-[calc(100%-12px)] relative mb-[12px]">

                    <div class="p-[20px_24px] flex-[0_0_58px] flex relative flex-col">
                         <div class="w-full flex flex-row justify-start items-center">
                              <h2 class="mt-0 mb-0 mr-auto font-medium text-[20px] leading-[26px] tracking-[-0.01em] overflow-hidden text-ellipsis whitespace-nowrap flex flex-row items-center content-center flex-nowrap"><span><SvgoPanelInboxIconUnassigned class="w-[20px] h-[20px] fill-[#001433] min-h-[20px] min-w-[20px] mr-[6px]"/> </span> Non attribués</h2>
                         </div>
                    </div>

                    <PanelInboxConversationItem
                         :items="conversationsUnassigned"
                         emptyMessage="Vous n’avez pas de conversations non attribuées pour le moment."
                         :background="backgroundConversationEmpty"
                    />


               </div>
               <div class="w-full h-[calc(100%-12px)] overflow-hidden bg-white border border-[rgb(226,232,239)] m-[0_12px_12px_0] rounded-r-[16px] flex relative">
                    <div class="flex-[3_1_0%] px-[12px] pr-[12px] pl-[60px] py-[60px] max-w-[812px]">

                         <div v-if="conversationsUnassigned" class="flex flex-col h-full relative">
                              <div></div>
                              <div></div>
                              <div></div>
                              <div></div>
                              <div></div>
                         </div>

                         <PanelInboxEmpty v-if="!conversationsUnassigned && !conversations"
                              title="Aucune conversation non attribuée"
                              description="Accédez au dossier Ouverts pour travailler sur les conversations qui vous sont attribuées."
                              button="Accéder aux Ouverts"
                              :onClick="() => navigateTo('/panel/inbox/operator')"
                         />

                         <PanelInboxEmpty v-if="!conversationsUnassigned && conversations"
                              title="Aucune conversation active"
                              description="Avant de commencer une vraie conversation avec vos visiteurs, simulez-en une pour voir le fonctionnement !."
                              button="Simuler une conversation"
                              :onClick="() => simulateVisitor()"
                         />
                    </div>
               </div>
          </div>
     </div>
</template>
<script setup lang="ts">
const { t } = useI18n()
const layoutLoadingPanel = useState('layoutLoadingPanel')
const backgroundConversationEmpty = useBase64Asset('panel/inbox/conversations/empty')
const inboxStore = useInboxStore()
const panelStore = usePanelStore()
const conversations = ref([])
const conversationsUnassigned = [
     {
          id: 'V-gdDFSD582dv',
          timeAgo: '10 min',
          lastMessage: 'Bonjour',
          agent: 'Jeremy',
          link: '/panel/inbox/conversation/1'
     }
]

onMounted(async () => {
     //await inboxStore.fetchData()
     layoutLoadingPanel.value = false
})

function simulateVisitor() {
     const url = '/panel/simulateVisitor?projectPublicKey=' + panelStore.project?.public_key
     const features = 'width=800,height=680,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes'
     window.open(url, '_blank', features)
}

definePageMeta({
     layout: 'panel'
})
</script>
