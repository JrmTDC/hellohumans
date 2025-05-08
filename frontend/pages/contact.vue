<template>
     <div class="p-8 max-w-3xl mx-auto space-y-8">
          <!-- Titre -->
          <h1 class="text-3xl font-semibold">Nous contacter</h1>
          <p class="text-gray-700">
               Vous avez une question, une suggestion ou besoin d’assistance ? Remplissez le formulaire ci-dessous ou choisissez l’une des ressources utiles.
          </p>

          <!-- Ressources utiles -->
          <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
               <a class="block p-4 bg-indigo-50 border border-indigo-200 rounded">
                    <h2 class="font-medium mb-1">Assistance téléphonique</h2>
                    <p>+33 1 23 45 67 89 (lun–ven, 9h–18h)</p>
               </a>
          </section>

          <!-- Formulaire de contact -->
          <section>
               <h2 class="text-2xl font-semibold mb-4">Envoyer un message</h2>
               <form @submit.prevent="onSubmit" class="space-y-4">
                    <div>
                         <label class="block font-medium mb-1">Nom</label>
                         <input
                              v-model="name"
                              type="text"
                              required
                              placeholder="Votre nom"
                              class="w-full border rounded px-3 py-2 focus:outline-blue-500"
                         />
                    </div>
                    <div>
                         <label class="block font-medium mb-1">Email</label>
                         <input
                              v-model="email"
                              type="email"
                              required
                              placeholder="Votre email"
                              class="w-full border rounded px-3 py-2 focus:outline-blue-500"
                         />
                    </div>
                    <div>
                         <label class="block font-medium mb-1">Sujet</label>
                         <input
                              v-model="subject"
                              type="text"
                              required
                              placeholder="Objet de votre message"
                              class="w-full border rounded px-3 py-2 focus:outline-blue-500"
                         />
                    </div>
                    <div>
                         <label class="block font-medium mb-1">Message</label>
                         <textarea
                              v-model="message"
                              rows="5"
                              required
                              placeholder="Décrivez votre demande"
                              class="w-full border rounded px-3 py-2 focus:outline-blue-500"
                         ></textarea>
                    </div>

                    <div class="text-right">
                         <button
                              type="submit"
                              :disabled="submitting"
                              class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                         >
                              {{ submitting ? 'Envoi…' : 'Envoyer' }}
                         </button>
                    </div>
               </form>
          </section>

          <!-- Informations complémentaires -->
          <section class="text-gray-600 text-sm space-y-2">
               <p><strong>Adresse :</strong> 123 Rue de l’Innovation, 75000 Paris</p>
               <p><strong>Support :</strong> <a href="mailto:support@hellohumans.com">support@hellohumans.com</a></p>
               <p><strong>Urgence :</strong> Pour toute urgence, appelez-nous au <a href="tel:+33123456789">+33 1 23 45 67 89</a>.</p>
          </section>
     </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePanelApi } from '~/composables/usePanelApi'
import { useI18n } from 'vue-i18n'
import { usePanelPageMeta } from '~/composables/usePanelPageMeta'

const { t } = useI18n()
const { apiFetch } = usePanelApi()

const name = ref('')
const email = ref('')
const subject = ref('')
const message = ref('')
const screenshot = ref<File|null>(null)
const submitting = ref(false)

function onFileChange(e: Event) {
     screenshot.value = (e.target as HTMLInputElement).files?.[0] ?? null
}

async function onSubmit() {
     if (!name.value || !email.value || !subject.value || !message.value) return
     submitting.value = true

     const form = new FormData()
     form.append('name', name.value)
     form.append('email', email.value)
     form.append('subject', subject.value)
     form.append('message', message.value)
     if (screenshot.value) {
          form.append('screenshot', screenshot.value)
     }

     try {
          await apiFetch('/contact', {
               method: 'POST',
               body: form,
          })
          // Optionnel : afficher un toast de succès
          name.value = email.value = subject.value = message.value = ''
          screenshot.value = null
     } catch {
          // Gérer l’erreur (toast, console, etc.)
     } finally {
          submitting.value = false
     }
}

</script>
