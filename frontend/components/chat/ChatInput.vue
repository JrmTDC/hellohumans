<template>
     <div id="conversation-input" class="px-6 w-full relative bg-white z-3 flex-none">
          <div class="transition-opacity duration-500 ease-in-out opacity-100 translate-y-0">
               <hr />
               <div class="flex items-center gap-3">
        <textarea
             rows="1"
             v-model="modelValue"
             placeholder="Écrivez un message..."
             class="py-4 border-0 w-full text-[15px] py-[16px] resize-none leading-6 overflow-x-hidden focus:outline-none"
             @keydown.enter.prevent="onEnter"
        ></textarea>

                    <button
                         v-show="modelValue.trim() !== ''"
                         @click="$emit('sendMessage')"
                         class="relative group p-2 rounded-full transition hover:bg-[#dce9ff] flex items-center justify-center ml-2"
                    >
          <span
               class="bg-white px-2 py-[6px] rounded shadow-lg text-[13px] absolute pointer-events-none whitespace-nowrap z-1 text-[#06132B] bottom-[calc(100%+5px)] left-1/2 translate-x-[-50%] translate-y-[10px] opacity-0 transition-opacity transition-transform duration-[160ms] ease-in-out gap-2 group-hover:opacity-100"
          >
            Envoyer
            <div class="flex items-center gap-1 text-xs text-[rgb(100,116,145)]">
              Raccourci
              <svgoIconSortcutEnter class="w-[11px] h-[10px]" fill="#647491" />
            </div>
          </span>
                         <svgoIconSend class="w-[20px] h-[21px]" :style="{ fill:primaryColor }" />
                    </button>
               </div>
          </div>
          <div class="h-[30px] relative">
               <div>
                    <a
                         href="https://hellohumans.fr"
                         target="_blank"
                         class="mr-0 float-right flex no-underline text-[#bfc3cb] text-xs font-normal uppercase ltr text-[11px]"
                    >
                         Propulsé par HelloHumans
                    </a>
               </div>
          </div>
     </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const emits = defineEmits(['update:currentMessage', 'sendMessage']);

const props = defineProps<{
     currentMessage: string;
     primaryColor: string;
}>();

// On crée un modèle local pour pouvoir utiliser v-model
const modelValue = ref(props.currentMessage);

// On synchronise la prop "currentMessage" et la valeur locale
watch(
     () => props.currentMessage,
     (newVal) => {
          if (newVal !== modelValue.value) {
               modelValue.value = newVal;
          }
     }
);

// Mise à jour de la prop parent dès que modelValue change
watch(modelValue, (val) => {
     emits('update:currentMessage', val);
});

// Permet d'envoyer le message si l'utilisateur appuie sur Enter
function onEnter() {
     if (modelValue.value.trim() !== '') {
          emits('sendMessage');
     }
}
</script>
