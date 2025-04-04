<template>
     <div class="p-[32px] px-[40px] w-[448px] flex flex-col justify-start items-[normal] flex-grow-0 border border-[#e2e8ef] bg-[#f5f7f9] self-stretch flex-shrink-0">
          <div class="flex flex-col justify-start items-[normal] sticky top-[96px]">
               <p class="text-[18px] font-medium mb-0">Résumé de l'abonnement</p>

               <!-- Choix de cycle -->
               <p class="text-[12px] text-[#647491] mt-[20px] mb-0 font-medium">FACTURÉ</p>
               <div class="flex items-center mt-[20px]">
                    <label class="flex items-center cursor-pointer">
                         <input type="radio" value="monthly" v-model="billingCycleLocal" class="hidden" />
                         <span v-if="billingCycleLocal === 'monthly'" class="w-[20px] h-[20px] rounded-full bg-[#0566ff] border-[6px] border-[#0566ff] shadow-[inset_0_0_0_4px_#fff]"></span>
                         <span v-else class="w-[20px] h-[20px] rounded-full border-[2px] border-[#647491]"></span>
                         <span class="ml-[8px]">Mensuel</span>
                    </label>

                    <label class="flex items-center cursor-pointer ml-[32px]">
                         <input type="radio" value="annual" v-model="billingCycleLocal" class="hidden" />
                         <span v-if="billingCycleLocal === 'annual'" class="w-[20px] h-[20px] rounded-full bg-[#0566ff] border-[6px] border-[#0566ff] shadow-[inset_0_0_0_4px_#fff]"></span>
                         <span v-else class="w-[20px] h-[20px] rounded-full border-[2px] border-[#647491]"></span>
                         <span class="ml-[8px]">Une fois par an</span>
                         <span class="ml-[8px] text-[9px] bg-[#501cd8] text-white px-[4px] py-[2px] rounded">2 MOIS GRATUITS</span>
                    </label>
               </div>

               <div class="bg-[#e2e8ef] h-px w-full mt-[20px]"></div>

               <!-- Offre sélectionnée -->
               <div class="mt-[20px]">
                    <p class="text-[12px] text-[#647491] font-medium mb-[16px]">OFFRE</p>
                    <div v-if="selectedPlan">
                         <div class="flex justify-between items-center">
                              <h2 class="text-[16px] font-medium">{{ selectedPlan.name }}</h2>
                              <div>
                                   <span class="text-[14px] font-medium">{{ planPrice }} €</span>
                                   <span class="text-[14px] text-[#080f1a] font-medium">{{ billingCycleLocal === 'monthly' ? '/mois' : '/an' }}</span>
                              </div>
                         </div>
                         <p class="text-[14px] text-[#647491] mt-[4px]">{{ firstFeature }}</p>
                    </div>
                    <div v-else>
                         <p class="text-[14px] text-[#647491]">Aucune offre sélectionnée.</p>
                    </div>
               </div>

               <div class="bg-[#e2e8ef] h-px w-full mt-[20px]"></div>

               <!-- Modules sélectionnés / inclus -->
               <div v-if="showModules && selectedModules.length > 0" class="mt-[20px]">
                    <p class="text-[12px] font-medium text-[#647491]">MODULES COMPLÉMENTAIRES</p>
                    <div
                         v-for="mod in selectedModules"
                         :key="mod.id"
                         class="mt-[16px] flex flex-col"
                    >
                         <div class="flex justify-between items-center">
                              <h2 class="text-[16px] font-medium">{{ mod.name }}</h2>
                              <div>
                                   <span v-if="selectedPlan?.includedModules?.includes(mod.id)" class="text-[14px] font-medium text-green-600">Inclus</span>
                                   <span v-else>
                <span class="text-[14px] font-medium">{{ modulePrice(mod) }} €</span>
                <span class="text-[14px] font-medium">{{ billingCycleLocal === 'monthly' ? '/mois' : '/an' }}</span>
              </span>
                              </div>
                         </div>
                         <p class="text-[14px] text-[#647491] mt-[4px]">{{ mod.description }}</p>
                    </div>
                    <div class="bg-[#e2e8ef] h-px w-full mt-[20px]"></div>
               </div>

               <!-- Total -->
               <div class="mt-[20px] flex justify-between items-center">
                    <h2 class="text-[20px] font-medium">Total</h2>
                    <div>
                         <span class="text-[20px] font-medium">{{ totalPriceLocal }} €</span>
                         <span class="text-[14px] font-medium">{{ billingCycleLocal === 'monthly' ? '/mois' : '/an' }}</span>
                    </div>
               </div>

               <!-- Bouton final -->
               <div class="mt-[20px]">
                    <button
                         :disabled="!selectedPlan || (disableIfZero && totalPriceLocal <= 0)"
                         @click="goNext"
                         :class="[
            'rounded-[8px] text-[18px] h-[46px] px-[20px] w-full text-white font-medium',
            (!selectedPlan || (disableIfZero && totalPriceLocal <= 0))
              ? 'bg-[#eff2f6] text-[#acb8cb] cursor-not-allowed'
              : 'bg-[#0566ff] hover:bg-[#0049bd]'
          ]"
                    >
                         {{ nextButtonLabel }}
                    </button>
                    <p class="text-[14px] text-[#647491] text-center mt-[8px]">Modifier ou annuler votre offre à tout moment</p>
               </div>
          </div>
     </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'

interface Plan {
     id: string
     name: string
     monthlyPrice: number
     discountMonths: number
     includedFeatures: string[]
}

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
     selectedPlan: Plan | null
     billingCycle: 'monthly' | 'annual'
     selectedModules: ModuleAddOn[]
     showModules?: boolean
     totalPrice: number
     nextButtonLabel?: string
     disableIfZero?: boolean
}>()

const emit = defineEmits(['updateBillingCycle', 'goNext'])

const billingCycleLocal = ref(props.billingCycle)
watch(billingCycleLocal, (newVal) => {
     emit('updateBillingCycle', newVal)
})

const showModules = computed(() => props.showModules)
const totalPriceLocal = computed(() => props.totalPrice)
const nextButtonLabel = computed(() => props.nextButtonLabel || 'Prochaine étape')

const planPrice = computed(() => {
     if (!props.selectedPlan) return 0
     const { monthlyPrice, discountMonths } = props.selectedPlan
     return billingCycleLocal.value === 'monthly'
          ? monthlyPrice
          : monthlyPrice * (12 - discountMonths)
})

const firstFeature = computed(() => {
     if (!props.selectedPlan?.includedFeatures.length) return ''
     return props.selectedPlan.includedFeatures[0]
})

function modulePrice(mod: ModuleAddOn): number {
     const isIncluded = props.selectedPlan?.includedModules?.includes(mod.id)
     if (isIncluded) return 0

     if (mod.multipleChoice && mod.choices && mod.selectedChoiceIndex != null) {
          const choice = mod.choices[mod.selectedChoiceIndex]
          const disc = choice.discountMonths ?? 0
          return billingCycleLocal.value === 'monthly'
               ? choice.monthlyPrice
               : choice.monthlyPrice * (12 - disc)
     } else {
          const disc = mod.discountMonths ?? 0
          return billingCycleLocal.value === 'monthly'
               ? mod.basePrice
               : mod.basePrice * (12 - disc)
     }
}

function goNext() {
     emit('goNext')
}
</script>
