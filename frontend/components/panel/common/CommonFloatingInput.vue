<template>
     <div
          class="hhcss_1iwez1q text-[16px] leading-[20px] w-full text-left text-[#647491] relative mb-[-4px] group"
     >
          <label
               class="flex flex-col relative font-normal max-w-full"
               :class="{
        'text-[#0566ff]': isFocused,
        'text-[#e81332]': showError && !isFocused,
        'text-[#647491]': !isFocused && !showError,
      }"
          >
               <input
                    v-model="modelValueProxy"
                    type="text"
                    :placeholder="focused || modelValue ? '' : placeholder"
                    @focus="onFocus"
                    @blur="onBlur"
                    class="w-full h-[51px] text-[#080f1a] border-2 rounded-[8px] px-[14px] py-[16px] outline-none"
                    :class="{
          'border-[#0566ff]': isFocused,
          'border-[#e81332]': showError && !isFocused,
          'border-[#d3dbe5]': !isFocused && !showError,
        }"
               />
               <span
                    class="text-[12px] leading-[16px] px-[8px] pb-[2px] ml-[8px] bg-white absolute top-0 transition-all duration-[150ms] rounded-[4px]"
                    :class="[
          {
            'translate-y-[-7px]': isFocused || modelValue,
            'translate-y-[15px] text-[16px]': !modelValue && !isFocused,
            'text-[#0566ff]': isFocused,
            'text-[#e81332]': showError && !isFocused,
            'text-[#647491]': !isFocused && !showError,
          }
        ]"
               >
        {{ label }}
      </span>
          </label>

          <span v-if="!showError && hint" class="text-[12px] text-[#647491] pt-[4px] pl-[14px] block">
      {{ hint }}
    </span>
          <span v-if="showError" class="text-[12px] pt-[4px] pl-[14px] block text-[#e81332]">
      {{ errorText }}
    </span>
     </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps({
     modelValue: String,
     label: String,
     hint: String,
     errorText: {
          type: String,
          default: 'Champ invalide.'
     },
     validator: Function
})

const emit = defineEmits(['update:modelValue'])
const isFocused = ref(false)
const showError = ref(false)

const onFocus = () => {
     isFocused.value = true
     showError.value = false
}

const onBlur = () => {
     isFocused.value = false
     if (props.validator && props.modelValue) {
          showError.value = !props.validator(props.modelValue)
     }
}

const modelValueProxy = computed({
     get() {
          return props.modelValue
     },
     set(val) {
          emit('update:modelValue', val)
     }
})
</script>
