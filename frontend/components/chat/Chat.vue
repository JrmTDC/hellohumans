<template>
     <div class="absolute w-[112px] h-[140px] bottom-[12px] flex items-center justify-center pointer-events-none z-[1] right-0">
          <button
               v-if="!isOpen"
               @click="toggleChat"
               class="w-[60px] h-[60px] rounded-[30px] flex items-center justify-center pointer-events-auto transition duration-150 ease-in-out relative text-[#007dfc] bg-[#0566ff] shadow-[0px_4px_24px_#02061033] hover:scale-110 transition duration-150 ease-in-out"
          >
               <svgoButtonIconChat class="w-[24px] h-[24px]"/>
          </button>
          <!-- Icône de notifications désactivées (optionnel) -->
          <div
               v-if="!isOpen && !notificationsEnabled"
               class="absolute top-[37px] right-[23px] font-bold pointer-events-none rounded-[10px] flex justify-center items-center min-w-[20px] h-[20px] bg-white outline outline-1 outline-[rgb(226,232,239)] text-[rgb(8,15,26)] z-1"
          >
               <svgoIconNotificationDisabled class="w-[16px] h-[16px]"/>
          </div>
     </div>

     <!-- Conteneur principal du chatbot -->
     <div
          v-if="isOpen || isVisible"
          id="hellohumans-chat-iframe"
          class="max-h-[calc(100%-47px)] h-[699px] flex flex-col transition-[height] duration-200 absolute bottom-[26px] right-[26px] left-auto rounded-[16px] pointer-events-auto shadow-lg overflow-hidden z-1 bg-white scale-85 opacity-0 transform transition-transform duration-300 ease-in-out"
          :class="[
            isExpanded ? 'w-[593px]' : 'w-[372px]',
            isVisible ? 'scale-100 opacity-100' : 'scale-85 opacity-0'
          ]"
     >
          <!-- Zone de contenu avec animation -->
          <div v-auto-animate class="flex-1 overflow-hidden">

               <!-- Header -->
               <ChatHeader
                    :isChatActive="isChatActive"
                    :isOpen="isOpen"
                    :notificationsEnabled="notificationsEnabled"
                    :showOptions="showOptions"
                    @goToHome="goToHome"
                    @toggleChat="toggleChat"
                    @toggleOptions="toggleOptions"
               />

               <!-- Vague décorative -->
               <div class="relative z-10">
                    <svgoLineWave class="h-6 w-[calc(100%+10px)] absolute bottom-[-12px] left-[-4px]"/>
               </div>

               <!-- Écran d'accueil (Home) -->
               <ChatHome
                    v-if="!isChatActive"
                    :suggestedQuestions="suggestedQuestions"
                    @sendSuggestedMessage="sendSuggestedMessage"
                    @openChat="() => (isChatActive = true)"
               />

               <!-- Conteneur des messages -->
               <ChatMessages
                    v-if="isChatActive"
                    :messages="messages"
                    :isLoading="isLoading"
                    :isChatActive="isChatActive"
               />

               <!-- Zone de saisie -->
               <ChatInput
                    v-if="isChatActive"
                    v-model:currentMessage="message"
                    @sendMessage="sendMessage"
                    :acceptedRGPD="acceptedRGPD"
               />
          </div>

          <!-- RGPD Modal -->
          <ChatModal
               :show="showRGPDModal"
               @accept="onAcceptRGPD"
               @close="onCloseRGPD"
          />

          <!-- Options -->
          <ChatOptions
               v-if="showOptions"
               :notificationsEnabled="notificationsEnabled"
               :isExpanded="isExpanded"
               :optionsBox="optionsBox"
               @toggleNotifications="toggleNotifications"
               @toggleExpend="toggleExpend"
               @clearChatAndClose="clearChatAndClose"
               @closeOptions="showOptions = false"
          />
     </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useRuntimeConfig } from '#imports';

import ChatHeader from '@/components/chat/ChatHeader.vue';
import ChatHome from '@/components/chat/ChatHome.vue';
import ChatMessages from '@/components/chat/ChatMessages.vue';
import ChatInput from '@/components/chat/ChatInput.vue';
import ChatOptions from '@/components/chat/ChatOptions.vue';

