<template>
     <div class="flex flex-col h-screen font-[euclidcircularb,sans-serif]">
          <div class="app-container flex items-stretch flex-[1_1_100%] flex-row overflow-hidden relative">
               <menuNavPage />

               <div class="app-content-wrapper items-stretch bg-[#f5f7f9] flex flex-1 flex-col justify-start max-w-[calc(100%-65px)] overflow-hidden relative">
                    <headerPage :title="pageTitle" :isBilled="pageIsBilled" :isPaid="pageIsPaid" />

                    <div class="app-content">
                         <slot />
                    </div>
               </div>
          </div>
     </div>
</template>

<script setup lang="ts">
import menuNavPage from '~/components/panel/common/menuNavPage.vue'
import headerPage from '~/components/panel/common/headerPage.vue'

const pageTitle = useState('pageTitle')
const pageIsBilled = useState('pageIsBilled')
const pageIsPaid = useState('pageIsPaid')

</script>
