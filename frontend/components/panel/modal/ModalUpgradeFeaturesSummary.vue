<template>
     <div class="w-full h-full p-[32px] text-[#080f1a]">
          <h3 class="text-[18px] font-semibold mb-[16px]">
               {{ t('panel.components.upgradeFeaturesSummary.title') }}
          </h3>

          <ul class="flex flex-col gap-[10px]">
               <li
                    v-for="(feature, idx) in features"
                    :key="idx"
                    class="flex items-start gap-[8px] text-[14px] text-[#1a1a1a]"
               >
                   xxx
                    <span v-html="feature"></span>
               </li>
          </ul>

          <div class="mt-[24px] text-[12px] text-[#7f8a9c] italic">
               <blockquote>
                    {{ t('panel.components.upgradeFeaturesSummary.quote') }}<br />
                    <span class="text-[#000] font-medium">— {{ t('panel.components.upgradeFeaturesSummary.author') }}</span>
               </blockquote>
          </div>
     </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

const props = defineProps<{
     features: string[]
}>()
</script>