// Vous pouvez adapter les chemins d'import en fonction de votre arborescence de fichiers.
// Assurez-vous que ces composants se trouvent réellement à ces emplacements.

// --- État global du chatbot ---
const config = useRuntimeConfig();
const apiUrl = `${config.public.apiBaseUrl}/api/${config.public.apiVersion}/`;

const message = ref(''); // Message en cours
const clientKey = ref(`${config.public.apiClientKey}`); // Clé client
const messages = ref<any[]>([]); // Historique des messages
const isLoading = ref(false); // Animation de chargement
const isOpen = ref(false); // Gère l'ouverture du chatbot
const isChatActive = ref(false); // Gère l'affichage entre Home & Chat
const notificationsEnabled = ref(true); // True = Notifications activées
const isExpanded = ref(false); // True = Chatbox agrandie
const showOptions = ref(false); // Gère l'ouverture des options
const isSending = ref(false); // Empêche l'envoi multiple
const isVisible = ref(false); // Gère l'animation d'ouverture

// Modal RGPD
const acceptedRGPD = ref(false);
const showRGPDModal = ref(false);
const pendingMessage = ref<string | null>(null);

// Référence pour la zone d'options
const optionsBox = ref<HTMLElement | null>(null);

// Exemples de questions suggérées
const suggestedQuestions = [
     'Quels sont les restaurants ?',
     'Quels sont les événements à venir ?',
     'Quels sites touristiques visiter ?',
     'Où trouver un hôtel ?',
     'Quels sont les transport ?',
];

// Vérifie si on est dans le navigateur
const isBrowser = typeof window !== 'undefined';

// Watch pour sauvegarder l'historique des messages
watch(
     messages,
     (newMessages) => {
          if (isBrowser) {
               localStorage.setItem('chat_history', JSON.stringify(newMessages));
          }
     },
     { deep: true }
);


// Fonction pour jouer un son lorsqu'un message du chatbot arrive
const playNotificationSound = () => {
     const audio = new Audio('/sounds/notification.mp3');
     audio.volume = 0.5;
     audio.play().catch((error) => console.warn('Impossible de jouer le son :', error));
};

// Fonction pour activer/désactiver l'agrandissement de la chatbox
const toggleExpend = () => {
     isExpanded.value = !isExpanded.value;
};

// Fonction pour activer/désactiver les notifications
const toggleNotifications = () => {
     notificationsEnabled.value = !notificationsEnabled.value;
     if (isBrowser) {
          localStorage.setItem('notifications_enabled', notificationsEnabled.value.toString());
     }
     showOptions.value = false;
};

// Fonction pour envoyer une question pré-remplie
const sendSuggestedMessage = (question: string) => {
     message.value = question;
     isChatActive.value = true;
     sendMessage();
};

// Chargement initial
onMounted(() => {
     document.addEventListener('click', handleClickOutside);

     if (isBrowser) {
          // Récupération de l'état des notifications
          const savedNotifications = localStorage.getItem('notifications_enabled');
          if (savedNotifications !== null) {
               notificationsEnabled.value = savedNotifications === 'true';
          }

          // Récupération des messages
          const savedMessages = localStorage.getItem('chat_history');
          if (savedMessages) {
               messages.value = JSON.parse(savedMessages);
          }
     }
});

onUnmounted(() => {
     document.removeEventListener('click', handleClickOutside);
});

// Fermer le menu d'options si on clique en dehors
const handleClickOutside = (event: any) => {
     if (optionsBox.value && !optionsBox.value.contains(event.target)) {
          showOptions.value = false;
     }
};

