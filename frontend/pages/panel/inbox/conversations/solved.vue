<template>
     <div class="grid grid-cols-[232px_1fr] grid-rows-1 gap-0 h-full max-h-full overflow-hidden">
          <div class="relative overflow-hidden bg-[#f5f7f9] z-[1]">
               <PanelInboxChildSideMenu />
          </div>
          <div class="flex w-full">
               <div class="w-[320px] min-w-[320px] bg-white border border-r-0 border-[rgb(226,232,239)] rounded-l-[16px] text-[rgb(8,15,26)] flex flex-col h-[calc(100%-12px)] relative mb-[12px]">
                    <div class="p-[20px_24px] flex-[0_0_58px] flex relative flex-col">
                         <div class="w-full flex flex-row justify-start items-center">
                              <h2 class="mt-0 mb-0 mr-auto font-medium text-[20px] leading-[26px] tracking-[-0.01em] overflow-hidden text-ellipsis whitespace-nowrap flex flex-row items-center content-center flex-nowrap"><span><SvgoPanelInboxIconSolved class="w-[20px] h-[20px] fill-[#001433] min-h-[20px] min-w-[20px] mr-[6px]"/> </span>Résolus</h2>
                         </div>
                    </div>
                    <div class="bg-no-repeat bg-[position:20px_16px] min-h-[264px] block text-[rgb(100,116,145)] text-center px-[20px] py-[240px] mt-[10px] relative text-[14px] leading-[1.28571429] tracking-[-0.01em]" :style="backgroundConversationEmpty ? { backgroundImage: `url('${backgroundConversationEmpty}')` } : {}">
                         Vous n’avez aucune conversation résolue pour le moment.
                    </div>
                    <div class="flex items-center justify-center absolute top-[20px] left-[-12px] w-[24px] h-[24px] z-[8] cursor-pointer rotate-0 transition-transform duration-300 ease-in-out rounded-[12px] border border-[rgb(226,232,239)] bg-white hover:border-[rgb(220,233,255)] hover:bg-[rgb(220,233,255)] group">
                         <SvgoPanelInboxIconArrowLeft class="w-[16px] h-[16px] fill-[#8796af] min-h-[16px] min-w-[16px] group-hover:fill-[#0566ff]" />
                    </div>
               </div>
               <div class="w-full h-[calc(100%-12px)] overflow-hidden bg-white border border-[rgb(226,232,239)] m-[0_12px_12px_0] rounded-r-[16px] flex relative">
                    <div class="flex-[3_1_0%] px-[12px] pr-[12px] pl-[60px] py-[60px] max-w-[812px]">

                         <div v-if="!inboxStore.conversations" class="text-[18px] leading-[23px] tracking-[-0.01em] min-w-[550px] max-w-[550px]">
                              <h4 class="mt-0 mb-0 font-medium text-[32px] leading-[41px] tracking-[-0.01em]">Aucune conversation active</h4>
                              <span class="block w-[32px] min-w-[32px] h-[32px] min-h-[32px]"></span>
                              <p>Avant de commencer une vraie conversation avec vos visiteurs, simulez-en une pour voir le fonctionnement !</p>
                              <span class="block w-[40px] min-w-[40px] h-[40px] min-h-[40px]"></span>
                              <button @click="simulateVisitor" class="inline-flex items-center justify-center align-middle select-none whitespace-nowrap text-center cursor-pointer bg-[#0566ff] border border-[#0566ff] text-white rounded-[8px] text-[16px] font-normal h-[38px] min-w-[80px] px-[16px] py-0 hover:bg-[#0049bd] hover:border-[#0049bd] hover:text-white">Simuler une conversation</button>
                         </div>
                         <div v-if="inboxStore.conversations && inboxStore.conversations.length > 0" class="text-[18px] leading-[23px] tracking-[-0.01em] min-w-[550px] max-w-[550px]">
                              <h4 class="mt-0 mb-0 font-medium text-[32px] leading-[41px] tracking-[-0.01em]">Aucune conversation non attribuée</h4>
                              <span class="block w-[32px] min-w-[32px] h-[32px] min-h-[32px]"></span>
                              <p>Accédez au dossier Ouverts pour travailler sur les conversations qui vous sont attribuées.</p>
                              <span class="block w-[40px] min-w-[40px] h-[40px] min-h-[40px]"></span>
                              <button class="inline-flex items-center justify-center align-middle select-none whitespace-nowrap text-center cursor-pointer bg-[#0566ff] border border-[#0566ff] text-white rounded-[8px] text-[16px] font-normal h-[38px] min-w-[80px] px-[16px] py-0 hover:bg-[#0049bd] hover:border-[#0049bd] hover:text-white">Accéder aux Ouverts</button>
                         </div>
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

onMounted(async () => {
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
