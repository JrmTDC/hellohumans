import router from '@adonisjs/core/services/router'
import ClientsController from '#controllers/ClientsController'
import UsersController from '#controllers/UsersController'
import MessagesController from '#controllers/MessagesController'
import SecurityMiddleware from '#middleware/security_middleware'

router.group(() => {
     router.get('/clients', (ctx) => ClientsController.show(ctx))
     router.post('/users', (ctx) => UsersController.store(ctx))
     router.post('/messages', (ctx) => MessagesController.sendMessage(ctx))
})
     .prefix('/api/v1')
     .middleware([
          SecurityMiddleware,
     ])
