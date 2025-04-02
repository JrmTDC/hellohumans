export default defineNuxtRouteMiddleware((to) => {
     if (import.meta.client && to.path.startsWith('/panel') && !['/panel/login', '/panel/register'].includes(to.path)) {
          const token = localStorage.getItem('panel_token')
          if (!token) {
               return navigateTo('/panel/login')
          }
     }
})
