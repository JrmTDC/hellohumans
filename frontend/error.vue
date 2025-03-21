<template>
     <component :is="errorComponent" />
</template>

<script setup>
import { computed } from 'vue'
import { useError } from '#imports'

// Import des composants d’erreur
import Error404 from '~/pages/error/404.vue'
import Error403 from '~/pages/error/403.vue'
import Error500 from '~/pages/error/500.vue'
import ErrorDefault from '~/pages/error/default.vue' // si vous voulez gérer un fallback

// Récupérer l'erreur levée
const error = useError()

// Choix du composant selon le code d'erreur
const errorComponent = computed(() => {
     const code = error.value?.statusCode

     if (code === 404) return Error404
     if (code === 403) return Error403
     if (code === 500) return Error500
     // Fallback pour d'autres codes
     return ErrorDefault
})
</script>