// Envoi d'un message
const sendMessage = async () => {
     if (!message.value.trim()) return;

     // RGPD déjà accepté ?
     if (!acceptedRGPD.value) {
          // Pas accepté, on stocke le message et on ouvre la modal
          pendingMessage.value = message.value;
          showRGPDModal.value = true;
          return;
     }

     messages.value.push({
          text: message.value,
          datetime: new Date().toISOString(),
          status: 'success',
          sender: 'user',
     });
     isLoading.value = true;

     const userMessage = message.value;
     message.value = '';

     if (!isSending.value) {
          isSending.value = true; // Désactive l'envoi
          try {
               const res = await fetch(apiUrl+'/chat', {
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/json',
                         'x-client-key': clientKey.value,
                    },
                    body: JSON.stringify({
                         message: userMessage,
                    }),
               });
               const data = await res.json();

               setTimeout(() => {
                    if (notificationsEnabled.value) {
                         playNotificationSound();
                    }
                    if (data.status && (data.status === 'success' || data.status === 'unavailable')) {
                         messages.value.push({
                              text: data.response,
                              datetime: new Date().toISOString(),
                              status: data.status,
                              sender: 'bot',
                         });
                    } else {
                         messages.value.push({
                              text: "Oups... Un problème est survenu ! Je n’arrive pas à répondre pour le moment. Vous pouvez réessayer dans quelques instants. 🚀",
                              datetime: new Date().toISOString(),
                              status: 'unavailable',
                              sender: 'bot',
                         });
                    }
                    isLoading.value = false;
                    isSending.value = false; // Réactive l'envoi
               }, 1000);
          } catch (error) {
               if (notificationsEnabled.value) {
                    playNotificationSound();
               }
               messages.value.push({
                    text: "Oups... Un problème est survenu ! Je n’arrive pas à répondre pour le moment. Vous pouvez réessayer dans quelques instants. 🚀",
                    datetime: new Date().toISOString(),
                    status: 'unavailable',
                    sender: 'bot',
               });
               isLoading.value = false;
               isSending.value = false; // Réactive l'envoi
          }
     }
};

// Fonction pour ouvrir/fermer les options
const toggleOptions = () => {
     showOptions.value = !showOptions.value;
};

// Fonction pour vider l'historique
const clearChatAndClose = () => {
     messages.value = [];
     if (isBrowser) {
          localStorage.removeItem('chat_history');
     }
     showOptions.value = false;
};

// Fonction pour ouvrir/fermer le chatbot
const toggleChat = () => {
     isOpen.value = !isOpen.value;
     setTimeout(() => {
          isVisible.value = !isVisible.value;
     }, 90);

     if (!isOpen.value) {
          setTimeout(() => {
               isChatActive.value = false;
          }, 300); // Attendre la fin de l'animation
     }
};

// Permet de retourner à l'accueil
const goToHome = () => {
     isChatActive.value = false;
};

// Filtrer les messages (exemple si besoin, non utilisé directement ici)
const filteredMessages = computed(() => {
     return messages.value.filter(
          (msg) => msg.status && (msg.status === 'success' || msg.status === 'unavailable')
     );
});

// Modal RGPD : l'utilisateur accepte
async function onAcceptRGPD(userData: string) {
     try {
          // Appel API pour enregistrer le consentement RGPD
          // (à adapter avec votre URL / fetch)
          /*
          const res = await fetch(apiUrl+'/user', {
               method: 'POST',
               headers: {
                    'Content-Type': 'application/json',
                    'x-client-key': clientKey.value,
               },
               body: JSON.stringify({
                    user: userData,
               }),
          });
          const data = await res.json();
          */


          // envoie email à api, recupère uuid
          // email: localEmail.value,
          // Stocker les données RGPD dans `localStorage`
          localStorage.setItem(
               'user',
               JSON.stringify({
                    uuid: '123456',
                    rgpd: 'accepted'
               })
          );


     } catch (err) {
          console.error("Erreur enregistrement de l'utilisateur:", err);
          // Gérer un éventuel message d'erreur
     }
     setTimeout(() => {

          // On marque la RGPD comme acceptée
          acceptedRGPD.value = true;

          // On ferme la modal
          showRGPDModal.value = false;
          // On envoie immédiatement le pendingMessage s'il y en a un
          if (pendingMessage.value && pendingMessage.value.trim().length > 0) {
               // On place la valeur dans message
               message.value = pendingMessage.value;
               pendingMessage.value = null;
               // On envoie
               sendMessage();
          }

     }, 2000);
}

// Modal RGPD : l'utilisateur clique sur la croix pour fermer
function onCloseRGPD() {
     // On ferme la modal
     showRGPDModal.value = false;
     // On récupère le pendingMessage pour ne pas le perdre
     if (pendingMessage.value) {
          message.value = pendingMessage.value;
     }
}
</script>
