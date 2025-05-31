<template>
     <div v-if="leads && leads.length > 0" class="overflow-x-auto">
          <table class="border-collapse mb-[6px] max-w-full w-full">
               <thead>
                    <tr class="border-b border-b-[#eff2f6]">
                         <th class="flex items-center sticky left-0 min-w-[62px] pl-[22px] w-[1%] z-[1] bg-transparent !bg-transparent bg-[linear-gradient(90deg,#fff_90%,hsla(0,0%,100%,0))] px-[17px] py-[17px]">
                              <PanelCommonCheckbox v-model="allSelected"/>
                         </th>

                         <th class="min-w-[100px] text-[#647491] font-normal px-[16px] py-[8px] text-[14px] hover:bg-[#f5f7f9] group cursor-pointer">
                              <button class="flex items-center">
                                   <span>Radar</span>
                                   <span class="ml-[4px] opacity-0 transition-opacity group-hover:opacity-100">
                                        <SvgoPanelCustomersIconOrder class="w-[16px] h-[16px] fill-[#647491]" />
                                   </span>
                              </button>
                         </th>

                         <th class="min-w-[100px] text-[#647491] font-normal px-[16px] py-[8px] text-[14px] hover:bg-[#f5f7f9] group cursor-pointer">
                              <button class="flex items-center">
                                   <span>Email</span>
                                   <span class="ml-[4px] opacity-0 transition-opacity group-hover:opacity-100">
                                        <SvgoPanelCustomersIconOrder class="w-[16px] h-[16px] fill-[#647491]" />
                                   </span>
                              </button>
                         </th>

                         <th class="min-w-[100px] text-[#647491] font-normal px-[16px] py-[8px] text-[14px]">
                              <span>Activité récente</span>
                         </th>

                         <th class="min-w-[100px] text-[#647491] font-normal px-[16px] py-[8px] text-[14px] hover:bg-[#f5f7f9] group cursor-pointer">
                              <button class="flex items-center">
                                   <span>Pays</span>
                                   <span class="ml-[4px] opacity-0 transition-opacity group-hover:opacity-100">
                                        <SvgoPanelCustomersIconOrder class="w-[16px] h-[16px] fill-[#647491]" />
                                   </span>
                              </button>
                         </th>
                    </tr>
               </thead>
               <tbody>
                    <tr v-for="lead in leads" :key="lead.id" class="border-b border-b-[#eff2f6] hover:bg-[#f5f7f9]">
                         <td class="flex items-center sticky left-0 min-w-[62px] pl-[22px] w-[1%] z-[1] h-[56px] px-[16px] py-[8px]">
                              <PanelCommonCheckbox :modelValue="isSelected(lead.id)" @update:modelValue="checked => toggleSelection(lead.id, checked)"/>
                         </td>

                         <td class="h-[56px] px-[16px] py-[8px] align-middle">
                              <div class="bg-[rgb(203,216,82)] rounded-full text-white text-[14px] leading-[2.10] h-[30px] text-center w-[30px]">{{ lead.radar }}</div>
                         </td>

                         <td class="h-[56px] px-[16px] py-[8px] align-middle">
                              <p class="text-[14px] leading-[18px] tracking-[-0.01em] truncate">{{ lead.email }}</p>
                         </td>

                         <td class="h-[56px] px-[16px] py-[8px] align-middle">
                              <div class="flex">
                                   <button class="hover:bg-[rgb(220,233,255)] group w-[28px] h-[28px] rounded-[4px] flex justify-center items-center">
                                        <SvgoPanelCustomersIconChat class="w-[20px] h-[20px] fill-[rgb(100,116,145)] group-hover:fill-[#0566ff]" />
                                   </button>
                                   <button class="ml-[16px] hover:bg-[rgb(220,233,255)] group w-[28px] h-[28px] rounded-[4px] flex justify-center items-center">
                                        <SvgoPanelCustomersIconUserInfo class="w-[20px] h-[20px] fill-[rgb(100,116,145)] group-hover:fill-[#0566ff]" />
                                   </button>
                              </div>
                         </td>

                         <td class="h-[56px] px-[16px] py-[8px] align-middle">
                              <component :is="getFlagComponent(lead.country)" class="w-[18px] h-[18px]" />
                         </td>
                    </tr>
               </tbody>
          </table>
     </div>

     <div v-else class="text-[22px] pt-[170px] pb-[115px] text-center bg-[position:50%_55px] bg-no-repeat bg-[length:80px_80px]" :style="{ backgroundImage: `url('${backgroundNoCustomer}')` }">
          Désolé, aucun contact n’a été identifié
     </div>
</template>

<script setup lang="ts">
const props = defineProps<{
     leads: Array<any>
}>()

const backgroundNoCustomer = useAssetBase64Loader('panel/customers/backgroundNoCustomers')

import flagsFr from "assets/icons/panel/flags/fr.svg";
import flagsUs from "assets/icons/panel/flags/us.svg";
import flagsDe from "assets/icons/panel/flags/de.svg";
import flagsUnknown from "assets/icons/panel/flags/unknown.svg";

const getFlagComponent = (country: string | null) => {
     switch (country) {
          case 'fr': return rawIcon(flagsFr)
          case 'us': return rawIcon(flagsUs)
          case 'de': return rawIcon(flagsDe)
          default: return rawIcon(flagsUnknown)
     }
}

const selectedLeadIds = ref<string[]>([])

const allSelected = computed({
     get: () => props.leads.length > 0 && selectedLeadIds.value.length === props.leads.length,
     set: (val) => {
          selectedLeadIds.value = val ? props.leads.map(l => l.id) : []
     }
})

const isSelected = (id: string) => selectedLeadIds.value.includes(id)

const toggleSelection = (id: string, checked: boolean) => {
     selectedLeadIds.value = checked
          ? [...selectedLeadIds.value, id]
          : selectedLeadIds.value.filter(i => i !== id)
}


</script>
