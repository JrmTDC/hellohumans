<template>
          <ul class="list-none p-[8px_12px] bg-[#f5f7f9] m-0 min-h-full h-full flex flex-col w-[232px]">
               <template v-if="groups && groups.length">
                    <template v-for="group in groups" :key="group.id">
                         <li class="pt-[24px] px-[12px] pb-[8px] text-[#080f1a] text-[12px] leading-[16px] tracking-[-0.01em] font-medium uppercase flex justify-between items-center">{{ group.name }}</li>

                         <li v-for="item in groupedItems[group.id] || []" :key="item.routeURL" class="flex flex-col w-full relative text-[#354869] p-0 text-[14px] leading-[18px] tracking-[-0.01em]">
                              <NuxtLink :to="item.routeURL" class="flex items-center w-full p-[9px_12px] rounded-[8px] transition" :class="route.path === item.routeURL ? 'bg-[#dce9ff] text-[#001433] font-medium' : 'bg-transparent text-[#354869] hover:bg-[#64749114] hover:text-[#001433] font-normal'">
                                   <component :is="item.icon" class="w-[16px] h-[16px] fill-[#001433] mr-[8px]" />
                                   {{ item.name }}
                              </NuxtLink>
                         </li>
                    </template>
               </template>

               <template v-else>
                    <li v-for="item in items" :key="item.routeURL" class="flex flex-col w-full relative text-[#354869] p-0 text-[14px] leading-[18px] tracking-[-0.01em]">
                         <NuxtLink :to="item.routeURL" class="flex items-center w-full p-[9px_12px] rounded-[8px] transition" :class="route.path === item.routeURL ? 'bg-[#dce9ff] text-[#001433] font-medium' : 'bg-transparent text-[#354869] hover:bg-[#64749114] hover:text-[#001433] font-normal'">
                              <component :is="item.icon" class="w-[16px] h-[16px] fill-[#001433] mr-[8px]" />
                              {{ item.name }}
                         </NuxtLink>
                    </li>
               </template>
          </ul>
</template>
<script setup lang="ts">

interface SidebarItem {
     group?: string
     icon: any
     routeURL: string
     name: string
}

interface SidebarGroup {
     id: string
     name: string
}

const props = defineProps<{
     items: SidebarItem[]
     groups?: SidebarGroup[] | null
}>()

const { items, groups } = toRefs(props)
const route = useRoute()

const groupedItems = computed<Record<string, SidebarItem[]>>(() => {
     const map: Record<string, SidebarItem[]> = {}
     if (groups.value) {
          for (const g of groups.value) {
               map[g.id] = items.value.filter(i => i.group === g.id)
          }
     }
     return map
})
</script>
