<template>
     <div class="relative w-full">
          <fieldset>
               <!-- Checkbox -->
               <fieldset
                    v-if="props.type === 'checkbox'"
                    class="mb-[16px] flex flex-col items-start w-full max-w-[370px]">
                    <label class="flex items-start text-[14px] leading-[18px] tracking-[-0.01em] cursor-pointer">
                         <span>
                              <input
                                   type="checkbox"
                                   v-model="inputValue"
                                   class="sr-only peer"
                                   @change="emit('update:modelValue', inputValue)"
                              />
                              <span
                                   class="float-left block w-[20px] h-[20px] rounded-[3px] border-[2px] border-[rgb(226,232,239)] cursor-pointer mr-[14px] mb-[16px] translate-y-[1px] transition-all duration-100 ease-in-out peer-checked:bg-[rgb(5,102,255)] peer-checked:border-[rgb(5,102,255)] peer-checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNMTg2LjMwMSAzMzkuODkzTDk2IDI0OS40NjFsLTMyIDMwLjUwN0wxODYuMzAxIDQwMiA0NDggMTQwLjUwNiA0MTYgMTEweiIvPjwvc3ZnPg==')] peer-checked:bg-center peer-checked:bg-no-repeat peer-checked:bg-[length:16px_16px]"
                                   :class="[extraClassInput, { 'border-[rgb(232,19,50)]': shouldShowError}]"
                              ></span>
                         </span>
                         <span class="mt-0 mb-0 leading-[18px] text-[#647491]">
                              <slot name="label"></slot>
                         </span>
                    </label>
                    <Transition name="slide-fade" appear>
                         <span
                              v-if="shouldShowError"
                              class="_inputError text-[rgb(232,19,50)] inline-flex text-[12px] font-medium leading-normal tracking-[-0.09px] items-center pl-[2px]"
                         >
                              {{ errorText }}
                         </span>
                    </Transition>
               </fieldset>

               <!-- Input text/password/email/url -->
               <fieldset v-else>
                    <fieldset class="relative border-0 p-0 m-0 mb-[16px] flex flex-col items-center">
                         <input
                              v-model="inputValue"
                              :type="inputType"
                              :placeholder="placeholder"
                              :class="[extraClassInput, { 'border-[rgb(232,19,50)]': shouldShowError}]"
                              :autocomplete="isPasswordType ? 'new-password' : 'off'"
                              autocorrect="off"
                              autocapitalize="off"
                              spellcheck="false"
                              @focus="handleFocus"
                              @blur="handleBlur"
                              @input="handleInput"
                         />

                         <!-- Bouton mot de passe -->
                         <button
                              v-if="isPasswordType && inputString.length > 0"
                              type="button"
                              class="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-500"
                              @click="togglePasswordVisibility"
                         >
                              <svgo-panel-icon-eye
                                   v-if="!showPassword"
                                   :style="{ height: iconSize + 'px', width: iconSize + 'px' }"
                              />
                              <svgo-panel-icon-eye-off
                                   v-else
                                   :style="{ height: iconSize + 'px', width: iconSize + 'px' }"
                              />
                         </button>
                    </fieldset>

                    <!-- Barre de force & message d'erreur -->
                    <fieldset>
                         <Transition name="slide-fade" mode="out-in" appear>
                              <div
                                   v-if="enableStrengthEvaluation && isPasswordType && focused"
                                   key="strength"
                                   class="relative translate-y-[-8px] pl-[4px] mb-[8px]"
                              >
                                   <div class="flex items-center">
                                        <div class="w-[100px] h-[4px] rounded-[3.5px] bg-[#eff2f6] inline-block mr-[12px]">
                                             <div
                                                  class="block h-[4px] rounded-[3.5px]"
                                                  :style="{ width: progressWidth, backgroundColor: progressColor }"
                                             ></div>
                                        </div>
                                        <span
                                             class="text-[12px] font-medium leading-normal tracking-[-0.09px] text-[rgb(135,150,175)]"
                                        >{{ passwordStrength }}</span>
                                   </div>
                              </div>

                              <div
                                   v-else-if="shouldShowError && !focused"
                                   key="error"
                                   class="relative translate-y-[-8px] pl-[4px] mb-[8px]"
                              >
                                   <span
                                        class="_inputError text-[rgb(232,19,50)] inline-flex pl-[2px] text-[12px] font-medium leading-normal tracking-[-0.09px] items-center"
                                   >{{ errorText }}</span>
                              </div>
                         </Transition>
                    </fieldset>
               </fieldset>
          </fieldset>
     </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, defineExpose } from 'vue'
