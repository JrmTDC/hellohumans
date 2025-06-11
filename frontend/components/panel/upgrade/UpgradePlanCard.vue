<template>
     <div class="flex flex-col h-full w-full" @click="handleSelectPlan">
          <!-- Haut : Titre, badges -->
          <div data-section="header" class="bg-white px-[20px] pt-[30px] pb-[2px] text-center relative [border-radius:12px_12px_0px_0px] flex flex-col justify-center items-start" :class="[orderClass(1), borderTopClasses]">

               <!-- Ancienne Offre  si current MAIS pas sélectionné -->
               <div
                    class="absolute -top-[14px] left-[20px] uppercase whitespace-nowrap"
                    v-if="isCurrent && !selected"
               >
                    <div class="flex flex-row justify-start items-center px-[8px] py-[4px] rounded-[4px] gap-[4px] bg-[#f0f0f0]">
                         <p class="mt-0 mb-0 font-medium text-[11px] leading-[16px] tracking-[-0.01em] text-[#647491]">
                              Ancienne Offre
                         </p>
                    </div>
               </div>

               <!-- Offre actuelle  si current ET sélectionné -->
               <div
                    class="absolute -top-[14px] left-[20px] uppercase whitespace-nowrap"
                    v-else-if="isCurrent && selected"
               >
                    <div class="flex flex-row justify-start items-center px-[8px] py-[4px] rounded-[4px] gap-[4px] bg-[#dce9ff]">
                         <p class="mt-0 mb-0 font-medium text-[11px] leading-[16px] tracking-[-0.01em] text-[#0049bd]">
                              Offre Actuelle
                         </p>
                    </div>
               </div>

               <!-- Badge 'Dans votre panier' (uniquement si ce n’est pas l’offre actuelle) -->
               <div
                    class="absolute -top-[14px] left-[20px] uppercase whitespace-nowrap"
                    v-else-if="selected">
                    <div class="flex flex-row justify-start items-center px-[8px] py-[4px] rounded-[4px] gap-[4px] bg-[#dce9ff]">
                         <p class="mt-0 mb-0 font-medium text-[11px] leading-[14px] tracking-[-0.01em] text-[#0049bd]">
                              {{ t('panel.components.upgrade.planCard.inCart') }}
                         </p>
                    </div>
               </div>

               <!-- Badge 'Le plus populaire' (uniquement sans abo actif) -->
               <div class="absolute -top-[14px] left-[20px] uppercase whitespace-nowrap"  v-else-if="plan.popular && !hasSubscription">
                    <div class="flex flex-row justify-start items-center px-[8px] py-[4px] rounded-[4px] gap-[4px] bg-[#ccf1d5]">
                         <div class="w-[12px] h-[12px] rounded-[6px] bg-[rgb(52,184,87)] flex justify-center items-center">
                              <svgo-panel-icon-selected class="w-[10px] h-[10px] fill-[#fff]" />
                         </div>
                         <p class="mt-0 mb-0 font-medium text-[12px] leading-[16px] tracking-[-0.01em] text-[#0d2d16]">{{ t('panel.components.upgrade.planCard.popular') }}</p>
                    </div>
               </div>

               <!-- Titre -->
               <div class="flex flex-row justify-start items-center">
                    <h2 class="mt-0 mb-0 font-medium text-[20px] leading-[26px] tracking-[-0.01em]">{{ plan.name }}</h2>

               </div>
          </div>

          <!-- Description -->
          <div data-section="description" :class="[ 'bg-white px-[20px] pb-[16px] text-center flex flex-col justify-start items-start', borderClasses, orderClass(2) ]">
               <p class="mt-0 mb-0 font-normal text-[12px] leading-[16px] tracking-[-0.01em] text-left">{{ plan.description }}</p>
          </div>

          <div data-section="spacer" :class="[ 'bg-white px-[20px] pb-[16px] text-center flex flex-col justify-center items-start', borderClasses, orderClass(3) ]"></div>

          <!-- Prix -->
          <div data-section="price" :class="[ 'bg-white px-[20px] pb-[16px] text-center flex flex-col justify-start items-start px-[20px] pb-[16px] pt-0', borderClasses, orderClass(4) ]">
               <span>
                    <span class="h-auto relative text-[40px] leading-[52px] tracking-[-0.02em] text-[#080f1a] font-medium">{{ displayedPriceMonth }}<span class="text-[40px] leading-[52px] tracking-[-0.02em] font-medium">€</span>
                    </span>
                    <span class="text-[14px] leading-[18px] tracking-[-0.01em] text-[#080f1a] font-medium ml-[4px]">{{ t('panel.components.upgrade.planCard.perMonth') }}</span>
               </span>
               <p v-if="billingCycle === 'year'" class="mt-0 mb-0 font-normal text-[12px] leading-[16px] tracking-[-0.01em] text-[rgb(100,116,145)]">
                    <template v-if="props.plan?.billingYear">
                         Prix facturé : <span class="ml-[2px]">{{ displayedPriceYear }}<span>€</span> <span>{{ t('panel.components.upgrade.planCard.perYear') }}</span></span>
                    </template>
                    <template v-else>
                         Offre que par mois
                    </template>
               </p>
          </div>

          <!-- Bouton (ou étiquette) Sélectionné -->
          <div data-section="button" :class="[ 'bg-white px-[20px] pb-[16px] text-center flex flex-col justify-center items-start', borderClasses, orderClass(5) ]">
               <button v-if="selected" class="block bg-[#eff2f6] border border-transparent text-[#acb8cb] max-w-full w-full rounded-[8px] text-[16px] h-[38px] leading-[20px] px-[16px] py-0" disabled>
                    <span class="flex flex-row justify-center items-center">
                         <div class="flex flex-row justify-start items-center">
                              <svgo-panel-icon-selected class="w-[20px] h-[20px] fill-[#acb8cb] mr-[6px] ml-[-2px]" />
                              {{ t('panel.components.upgrade.planCard.selected') }}
                         </div>
                    </span>
               </button>
               <button v-else class="block bg-[#dce9ff] border border-[#dce9ff] text-[#0049bd] max-w-full w-full rounded-[8px] text-[16px] h-[38px] leading-[20px] px-[16px] py-0 hover:bg-[#9ac1ff] hover:border-[#9ac1ff] hover:text-[#0049bd] whitespace-nowrap inline-flex justify-center items-center outline-none">{{ t('panel.components.upgrade.planCard.selectPlan') }}</button>
          </div>

          <!-- Features -->
          <div data-section="subtitle" :class="['bg-white px-[20px] pb-[16px] text-center flex flex-col justify-start items-start', borderClasses, orderClass(6)]">
               <p class="mt-0 mb-0 font-medium text-[12px] leading-[16px] tracking-[-0.01em] text-left">{{ plan.baseSubtitle }}</p>
          </div>
          <div v-for="(feature, idx) in plan.includedFeatures" :key="idx" :class="[ 'bg-white px-[20px] pb-[16px] text-center flex flex-col justify-start items-start', borderClasses, `order-[${7000 + props.index + 1 + idx}]` ]">
               <div class="flex flex-row justify-start items-center">
                    <svgo-panel-icon-option-included class="w-[14px] h-[14px] min-w-[14px] min-h-[14px] fill-[#080f1a]" />
                    <span class="block w-[8px] min-w-[8px] h-[8px] min-h-[8px]"></span>
                    <p class="mb-0 font-normal text-[12px] leading-[16px] tracking-[-0.01em] text-left">{{ feature }}</p>
               </div>
          </div>

          <!-- ───────── Modules inclus ───────── -->
          <template v-if="plan.includedModules?.length">
               <div
                    data-section="included-modules"
                    :class="['bg-white px-[20px] pb-[16px] flex justify-center items-center', borderClasses, orderClass(7)]"
               >
                    <div class="flex items-center w-full">
                         <div class="flex-1 h-px bg-[#dce9ff]"></div>
                         <span class="mx-[8px] text-[12px] font-medium text-[#000]">Modules inclus</span>
                         <div class="flex-1 h-px bg-[#dce9ff]"></div>
                    </div>
               </div>
               <div
                    v-for="(mod, idx) in plan.includedModules"
                    :key="mod"
                    :class="['bg-white px-[20px] pb-[16px] text-center flex flex-col justify-start items-start',borderClasses,orderClass(7000 + props.index + 1 + plan.includedFeatures.length + idx)]">
                    <div class="flex flex-row justify-start items-center">
                         <svgo-panel-icon-option-included
                              class="w-[14px] h-[14px] min-w-[14px] min-h-[14px] fill-[#080f1a]"/>
                         <span class="block w-[8px] min-w-[8px]"></span>
                         <p class="mb-0 font-normal text-[12px] leading-[16px] tracking-[-0.01em] text-left">
                              {{ mod }}
                         </p>
                    </div>
               </div>
          </template>

          <div class="h-[inherit]" :class="[ 'bg-white px-[20px] pb-[16px] text-center flex flex-col justify-center items-start', borderClasses, orderClass(3) ]"></div>
          <!-- Bas arrondi -->
          <div data-section="footer" class="mt-auto bg-white px-[20px] pb-[18px] text-center flex flex-col justify-center items-start mb-[20px] [border-radius:0px_0px_12px_12px]" :class="[orderClass(8),borderBottomClasses]">
          </div>
     </div>
