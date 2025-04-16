<template>
     <PanelModalBase title="t('panel.components.modal.createProject.title')" @close="emit('close')">
          <form @submit.prevent="submit">
               <PanelCommonFloatingInput
                    v-model="url"
                    label="t('panel.components.modal.createProject.label')"
                    hint="t('panel.components.modal.createProject.hint')"
                    :error-text="t('panel.components.modal.createProject.error')"
                    :validator="isValidUrl"
               />

               <div class="flex justify-center pt-[20px]">
                    <button type="submit" class="rounded-[8px] text-[18px] h-[46px] px-[20px] bg-[#0566ff] text-white hover:bg-[#0049bd]">
                         {{ t('panel.components.modal.createProject.submit') }}
                    </button>
               </div>
          </form>
     </PanelModalBase>
</template>

<script setup lang="ts">
const emit = defineEmits(['close', 'create'])
const { t } = useI18n()

const url = ref('')
const isValidUrl = (val: string) => {
     const pattern = /^(https?:\/\/)?([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,}(\/.*)?$/
     return pattern.test(val)
}

const submit = () => {
     if (!isValidUrl(url.value)) return
     emit('create', url.value)
     emit('close')
}
</script>
