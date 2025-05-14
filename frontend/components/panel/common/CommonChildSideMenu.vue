<template>
     <ul class="list-none p-[8px_12px] bg-[#f5f7f9] m-0 min-h-full h-full flex flex-col w-[232px]">
          <template v-if="groups && groups.length">
               <template v-for="group in groups" :key="group.id">
                    <li v-if="hasVisibleItemsInGroup(group.id)" class="pt-[24px] px-[12px] pb-[8px] text-[#080f1a] text-[12px] leading-[16px] tracking-[-0.01em] font-medium uppercase flex justify-between items-center">
                         {{ group.name }}
                    </li>
                    <template v-for="item in groupedItems[group.id] || []" :key="item.routeURL">
                         <li v-if="!item.disabled" class="flex flex-col w-full relative text-[#354869] p-0 text-[14px] leading-[18px] tracking-[-0.01em]">
                              <template v-if="item.type === 'submenu'">
                                   <div @click="toggleItem(item.id)" class="flex items-center w-full p-[9px_12px] rounded-[8px] transition cursor-pointer" :class="openItems.has(item.id) ? '' : 'bg-transparent text-[#354869] hover:bg-[#64749114] hover:text-[#001433] font-normal'">
                                        <component :is="item.icon" class="w-[16px] h-[16px] min-h-[16px] min-w-[16px] fill-[#001433] mr-[8px]" />
                                        <span class="block w-[2px] min-w-[2px] h-[2px] min-h-[2px] ml-0"></span>
                                        {{ item.name }}
                                        <SvgoPanelCommonIconArrowMenu class="w-[16px] h-[16px] min-h-[16px] min-w-[16px] fill-[#001433] ml-auto" :class="{ 'rotate-90': openItems.has(item.id) }"/>
                                   </div>
                                   <div v-if="openItems.has(item.id)" class="pl-[24px]">
                                        <ul class="list-none p-0 m-0">
                                             <li v-for="sub in groupedSubs[item.id] || []" :key="sub.routeURL" class="flex items-center">
                                                  <NuxtLink :to="sub.routeURL" class="flex items-center w-full px-[12px] py-[9px] rounded-[6px] transition" :class="route.path === sub.routeURL ? 'bg-[#dce9ff] text-[#001433] font-medium' : 'bg-transparent text-[#354869] hover:bg-[#64749114] hover:text-[#001433] font-normal'">
                                                       <component :is="sub.icon" class="w-[16px] h-[16px] fill-[#001433] mr-[6px] min-h-[16px] min-w-[16px]" />
                                                       {{ sub.name }}
                                                  </NuxtLink>
                                             </li>
                                        </ul>
                                   </div>
                              </template>
                              <!-- lien normal -->
                              <template v-else>
                                   <NuxtLink :to="item.routeURL" class="flex items-center w-full p-[9px_12px] rounded-[8px] transition" :class="{'bg-[#dce9ff] text-[#001433] font-medium': isItemActive(item), 'bg-transparent text-[#354869] hover:bg-[#64749114] hover:text-[#001433] font-normal': !isItemActive(item)}">
                                        <component :is="item.icon" class="w-[16px] h-[16px] min-h-[16px] min-w-[16px] fill-[#001433] mr-[8px]" />
                                        {{ item.name }}
                                        <div v-if="item.beta" class="flex ml-auto">
                                             <span class="uppercase text-[9px] leading-[11px] tracking-[0em] bg-[#acb8cb] text-white px-[4px] py-[3px] rounded-[4px] font-medium">{{ t('panel.components.common.childSideMenu.beta') }}</span>
                                        </div>
                                   </NuxtLink>
                              </template>
                         </li>
                    </template>
               </template>
          </template>
          <!-- sans groupes -->
          <template v-else>
               <li v-for="item in items.filter(i => !i.disabled)" :key="item.id" class="flex flex-col w-full relative text-[#354869] p-0 text-[14px] leading-[18px] tracking-[-0.01em]">
                    <!-- sous-menu -->
                    <template v-if="item.type === 'submenu'">
                         <div @click="toggleItem(item.id)" class="flex items-center w-full p-[9px_12px] rounded-[8px] transition cursor-pointer" :class="openItems.has(item.id) ? '' : 'bg-transparent text-[#354869] hover:bg-[#64749114] hover:text-[#001433] font-normal'">
                              <component :is="item.icon" class="w-[16px] h-[16px] min-h-[16px] min-w-[16px] fill-[#001433] mr-[8px]" />
                              <span class="block w-[2px] min-w-[2px] h-[2px] min-h-[2px] ml-0"></span>
                              {{ item.name }}
                              <SvgoPanelCommonIconArrowMenu class="w-[16px] h-[16px] min-h-[16px] min-w-[16px] fill-[#001433] ml-auto" :class="{ 'rotate-90': openItems.has(item.id) }"/>
                         </div>
                         <div v-if="openItems.has(item.id)" class="pl-[10px]">
                              <ul class="list-none p-0 m-0">
                                   <li v-for="sub in groupedSubs[item.id] || []" :key="sub.routeURL" class="flex items-center">
                                        <NuxtLink :to="sub.routeURL" class="flex items-center w-full px-[12px] py-[9px] rounded-[6px] transition" :class="route.path === sub.routeURL ? 'bg-[#dce9ff] text-[#001433] font-medium' : 'bg-transparent text-[#354869] hover:bg-[#64749114] hover:text-[#001433] font-normal'">
                                             <component :is="sub.icon" class="w-[16px] h-[16px] fill-[#001433] min-h-[16px] min-w-[16px] mr-[6px]" />
                                             {{ sub.name }}
                                        </NuxtLink>
                                   </li>
                              </ul>
                         </div>
                    </template>
                    <!-- lien simple -->
                    <template v-else>
                         <NuxtLink :to="item.routeURL" class="flex items-center w-full p-[9px_12px] rounded-[8px] transition" :class="{'bg-[#dce9ff] text-[#001433] font-medium': isItemActive(item), 'bg-transparent text-[#354869] hover:bg-[#64749114] hover:text-[#001433] font-normal': !isItemActive(item)}">
                              <component :is="item.icon" class="w-[16px] h-[16px] min-h-[16px] min-w-[16px] fill-[#001433] mr-[8px]" />
                              {{ item.name }}
                              <div v-if="item.beta" class="flex ml-auto">
                                   <span class="uppercase text-[9px] leading-[11px] tracking-[0em] bg-[#acb8cb] text-white px-[4px] py-[3px] rounded-[4px] font-medium">
                                        {{ t('panel.components.common.childSideMenu.beta') }}
                                   </span>
                              </div>
                         </NuxtLink>
                    </template>
               </li>
          </template>
     </ul>
