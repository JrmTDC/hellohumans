<template>
     <div pageTitle="Tableau de bord">
          <div class="dashboard-content flex-1 overflow-x-hidden overflow-y-auto relative">
               <div class="grid grid-cols-1 grid-rows-1 h-full max-h-full overflow-hidden ml-[24px]">
                    <div class="min-h-full h-full pr-[12px]">
                         <div class="border border-[rgb(226,232,239)] bg-white rounded-[16px] min-h-[calc(100%-12px)] flex-[1_1_0%] p-0 flex">
                              <h2>Bienvenue dans le Tableau de bord</h2>
                              <p>Ici, vous pouvez visualiser les statistiques et gérer vos configurations.</p>

                              <!-- EXEMPLE D'AFFICHAGE DE STATISTIQUES -->
                              <div class="dashboard-stats">
                                   <div class="stat-card">
                                        <h3>Visiteurs atteints</h3>
                                        <p>0 / ∞</p>
                                   </div>
                                   <div class="stat-card">
                                        <h3>Conversations traitées</h3>
                                        <p>0 / 5000</p>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     </div>
</template>

<script setup>
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
})
</script>
