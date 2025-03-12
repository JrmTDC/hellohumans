<template>
     <div
          ref="optionsBox"
          class="absolute top-[72px] right-[24px] bg-white rounded-[8px] shadow-[0px_6px_32px_0px_rgba(0,18,46,0.16)] p-[12px_6px] z-[30] min-w-[230px]"
     >
          <ul class="m-0 p-0">
               <li class="rounded-[6px] flex">
                    <button
                         @click="$emit('toggleNotifications')"
                         class="p-2 px-4 flex m-0 w-full rounded-[6px] hover:bg-[#eff2f6] items-center"
                    >
                         <svgoIconHpOff
                              class="fill-[#abb3c3] h-[20px] w-[20px]"
                              id="ic_notificationsOn"
                              v-if="!notificationsEnabled"
                         />
                         <svgoIconHpOn
                              class="fill-[#0566ff] h-[20px] w-[20px]"
                              v-else
                         />
                         <span class="ml-[10px] text-[#06132b]">Son {{ notificationsEnabled ? "activé" : "désactivé" }}</span>
                         <input
                              type="checkbox"
                              id="audio-switch"
                              class="hidden"
                              :checked="notificationsEnabled"
                              disabled
                         />
                         <label
                              for="audio-switch"
                              class="flex items-center cursor-pointer w-10 h-5 bg-[#2f3941] rounded-full transition-colors duration-300 m-auto" :style="{ backgroundColor: notificationsEnabled ? '#0566ff' : '#abb3c3' }">
                              <svgoBtnPuce class="fill-[#fff] h-[16px] w-[16px] transition-transform duration-300" :style="{ transform: notificationsEnabled ? 'translateX(20px)' : 'translateX(3px)', }"/>
                         </label>
                    </button>
               </li>
               <li class="rounded-[6px] flex">
                    <button
                         @click="$emit('toggleExpend')"
                         class="p-2 px-4 flex m-0 w-full rounded-[6px] hover:bg-[#eff2f6] items-center"
                    >
                         <svgoIconExpand class="fill-[#474747] h-[20px] w-[20px]" v-if="!isExpanded" />
                         <svgoIconCollapse class="fill-[#474747] h-[20px] w-[20px]" v-if="isExpanded"/>
                         <span class="ml-[10px] text-[#06132b]">{{ isExpanded ? "Réduire" : "Agrendir" }} la discution</span>
                    </button>
               </li>
               <li class="rounded-[6px] flex">
                    <button
                         @click="$emit('clearChatAndClose')"
                         class="p-2 px-4 flex m-0 w-full rounded-[6px] hover:bg-[#eff2f6] items-center"
                    >
                         <svgoIconTrash class="fill-[#474747] h-[22px] w-[22px]" />
                         <span class="ml-[10px] text-[#06132b]">Effacer l'historique</span>
                    </button>
               </li>
          </ul>
     </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
     notificationsEnabled: boolean;
     isExpanded: boolean;
     optionsBox: HTMLElement | null;
}>();
const emits = defineEmits(['toggleNotifications', 'toggleExpend', 'clearChatAndClose', 'closeOptions']);

const optionsBox = ref<HTMLElement | null>(null);

onMounted(() => {
     document.addEventListener('click', handleClickOutside);
});
onUnmounted(() => {
     document.removeEventListener('click', handleClickOutside);
});

function handleClickOutside(event: any) {
     if (
          optionsBox.value &&
          !optionsBox.value.contains(event.target)
     ) {
          emits('closeOptions');  // On avertit le parent de fermer
     }
}

</script>
