<template>
     <baseModal title="Nouveau projet" @close="emit('close')">
          <form @submit.prevent="submit">
               <floatingInput
                    v-model="url"
                    label="URL de votre site"
                    hint="par exemple, monsiteweb.com"
                    :error-text="'Cette URL est invalide.'"
                    :validator="isValidUrl"
               />

               <div class="flex justify-center pt-[20px]">
                    <button type="submit" class="rounded-[8px] text-[18px] h-[46px] px-[20px] bg-[#0566ff] text-white hover:bg-[#0049bd]">
                         Ajouter un projet
                    </button>
               </div>
          </form>
     </baseModal>
</template>

<script setup lang="ts">
import baseModal from '~/components/panel/modal/baseModal.vue'
import floatingInput from '~/components/panel/common/floatingInput.vue'
import { ref } from 'vue'

const emit = defineEmits(['close', 'create'])

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
