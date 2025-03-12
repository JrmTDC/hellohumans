<template>
     <div
          id="conversation-group"
          ref="chatContainer"
          v-auto-animate
          class="w-full overflow-y-auto bg-white transition duration-300 min-h-[160px] h-[487px] px-6 flex-1 max-h-full static"
     >
          <div id="messages" class="relative mt-[10px] w-full pb-6 float-left">
               <!-- Boucle des messages -->
               <div
                    v-for="(msg, index) in messages"
                    :key="index"
                    :class="[
          msg.sender === 'user'
            ? 'hhcss_message-visitor mt-[9px] bg-[#0566ff] text-white float-right'
            : 'hhcss_message-operator mt-[9px] text-[rgb(6,19,43)] float-left border border-transparent',
          msg.status === 'unavailable' ? 'hhcss_chat-error text-[#06132b] bg-[#f0f2f7]' : '',
          'hhcss_message py-[10px] px-4 rounded-[20px] my-[2px] text-[15px] leading-[20px] break-words inline-block max-w-[85%] clear-both relative transition-[margin] duration-[280ms] ease-in-out'
        ]"
               >
                    <span v-html="formatMessage(msg.text)" class="whitespace-pre-line"></span>
               </div>

               <!-- État d'écriture (isLoading) -->
               <div
                    v-if="isLoading"
                    class="hhcss_messageLoading text-[#00a9ff] float-left border border-transparent py-[10px] px-4 rounded-[20px] my-[2px] text-[15px] leading-[20px] break-words inline-block max-w-[85%] clear-both relative transition-[margin] duration-[280ms] ease-in-out"
               >
                    <span>En train d'écrire</span>
                    <div class="hhcss_puceAnimation">
                         <span></span>
                         <span></span>
                         <span></span>
                    </div>
               </div>
          </div>

          <!-- Custom scrollbar container -->
          <div id="conversation-scroll" ref="scrollbarContainer">
               <div ref="customScrollbar"></div>
          </div>
     </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';

const props = defineProps<{
     messages: Array<{
          text: string;
          datetime: string;
          status: string;
          sender: string;
     }>;
     isLoading: boolean;
     isChatActive: boolean;
}>();

// Références pour la zone de chat et la scrollbar
const chatContainer = ref<HTMLElement | null>(null);
const customScrollbar = ref<HTMLElement | null>(null);
const scrollbarContainer = ref<HTMLElement | null>(null);

let isDragging = false;
let startY = 0;
let startScrollTop = 0;

onMounted(() => {
     // On attache l'event listener si le chat est actif
     if (props.isChatActive && chatContainer.value) {
          chatContainer.value.addEventListener('scroll', updateScrollbar);
     }
     if (props.isChatActive && customScrollbar.value) {
          customScrollbar.value.addEventListener('mousedown', startDrag);
     }
});

onUnmounted(() => {
     if (chatContainer.value) {
          chatContainer.value.removeEventListener('scroll', updateScrollbar);
     }
     if (customScrollbar.value) {
          customScrollbar.value.removeEventListener('mousedown', startDrag);
     }
});

// Surveillez le changement de isChatActive pour attacher/détacher les events
watch(
     () => props.isChatActive,
     (newVal) => {
          nextTick(() => {
               if (chatContainer.value && newVal) {
                    chatContainer.value.addEventListener('scroll', updateScrollbar);
               } else if (chatContainer.value && !newVal) {
                    chatContainer.value.removeEventListener('scroll', updateScrollbar);
               }

               if (customScrollbar.value && newVal) {
                    customScrollbar.value.addEventListener('mousedown', startDrag);
               } else if (customScrollbar.value && !newVal) {
                    customScrollbar.value.removeEventListener('mousedown', startDrag);
               }
               scrollToBottom();
          });
     }
);

// Scroller lors de l'ouverture de la discution
watch(
     () => props.isChatActive,
     (newVal) => {
          if (!newVal) return;
          nextTick(() => {
               setTimeout(() => {
                    scrollToBottom();
               }, 50);
          });
     },
     { immediate: true }
);

// Scroller en bas quand la liste de messages change
watch(
     () => props.messages,
     () => {
          nextTick(() => {
               scrollToBottom();
          });
     },
     { deep: true }
);

// Met à jour la scrollbar custom
function updateScrollbar() {
     if (!chatContainer.value || !customScrollbar.value) return;

     const scrollHeight = chatContainer.value.scrollHeight;
     const scrollTop = chatContainer.value.scrollTop;
     const clientHeight = chatContainer.value.clientHeight;

     if (scrollHeight <= clientHeight) {
          // Masquer la barre de défilement si le contenu ne dépasse pas
          customScrollbar.value.style.display = 'none';
          return;
     }

     // Afficher et mettre à jour la barre de défilement
     customScrollbar.value.style.display = 'block';
     const scrollbarHeight = Math.max(
          (clientHeight / scrollHeight) * clientHeight,
          30
     );
     const scrollbarPosition =
          (scrollTop / (scrollHeight - clientHeight)) * (clientHeight - scrollbarHeight);

     customScrollbar.value.style.height = `${scrollbarHeight}px`;
     customScrollbar.value.style.transform = `translateY(${scrollbarPosition}px)`;
}

function startDrag(event: MouseEvent) {
     isDragging = true;
     startY = event.clientY;
     startScrollTop = chatContainer.value ? chatContainer.value.scrollTop : 0;

     document.addEventListener('mousemove', onDrag);
     document.addEventListener('mouseup', stopDrag);
}

function onDrag(event: MouseEvent) {
     if (!isDragging || !chatContainer.value || !customScrollbar.value) return;

     const scrollHeight = chatContainer.value.scrollHeight;
     const clientHeight = chatContainer.value.clientHeight;
     const deltaY = event.clientY - startY;

     const scrollMove = (deltaY / clientHeight) * scrollHeight;
     chatContainer.value.scrollTop = startScrollTop + scrollMove;
     updateScrollbar();
}

function stopDrag() {
     isDragging = false;
     document.removeEventListener('mousemove', onDrag);
     document.removeEventListener('mouseup', stopDrag);
}

// Fonction pour scroller automatiquement en bas avec un effet fluide
function scrollToBottom() {
     nextTick(() => {
          if (chatContainer.value) {
               chatContainer.value.scrollTo({
                    top: chatContainer.value.scrollHeight,
                    behavior: 'smooth',
               });
               setTimeout(() => {
                    updateScrollbar();
               }, 200);
          }
     });
}

// Formatage du texte (gras, italique, listes, etc.)
function formatMessage(text: string) {
     return text
          .replace(/\n/g, "<br>") // Remplace les sauts de ligne par <br>
          .replace(/(\d{1,2}\s\w+\s\w+)/g, "<strong>$1</strong>") // Met en gras les adresses ou dates
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Formatage en gras **Texte**
          .replace(/\*(.*?)\*/g, "<em>$1</em>") // Formatage en italique *Texte*
          .replace(/- (.*?)<br>/g, "• $1<br>"); // Convertir les listes en puces
}
</script>
