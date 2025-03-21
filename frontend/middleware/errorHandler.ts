export default defineNuxtRouteMiddleware((to, from) => {
     const error = useError()

     if (error.value) {
          if (error.value.statusCode === 404) {
               return navigateTo('/errors/404')
          }
          if (error.value.statusCode === 500) {
               return navigateTo('/errors/500')
          }
          if (error.value.statusCode === 403) {
               return navigateTo('/errors/403')
          }
     }
})
