<template>
     <div class="flex flex-col h-screen font-[euclidcircularb,sans-serif]">
          <div class="app-container flex items-stretch flex-[1_1_100%] flex-row overflow-hidden relative">
               <PanelNav />

               <div class="app-content-wrapper items-stretch bg-[#f5f7f9] flex flex-1 flex-col justify-start max-w-[calc(100%-65px)] overflow-hidden relative">
                    <PanelHeader :title="pageTitle" :isBilled="pageIsBilled" :isPaid="pageIsPaid" />

                    <div class="app-content">
                         <slot />
                    </div>
               </div>
          </div>
     </div>
</template>

<script setup>
import PanelNav from '@/components/panel/PanelNav.vue'
import PanelHeader from '@/components/panel/PanelHeader.vue'

const pageTitle = useState('pageTitle')
const pageIsBilled = useState('pageIsBilled')
const pageIsPaid = useState('pageIsPaid')

</script>
