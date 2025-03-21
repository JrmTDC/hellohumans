<template>
     <div>
          <div class="dashboard-content flex-1 overflow-x-hidden overflow-y-auto relative">
               <div class="grid grid-cols-1 grid-rows-1 h-full max-h-full overflow-hidden ml-[24px]">
                    <div class="min-h-full h-full pr-[12px]">
                         <div class="border border-[rgb(226,232,239)] bg-white rounded-[16px] min-h-[calc(100%-12px)] flex-[1_1_0%] p-0 flex">

                              <div class="grid grid-cols-[1fr_340px] grid-rows-1 flex-[1_1_0%]">
                                   <div class="flex flex-col justify-start items-start p-[24px_20px_24px_28px] min-w-0">
d
                                   </div>
                                   <div class="flex flex-col justify-start items-start border-l border-[rgb(226,232,239)] p-[24px_28px_24px_20px]">
                                        <div class="flex flex-col justify-start items-start mt-0 mb-0 w-full">
                                             <h2 class="mt-0 mb-0 font-medium text-[18px] leading-[24px] tracking-[-0.01em]">Utilisation actuelle</h2>
                                             <div class="border border-[rgb(226,232,239)] rounded-[12px] mt-[16px] w-full">
                                                  <div class="flex flex-col justify-start items-start p-[20px] w-full">
                                                       <div class="flex flex-row justify-start items-center">
                                                            <h2 class="mt-0 mb-0 font-medium text-[16px] leading-[20px] tracking-[-0.01em]">Audience</h2>
                                                       </div>
                                                       <div class="flex flex-row justify-start items-center mt-[16px]">
                                                            <div></div>
                                                            <div class="flex flex-row justify-start items-center ml-[8px]">
                                                                 <h2 class="mt-0 mb-0 font-medium text-[28px] leading-[33px] tracking-[-0.01em] text-[#acb8cb]">0</h2>
                                                                 <h2 class="mt-0 mb-0 font-medium text-[28px] leading-[33px] tracking-[-0.01em] text-[#acb8cb]">&nbsp;/&nbsp;</h2>
                                                                 <h2 class="mt-0 mb-0 font-medium text-[28px] leading-[33px] tracking-[-0.01em] text-[#acb8cb]">52</h2>
                                                                 <h2 class="mt-0 mb-0 font-normal text-[32px] tracking-[-0.01em] text-[#acb8cb] leading-[18px]">∞</h2>
                                                            </div>
                                                       </div>

                                                  </div>
                                             </div>
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
