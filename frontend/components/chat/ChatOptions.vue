<template>
     <div ref="optionsBox" class="absolute top-[72px] right-[24px] bg-white rounded-[8px] shadow-[0px_6px_32px_0px_rgba(0,18,46,0.16)] p-[12px_6px] z-[300] min-w-[230px]">
          <ul class="m-0 p-0">
               <li class="rounded-[6px] flex">
                    <button @click="!previewMode && $emit('toggleNotifications')" class="p-2 px-4 flex m-0 w-full rounded-[6px] hover:bg-[#eff2f6] items-center">
                         <svgo-chat-icon-hp-off v-if="notificationSnoozed" class="fill-[#abb3c3] h-[20px] w-[20px]" id="ic_notificationsOn" />
                         <svgo-chat-icon-hp-on v-else class="h-[20px] w-[20px]" :style="{ fill:primaryColor }" />
                         <span class="ml-[10px] text-[#06132b]">{{ notificationSnoozed ? t('chat.components.options.soundOff') : t('chat.components.options.soundOn') }}</span>
                         <input type="checkbox" id="audio-switch" class="hidden" :checked="notificationSnoozed" disabled/>
                         <label for="audio-switch" class="flex items-center cursor-pointer w-10 h-5 bg-[#2f3941] rounded-full transition-colors duration-300 m-auto" :style="{ backgroundColor: !notificationSnoozed ? primaryColor : '#abb3c3' }">
                              <svgo-chat-btn-puce class="fill-[#fff] h-[16px] w-[16px] transition-transform duration-300" :style="{ transform: !notificationSnoozed ? 'translateX(20px)' : 'translateX(3px)', }"/>
                         </label>
                    </button>
               </li>
               <li v-if="isMdUp" class="rounded-[6px] flex">
                    <button @click="!previewMode && $emit('toggleExpend')" class="p-2 px-4 flex m-0 w-full rounded-[6px] hover:bg-[#eff2f6] items-center">
                         <svgo-chat-icon-expand v-if="!isExpanded" class="fill-[#474747] h-[20px] w-[20px]"  />
                         <svgo-chat-icon-collapse v-if="isExpanded" class="fill-[#474747] h-[20px] w-[20px]" />
                         <span class="ml-[10px] text-[#06132b]">{{ isExpanded ? t('chat.components.options.collapse') : t('chat.components.options.expand') }}</span>
                    </button>
               </li>
               <li class="rounded-[6px] flex">
                    <button @click="!previewMode && $emit('clearChatAndClose')" class="p-2 px-4 flex m-0 w-full rounded-[6px] hover:bg-[#eff2f6] items-center">
                         <svgo-chat-icon-trash class="fill-[#474747] h-[22px] w-[22px]" />
                         <span class="ml-[10px] text-[#06132b]">	{{ t('chat.components.options.clearHistory') }}</span>
                    </button>
               </li>
          </ul>
     </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

const chatStore = useChatStore();
const props = defineProps<{
     notificationSnoozed: boolean;
     isExpanded: boolean;
     optionsBox: HTMLElement | null;
     previewMode: boolean;
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
import { useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints({
     sm: 640, md: 768,
})

const isMdUp = breakpoints.greaterOrEqual('md')

</script>
