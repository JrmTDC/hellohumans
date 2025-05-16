<template>
     <div class="relative flex-col justify-start items-[normal] rounded-[12px] border-2" :class="[ borderClasses, index >= 1 ? 'mt-[25px]' : '' ]">

          <span v-if="isIncluded" class="uppercase whitespace-nowrap absolute top-[-12px] right-[30px] px-[8px] py-[4px] text-[11px] leading-[16px] tracking-[-0.01em] font-medium rounded-[4px] bg-[#dce9ff] text-[#0049bd]">Inclus dans votre offre</span>

          <span v-else-if="module.comingSoon" class="uppercase whitespace-nowrap absolute top-[-12px] right-[30px] px-[8px] py-[4px] text-[11px] leading-[16px] tracking-[-0.01em] font-medium rounded-[4px] bg-[#f0f0f0] text-[#647491]">Bientôt disponible</span>

          <span v-else-if="isCurrentModule" class="uppercase whitespace-nowrap absolute top-[-12px] right-[30px] px-[8px] py-[4px] text-[11px] leading-[16px] tracking-[-0.01em] font-medium rounded-[4px]" :class="checked ? 'bg-[#dce9ff] text-[#0049bd]' : 'bg-[#ff073d] text-[#fff]'">{{ checked ? 'Module actuel' : 'Module supprimé' }}</span>

          <span v-else-if="checked" class="uppercase whitespace-nowrap absolute top-[-12px] right-[30px] px-[8px] py-[4px] text-[11px] leading-[16px] tracking-[-0.01em] font-medium rounded-[4px] bg-[#dce9ff] text-[#0049bd]">Ajouté à votre panier</span>

          <!-- Bloc du haut -->
          <div class="flex flex-col justify-start items-[normal] p-[20px]">
               <div class="flex flex-row justify-start items-center">
                    <div class="flex flex-col mr-auto">
                         <!-- Switch OFF -->
                         <label v-if="!checked" class="relative inline-block align-top rounded-[17px] border border-[#d3dbe5] bg-[#f5f7f9] w-[36px] max-w-[36px] h-[22px]" :class="[ module.comingSoon ? 'opacity-60 cursor-not-allowed' : '', isIncluded ? 'opacity-60 cursor-not-allowed' : '', isCurrentModule ? 'bg-[#ff073d]' : '' ]">
                              <input
                                   type="checkbox"
                                   role="switch"
                                   class="absolute w-[0px] h-[0px] m-[-1px] p-0 overflow-hidden clip-[rect(0px,0px,0px,0px)] border-0"
                                   :checked="checked"
                                   :disabled="isIncluded || module.comingSoon"
                                   @change="toggle(true)"
                              />
                              <div class="absolute left-[1px] top-[1px] bottom-[1px] w-[18px] rounded-full bg-white transition-[left,transform] duration-200 ease-in-out shadow-[0px_2px_8px_rgba(0,20,51,0.28)]"></div>
                         </label>

                         <!-- Switch ON -->
                         <label v-else class="relative inline-block align-top rounded-[17px] border border-[#0566ff] bg-[#0566ff] w-[36px] max-w-[36px] h-[22px] shadow-[inset_0px_0px_0px_11px_#0566ff]" :class="[ module.comingSoon ? 'opacity-60 cursor-not-allowed' : '', isIncluded ? 'opacity-60 cursor-not-allowed' : '' ]">
                              <input
                                   type="checkbox"
                                   role="switch"
                                   class="absolute w-[0px] h-[0px] m-[-1px] p-0 overflow-hidden clip-[rect(0px,0px,0px,0px)] border-0"
                                   :checked="checked"
                                   :disabled="isIncluded || module.comingSoon"
                                   @change="toggle(false)"
                              />
                              <div class="absolute left-[calc(100%-1px)] top-[1px] bottom-[1px] w-[18px] rounded-full bg-white transition-[left,transform] duration-200 ease-in-out shadow-[0px_2px_8px_rgba(0,20,51,0.28)] translate-x-[-100%] translate-y-0"></div>
                         </label>
                         <span class="block w-[12px] h-[12px]"></span>
                    </div>

                    <div class="flex flex-col self-end">
                         <!-- "À partir de" si c'est un module multipleChoice NON coché -->
                         <p v-if="module.multipleChoice && !checked" class="mt-0 mb-0 font-normal text-[11px] leading-[14px] tracking-[-0.01em] text-right text-[#647491]" :class="[ module.comingSoon ? 'text-[#acb8cb]' : '', isIncluded ? 'text-[#acb8cb]' : '' ]">{{ t('panel.components.upgrade.ModuleCard.startingAt') }}</p>
                         <span class="block w-[2px] h-[2px]"></span>
                    </div>
               </div>


               <div class="flex flex-row justify-start items-center">
                    <div class="flex flex-col justify-start items-[normal] flex-grow">
                         <h2 class="mt-0 mb-0 font-medium text-[18px] leading-[24px] tracking-[-0.01em] text-[#080f1a]" :class="[ module.comingSoon ? 'text-[#acb8cb]' : '', isIncluded ? 'text-[#acb8cb]' : '' ]">{{ module.name }}</h2>
                         <p class="mt-[8px] mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[#647491]" :class="[ module.comingSoon ? 'text-[#acb8cb]' : '', isIncluded ? 'text-[#acb8cb]' : '' ]">{{ module.description }}</p>
                    </div>

                    <!-- Prix affiché -->
                    <div class="flex flex-col justify-start items-[normal] whitespace-nowrap h-full ml-[12px]">
                         <div class="flex flex-row justify-start items-center">
                              <span>
                                   <span class="h-auto relative text-[24px] leading-[31px] tracking-[-0.01em] text-[#080f1a] font-medium" :class="[ module.comingSoon ? 'text-[#acb8cb]' : '', isIncluded ? 'text-[#acb8cb]' : '' ]">{{ displayedPrice }}<span class="text-[24px] leading-[31px] tracking-[-0.01em] font-medium">€</span></span>
                                   <span class="text-[12px] leading-[16px] tracking-[-0.01em] text-[#080f1a] font-medium" :class="[ module.comingSoon ? 'text-[#acb8cb]' : '', isIncluded ? 'text-[#acb8cb]' : '' ]">{{ billingCycle === 'month' ? t('panel.components.upgrade.ModuleCard.perMonth') : t('panel.components.upgrade.ModuleCard.perYear') }}</span>
                              </span>
                         </div>
                         <button v-if="module.displayMore" class="flex flex-row justify-start items-center bg-transparent text-[#0566ff] no-underline text-[13px] leading-[18px] min-w-[64px] py-0 hover:underline hover:text-[#0047b7]">En s'avoir plus
                         </button>

                    </div>
               </div>
          </div>

          <!-- Si multi-choix ET module coché, on affiche le menu déroulant -->
          <div v-if="module.multipleChoice && checked" class="flex flex-col justify-start items-[normal] px-[24px] pb-[24px] pt-0">
               <div class="flex flex-row justify-start items-center">
                    <p class="mt-0 mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[#080f1a]">
                         {{ t('panel.components.upgrade.ModuleCard.selectLabel') }}
                    </p>
                    <!-- info-bulle d'exemple -->
                    <div class="shadow-[0px_1px_3px_0px_rgba(136,148,171,0.56)] bg-white rounded-[4px] w-[18px] h-[18px] ml-[8px] cursor-pointer flex items-center justify-center">
                         <svgo-panel-icon-helper class="w-[14px] h-[14px] fill-[#647491]" />
                    </div>
               </div>
               <span class="block w-[12px] h-[12px]"></span>

               <div class="flex flex-col justify-start items-[normal]">
                    <div class="mb-0 text-left relative w-full">
                         <select class="block w-full h-[34px] text-[14px] leading-[18px] border border-[#d3dbe5] rounded-[6px] px-[8px]" @change="onChoiceChange($event)">
                              <option
                                   v-for="(choice, idx) in module.choices"
                                   :key="idx"
                                   :value="idx"
                                   :selected="idx === module.selectedChoiceIndex"
                              >
                                   {{ choice.label }} ({{ choice.monthlyPrice }} {{ t('panel.components.upgrade.ModuleCard.perMonth') }})
                              </option>
                         </select>
                    </div>
               </div>
          </div>
     </div>
