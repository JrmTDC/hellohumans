import router from '@adonisjs/core/services/router'
import ClientsController from '#controllers/Chat/ClientsController'
import VisitorsController from '#controllers/Chat/VisitorsController'
import MessagesController from '#controllers/Chat/MessagesController'
import AuthController from '#controllers/Panel/AuthController'
import UpgradeController from '#controllers/Panel/UpgradeController'
import UsageController from '#controllers/Panel/UsageController'
import ClientController from '#controllers/Panel/ClientController'
import UserController from '#controllers/Panel/UserController'

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
     router.post('/register', (ctx) => AuthController.register(ctx))
     router.post('/forgot-password', (ctx) => AuthController.forgotPassword(ctx))
})
     .prefix('/panel/auth')

// Routes protégées par l'authentification
router.group(() => {
     router.get('/upgrade/plans', (ctx) => UpgradeController.getPlans(ctx))
     router.get('/upgrade/modules', (ctx) => UpgradeController.getModules(ctx))
     router.get('/user', (ctx) => UserController.getUser(ctx))
     router.get('/client', (ctx) => ClientController.getClient(ctx))
     router.get('/clients', (ctx) => ClientController.getClients(ctx))
     router.get('/project', (ctx) => ClientController.getProject(ctx))
     router.get('/projects', (ctx) => ClientController.getProjects(ctx))
     router.get('/usages', (ctx) => UsageController.index(ctx))
     router.post('/switch-project/:uuid', (ctx) => ClientController.switchProject(ctx))
     router.post('/panel/lang', (ctx) => UserController.updateLang(ctx))
})
     .prefix('/panel')
     .use(middleware.panel_auth())
