<template>
     <div
          class="cursor-pointer plan-card h-full min-h-[540px] flex flex-col"
          :class="[fullBorderClass]"
          @click="handleSelectPlan"
     >
          <!-- Haut -->
          <div class="bg-white px-[20px] pt-[30px] pb-[2px] text-center flex flex-col justify-center items-start relative rounded-t-[12px]">
               <div
                    class="absolute -top-[14px] left-[20px] uppercase whitespace-nowrap"
                    v-if="selected"
               >
                    <div
                         class="flex flex-row justify-start items-center px-[8px] py-[4px] rounded-[4px] gap-[4px] bg-[#dce9ff]"
                    >
                         <p class="mt-0 mb-0 font-medium text-[11px] leading-[14px] tracking-[-0.01em] text-[#0049bd]">
                              {{ t('panel.components.upgrade.planCard.inCart') }}
                         </p>
                    </div>
               </div>

               <div
                    class="absolute -top-[14px] left-[20px] uppercase whitespace-nowrap"
                    v-else-if="plan.popular"
               >
                    <div
                         class="flex flex-row justify-start items-center px-[8px] py-[4px] rounded-[4px] gap-[4px] bg-[#ccf1d5]"
                    >
                         <div class="w-[12px] h-[12px] rounded-[6px] bg-[rgb(52,184,87)] flex justify-center items-center">
                              <svgo-panel-icon-selected class="w-[10px] h-[10px] fill-[#fff]" />
                         </div>
                         <p class="mt-0 mb-0 font-medium text-[12px] leading-[16px] tracking-[-0.01em] text-[#0d2d16]">
                              {{ t('panel.components.upgrade.planCard.popular') }}
                         </p>
                    </div>
               </div>

               <div class="flex flex-row justify-start items-center">
                    <h2 class="mt-0 mb-0 font-medium text-[20px] leading-[26px] tracking-[-0.01em]">
                         {{ plan.name }}
                    </h2>
               </div>
          </div>

          <!-- Description -->
          <div class="bg-white px-[20px] pb-[16px] text-center flex flex-col justify-center items-start">
               <p class="mt-0 mb-0 font-normal text-[12px] leading-[16px] tracking-[-0.01em] text-left">
                    {{ plan.description }}
               </p>
          </div>

          <!-- Prix -->
          <div class="bg-white px-[20px] pb-[16px] text-center flex flex-col justify-center items-start">
      <span>
        <span class="h-auto relative text-[40px] leading-[52px] tracking-[-0.02em] text-[#080f1a] font-medium">{{ displayedPrice }}<span>€</span></span>
        <span class="text-[14px] leading-[18px] tracking-[-0.01em] text-[#080f1a] font-medium ml-[4px]">
          {{ billingCycle === 'monthly' ? t('panel.components.upgrade.planCard.perMonth') : t('panel.components.upgrade.planCard.perYear') }}
        </span>
      </span>
          </div>

          <!-- Bouton sélection -->
          <div class="bg-white px-[20px] pb-[16px] text-center flex flex-col justify-center items-start">
               <button
                    v-if="selected"
                    class="block bg-[#eff2f6] border border-transparent text-[#acb8cb] max-w-full w-full rounded-[8px] text-[16px] h-[38px] leading-[20px] px-[16px] py-0"
                    disabled
               >
        <span class="flex flex-row justify-center items-center">
          <svgo-panel-icon-selected class="w-[20px] h-[20px] fill-[#acb8cb] mr-[6px] ml-[-2px]" />
          {{ t('panel.components.upgrade.planCard.selected') }}
        </span>
               </button>
               <button
                    v-else
                    class="block bg-[#dce9ff] border border-[#dce9ff] text-[#0049bd] max-w-full w-full rounded-[8px] text-[16px] h-[38px] leading-[20px] px-[16px] py-0 hover:bg-[#9ac1ff] hover:border-[#9ac1ff] hover:text-[#0049bd] whitespace-nowrap inline-flex justify-center items-center"
               >
                    {{ t('panel.components.upgrade.planCard.selectPlan') }}
               </button>
          </div>

          <!-- Features -->
          <div class="bg-white px-[20px] pb-[16px] text-center flex flex-col justify-center items-start">
               <p class="mt-0 mb-0 font-medium text-[12px] leading-[16px] tracking-[-0.01em] text-left">
                    {{ plan.baseSubtitle }}
               </p>
          </div>
          <div
               v-for="(feature, idx) in plan.includedFeatures"
               :key="idx"
               :class="['bg-white px-[20px] pb-[16px] text-center flex flex-col justify-center items-start', `order-[${6000 + props.index + 1 + idx}]`]"
          >
               <div class="flex flex-row justify-start items-center">
                    <svgo-panel-icon-option-included class="w-[14px] h-[14px] fill-[#080f1a]" />
                    <span class="block w-[8px] min-w-[8px] h-[8px] min-h-[8px]"></span>
                    <p class="mb-0 font-normal text-[12px] leading-[16px] tracking-[-0.01em] text-left">
                         {{ feature }}
                    </p>
               </div>
          </div>

          <!-- Bas -->
          <div class="mt-auto bg-white px-[20px] pb-[18px] text-left rounded-b-[12px]"></div>
     </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface Plan {
     id: string
     name: string
     description: string
     monthlyPrice: number
     discountMonths: number
     popular?: boolean
     includedFeatures: string[]
}

const { t } = useI18n()

const props = defineProps<{
     plan: Plan
     selected: boolean
     billingCycle: 'monthly' | 'annual'
     index: number
}>()

const emit = defineEmits(['selectPlan'])

function handleSelectPlan() {
     emit('selectPlan', props.plan.id)
}

const displayedPrice = computed(() => {
     return props.billingCycle === 'monthly'
          ? props.plan.monthlyPrice
          : props.plan.monthlyPrice * (12 - props.plan.discountMonths)
})

const fullBorderClass = computed(() => {
     return props.selected
          ? 'border-[2px] border-[#0566ff] rounded-[12px]'
          : 'border-[2px] border-[#eff2f6] rounded-[12px]'
})
</script>
