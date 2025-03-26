<template>
     <div
         class="p-[32px] px-[40px] w-[448px] flex flex-col justify-start items-[normal] flex-grow-0 border border-[#e2e8ef] bg-[#f5f7f9] self-stretch flex-shrink-0">
          <div class="flex flex-col justify-start items-[normal] sticky top-[96px]">
               <p class="mt-0 mb-0 font-medium text-[18px] leading-[23px] tracking-[-0.01em]">Résumé de l'abonnement</p>

               <!-- Toggle Mensuel / Annuel -->
               <p class="mt-[20px] mb-0 font-medium text-[12px] leading-[16px] tracking-[-0.01em] text-[#647491]">FACTURÉ</p>
               <div class="flex flex-grow-0 items-center mt-[20px]">
                    <div class="flex flex-row justify-start items-center whitespace-nowrap">
                         <!-- Radio mensuel -->
                         <label class="flex items-center cursor-pointer flex-[1_1_0%] text-[16px] leading-[20px] tracking-[-0.01em] font-normal max-w-full">
                              <input type="radio" value="monthly" v-model="billingCycleLocal" class="absolute w-px h-px m-[-1px] p-0 overflow-hidden clip-[rect(0px,0px,0px,0px)] border-0"/>
                              <!-- Span bleu si c'est mensuel, sinon le cercle gris -->
                              <span v-if="billingCycleLocal === 'monthly'" class="flex-shrink-0 pointer-events-none inline-block rounded-full border-[6px] border-[#0566ff] bg-[#0566ff] shadow-[inset_0_0_0_4px_#fff] w-[20px] h-[20px]"></span>
                              <span v-else class="w-[20px] h-[20px] flex-shrink-0 pointer-events-none inline-block rounded-full border-[2px] border-[#647491] bg-transparent"></span>
                              <span class="ml-[4px]">
                                   <div class="flex flex-row justify-start items-center">
                                        <p class="mt-0 mb-0 font-medium text-[14px] leading-[18px] tracking-[-0.01em]">Mensuel</p>
                                   </div>
                              </span>
                         </label>

                         <!-- Radio annuel -->
                         <label class="flex items-center cursor-pointer flex-[1_1_0%] text-[16px] leading-[20px] tracking-[-0.01em] font-normal max-w-full ml-[32px]">
                              <input type="radio" value="annual" v-model="billingCycleLocal" class="absolute w-px h-px m-[-1px] p-0 overflow-hidden clip-[rect(0px,0px,0px,0px)] border-0"/>
                              <!-- Span bleu si c'est annual, sinon gris -->
                              <span v-if="billingCycleLocal === 'annual'" class="flex-shrink-0 pointer-events-none inline-block rounded-full border-[6px] border-[#0566ff] bg-[#0566ff] shadow-[inset_0_0_0_4px_#fff] w-[20px] h-[20px]"></span>
                              <span v-else class="w-[20px] h-[20px] flex-shrink-0 pointer-events-none inline-block rounded-full border-[2px] border-[#647491] bg-transparent"></span>
                              <span class="ml-[4px]">
                                   <div class="flex flex-row justify-start items-center">
                                        <p class="mt-0 mb-0 font-medium text-[14px] leading-[18px] tracking-[-0.01em]">Une fois par an</p>
                                        <span class="ml-[4px] flex flex-row justify-start items-center bg-[#501cd8] rounded-[4px] px-[4px] py-[3px]">
                                             <p class="mt-0 mb-0 font-medium text-[9px] leading-[11px] tracking-[0em] text-white">2&nbsp;MOIS GRATUITS</p>
                                        </span>
                                   </div>
                              </span>
                         </label>
                    </div>
               </div>
               <div class="bg-[#e2e8ef] h-px w-full mt-[20px]"></div>

               <!-- Détail de l'offre sélectionnée -->
               <div class="flex flex-col justify-start items-[normal] mt-[20px]">
                    <p class="mt-0 mb-0 font-medium text-[12px] leading-[16px] tracking-[-0.01em] text-[#647491]">OFFRE</p>
                    <div class="flex flex-col justify-start items-[normal] mt-[16px]">
                         <!-- Si une offre est sélectionnée, on l’affiche -->
                         <div v-if="selectedOffer">
                              <div class="flex flex-row justify-start items-center">
                                   <h2 class="mt-0 mb-0 font-medium text-[16px] leading-[20px] tracking-[-0.01em]">{{ selectedOffer.name }}</h2>
                                   <div class="flex flex-grow ml-0"></div>
                                   <div class="ml-0 flex flex-col justify-start items-end">
                                        <span>
                                             <span class="h-auto text-[14px] leading-[18px] tracking-[-0.01em] text-[#080f1a] font-medium">{{ offerPrice }}
                                                  <span class="text-[14px] leading-[18px] tracking-[-0.01em] font-medium ml-[2px]">€</span>
                                             </span>
                                             <span class="text-[14px] leading-[18px] tracking-[-0.01em] text-[#080f1a] font-medium">{{ billingCycleLocal === 'monthly' ? '/mois' : '/an' }}</span>
                                        </span>
                                   </div>
                              </div>
                              <p class="mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[#647491] mt-[4px]">
                                   <!-- On affiche la première feature, par exemple -->
                                   {{ firstFeature }}
                              </p>
                         </div>

                         <!-- Sinon, rien de sélectionné -->
                         <div v-else>
                              <p class="text-[14px] leading-[18px] text-[#647491]">
                                   Aucune offre sélectionnée.
                              </p>
                         </div>
                    </div>
               </div>
               <div class="bg-[#e2e8ef] h-px w-full mt-[20px]"></div>

               <!-- Section "Modules" (étape 2) -->
               <div v-if="showModules && selectedModules.length > 0" class="flex flex-col justify-start items-[normal] mt-[20px]">
                    <p class="mt-0 mb-0 font-medium text-[12px] leading-[16px] tracking-[-0.01em] text-[#647491]">
                         MODULES COMPLÉMENTAIRES
                    </p>
                    <!-- Boucle sur selectedModules -->
                    <div v-for="(mod, index) in selectedModules" :key="mod.id" class="flex flex-col justify-start items-[normal] mt-[16px]">
                         <div class="flex flex-row justify-start items-center">
                              <h2 class="mt-0 mb-0 font-medium text-[16px] leading-[20px] tracking-[-0.01em]">
                                   {{ mod.name }}
                              </h2>
                              <div class="flex flex-grow ml-0"></div>
                              <div class="ml-0 flex flex-col justify-start items-end">
                                   <span>
                                        <span class="h-auto text-[14px] leading-[18px] tracking-[-0.01em] text-[#080f1a] font-medium">{{ modulePrice(mod) }}<span class="text-[14px] leading-[18px] font-medium ml-[2px]">€</span>
                                        </span>
                                        <span class="text-[14px] leading-[18px] tracking-[-0.01em] text-[#080f1a] font-medium">{{ billingCycleLocal === 'monthly' ? '/mois' : '/an' }}</span>
                                   </span>
                              </div>
                         </div>
                         <p class="mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[#647491] mt-[4px]">{{ mod.description }}</p>
                    </div>
                    <div class="bg-[#e2e8ef] h-px w-full mt-[20px]"></div>
               </div>

               <!-- Total -->
               <div class="flex flex-col justify-start items-[normal] mt-[20px]">
                    <div class="flex flex-row justify-start items-center mt-0 mb-0">
                         <h2 class="mt-0 mb-0 font-medium text-[20px] leading-[26px] tracking-[-0.01em] flex-grow">Total</h2>
                         <span class="ml-[4px]">
                              <span class="h-auto text-[20px] leading-[26px] tracking-[-0.01em] text-[#080f1a] font-medium">{{ totalPriceLocal }}<span class="text-[20px] leading-[26px] tracking-[-0.01em] text-[#080f1a] font-medium">€</span>
                              </span>
                              <span class="text-[14px] leading-[18px] tracking-[-0.01em] text-[#080f1a] font-medium">{{ billingCycleLocal === 'monthly' ? '/mois' : '/an' }}</span>
                         </span>
                    </div>
               </div>

               <!-- Bouton prochaine étape -->
               <div class="flex flex-col justify-start items-[normal] mt-[20px]">
                    <button :disabled="!selectedOffer || (disableIfZero && totalPriceLocal <= 0)" @click="goNext"
                            :class="[
                                 'whitespace-nowrap rounded-[8px] text-[18px] h-[46px] leading-[23px] min-w-[100px] px-[20px] shadow-none border inline-flex items-center justify-center',
                                 !selectedOffer || (disableIfZero && totalPriceLocal <= 0)
                                 ? 'bg-[#eff2f6] border-transparent text-[#acb8cb] cursor-not-allowed hover:bg-[#eff2f6] hover:border-transparent hover:text-[#acb8cb]'
                                 : 'bg-[#0566ff] border-[#0566ff] text-white hover:bg-[#0049bd] hover:border-[#0049bd] hover:text-white'
                                 ]">
                         <span class="text-ellipsis overflow-hidden">{{ nextButtonLabel }}</span>
                    </button>
                    <p class="text-[14px] leading-[18px] tracking-[-0.01em] text-[#647491] text-center mt-[8px]">Modifier ou annuler votre offre à tout moment</p>
               </div>
          </div>
     </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits, ref, watch } from 'vue'

