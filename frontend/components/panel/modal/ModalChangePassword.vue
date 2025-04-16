<template>
     <PanelModalBase title="t('panel.components.modal.changePassword.title')" @close="emit('close')">
          <form @submit.prevent="submit" class="w-full">
               <!-- Mot de passe actuel -->
               <div class="mb-4">
                    <label class="block text-[#647491] text-sm mb-1">{{ t('panel.components.modal.changePassword.current') }}</label>
                    <input
                         v-model="currentPassword"
                         type="password"
                         class="hh-input"
                         :class="{ 'border-[#e81332]': errors.currentPassword }"
                    />
                    <p v-if="errors.currentPassword" class="text-[#e81332] text-sm mt-1">{{ t('panel.components.modal.changePassword.required') }}</p>
               </div>

               <!-- Nouveau mot de passe -->
               <div class="mb-4">
                    <label class="block text-[#647491] text-sm mb-1">{{ t('panel.components.modal.changePassword.new') }}</label>
                    <input
                         v-model="newPassword"
                         type="password"
                         class="hh-input"
                         :class="{ 'border-[#e81332]': errors.newPassword }"
                    />
                    <p v-if="errors.newPassword" class="text-[#e81332] text-sm mt-1">{{ t('panel.components.modal.changePassword.required') }}</p>
               </div>

               <!-- Confirmation -->
               <div class="mb-4">
                    <label class="block text-[#647491] text-sm mb-1"> {{ t('panel.components.modal.changePassword.confirm') }}</label>
                    <input
                         v-model="confirmPassword"
                         type="password"
                         class="hh-input"
                         :class="{ 'border-[#e81332]': errors.confirmPassword }"
                    />
                    <p v-if="errors.confirmPassword" class="text-[#e81332] text-sm mt-1">{{ t('panel.components.modal.changePassword.mismatch') }}</p>
               </div>

               <div class="pt-4 flex justify-end">
                    <button type="submit" class="btn btn-new btn-size-xl btn-primary">{{ t('panel.components.modal.changePassword.submit') }}</button>
               </div>
          </form>
     </PanelModalBase>
</template>

<script setup lang="ts">
const emit = defineEmits(['close'])

const { t } = useI18n()
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const errors = ref({
     currentPassword: false,
     newPassword: false,
     confirmPassword: false,
})

const panelStore = usePanelStore()

const submit = async () => {
     errors.value = {
          currentPassword: !currentPassword.value,
          newPassword: !newPassword.value,
          confirmPassword: newPassword.value !== confirmPassword.value,
     }

     if (Object.values(errors.value).some(Boolean)) return

     const success = await panelStore.updatePassword(currentPassword.value, newPassword.value)
     if (success) emit('close')
}
</script>
