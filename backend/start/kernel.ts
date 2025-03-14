// start/kernel.ts
import router from '@adonisjs/core/services/router'
import server from '@adonisjs/core/services/server'

/**
 * The error handler is used to convert an exception
 * to a HTTP response.
 */
server.errorHandler(() => import('#exceptions/handler'))

/**
 * The server middleware stack runs on all HTTP requests.
 */
server.use([
     // Middleware pour forcer les réponses JSON
     () => import('#middleware/force_json_response_middleware'),

     // CORS
     () => import('@adonisjs/cors/cors_middleware'),

     // FormatResponseMiddleware
     () => import('#middleware/format_response_middleware'),
])

/**
 * Le middleware du router (s’exécute sur les routes existantes).
 */
router.use([
     // BodyParser pour JSON / form data
     () => import('@adonisjs/core/bodyparser_middleware'),
])

/**
 * Named middleware accessible via router.group().middleware('security')
 */
export const middleware = router.named({
     security: () => import('#middleware/security_middleware'),
})


