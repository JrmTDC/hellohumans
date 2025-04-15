<template>
     <PanelModalBase title="Modifier le mot de passe" @close="emit('close')">
          <form @submit.prevent="submit" class="w-full">
               <!-- Mot de passe actuel -->
               <div class="mb-4">
                    <label class="block text-[#647491] text-sm mb-1">Mot de passe actuel</label>
                    <input
                         v-model="currentPassword"
                         type="password"
                         class="hh-input"
                         :class="{ 'border-[#e81332]': errors.currentPassword }"
                    />
                    <p v-if="errors.currentPassword" class="text-[#e81332] text-sm mt-1">Champ requis</p>
               </div>

               <!-- Nouveau mot de passe -->
               <div class="mb-4">
                    <label class="block text-[#647491] text-sm mb-1">Nouveau mot de passe</label>
                    <input
                         v-model="newPassword"
                         type="password"
                         class="hh-input"
                         :class="{ 'border-[#e81332]': errors.newPassword }"
                    />
                    <p v-if="errors.newPassword" class="text-[#e81332] text-sm mt-1">Champ requis</p>
               </div>

               <!-- Confirmation -->
               <div class="mb-4">
                    <label class="block text-[#647491] text-sm mb-1">Confirmer le nouveau mot de passe</label>
                    <input
                         v-model="confirmPassword"
                         type="password"
                         class="hh-input"
                         :class="{ 'border-[#e81332]': errors.confirmPassword }"
                    />
                    <p v-if="errors.confirmPassword" class="text-[#e81332] text-sm mt-1">Les mots de passe ne correspondent pas</p>
               </div>

               <div class="pt-4 flex justify-end">
                    <button type="submit" class="btn btn-new btn-size-xl btn-primary">Modifier</button>
               </div>
          </form>
     </PanelModalBase>
</template>

<script setup lang="ts">
const emit = defineEmits(['close'])

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
