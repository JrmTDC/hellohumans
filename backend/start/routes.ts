import router from '@adonisjs/core/services/router'
import ClientsController from '#controllers/Chat/ClientsController'
import VisitorsController from '#controllers/Chat/VisitorsController'
import MessagesController from '#controllers/Chat/MessagesController'
import AuthController from '#controllers/Panel/AuthController'
import UpgradeController from '#controllers/Panel/UpgradeController'

import { middleware } from '#start/kernel'

// Routes de chat
router.group(() => {
     router.get('/clients', (ctx) => ClientsController.show(ctx))
     router.post('/visitors', (ctx) => VisitorsController.store(ctx))
     router.post('/messages', (ctx) => MessagesController.sendMessage(ctx))
})
     .prefix('/chat')
     .use(middleware.chat_security())

// Routes d'authentification et de gestion du mot de passe
router.group(() => {
     router.post('/login', (ctx) => AuthController.login(ctx))
     router.get('/verify', (ctx) => AuthController.verify(ctx))
     router.post('/register', (ctx) => AuthController.register(ctx))
     router.post('/forgot-password', (ctx) => AuthController.forgotPassword(ctx))
     router.post('/reset-password', (ctx) => AuthController.resetPassword(ctx))
     router.post('/change-password', (ctx) => AuthController.changePassword(ctx))
})
     .prefix('/panel/auth')

// Routes protégées par l'authentification
router.group(() => {
     router.get('/projects', async (ctx) => {
          if (!ctx.auth || !ctx.auth.user) {
               return ctx.response.unauthorized({
                    error: { name: 'unauthorized', description: 'Utilisateur non authentifié' }
               })
          }

          return {
               message: 'Liste des projets',
               user: ctx.auth.user, // Maintenant TypeScript ne renverra plus d'erreur
          }
     })
     router.get('/upgrade/offers', (ctx) => UpgradeController.getOffers(ctx))
     router.get('/upgrade/modules', (ctx) => UpgradeController.getModules(ctx))
})
     .prefix('/panel')
     .use(middleware.panel_auth())
