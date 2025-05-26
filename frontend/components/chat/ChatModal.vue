<template>
          <div v-if="show" class="fixed top-0 left-0 w-full h-full z-[1000] flex justify-center items-end pointer-events-auto">
               <!-- Overlay semi-transparent -->
               <div class="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] transition-opacity duration-300" :class="isVisible ? 'opacity-100' : 'opacity-0'"></div>

               <!-- Conteneur de la boîte en bas -->
               <div class="absolute bottom-0 left-[22px] right-[22px] w-[calc(100%-44px)] max-h-[calc(100%-8px)] p-[32px_20px] pt-[45px] bg-white rounded-t-[12px] z-[1001] overflow-hidden transform transition-transform duration-300 ease-in-out" :class="isVisible ? 'translate-y-0' : 'translate-y-full'">
                    <!-- Bouton Fermer (top right) -->
                    <button @click="!previewMode && closeModal" class="absolute top-[20px] right-[20px] group">
                         <svgo-chat-icon-minimize class="w-[24px] h-[24px] fill-[#6D7E9E] group-hover:fill-[#0566ff]" />
                    </button>

                    <!-- Titre + formulaire RGPD -->
                    <h2 class="text-[15px] mb-2 text-[#494949]">Avant de commencer, veuillez entrer votre adresse email.</h2>
                    <div class="relative left-0 p-[15px]">
                         <svgo-chat-icon-input class="w-[24px] h-[24px] fill-[#0566ff] rotate-45 absolute top-[28px] left-[25px]" />
                         <input v-model="visitorEmail" type="email" placeholder="Entrez votre email" class="border border-[rgba(108,125,159,0.24)] text-[15px] p-[9px_12px_10px_40px] leading-normal m-0 w-full rounded-[10px] focus:outline-none h-[50px]" :disabled="isLoading" @keydown.enter.prevent="onAccept"
                         />
                    </div>
                    <p class="text-[13px] mt-[10px] mb-[35px] text-[#9B9B9B] leading-[18px]">Je comprends et reconnais que HelloHumans est le responsable du traitement de mes données personnelles. Toutes mes données seront traitées et protégées conformément au Règlement Général sur la Protection des Données (RGPD)</p>
                    <button @click="!previewMode && onAccept" :disabled="!isEmailValid" class="flex-shrink-0 w-full h-[50px] text-[16px] text-white rounded-[6px] relative" :class="[isEmailValid ? 'bg-[#0566ff]' : 'bg-gray-400 cursor-not-allowed', isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0566ff]']">
                         <span v-if="!isLoading">J’accepte et je continue</span>
                         <span v-else class="flex items-center text-center justify-center">
                              Chargement...
                         </span>
                    </button>
               </div>
          </div>
</template>

<script setup lang="ts">

const chatStore = useChatStore();
const props = defineProps<{
     show: boolean;
     isLoading : boolean;
     previewMode: boolean;
}>();

const emits = defineEmits(['accept', 'close', 'loading']);
const visitorEmail = ref('');
const isVisible = ref(false); // Pour contrôler l'animation proprement

// Vérifier si l'utilisateur a déjà accepté le RGPD
onMounted(() => {
     if(props.previewMode) return
     const ispChatLocalStorage = localStorage.getItem('hhs_isp_chat');
     if (ispChatLocalStorage) {
          const ispChatData = JSON.parse(ispChatLocalStorage);
          if (ispChatData.visitor.gdprConsent === true) {
               visitorEmail.value = ispChatData.visitor.email;
               emits('accept', ispChatData.visitor.email, 'isLoading', false);
          }
     }
});


// Vérifier si l'email est valide
const isEmailValid = computed(() => {
     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(visitorEmail.value);
});

// Activer l'animation avec un petit délai
watch(() => props.show, (newVal) => {
     if (newVal) {
          setTimeout(() => {
               isVisible.value = true;
          }, 50);
     } else {
          setTimeout(() => {
               isVisible.value = false;
          }, 50);
     }
});

// Quand l’utilisateur clique “J’accepte”
function onAccept() {
     if (!isEmailValid.value || props.isLoading) return;
     emits('accept', visitorEmail.value);
}

// Quand l’utilisateur clique sur “Fermer” (croix en haut)
function closeModal() {
     isVisible.value = false; // Animation de fermeture
     setTimeout(() => emits('close'), 300); // Attendre 300ms avant de cacher complètement
}
</script>
