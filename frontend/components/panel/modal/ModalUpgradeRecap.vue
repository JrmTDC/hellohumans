<template>
     <div class="h-full">
          <h3 class="text-xl font-semibold mb-3">Récapitulatif</h3>
          <div class="flex flex-col justify-between h-[calc(100%_-_28px)]">
               <div class="mb-4 ">
                    <div class="text-[12px] text-[#647491] font-medium uppercase">{{ t('panel.components.modal.upgradeRecap.titleOffer') }}</div>
                    <!-- PLAN -->
                    <div class="flex justify-between items-center py-1 text-sm">
                         <div class="flex items-center gap-2">
                              <svgo-panel-icon-checked v-if="changes.plan.current.price_now >= 0" class="w-[16px] h-[16px] fill-[#0566ff]" />
                              <svgo-panel-icon-remove v-else class="w-[16px] h-[16px] fill-[#e14b4b] " />
                              <span>Plan <span v-if="planLabel" class="ml-2 text-sm px-2 py-1 rounded inline-flex items-center rounded-full bg-opacity-70 border px-2.5 py-0.5 text-xs ml-1" :class="labelColor.identical">{{ planLabel }}</span></span>
                         </div>
                         <div class="text-right">
                              <span class="block">{{ money(changes.plan.current.price_now) }} €</span>
                              <small class="text-[#647491]">{{ money(changes.plan.current.price_cycle) }} € {{ upgradeStore.billingCycle === 'year' ? t('panel.components.modal.upgradeRecap.perYear') : t('panel.components.modal.upgradeRecap.perMonth') }}</small>
                         </div>
                    </div>
                    <div v-if="changes.modules && ((changes.modules.current?.length || 0) > 0 || (changes.modules.added?.length || 0) > 0 || (changes.modules.removed?.length || 0) > 0)" class="mt-2">
                         <div class="text-[12px] text-[#647491] font-medium uppercase">{{ t('panel.components.modal.upgradeRecap.titleModule') }}</div>
                    <!-- MODULES AJOUTÉS -->
                    <div v-if="changes.modules.added.length" class="mb-2">
                         <div v-for="(m, index) in changes.modules.added" :key="m.id" :class="index < changes.modules.added.length - 1 ? 'border-b border-b-[#d3dbe5] border-dashed' : ''"
                              class="flex justify-between items-center py-1 text-sm">
                              <div class="flex items-center gap-2">
                                   <svgo-panel-icon-add class="w-[16px] h-[16px] fill-[#0566ff]" />
                                   <span>{{ m.name }}</span>
                              </div>
                              <div class="text-right">
                                   <span class="block">{{ money(m.price_now) }} €</span>
                                   <small class="text-[#647491]">{{ money(m.price_cycle) }} € {{ upgradeStore.billingCycle === 'year' ? t('panel.components.modal.upgradeRecap.perYear') : t('panel.components.modal.upgradeRecap.perMonth') }}</small>
                              </div>
                         </div>
                    </div>

                    <!-- MODULES RETIRÉS  (crédits) -->
                    <div  class="mb-2">
                         <div v-for="(m, index) in changes.modules.removed" :key="m.id"
                              :class="index < changes.modules.removed.length - 1 ? 'border-b border-b-[#d3dbe5] border-dashed' : ''" class="flex justify-between items-center py-1 text-sm">
                              <div class="flex items-center gap-2">
                                   <!-- <svgo-panel-icon-remove class="w-[14px] h-[14px] fill-[#e14b4b]" /> -->
                                   <span>{{ m.name }}</span>
                              </div>
                              <div class="text-right text-[#e14b4b]">
                                   <span class="block">{{ money(m.price_now) }} €</span>
                                   <small class="text-[#647491]">crédit immédiat</small>
                              </div>
                         </div>
                    </div>

                    </div>
               </div>
               <div class="border-t pt-6 justify-end">
                    <blockquote class="text-sm text-foreground-light text-[12px] text-[#7f8a9c] italic">
                         {{ t('panel.components.modal.upgradeFeaturesSummary.quote') }}<br />
                         <span class="text-[#0566ff]">— @{{ t('panel.components.modal.upgradeFeaturesSummary.author') }}</span>
                    </blockquote>
               </div>
          </div>
     </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const upgradeStore = useUpgradeStore()
const panelStore = usePanelStore()
const props = defineProps<{
     changes: any          // ← simplifié, tape au besoin
     totalNow: number
     totalCycle: number
}>()

const planLabel = computed(() => {
     if (!panelStore.project?.subscription) return 'Nouveau'
     if (upgradeStore.isSameAsCurrent) return 'Identique'
     return 'Mise à jour'
})

const labelColor = {
     'new': 'bg-[#e5ffd8] text-[#6ce14b] border-[#d3ffc1]',
     'update': 'bg-[#ffecdc] text-[#d9955d] border-[#f7d4b7]',
     'delete': 'bg-[#ffd8d8] text-[#e14b4b] border-[#ffc1c1]',
     'identical': 'bg-[#d8e5ff] text-[#4b6de1] border-[#c1d2ff]',
}
function money(n: number) {
     return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>
