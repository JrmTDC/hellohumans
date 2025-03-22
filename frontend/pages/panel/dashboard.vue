<template>
     <div>
          <div class="dashboard-content flex-1 overflow-x-hidden overflow-y-auto relative">
               <div class="grid grid-cols-1 grid-rows-1 h-full max-h-full overflow-hidden ml-[24px]">
                    <div class="min-h-full h-full pr-[12px]">
                         <div class="border border-[rgb(226,232,239)] bg-white rounded-[16px] min-h-[calc(100%-12px)] flex-[1_1_0%] p-0 flex">

                              <div class="grid grid-cols-[1fr_340px] grid-rows-1 flex-[1_1_0%]">
                                   <div class="flex flex-col justify-start items-start p-[24px_20px_24px_28px] min-w-0">
                                        <div class="flex flex-row justify-start items-center border border-[rgb(226,232,239)] rounded-[12px] bg-[rgb(245,247,249)] p-[20px] mt-0 mb-0">
                                             <div class="w-[48px] h-[48px] relative">
                                                  <ProgressCircle
                                                       :percentage="16"
                                                       progressColor="#34b857"
                                                       bgColor="#ccf1d5"
                                                       center-content="number"
                                                       number-content="1/6"
                                                       :sizeCircle=48
                                                       :sizeFont=13
                                                  />
                                             </div>
                                             <div class="flex flex-col justify-start items-start mr-auto ml-[12px]">
                                                  <h2 class="mt-0 mb-0 font-medium text-[18px] leading-[24px] tracking-[-0.01em]">Finalisez votre configuration de HelloHumans</h2>
                                                  <p class="mt-[4px] mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[#647491]">Nous allons vous aider à créer un environnement qui ravira vos visiteurs. C'est très facile et cela ne prend que quelques minutes.</p>
                                             </div>
                                             <button class="rounded-[8px] text-[14px] h-[34px] leading-[18px] px-[14px] shadow-none ml-[12px] min-w-fit bg-[#dce9ff] border-[#dce9ff] text-[#0049bd] hover:bg-[#9ac1ff] hover:border-[#9ac1ff] hover:text-[#0049bd]">
                                                  <span>Terminer l'intégration</span>
                                             </button>
                                        </div>
                                   </div>
                                   <div class="flex flex-col justify-start items-start border-l border-[rgb(226,232,239)] p-[24px_28px_24px_20px]">

                                        <div class="flex flex-col justify-start items-start mt-0 mb-0 w-full">
                                             <h2 class="mt-0 mb-0 font-medium text-[18px] leading-[24px] tracking-[-0.01em]">Utilisation actuelle</h2>
                                             <UsageItemDashbord
                                                  v-for="(item, index) in usages"
                                                  :key="index"
                                                  :item="item"
                                                  :class="index > 0 ? 'mt-[16px]' : ''"
                                             />
                                        </div>

                                   </div>
                              </div>

                         </div>
                    </div>
               </div>
          </div>
     </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import UsageItemDashbord from "~/components/panel/UsageItemDashbord.vue";
import ProgressCircle from '@/components/panel/ProgressCircle.vue'

const usages = [
     {
          title: 'Audience',
          description: 'Nombre total de visiteurs ayant interagi avec votre chatbot.',
          titleUsage: 'Visiteurs atteints',
          usage: 320,
          limit: '∞',
          percentage: 100,
          progressColor: '#22c55e',
          bgColor: '#e5e7eb',
          centerContent: 'infinity',
          numberContent: '0',
          autoColor: true
     },
     {
          title: 'Interactions',
          description: 'Conversations automatisées gérées par le bot.',
          titleUsage: 'Conversations traitées',
          usage: 4600,
          limit: 5000,
          percentage: 82,
          progressColor: '#f59e0b',
          bgColor: '#e5e7eb',
          centerContent: 'none',
          numberContent: '0',
          autoColor: true
     }
]

definePageMeta({
     layout: 'panel'
})

const router = useRouter()

onMounted(() => {
     const token = localStorage.getItem('token')
     if (!token) {
          router.push('/panel/login')
     }
     const pageTitle = useState('pageTitle')
     pageTitle.value = 'Tableau de bord'
})

</script>
