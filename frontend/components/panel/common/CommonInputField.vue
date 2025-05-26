<template>
     <div class="flex flex-col gap-[12px] justify-start items-start" :class="[' xl:flex-row']">
          <div v-if="label || helperText" class="pt-0 flex-[0_0_100%] min-w-[145px] max-w-full xl:flex-[1_0_175px] xl:max-w-[min(180px,12vw)] text-[14px]">
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
                    <input :type="type" :value="modelValue" :placeholder="placeholder" :disabled="disabled" :class="['block w-full border-solid border-2','rounded-[8px] outline-none text-[14px] leading-[18px] tracking-[-0.01em]','px-[14px] h-[34px]',disabled ? 'border-[rgb(226,232,239)] text-[rgb(100,116,145)] bg-[rgb(239,242,246)]' : 'border-[rgb(211,219,229)] text-[rgb(8,15,26)]',error ? 'border-red-500' : '']" v-bind="$attrs" @input="onInput">
                    <!-- Icône de droite -->
                    <div v-if="$slots.rightIcon" class="absolute inset-y-0 right-0 flex items-center pr-3">
                         <slot name="rightIcon" />
                    </div>
                    <!-- Icône gauche -->
                    <div v-if="$slots.leftIcon" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                         <slot name="leftIcon" />
                    </div>
               </div>
               <!-- Message d'erreur -->
               <p v-if="error" class="mt-1 text-[12px] leading-[16px] text-red-600">{{ error }}</p>
          </div>
     </div>
</template>
<script setup lang="ts">
const props = defineProps({
     modelValue: {
          type: [String, Number],
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
     type: {
          type: String,
          default: 'text',
          validator: (value: string) =>
          ['text', 'email', 'password', 'number', 'tel', 'url', 'search'].includes(value)
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
     }
});

const emit = defineEmits(['update:modelValue']);
const onInput = (event: Event) => {
     const target = event.target as HTMLInputElement;
     emit('update:modelValue', target.value);
};
</script>