// Modèles
interface Offer {
     id: string
     name: string
     monthlyPrice: number
     discountMonths: number
     includedFeatures: string[]
}

// Modules AddOn
interface ChoiceOption {
     label: string
     monthlyPrice: number
     discountMonths?: number
}
interface ModuleAddOn {
     id: string
     name: string
     description: string

     basePrice: number
     discountMonths?: number

     multipleChoice?: boolean
     choices?: ChoiceOption[]
     selectedChoiceIndex?: number

     selected: boolean
}

// Props
const props = defineProps<{
     selectedOffer: Offer | null
     billingCycle: 'monthly' | 'annual'
     selectedModules: ModuleAddOn[]  // Modules cochés
     showModules?: boolean
     totalPrice: number
     nextButtonLabel?: string
     disableIfZero?: boolean
}>()

const emit = defineEmits(['updateBillingCycle', 'goNext'])

// Local radio
const billingCycleLocal = ref(props.billingCycle)

// Sync local cycle -> parent
watch(billingCycleLocal, (newVal) => {
     emit('updateBillingCycle', newVal)
})

const selectedModules = computed(() => props.selectedModules || [])
const showModules = computed(() => props.showModules)

// Le total (calculé en parent ou on l’affiche juste)
const totalPriceLocal = computed(() => props.totalPrice)

