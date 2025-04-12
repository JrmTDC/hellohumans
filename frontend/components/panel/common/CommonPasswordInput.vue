<template>
     <div class="relative w-full">
          <!-- Champ de mot de passe -->
          <input
               v-model="password"
               :type="showPassword ? 'text' : 'password'"
               :placeholder="placeholder"
               :class="[
                    extraClassInput,
                    { 'border-[rgb(232,19,50)]': error }
               ]"
               @input="emit('update:modelValue', password)"
               @focus="emit('focus')"
               @blur="emit('blur')"
          />

          <!-- Bouton pour afficher/masquer le mot de passe -->
          <button
               v-if="password.length"
               type="button"
               class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
               @click="togglePasswordVisibility"
          >
               <svgo-panel-icon-eye v-if="!showPassword" :style="{ height: iconSize + 'px', width: iconSize + 'px' }" />
               <svgo-panel-icon-eye-off v-else :style="{ height: iconSize + 'px', width: iconSize + 'px' }" />
          </button>
     </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
     modelValue: String, // Permet la liaison v-model
     placeholder: {
          type: String,
          default: 'Mot de passe',
     },
     error: { // Pour gérer l'affichage des erreurs
          type: Boolean,
          default: false,
     },
     extraClassInput: { // Permet de personnaliser les classes du champ
          type: String,
          default: '',
     },
     iconSize: { // Permet de modifier la taille du SVG
          type: Number,
          default: 24,
     },
});

const emit = defineEmits(['update:modelValue', 'focus', 'blur']);
const password = ref(props.modelValue || ''); // Rend la valeur réactive
const showPassword = ref(false);

const togglePasswordVisibility = () => {
     showPassword.value = !showPassword.value;
};
</script>
