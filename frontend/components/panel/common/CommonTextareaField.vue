<template>
     <div class="flex flex-row justify-start items-start w-full">
          <div class="flex flex-col justify-start items-[normal] flex-[1_0_145px] min-w-[145px] max-w-[min(180px,12vw)]">
               <label v-if="label" class="inline-block font-normal">
                    <div class="flex flex-col justify-start items-[normal]">
                         <p class="font-normal text-[14px] leading-[18px] tracking-[-0.01em]">{{ label }}
                              <span v-if="required" class="text-red-500">*</span>
                         </p>
                         <p v-if="helperText" class="mt-[4px] font-normal text-[12px] leading-[16px] tracking-[-0.01em] text-[rgb(100,116,145)]">{{ helperText }}</p>
                    </div>
               </label>
          </div>
          <div class="flex-[1_1_0%] relative ml-[24px]">
               <div class="relative">
                    <textarea :value="modelValue":placeholder="placeholder" :disabled="disabled" :rows="rows" :class="['resize-none w-full min-h-auto border-solid border-2','rounded-[8px] outline-none text-[14px] leading-[18px] tracking-[-0.01em]','px-[12px] py-[8px]', disabled ? 'border-[rgb(226,232,239)] text-[rgb(100,116,145)] bg-[rgb(239,242,246)]': 'border-[rgb(211,219,229)] text-[rgb(8,15,26)]',error ? 'border-red-500' : '']" v-bind="$attrs" @input="onInput"></textarea>
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
