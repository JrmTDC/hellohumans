<template>
     <div class="relative group w-full" ref="selectContainer">
          <!-- Champ de sélection -->
          <div class="flex justify-between items-center h-[34px] text-[14px] leading-[18px] tracking-[-0.01em] rounded-[8px] outline-none px-[14px] py-[6px] pr-[7px] min-w-0 bg-white cursor-pointer border-2 border-[rgb(211,219,229)] hover:border-[rgb(172,184,203)] transition-colors" @click="toggleDropdown">
               <div class="overflow-hidden text-ellipsis whitespace-nowrap">
                    {{ selectedOption?.label || placeholder }}
               </div>
               <div class="flex items-center">
                    <SvgoPanelHubIconArrowSelect class="min-w-[24px] min-h-[24px] w-[24px] h-[24px] fill-[rgb(8,15,26)] transition-transform duration-200" :class="{ 'rotate-180': isOpen }" />
               </div>
          </div>
          <!-- Liste des options -->
          <Transition enter-active-class="transition duration-100 ease-out" enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
               <div v-if="isOpen" class="absolute z-50 min-w-full mt-1 bg-white rounded-[8px] shadow-lg max-h-[280px] overflow-auto" :class="dropdownClass" :style="{ width: selectWidth + 'px' }">
                    <ul class="p-[8px]">
                         <li v-for="(option, index) in options" :key="index" class="px-[8px] py-[9px] rounded-[4px] cursor-pointer hover:bg-[rgb(220,233,255)] transition-colors" :class="{ 'bg-[rgb(245,247,249)]': isOptionSelected(option) }" @click.stop="selectOption(option)">
                              <slot name="option" :option="option">
                                   <div class="flex flex-col">
                                        <span class="text-[14px] leading-[18px]">{{ option.label }}</span>
                                        <span v-if="option.description" class="text-[12px] text-[rgb(100,116,145)] mt-1">{{ option.description }}</span>
                                   </div>
                              </slot>
                         </li>
                    </ul>
               </div>
          </Transition>
     </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
     modelValue: {
          type: [String, Number, Object],
          default: null
     },
     options: {
          type: Array,
          required: true,
          default: () => []
     },
     placeholder: {
          type: String,
          default: 'Sélectionnez une option'
     },
     dropdownClass: {
          type: String,
          default: ''
     },
     optionKey: {
          type: String,
          default: 'value'
     },
     optionLabel: {
          type: String,
          default: 'label'
     },
     optionDescription: {
          type: String,
          default: 'description'
     }
});

const emit = defineEmits(['update:modelValue', 'change']);

const isOpen = ref(false);
const selectContainer = ref(null);
const selectWidth = ref(0);

// Trouver l'option sélectionnée initiale
const selectedOption = ref(
     props.options.find(option => option[props.optionKey] === props.modelValue) || null
);

// Vérifier si une option est sélectionnée
const isOptionSelected = (option) => {
     return selectedOption.value && selectedOption.value[props.optionKey] === option[props.optionKey];
};

// Basculer le menu déroulant
const toggleDropdown = () => {
     isOpen.value = !isOpen.value;
};

// Sélectionner une option
const selectOption = (option) => {
     selectedOption.value = option;
     emit('update:modelValue', option[props.optionKey]);
     emit('change', option);
     isOpen.value = false;
};

// Fermer le menu quand on clique à l'extérieur
const handleClickOutside = (event) => {
     if (selectContainer.value && !selectContainer.value.contains(event.target)) {
          isOpen.value = false;
     }
};

// Gérer la touche échap
const handleEscape = (event) => {
     if (event.key === 'Escape') {
          isOpen.value = false;
     }
};

// Mettre à jour la largeur du sélecteur
const updateSelectWidth = () => {
     if (selectContainer.value) {
          selectWidth.value = selectContainer.value.offsetWidth;
     }
};

// Ajouter les écouteurs d'événements
onMounted(() => {
     document.addEventListener('click', handleClickOutside);
     document.addEventListener('keydown', handleEscape);
     updateSelectWidth();
     window.addEventListener('resize', updateSelectWidth);
});

// Nettoyer les écouteurs d'événements
onBeforeUnmount(() => {
     document.removeEventListener('click', handleClickOutside);
     document.removeEventListener('keydown', handleEscape);
     window.removeEventListener('resize', updateSelectWidth);
});

// Mettre à jour l'option sélectionnée quand les props changent
watch(() => props.modelValue, (newValue) => {
     selectedOption.value = props.options.find(option => option[props.optionKey] === newValue) || null;
});
</script>
