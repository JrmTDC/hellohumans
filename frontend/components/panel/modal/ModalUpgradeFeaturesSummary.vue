<template>
     <div class="mb-4">
          <h3 class="text-xm font-semibold mb-2">{{ t('panel.components.modal.upgradeFeaturesSummary.title') }}</h3>
          <div class="space-y-2 mb-4 text-foreground-light mt-4 ">
               <ul class="flex flex-col gap-[10px]">
                    <li v-for="(feature, idx) in features" :key="idx" class="flex items-start gap-[8px] text-[14px] text-[#1a1a1a]"><svgo-panel-icon-checked class="fill-[#0566ff] w-[12px] h-[12px]" /><span v-html="feature"></span>
                    </li>
               </ul>
          </div>
     </div>
     <div class="border-t pt-6 justify-end">
          <blockquote class="text-sm text-foreground-light text-[12px] text-[#7f8a9c] italic">
               {{ t('panel.components.modal.upgradeFeaturesSummary.quote') }}<br />
               <span class="text-[#0566ff]">— @{{ t('panel.components.modal.upgradeFeaturesSummary.author') }}</span>
          </blockquote>
     </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

const props = defineProps<{
     features: string[]
}>()
</script>
