import router from '@adonisjs/core/services/router'
import ClientsController from '#controllers/Chat/ClientsController'
import VisitorsController from '#controllers/Chat/VisitorsController'
import MessagesController from '#controllers/Chat/MessagesController'
import AuthController from '#controllers/Panel/AuthController'
import UpgradeController from '#controllers/Panel/UpgradeController'
import UsageController from '#controllers/Panel/UsageController'
import ClientController from '#controllers/Panel/ClientController'

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
     router.get('/upgrade/plans', (ctx) => UpgradeController.getPlans(ctx))
     router.get('/upgrade/modules', (ctx) => UpgradeController.getModules(ctx))
     router.get('/client', (ctx) => ClientController.client(ctx))
     router.get('/projects', (ctx) => ClientController.projects(ctx))
     router.get('/usage', (ctx) => UsageController.index(ctx))
})
     .prefix('/panel')
     .use(middleware.panel_auth())