</template>

<script setup lang="ts">
import {computed} from "vue";

interface Plan {
     id: string
     name: string
     description: string
     price_month: number
     price_year: number
     discountMonths: number
     popular?: boolean
     includedFeatures: string[],
     includedModules?: string[],
     billingYear: boolean
     baseSubtitle: string
}
const { t } = useI18n()
const props = defineProps<{
     plan: Plan
     selected: boolean
     billingCycle: 'month' | 'year'
     index: number
}>()

const emit = defineEmits(['selectPlan'])
const panelStore = usePanelStore()

const isCurrent = computed(() =>
     props.plan.id === panelStore.project?.subscription?.current_plan_id
)

function roundUpToTwoDecimals(num: number): number {
     return Math.ceil(num * 100) / 100;
}

function handleSelectPlan() {
     emit('selectPlan', props.plan.id)
}

// détecte s’il y a déjà un abonnement actif
const hasSubscription = computed(() =>
     Boolean(panelStore.project?.subscription?.current_plan_id)
)

// Calcul du prix
const displayedPriceMonth = computed(() => {
     if (props.billingCycle === 'month') {
          return props.plan.price_month
     } else {
          if(props.plan?.billingYear){
               return roundUpToTwoDecimals(props.plan.price_year / 12)
          }else{
               return props.plan.price_month
          }
     }
})
const displayedPriceYear = computed(() => {
     return props.plan.price_year
})