</template>
<script setup lang="ts">

const upgradeStore = useUpgradeStore()
const panelStore  = usePanelStore()

const { t } = useI18n()

onMounted(() => {
     props.module.selected = subscriptionState.value
})

const props = defineProps<{
     module: any
     billingCycle: 'month' | 'year'
     onToggle: (moduleId: string, checked: boolean) => void
     onChangeChoice: (moduleId: string, choiceIndex: number) => void
     index: number
     includedModules: string[]
}>()

const currentModules = computed(() => panelStore.project?.subscription?.current_modules || [])

const overrideChecked = ref<boolean | null>(null)


// Obtenir l'état de l'abonnement
const subscriptionState = computed(() => {
     // Vérifier si l'abonnement existe
     if (!panelStore.project?.subscription?.current_modules) return false
     
     // Vérifier si le module est dans l'abonnement
     return panelStore.project.subscription.current_modules.includes(props.module.id)
})

const checked = computed(() => {
     // Si le module est inclus dans le plan (toujours coché)
     if (props.includedModules.includes(props.module.key)) {
          return true
     }

     // Utiliser l'état persistant si disponible
     return props.module.selected
})

// Le module est "inclus" => input disabled, pas togglable
const isIncluded = computed(() => {
     // Seul les modules inclus dans le plan sont désactivés
     return props.includedModules.includes(props.module.key)
})

