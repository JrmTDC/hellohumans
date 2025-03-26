<template>
     <div class="fixed inset-0 bg-[rgba(8,15,26,0.8)] z-[131] flex items-center justify-center p-[30px]" >
          <div class="opacity-100 translate-y-0 m-auto transition ease-out duration-300 outline-none">
               <div class="w-[min(100vw-32px,500px)] h-auto">
                    <div class="flex flex-col bg-white relative rounded-[8px] p-0 items-stretch min-h-full">
                         <form action="">
                              <header class="text-left px-[32px] pt-[32px] pb-[24px]">
                                   <h2 class="mt-0 mb-0 font-semibold text-[20px] leading-[26px] tracking-[-0.01em]">Payer à l’aide d’une carte</h2>
                              </header>
                              <button class="outline-none absolute bg-white rounded-full border-[3px] border-white shadow-[0px_8px_20px_rgba(0,20,51,0.24)] cursor-pointer flex items-center justify-center p-0 z-[10] w-[36px] h-[36px] top-[-12px] right-[-12px]" @click="$emit('close')">
                                   <svgo-panel-icon-cross class="w-[22px] h-[22px] fill-[#647491]" />
                              </button>
                              <div class="flex-1 px-[32px] pb-[32px]">
                                   <label class="h-[40px] relative text-[#647491] block mt-[30px] mb-[30px] font-normal max-w-full">
                                        <StripeCardInput v-model="cardDetails" />
                                   </label>
                                   <div class="flex flex-col items-stretch">
                                        <div class="mr-0 flex flex-row items-stretch self-center">
                                             <div>
                                                  <div class="text-[16px] leading-[31px] mr-[5px]">Total&nbsp;:</div>
                                             </div>
                                             <div>
                                                  <span>
                                                       <span class="h-auto relative text-[32px] leading-[41px] tracking-[-0.01em] text-[#080f1a] font-semibold"
                                                       >{{ total }}<span class="text-[32px] leading-[41px] tracking-[-0.01em] text-[#080f1a] font-semibold">€</span>
                                                       </span>
                                                       <span class="text-[15px] text-[#080f1a] font-semibold ml-[4px]">{{ billingCycleLocal === 'monthly' ? '/mois' : '/an' }}</span>
                                                  </span>
                                             </div>
                                        </div>
                                        <button class="bg-[#0566ff] border border-[#0566ff] text-white mt-[24px] inline-flex shadow-none max-w-full min-w-auto w-full rounded-[8px] text-[18px] h-[46px] leading-[23px] items-center justify-center px-[20px] hover:bg-[#0049bd] hover:border-[#0049bd] hover:text-white"><span>Soumettre la commande</span></button>
                                        <button class="w-auto bg-white text-[#647491] text-[14px] mt-[10px] h-[26px] flex items-center justify-center border-none rounded-[4px] outline-none cursor-pointer">Retour</button>
                                   </div>
                              </div>
                         </form>

                    </div>
               </div>
          </div>
     </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue'

// Ex. un composant / plugin Stripe
// import StripeCardInput from '@/components/stripe/StripeCardInput.vue'

const props = defineProps<{
     total: number
     billingCycle: 'monthly' | 'annual'
}>()

const cardDetails = ref({})

const billingCycleLocal = ref(props.billingCycle)

function submitPayment() {
     // On émet l'event "submit" avec les infos carte
     // Le parent va gérer la requête Stripe
     // ou on peut faire l'appel direct ici
     // ex:
     //   try {
     //     const result = await callStripeIntent(cardDetails.value)
     //     ...
     //   }
     //   catch(e) ...
     //   $emit('close')
     $emit('submit', cardDetails.value)
}
</script>
