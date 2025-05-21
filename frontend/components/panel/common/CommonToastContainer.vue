<template>
     <div class="fixed top-[64px] left-1/2 transform -translate-x-1/2 z-[1000]">
          <transition-group name="toast" tag="ul"
                            class="flex flex-col items-center space-y-3 list-none m-0 p-0">
               <li v-for="toast in toasts" :key="toast.id">
                    <div class="flex items-center max-w-[600px] px-[20px] py-[12px] rounded-[4px] shadow-[0_8px_20px_rgba(0,20,51,0.24)]" :class="toastClass(toast.type)">
                         <component :is="iconMap[toast.type]" class="w-6 h-6 min-w-[24px] min-h-[24px]" :class="iconClass(toast.type)" />
                         <span class="ml-4 text-sm leading-[18px] m-0">{{ toast.message }}</span>
                    </div>
               </li>
          </transition-group>
     </div>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'

import iconToastSuccess from "assets/icons/panel/toast/iconSuccess.svg"
const { toasts } = useToast()

const iconMap = {
     success: rawIcon(iconToastSuccess),
     error: rawIcon(iconToastSuccess),
     warning: rawIcon(iconToastSuccess),
     info: rawIcon(iconToastSuccess),
}

function toastClass(type: string) {
     switch (type) {
          case 'success': return 'bg-[rgb(13,23,38)] text-white'
          case 'error': return 'bg-red-600'
          case 'warning': return 'bg-yellow-500 text-black'
          case 'info': return 'bg-blue-500'
          default: return 'bg-gray-600'
     }
}

function iconClass(type: string) {
     switch (type) {
          case 'success': return 'fill-[#34b857]'
          case 'error': return 'fill-[#34b857]'
          case 'warning': return 'fill-[#34b857]'
          case 'info': return 'fill-[#34b857]'
          default: return 'fill-white'
     }
}
</script>

