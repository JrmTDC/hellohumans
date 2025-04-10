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
     panel_ensure_user: () => import('#middleware/panel_ensure_user_middleware'),
     panel_ensure_client: () => import('#middleware/panel_ensure_client_middleware'),
     panel_ensure_project: () => import('#middleware/panel_ensure_project_middleware')
})
