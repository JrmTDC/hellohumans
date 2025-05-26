<template>
     <div class="flex flex-col gap-[12px] justify-start items-start" :class="[' xl:flex-row']">
          <div v-if="label || helperText" class="pt-0 flex-[0_0_100%] min-w-[145px] max-w-full xl:pt-[8px] xl:flex-[1_0_175px] xl:max-w-[min(180px,12vw)] text-[14px]">
               <label v-if="label" class="inline-block font-normal">
                    <div class="flex flex-col justify-start items-[normal]">
                         <p class="font-normal text-[14px] leading-[18px] tracking-[-0.01em]">{{ label }}
                              <span v-if="required" class="text-red-500">*</span>
                         </p>
                         <p v-if="helperText" class="mt-[4px] font-normal text-[12px] leading-[16px] tracking-[-0.01em] text-[rgb(100,116,145)]">{{ helperText }}</p>
                    </div>
               </label>
          </div>
          <div class="w-full">
               <div class="relative">
                    <textarea :value="modelValue":placeholder="placeholder" :disabled="disabled" :rows="rows" :class="['resize-none w-full min-h-auto border-solid border-2','rounded-[8px] outline-none text-[14px] leading-[18px] tracking-[-0.01em]','px-[12px] py-[8px] focus:border-[#0566ff] hover:border-[rgb(172,184,203)] ', disabled ? 'border-[rgb(226,232,239)] text-[rgb(100,116,145)] bg-[rgb(239,242,246)]': 'border-[rgb(211,219,229)] text-[rgb(8,15,26)]',error ? 'border-red-500' : '']" v-bind="$attrs" @input="onInput"></textarea>
               </div>
               <!-- Message d'erreur -->
               <p v-if="error" class="mt-1 text-[12px] leading-[16px] text-red-600">{{ error }}</p>
               <!-- Compteur de caractères -->
               <div v-if="showCharacterCount" class="flex justify-end mt-1">
                    <span class="text-[12px] leading-[16px] text-[rgb(100,116,145)]">{{ modelValue?.length || 0 }} / {{ maxLength }}</span>
               </div>
          </div>
     </div>
</template>
<script setup lang="ts">
const props = defineProps({
     modelValue: {
          type: String,
          default: ''
     },
     label: {
          type: String,
          default: ''
     },
     placeholder: {
          type: String,
          default: ''
     },
     rows: {
          type: Number,
          default: 3
     },
     disabled: {
          type: Boolean,
          default: false
     },
     required: {
          type: Boolean,
          default: false
     },
     error: {
          type: String,
          default: ''
     },
     helperText: {
          type: String,
          default: ''
     },
     maxLength: {
          type: Number,
          default: null
     },
     showCharacterCount: {
          type: Boolean,
          default: false
     }
});

const emit = defineEmits(['update:modelValue']);
const onInput = (event: Event) => {
     const target = event.target as HTMLTextAreaElement;
     let value = target.value;
     // Limite de caractères si maxLength est défini
     if (props.maxLength && value.length > props.maxLength) {
          value = value.slice(0, props.maxLength);
     }
     emit('update:modelValue', value);
};
</script>
