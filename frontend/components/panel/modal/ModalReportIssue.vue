<template>
     <PanelModalBase :title="t('panel.components.modal.reportIssue.title')" @close="handleClose">
          <div class="w-full">
               <form @submit.prevent="onSubmit" class="space-y-4">

                    <!-- Type de problème -->
                    <div>
                         <label class="block mb-1 font-medium">{{ t('panel.components.modal.reportIssue.typeLabel') }}</label>
                         <select
                              v-model="type"
                              required
                              class="w-full border rounded px-3 py-2 focus:outline-blue-500"
                         >
                              <option disabled value="">{{ t('panel.components.modal.reportIssue.selectPlaceholder') }}</option>
                              <option value="bug">{{ t('panel.components.modal.reportIssue.options.bug') }}</option>
                              <option value="suggestion">{{ t('panel.components.modal.reportIssue.options.suggestion') }}</option>
                              <option value="other">{{ t('panel.components.modal.reportIssue.options.other') }}</option>
                         </select>
                    </div>

                    <!-- Description -->
                    <div>
                         <label class="block mb-1 font-medium">{{ t('panel.components.modal.reportIssue.descriptionLabel') }}</label>
                         <textarea
                              v-model="description"
                              required
                              rows="4"
                              class="w-full border rounded px-3 py-2 focus:outline-blue-500"
                         />
                    </div>

                    <!-- Bouton Envoyer -->
                    <div class="text-center">
                         <button
                              type="submit"
                              :disabled="submitting"
                              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                              {{ submitting ? t('panel.components.modal.reportIssue.sending') : t('panel.components.modal.reportIssue.sendButton') }}
                         </button>
                    </div>
               </form>
          </div>
     </PanelModalBase>
</template>

<script setup lang="ts">
const { t } = useI18n()
import { ref } from 'vue'
import { usePanelApi } from '~/composables/usePanelApi'

const emit = defineEmits<{
     (e: 'close'): void
     (e: 'submitted'): void
}>()

const description = ref('')
const type = ref<'bug'|'suggestion'|'autre'>('')
const file = ref<File|null>(null)
const submitting = ref(false)

function onFileChange(e: Event) {
     file.value = (e.target as HTMLInputElement).files?.[0] ?? null
}
function handleClose() {
     emit('close')
}


async function onSubmit() {
     if (!description.value || !type.value) return
     submitting.value = true
     const { apiFetch } = usePanelApi()
     const form = new FormData()
     form.append('description', description.value)
     form.append('type', type.value)
     if (file.value) form.append('screenshot', file.value)

     try {
          await apiFetch('/support/report-issue', {
               method: 'POST',
               body: form
          })
          emit('submitted')
          emit('close')
     } catch {
          // gérer erreur si besoin
     } finally {
          submitting.value = false
     }
}
</script>