function toggle(checkedVal: boolean) {
     // Si le module est inclus dans le plan => ne peut pas être désélectionné
     if (props.includedModules.includes(props.module.key)) {
          if (!checkedVal) return // empêche la désélection
          props.onToggle(props.module.id, true)
          return
     }
     // Si le module est comingSoon => do nothing
     if (props.module.comingSoon) return
     
     // Pour les autres modules (abonnement ou sélection manuelle)
     props.onToggle(props.module.id, checkedVal)
}

      // Le “checked” réel est soit notre override, soit la sélection manuelle
           const checked = computed(() =>
             overrideChecked.value !== null
               ? overrideChecked.value
                    : props.module.selected
                )

      function toggle(checkedVal: boolean) {
             if (props.module.comingSoon) return
             // on met à jour notre override pour garder l’état après refresh
                  overrideChecked.value = checkedVal
                  // on notifie le store pour sauvegarde
                  props.onToggle(props.module.id, checkedVal)
                }

const isCurrentModule = computed(() =>
     !!panelStore.project?.subscription?.current_modules.includes(props.module.id)
)

function onChoiceChange(e: Event) {
     const idx = Number((e.target as HTMLSelectElement).value)
     props.onChangeChoice(props.module.id, idx)
}

// Calcul du prix à afficher dans la carte
// S'il est comingSoon ou included, on affiche quand même le "faux" prix (pour info) ?
const displayedPrice = computed(() => {
     // non coché
     if (!checked.value) {
          if (props.module.multipleChoice && props.module.choices) {
               const minChoice = props.module.choices.reduce((prev, curr) =>
                    curr.monthlyPrice < prev.monthlyPrice ? curr : prev
               )
               const disc = minChoice.discountMonths ?? 0
               if (props.billingCycle === 'month') {
                    return minChoice.monthlyPrice
               } else {
                    return minChoice.monthlyPrice * (12 - disc)
               }
          }
          // single
          const disc = props.module.discountMonths ?? 0
          if (props.billingCycle === 'month') {
               return props.module.basePrice
          } else {
               return props.module.basePrice * (12 - disc)
          }
     } else {
          // coché
          if (props.module.multipleChoice && props.module.choices) {
               const idx = props.module.selectedChoiceIndex || 0
               const choice = props.module.choices[idx]
               const disc = choice.discountMonths ?? 0
               if (props.billingCycle === 'month') {
                    return choice.monthlyPrice
               } else {
                    return choice.monthlyPrice * (12 - disc)
               }
          }
          // single
          const disc = props.module.discountMonths ?? 0
          if (props.billingCycle === 'month') {
               return props.module.basePrice
          } else {
               return props.module.basePrice * (12 - disc)
          }
     }
})
// en haut du <script setup>
const borderClasses = computed(() => {
     if (isCurrentModule.value) {
          return checked.value ? 'border-[#0566ff]' : 'border-[#ff073d]'
     } else {
          return checked.value ? 'border-[#0566ff]' : 'border-[#e2e8ef]'
     }
})
</script>
