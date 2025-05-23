<template>
     <div class="flex border-b border-[#e2e8ef]">
          <NuxtLink v-for="tab in tabs" :key="tab.to" :to="tab.to"
                    class="relative px-3 pt-4 pb-5 text-[16px] transition-colors"
                    :class="isActive(tab) ? 'text-[#0566ff] border-b-3 border-[#0566ff]'
                                   : 'text-[#080f1a] hover:text-[#0566ff]'">
               {{ tab.label }}
          </NuxtLink>
     </div>
</template>
<script setup lang="ts">
const props = defineProps<{ tabs:{to:string,label:string}[] }>()
const route = useRoute()
const isActive = (t:any)=> route.path.startsWith(t.to)
</script>