</template>

<script setup lang="ts">
const { t } = useI18n()
interface SidebarItem {
     id: string
     group?: string
     type: string
     icon: any
     routeURL?: string
     name: string
     beta?: boolean
     disabled?: boolean
     isActive?: (route: any) => boolean
}

interface SidebarGroup {
     id: string
     name: string
}
interface SidebarSub {
     sub: string
     icon: any
     routeURL?: string
     name: string
     beta?: boolean
}

const props = defineProps<{
     items: SidebarItem[]
     groups?: SidebarGroup[] | null
     subs?: SidebarSub[] | null
}>()

const { items, groups, subs } = toRefs(props)
const route = useRoute()

// regroupe les sous-éléments par parent
const groupedSubs = computed<Record<string, SidebarSub[]>>(() => {
     const map: Record<string, SidebarSub[]> = {}
     if (subs.value) {
          for (const s of subs.value) {
               if (!map[s.sub]) map[s.sub] = []
               map[s.sub].push(s)
          }
     }
     return map
})

// état ouvert/fermé de chaque item
const openItems = ref(new Set<string>())

function toggleItem(id: string) {
     if (openItems.value.has(id)) openItems.value.delete(id)
     else openItems.value.add(id)
}

watch(
     () => route.path,
     (newPath) => {
          // on cherche le sub dont la routeURL correspond à la route actuelle
          const matching = subs.value?.find(s => s.routeURL === newPath)
          if (matching) {
               openItems.value.add(matching.sub)
          }
     },
     { immediate: true }
)

const groupedItems = computed<Record<string, SidebarItem[]>>(() => {
     const map: Record<string, SidebarItem[]> = {}
     if (groups.value) {
          for (const g of groups.value) {
               map[g.id] = items.value.filter(i => i.group === g.id)
          }
     }
     return map
})

// Vérifier si un élément de menu est actif (pour les sous-menus)
const isItemActive = (item) => {
     // Si l'élément a une fonction isActive personnalisée, on l'utilise
     if (typeof item.isActive === 'function') {
          return item.isActive(route);
     }
     // Pour les sous-menus, on vérifie si un des sous-éléments est actif
     if (item.type === 'submenu') {
          return (groupedSubs.value[item.id] || []).some(sub => route.path === sub.routeURL);
     }
     // Pour les liens simples, on vérifie si l'URL correspond
     return route.path === item.routeURL;
};

// Vérifier s'il y a des éléments visibles dans un groupe
const hasVisibleItemsInGroup = (groupId) => {
     return (groupedItems.value[groupId] || []).some(item => !item.disabled);
};
</script>
