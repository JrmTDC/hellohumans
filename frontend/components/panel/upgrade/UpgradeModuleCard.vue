<template>
     <!-- On enveloppe tout le moduleCard dans un Tooltip si needed -->
     <PanelCommonTooltip
          v-if="module.comingSoon || isIncluded"
          :text="module.comingSoon ? t('panel.components.upgrade.ModuleCard.comingSoon') : t('panel.components.upgrade.ModuleCard.included')"
          placement="top"
          variant="white"
          :arrow="false"
     >
          <div class="flex flex-col justify-start items-[normal] border border-[#e2e8ef] rounded-[12px]" :class="[ index >= 1 ? 'mt-[16px]' : '' ]">
               <!-- Bloc du haut -->
               <div class="flex flex-col justify-start items-[normal] p-[20px]">
                    <div class="flex flex-row justify-start items-center">
                         <div class="flex flex-col mr-auto">
                              <!-- Switch OFF -->
                              <label v-if="!checked" class="relative inline-block align-top rounded-[17px] border border-[#d3dbe5] bg-[#f5f7f9] w-[36px] max-w-[36px] h-[22px]" :class="[ module.comingSoon ? 'opacity-60 cursor-not-allowed' : '', isIncluded ? 'opacity-60 cursor-not-allowed' : '' ]">
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
                                   <div class="absolute left-[calc(100%-1px)] top-[1px] bottom-[1px] w-[18px] rounded-full bg-white transition-[left,transform] duration-200 ease-in-out shadow-[0px_2px_8px_rgba(0,20,51,0.28)] translate-x-[-100%] translate-y-0"
                                   ></div>
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
     </PanelCommonTooltip>

     <!-- Si aucun tooltip n'est nécessaire (pas comingSoon, pas included) -->
     <div v-else class="flex flex-col justify-start items-[normal] border border-[#e2e8ef] rounded-[12px]" :class="[ index >= 1 ? 'mt-[16px]' : '' ]">
          <!-- Même contenu que ci-dessus, sans l’enveloppe Tooltip -->
          <div class="flex flex-col justify-start items-[normal] p-[20px]">
               <div class="flex flex-row justify-start items-center">
                    <div class="flex flex-col mr-auto">
                         <label v-if="!checked" class="relative inline-block align-top rounded-[17px] border border-[#d3dbe5] bg-[#f5f7f9] cursor-pointer w-[36px] h-[22px]">
                              <input
                                   type="checkbox"
                                   role="switch"
                                   class="absolute w-[0px] h-[0px] m-[-1px] p-0 overflow-hidden clip-[rect(0px,0px,0px,0px)] border-0"
                                   :checked="checked"
                                   :disabled="false"
                                   @change="toggle(true)"
                              />
                              <div class="absolute left-[1px] top-[1px] bottom-[1px] w-[18px] rounded-full bg-white transition-[left,transform] duration-200 ease-in-out shadow-[0px_2px_8px_rgba(0,20,51,0.28)]"
                              ></div>
                         </label>

                         <label v-else class="relative inline-block align-top rounded-[17px] border border-[#0566ff] bg-[#0566ff] cursor-pointer w-[36px] h-[22px] shadow-[inset_0px_0px_0px_11px_#0566ff]"
                         >
                              <input
                                   type="checkbox"
                                   role="switch"
                                   class="absolute w-[0px] h-[0px] m-[-1px] p-0 overflow-hidden clip-[rect(0px,0px,0px,0px)] border-0"
                                   :checked="checked"
                                   :disabled="false"
                                   @change="toggle(false)"
                              />
                              <div class="absolute left-[calc(100%-1px)] top-[1px] bottom-[1px] w-[18px] rounded-full bg-white transition-[left,transform] duration-200 ease-in-out shadow-[0px_2px_8px_rgba(0,20,51,0.28)] translate-x-[-100%] translate-y-0"
                              ></div>
                         </label>
                         <span class="block w-[12px] h-[12px]"></span>
                    </div>

                    <div class="flex flex-col self-end">
                         <p v-if="module.multipleChoice && !checked" class="mt-0 mb-0 font-normal text-[11px] leading-[14px] tracking-[-0.01em] text-right text-[#647491]">{{ t('panel.components.upgrade.ModuleCard.startingAt') }}</p>
                         <span class="block w-[2px] h-[2px]"></span>
                    </div>
               </div>

               <div class="flex flex-row justify-start items-center">
                    <div class="flex flex-col justify-start items-[normal] flex-grow">
                         <h2 class="mt-0 mb-0 font-medium text-[18px] leading-[24px] tracking-[-0.01em] text-[#080f1a]">
                              {{ module.name }}
                         </h2>
                         <p class="mt-[8px] mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[#647491]">
                              {{ module.description }}
                         </p>
                    </div>

                    <div class="flex flex-col justify-start items-[normal] whitespace-nowrap h-full ml-[12px]">
                         <div class="flex flex-row justify-start items-center">
                              <span>
                                   <span class="h-auto relative text-[24px] leading-[31px] tracking-[-0.01em] text-[#080f1a] font-medium">{{ displayedPrice }}<span class="text-[24px] leading-[31px] font-medium">€</span>
                                   </span>
                                   <span class="text-[12px] leading-[16px] tracking-[-0.01em] text-[#080f1a] font-medium">{{ billingCycle === 'month' ?  t('panel.components.upgrade.ModuleCard.perMonth') : t('panel.components.upgrade.ModuleCard.perYear') }}</span>
                              </span>
                         </div>
                    </div>
               </div>
          </div>

          <div v-if="module.multipleChoice && checked" class="flex flex-col justify-start items-[normal] px-[24px] pb-[24px] pt-0">
               <div class="flex flex-row justify-start items-center">
                    <p class="mt-0 mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[#080f1a]">{{ t('panel.components.upgrade.ModuleCard.selectLabel') }}</p>
                    <div class="shadow-[0px_1px_3px_0px_rgba(136,148,171,0.56)] bg-white rounded-[4px] w-[18px] h-[18px] ml-[8px] cursor-pointer flex items-center justify-center">
                         <svgo-panel-icon-helper class="w-[14px] h-[14px] fill-[#647491]" />
                    </div>
               </div>
               <span class="block w-[12px] h-[12px]"></span>

               <div class="flex flex-col">
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
import type { upgradeModule } from '~/stores/upgradeStore'

const { t } = useI18n()

const props = defineProps<{
     module: upgradeModule
     billingCycle: 'month' | 'year'
     onToggle: (moduleId: string, checked: boolean) => void
     onChangeChoice: (moduleId: string, choiceIndex: number) => void
     index: number
     includedModules: string[]
}>()


// Le module est coché => si selected ou si inclus
const checked = computed(() => {
     if (props.includedModules.includes(props.module.id)) {
          return true
     }
     return props.module.selected
})

// Le module est "inclus" => input disabled, pas togglable
const isIncluded = computed(() => props.includedModules.includes(props.module.id))

function toggle(checkedVal: boolean) {
     // Si c'est inclus ou comingSoon => do nothing
     if (isIncluded.value || props.module.comingSoon) return
     props.onToggle(props.module.id, checkedVal)
}

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
</script>