// Gérer la bordure : verte si c’est l’offre actuelle **ET** sélectionnée, bleu si sélectionnée seulement, gris sinon
const borderClasses = computed(() => {
     if (isCurrent.value && props.selected) return 'border-l-[2px] border-r-[2px] border-[#0566ff]'
     if (props.selected)                         return 'border-l-[2px] border-r-[2px] border-[#0566ff]'
     return 'border-l-[2px] border-r-[2px] border-[#eff2f6]'
})

// Pour le haut arrondi (bordure du haut incluse)
const borderTopClasses = computed(() => {
     if (isCurrent.value && props.selected) return 'border-l-[2px] border-r-[2px] border-t-[2px] border-[#0566ff]'
     if (props.selected)                    return 'border-l-[2px] border-r-[2px] border-t-[2px] border-[#0566ff]'
     return 'border-l-[2px] border-r-[2px] border-t-[2px] border-[#eff2f6]'
})

// Pour le bas arrondi (bordure du bas incluse)
const borderBottomClasses = computed(() => {
     if (isCurrent.value && props.selected) return 'border-l-[2px] border-r-[2px] border-b-[2px] border-[#0566ff]'
     if (props.selected)                    return 'border-l-[2px] border-r-[2px] border-b-[2px] border-[#0566ff]'
     return 'border-l-[2px] border-r-[2px] border-b-[2px] border-[#eff2f6]'
})

function orderClass(block: number) {
     return `order-[${block * 1000 + props.index + 1}]`
}
</script>
