<template>
     <div class="p-8 max-w-4xl mx-auto">
          <h1 class="text-3xl font-semibold mb-6">Aide & Support</h1>

          <!-- Section 1 : FAQ -->
          <section class="mb-12">
               <h2 class="text-xl font-medium mb-2">FAQ</h2>
               <p class="text-gray-700 mb-4">
                    Retrouvez les réponses aux questions les plus fréquentes.
               </p>
               <NuxtLink
                    to="/panel/faq"
                    class="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
               >
                    Consulter la FAQ
               </NuxtLink>
          </section>

          <!-- Section 2 : Documentation -->
          <section class="mb-12">
               <h2 class="text-xl font-medium mb-2">Documentation</h2>
               <p class="text-gray-700 mb-4">
                    Guides pas-à-pas, intégrations et références API.
               </p>
               <a
                    href="https://docs.hellohumans.fr"
                    target="_blank"
                    class="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
               >
                    Voir la documentation
               </a>
          </section>

          <!-- Section 3 : Contacter directement -->
          <section class="mb-12">
               <h2 class="text-xl font-medium mb-2">Nous contacter</h2>
               <p class="text-gray-700 mb-4">
                    Si vous ne trouvez pas de réponse ci-dessus, ouvrez un ticket ou discutez en direct.
               </p>
               <div class="flex gap-4">
                    <button
                         @click="$emit('open-report-modal')"
                         class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                    >
                         Signaler un problème
                    </button>
                    <a
                         href="mailto:support@hellohumans.com"
                         class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                         Envoyer un email
                    </a>
                    <NuxtLink
                         to="/panel/chat-support"
                         class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                         Chat en ligne
                    </NuxtLink>
               </div>
          </section>
     </div>
</template>
<script setup lang="ts">

</script>
