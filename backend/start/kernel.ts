import router from '@adonisjs/core/services/router'
import server from '@adonisjs/core/services/server'

server.errorHandler(() => import('#exceptions/handler'))

server.use([
  () => import('#middleware/container_bindings_middleware'),  // Liaison des classes au conteneur IoC
  () => import('#middleware/format_response_middleware'),    // Formatage uniforme des réponses API
  () => import('#middleware/force_json_response_middleware'),// Forcer les réponses JSON
  () => import('@adonisjs/cors/cors_middleware'),            // Gestion du CORS
])

router.use([() => import('@adonisjs/core/bodyparser_middleware'), () => import('#middleware/detect_user_locale_middleware')])

export const middleware = router.named({
  chat_security: () => import('#middleware/chat_security_middleware'),
  panel_auth: () => import('#middleware/panel_auth_middleware'),
})
