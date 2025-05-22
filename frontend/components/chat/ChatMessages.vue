<template>
     <div
          id="conversation-group"
          ref="chatContainer"
          v-auto-animate
          class="w-full overflow-auto bg-white transition-all duration-300 min-h-[160px] h-[487px] px-[24px] flex-[1_1_auto]"
     >
          <div id="messages" class="relative mt-[10px] w-full pb-6 float-left">

                    <!-- Affichage du message d'introduction -->
                    <button v-if="!showPreviousMessages" @click="onShowHistory" class="mx-auto mb-[20px] flex items-center bg-white tracking-[-0.1px] text-center text-[12px] font-semibold text-[rgb(136,148,171)] rounded-[14px] border border-[rgba(136,148,171,0.24)] pr-[10px]">
                         <SvgoChatIconHistory class="fill-[rgb(136,148,171)] w-[19px] h-[24px] mx-[4px]"/>
                         Messages précédents
                    </button>


               <!-- Boucle sur tous les messages filteredMessages -->
               <div
                    v-for="(msg, index) in filteredMessages" :key="msg.id"
                    :class="[
          msg.sender === 'visitor'
            ? 'hhcss_message-visitor mt-[9px] text-white float-right '
            : 'hhcss_message-operator mt-[9px] text-[rgb(6,19,43)] float-left border border-transparent',
          msg.status === 'unavailable' ? 'hhcss_chat-error text-[#06132b] bg-[#f0f2f7]' : '',
          'hhcss_message py-[10px] px-4 rounded-[20px] my-[2px] text-[15px] leading-[20px] break-words inline-block max-w-[85%] clear-both relative transition-[margin] duration-[280ms] ease-in-out'
        ]" :style="[
             msg.sender === 'visitor' ? { background: chatStore.configChat.backgroundColor, color: chatStore.project?.config.textColor } : { background:`linear-gradient(white, white) padding-box padding-box,
               linear-gradient(135deg, ${variation1}, ${variation2}) border-box border-box` },
             msg.status === 'unavailable' ? { } : {},
        ]"
               >
                    <!-- Affichage du texte du message -->
                    <span v-html="formatMessage(msg.content)" class="whitespace-pre-line"></span>

                    <!-- Si le message contient des choices, on affiche des boutons -->
                    <div v-if="msg.choices" class="mt-2 flex flex-wrap gap-2">
                         <button
                              v-for="(choice, index) in msg.choices"
                              :key="choice"
                              @mouseover="hoverIndex = index"
                              @mouseleave="hoverIndex = null"
                              class="px-3 py-2 border rounded cursor-pointer hover:text-white"
                              :style="{ background: hoverIndex === index ? chatStore.configChat.backgroundColor : '' }"
                              @click="$emit('choiceSelected', choice)"
                         >{{ choice }}
                         </button>
                    </div>
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
import { colord } from 'colord';
const chatStore = useChatStore();
const emits = defineEmits(['choiceSelected']);

const props = defineProps<{
     messages: ChatMessage[]
     isLoading: boolean
     isChatActive: boolean
}>()

// Références pour la zone de chat et la scrollbar
const chatContainer = ref<HTMLElement | null>(null);
const customScrollbar = ref<HTMLElement | null>(null);
const scrollbarContainer = ref<HTMLElement | null>(null);
const hoverIndex = ref(null);

const variation1 = computed(() => colord(chatStore.configChat.backgroundColor).rotate(-15).lighten(0).toHex());
const variation2 = computed(() => colord(chatStore.configChat.backgroundColor).rotate(-20).lighten(0.1).toHex());

let isDragging = false;
let startY = 0;
let startScrollTop = 0;

const showPreviousMessages = ref(false)
const lastActivityTime = ref(Date.now())

// Montre uniquement les messages envoyés après le seuil
const filteredMessages = computed(() => {
     const twoMinutes = 2 * 60 * 1000
     const now = Date.now()

     if (showPreviousMessages.value) return props.messages

     // Messages récents uniquement (envoyés dans les 2 dernières minutes)
     return props.messages.filter((msg) => {
          return msg.time_sent > now - twoMinutes
     })
})

// Met à jour l'activité dès qu’un message est envoyé ou reçu
watch(() => props.messages, () => {
     if (!showPreviousMessages.value) {
          const latest = props.messages[props.messages.length - 1]
          if (latest) lastActivityTime.value = latest.time_sent
     }
}, { deep: true })

// Masquer l’historique après 2 minutes d’inactivité
let hideTimer: ReturnType<typeof setTimeout> | null = null

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

watch(() => props.messages.length, () => {
     if (hideTimer) clearTimeout(hideTimer)
     hideTimer = setTimeout(() => {
          showPreviousMessages.value = false
     }, 2 * 60 * 1000)
})

// Quand l'utilisateur clique pour afficher les anciens messages
function onShowHistory() {
     showPreviousMessages.value = true
     lastActivityTime.value = Date.now()

     // On redémarre le timer pour recacher au bout de 2 min
     if (hideTimer) clearTimeout(hideTimer)
     hideTimer = setTimeout(() => {
          showPreviousMessages.value = false
     }, 2 * 60 * 1000)
}

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
function formatMessage(content?: string) {
     if (!content) return ''
     return content
          .replace(/\n/g, "<br>") // Remplace les sauts de ligne par <br>
          .replace(/(\d{1,2}\s\w+\s\w+)/g, "<strong>$1</strong>") // Met en gras les adresses ou dates
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Formatage en gras **Texte**
          .replace(/\*(.*?)\*/g, "<em>$1</em>") // Formatage en italique *Texte*
          .replace(/- (.*?)<br>/g, "• $1<br>"); // Convertir les listes en puces
}
</script>
