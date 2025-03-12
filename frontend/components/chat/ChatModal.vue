<template>
          <div
               v-if="show"
               class="fixed top-0 left-0 w-full h-full z-[1000] flex justify-center items-end pointer-events-auto"
          >
               <!-- Overlay semi-transparent -->
               <div class="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)]"></div>

               <!-- Conteneur de la boîte en bas -->
               <div
                    class="absolute bottom-0 left-[22px] right-[22px] w-[calc(100%-44px)] max-h-[calc(100%-8px)] p-[32px_20px] pt-[45px] bg-white rounded-t-[12px] z-[1001] overflow-hidden"
               >
                    <!-- Bouton Fermer (top right) -->
                    <button
                         @click="closeModal"
                         class="absolute top-[20px] right-[20px] text-gray-500 hover:text-gray-700"
                    >
                         <svgoIconMinimize class="w-[24px] h-[24px] fill-[#6D7E9E]" />
                    </button>

                    <!-- Titre + formulaire RGPD -->
                    <h2 class="text-[15px] mb-2 text-[#494949]">Avant de commencer, veuillez entrer votre adresse email.</h2>
                    <div class="relative left-0 p-[15px]">
                         <svgoIconInput class="w-[24px] h-[24px] fill-[#0566ff] rotate-45 absolute top-[28px] left-[25px]" />
                         <input
                              v-model="localEmail"
                              type="email"
                              placeholder="Entrez votre email"
                              class="border border-[rgba(108,125,159,0.24)] text-[15px] p-[9px_12px_10px_40px] leading-normal m-0 w-full rounded-[10px] focus:outline-none h-[50px]"
                         />
                    </div>
                    <p class="text-[13px] mt-[10px] mb-[35px] text-[#9B9B9B] leading-[18px]">
                         Je comprends et reconnais que HelloHumans est le responsable du traitement de mes données personnelles. Toutes mes données seront traitées et protégées conformément au Règlement Général sur la Protection des Données (RGPD)
                    </p>
                    <button
                         @click="onAccept"
                         :disabled="!isEmailValid"
                         class="flex-shrink-0 w-full h-[50px] text-[16px] text-white rounded-[6px] relative"
                         :class="isEmailValid ? 'bg-[#0566ff]' : 'bg-gray-400 cursor-not-allowed'"
                    >
                         J’accepte et je continue
                    </button>
               </div>
          </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
     show: boolean; // True si on doit afficher la modal
}>();

const emits = defineEmits(['accept', 'close']);

// E-mail local, tapé par l’utilisateur dans le champ
const localEmail = ref('');

// Vérifier si l'email est valide
const isEmailValid = computed(() => {
     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localEmail.value);
});


// Quand l’utilisateur clique “J’accepte”
function onAccept() {
     emits('accept', localEmail.value);
}

// Quand l’utilisateur clique sur “Fermer” (croix en haut)
function closeModal() {
     // On émet un event 'close' pour signaler qu’on veut fermer la modal
     emits('close');
}
</script>
