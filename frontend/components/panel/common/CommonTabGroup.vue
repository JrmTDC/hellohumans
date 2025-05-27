<template>
     <div class="flex sm:hidden">
          <div class="mb-0 text-left relative w-full">
               <div class="relative text-left h-fit pointer-events-auto rounded-[8px] w-full">
                    <PanelCommonSelectField :model-value="modelValue" @update:modelValue="updateValue" :options="tabs" option-key="value" option-label="label" dropdown-class="min-w-[581px] max-w-[256px]" />
               </div>
               <div class="max-w-[256px] shadow-[0_8px_20px_rgba(0,20,51,0.24)] bg-white rounded-[8px] absolute top-[56px] z-[2] max-h-[280px] flex mt-0"></div>
          </div>
     </div>
     <div class="flex">
          <div class="hidden border-r border-[rgb(239,242,246)] sm:block">
               <!-- Liste des guides d'installation -->
               <ul class="m-0 min-h-full h-full flex flex-col pr-4 pl-0 w-[232px] bg-transparent">
                    <li v-for="tab in tabs" :key="tab.value" class="flex flex-col w-full relative p-0  text-[14px] leading-[18px] tracking-[-0.01em]">
                         <div class="rounded-[8px] relative">
                              <button class="relative outline-none border-none rounded-[8px] flex items-center w-full text-left cursor-pointer px-[12px] py-[8px] min-h-[36px text-[#354869] hover:bg-[#64749114] hover:text-[#001433] active:text-[#001433] active:bg-[#dce9ff] active:font-medium" :class="{'bg-[#dce9ff] text-[#001433] font-medium': modelValue === tab.value,'text-[#354869]': modelValue !== tab.value}" @click="updateValue(tab.value)">
                                   <div class="flex items-center gap-2">
                                        <component :is="tab.icon" class="min-w-[20px] min-h-[20px] w-[20px] h-[20px] text-[#354869] mr-[8px]" />
                                        <span class="text-[14px] leading-[18px] tracking-[-0.01em] flex-[0_1_170px] overflow-hidden">{{ tab.label }}</span>
                                   </div>
                              </button>
                         </div>
                    </li>
               </ul>
          </div>
          <div class="block w-[600px] sm:ml-0 sm:mr-0 sm:pl-[36px]">
               <!-- Contenu du guide d'installation (Custom) -->
               <slot :active="modelValue" />
          </div>
     </div>
</template>

<script setup lang="ts">
const props = defineProps<{
     modelValue: string
     tabs: { value: string; label: string; icon?: any }[]
}>()
const emit = defineEmits(['update:modelValue'])
const updateValue = (val: string) => {
     emit('update:modelValue', val)
}
</script>
