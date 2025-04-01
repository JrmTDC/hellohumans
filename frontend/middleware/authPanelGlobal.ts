export default defineNuxtRouteMiddleware((to) => {
     // Ne vérifie que les routes commençant par /panel (sauf /login et /register)
     if (process.client && to.path.startsWith('/panel') && !['/panel/login', '/panel/register'].includes(to.path)) {
          const token = localStorage.getItem('panel_token')
          if (!token) {
               return navigateTo('/panel/login')
          }
     }
})