// Prix de l’offre, tenant compte de annual => (12 - discountMonths)
const offerPrice = computed(() => {
     if (!props.selectedOffer) return 0
     const { monthlyPrice, discountMonths } = props.selectedOffer
     if (billingCycleLocal.value === 'monthly') {
          return monthlyPrice
     } else {
          return monthlyPrice * (12 - discountMonths)
     }
})

// Première feature (exemple)
const firstFeature = computed(() => {
     if (!props.selectedOffer?.includedFeatures.length) return ''
     return props.selectedOffer.includedFeatures[0]
})

// Label du bouton
const nextButtonLabel = computed(() => props.nextButtonLabel || 'Prochaine étape')

/** Calcule le prix d’un module selon le cycle */
function modulePrice(mod: ModuleAddOn): number {
     if (!mod.selected) return 0

     // multi-choix
     if (mod.multipleChoice && mod.choices && mod.selectedChoiceIndex != null) {
          const choice = mod.choices[mod.selectedChoiceIndex]
          const disc = choice.discountMonths ?? 0
          if (billingCycleLocal.value === 'monthly') {
               return choice.monthlyPrice
          } else {
               return choice.monthlyPrice * (12 - disc)
          }
     } else {
          // single
          const disc = mod.discountMonths ?? 0
          if (billingCycleLocal.value === 'monthly') {
               return mod.basePrice
          } else {
               return mod.basePrice * (12 - disc)
          }
     }
}

function goNext() {
     emit('goNext')
}
</script>
