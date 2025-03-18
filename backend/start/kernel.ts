import router from '@adonisjs/core/services/router'
import server from '@adonisjs/core/services/server'

server.errorHandler(() => import('#exceptions/handler'))

server.use([
     () => import('#middleware/force_json_response_middleware'),
     () => import('@adonisjs/cors/cors_middleware'),
     () => import('#middleware/format_response_middleware'),
])

router.use([
     () => import('@adonisjs/core/bodyparser_middleware'),
])

export const middleware = router.named({
     security: () => import('#middleware/security_middleware'),
})
