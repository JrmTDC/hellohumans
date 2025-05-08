<template>
     <ul class="list-none p-[8px_12px] bg-[#f5f7f9] m-0 min-h-full h-full flex flex-col w-[232px]">
          <li v-for="item in items" class="flex flex-col w-full relative text-[#354869] p-0 text-[14px] leading-[18px] tracking-[-0.01em] font-medium">
               <div class="rounded-[8px] relative">
                    <NuxtLink :to="item.routeURL" :class="['flex items-center w-full p-[9px_12px] rounded-[8px] transition', route.path === item.routeURL? 'bg-[#dce9ff] text-[#001433]': 'bg-transparent text-[#354869] hover:bg-[#64749114] hover:text-[#001433]']">
                         <component :is="item.icon" class="w-[18px] h-[18px] mr-[12px]" />
                         {{ item.name }}
                    </NuxtLink>
               </div>
          </li>
     </ul>
</template>
<script setup lang="ts">
const route = useRoute()
const props = defineProps<{
     items: {
          type: string;
          icon: any;
          routeURL: string;
          name: string;
     }[]
}>()
const { items } = toRefs(props)
</script>