import { Transition } from 'vue'

const { t } = useI18n()

const props = defineProps({
     modelValue: [String, Boolean],
     type: {
          type: String,
          default: 'text', // text, password, email, url, checkbox
     },
     placeholder: String,
     iconSize: { type: Number, default: 24 },
     extraClassInput: String,
     validator: Function,
     errorText: { type: String, default: 'panel.components.common.staticInput.placeholder' },
     enableStrengthEvaluation: Boolean,
     labelText: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

const inputValue = ref(props.modelValue) as Ref<string | boolean | undefined>

const showPassword = ref(false)
const focused = ref(false)
const touched = ref(false)

const passwordStrength = ref('')
const progressWidth = ref('0%')
const progressColor = ref('rgb(226,232,239)')

const isPasswordType = computed(() =>
     ['password', 'confirm-password'].includes(props.type)
)

const inputType = computed(() => {
     if (isPasswordType.value) {
          return showPassword.value ? 'text' : 'password'
     }
     return props.type
})

const inputString = computed(() =>
     typeof inputValue.value === 'string' ? inputValue.value : ''
)

const defaultEmailValidator = (val: string) =>
     /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)

const defaultUrlValidator = (val: string) => {
     try {
          new URL(val)
          return true
     } catch {
          return false
     }
}

const getIsValid = (val: any): boolean => {
     if (props.validator) return props.validator(val)
     if (props.type === 'email') return defaultEmailValidator(val)
     if (props.type === 'url') return defaultUrlValidator(val)
     if (props.type === 'checkbox') return Boolean(val)
     return true
}

const shouldShowError = computed(() => {
     return touched.value && !getIsValid(inputValue.value)
})

const handleFocus = () => {
     focused.value = true
     if (props.enableStrengthEvaluation && isPasswordType.value) {
          evaluatePasswordStrength()
     }
}

const handleBlur = () => {
     focused.value = false
     touched.value = true
}

const handleInput = () => {
     emit('update:modelValue', inputValue.value)
     if (touched.value) shouldShowError.value
     if (props.enableStrengthEvaluation && focused.value && isPasswordType.value) {
          evaluatePasswordStrength()
     }
}

const togglePasswordVisibility = () => {
     showPassword.value = !showPassword.value
}

const evaluatePasswordStrength = () => {
     const pass = inputString.value

     if (!props.enableStrengthEvaluation || !focused.value || !isPasswordType.value) {
          passwordStrength.value = ''
          progressWidth.value = '0%'
          progressColor.value = 'rgb(226,232,239)'
          return
     }

     if (pass.length === 0) {
          passwordStrength.value = t('panel.components.common.staticInput.strengthLabel')
          progressWidth.value = '0%'
          progressColor.value = 'rgb(226,232,239)'
     } else if (pass.length <= 4) {
          passwordStrength.value = t('panel.components.common.staticInput.veryWeak')
          progressWidth.value = '20%'
          progressColor.value = 'rgb(246, 48, 62)'
     } else if (pass.length <= 7) {
          passwordStrength.value = t('panel.components.common.staticInput.weak')
          progressWidth.value = '40%'
          progressColor.value = 'rgb(246, 135, 48)'
     } else if (pass.length <= 9) {
          passwordStrength.value = t('panel.components.common.staticInput.medium')
          progressWidth.value = '60%'
          progressColor.value = 'rgb(255, 200, 89)'
     } else if (pass.length <= 13) {
          passwordStrength.value = t('panel.components.common.staticInput.strong')
          progressWidth.value = '80%'
          progressColor.value = 'rgb(52, 184, 87)'
     } else {
          passwordStrength.value = t('panel.components.common.staticInput.veryStrong')
          progressWidth.value = '100%'
          progressColor.value = 'rgb(52, 184, 87)'
     }
}

watch(() => props.modelValue, val => {
     inputValue.value = val
}, { immediate: true
})

watch(inputValue, () => {
     if (touched.value) shouldShowError.value
})

watch(inputValue, (val) => {
     emit('update:modelValue', val)
})

const validate = () => {
     touched.value = true
     return getIsValid(inputValue.value)
}

defineExpose({ validate })
</script>
