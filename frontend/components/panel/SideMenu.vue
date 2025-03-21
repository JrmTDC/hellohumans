<template>
     <div
          ref="menuRef"
          class="fixed left-0 bottom-0 transform translate-x-[64px] min-w-max z-[100]"
     >
          <div
               class="p-[8px] rounded-[8px] bg-white shadow-[0_8px_20px_rgba(0,20,51,0.24)] w-[256px] max-w-[256px] translate-x-[-10px] translate-y-[-10px]"
          >
               <div class="m-[8px] bg-[rgb(226,232,239)] h-[1px]"></div>
               <div
                    @click="logout"
                    class="w-full flex items-center text-[rgb(8,15,26)] bg-transparent border-none rounded-[4px] m-0 min-h-[36px] p-[6px_8px] cursor-pointer outline-none hover:bg-[#dce9ff] hover:text-[rgb(0,20,51)]"
               >
        <span class="whitespace-nowrap overflow-hidden text-ellipsis flex-[1_1_0%] text-left text-[14px]">
          Se déconnecter
        </span>
               </div>
          </div>
     </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const emits = defineEmits(['closeSideUserMenu'])

const router = useRouter()
const menuRef = ref<HTMLElement | null>(null)

const handleClickOutside = (event: MouseEvent) => {
     if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
          emits('closeSideUserMenu')
     }
}
let skipNextClick = true

onMounted(() => {
     skipNextClick = true
     setTimeout(() => {
          skipNextClick = false
     }, 100)

     document.addEventListener('click', (e) => {
          if (skipNextClick) return
          handleClickOutside(e)
     })
})

onUnmounted(() => {
     document.removeEventListener('click', handleClickOutside)
})

const logout = () => {
     localStorage.removeItem('token')
     router.push('/panel/login')
}
</script>
