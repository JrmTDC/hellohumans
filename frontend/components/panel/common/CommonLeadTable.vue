<template>
     <div v-if="leads && leads.length > 0" class="overflow-x-auto">
          <table class="border-collapse mb-[6px] max-w-full w-full">
               <thead>
               <tr class="border-b border-b-[#eff2f6]">
                    <th class="flex items-center sticky left-0 min-w-[62px] pl-[22px] w-[1%] z-[1] bg-transparent !bg-transparent bg-[linear-gradient(90deg,#fff_90%,hsla(0,0%,100%,0))] px-[16px] py-[12px]">
                         <label class="flex cursor-pointer relative">
                              <input type="text" class="absolute w-0 h-0 m-[-1px] p-0 overflow-hidden clip-[rect(0px,0px,0px,0px)] border-0">
                              <div class="flex flex-row justify-start items-center">
                                   <div class="flex items-start justify-start rounded-[5px]">
                                        <SvgoPanelCustomersIconCheckOff class="min-w-[24px] min-h-[24px] w-[24px] h-[24px] self-baseline fill-[rgb(100,116,145)] hover:fill-[#0049bd]" />
                                   </div>
                              </div>
                         </label>
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
               <tr
                    v-for="lead in leads"
                    :key="lead.id"
                    class="border-b border-b-[#eff2f6] hover:bg-[#f5f7f9]"
               >
                    <td class="flex items-center sticky left-0 min-w-[62px] pl-[22px] w-[1%] z-[1] h-[56px] px-[16px] py-[8px]">
                         <label class="flex cursor-pointer relative">
                              <input type="text" class="absolute w-0 h-0 m-[-1px] p-0 overflow-hidden clip-[rect(0px,0px,0px,0px)] border-0">
                              <div class="flex flex-row justify-start items-center">
                                   <div class="flex items-start justify-start rounded-[5px]">
                                        <SvgoPanelCustomersIconCheckOn class="w-[24px] h-[24px] fill-[#0566ff] hover:fill-[#0049bd]" />
                                   </div>
                              </div>
                         </label>
                    </td>

                    <td class="h-[56px] px-[16px] py-[8px] align-middle">
                         <div class="bg-[rgb(203,216,82)] rounded-full text-white text-[14px] leading-[2.10] h-[30px] text-center w-[30px]">
                              {{ lead.radar }}
                         </div>
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
defineProps<{
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

</script>
