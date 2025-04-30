import router from '@adonisjs/core/services/router'
import ClientsController from '#controllers/Chat/ClientsController'
import VisitorsController from '#controllers/Chat/VisitorsController'
import MessagesController from '#controllers/Chat/MessagesController'
import AuthController from '#controllers/Panel/AuthController'
import UpgradeController from '#controllers/Panel/UpgradeController'
import UsageController from '#controllers/Panel/UsageController'
import ClientController from '#controllers/Panel/ClientController'
import ProjectController from '#controllers/Panel/ProjectController'
import UserController from '#controllers/Panel/UserController'
import OnboardingController from '#controllers/Panel/OnboardingController'
import SubscriptionController from '#controllers/Panel/SubscriptionController'
import StripeController from "#controllers/Panel/StripeController";
//import StripeWebhookController from "#controllers/Panel/StripeWebhookController";

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
     router.get('/usages', (ctx) => UsageController.index(ctx))
     router.get('/client', (ctx) => ClientController.getClient(ctx))
     router.get('/clients', (ctx) => ClientController.getClients(ctx))
     router.get('/project', (ctx) => ProjectController.getProject(ctx))
     router.get('/projects', (ctx) => ProjectController.getProjects(ctx))
     router.post('/switch-project/:uuid', (ctx) => ProjectController.switchProject(ctx))
     router.post('/lang', (ctx) => UserController.updateLang(ctx))
     router.get('/onboarding/activities', (ctx) => OnboardingController.getActivities(ctx))
     router.post('/onboarding', (ctx) => OnboardingController.create(ctx))
})
     .prefix('/panel')
     .use(middleware.panel_ensure_user())

// Routes Stripe protégées par l'authentification
router.group(() => {
     router.get('/setup-intent', (ctx) => StripeController.createSetupIntent(ctx))
     router.get('/payment-methods', (ctx) => StripeController.paymentMethods(ctx))
     router.post('/preview-upgrade', (ctx) => StripeController.previewUpgrade(ctx))
     router.post('/confirm-upgrade', (ctx) => SubscriptionController.confirmUpgrade(ctx))
     //router.get('/cancel-subscription', (ctx) => StripeController.cancel(ctx))
     //router.post('/update-subscription', (ctx) => SubscriptionController.update(ctx))
     //router.post('/cancel-subscription', (ctx) => SubscriptionController.cancel(ctx))
     //router.post('/subscription/:project_uuid', (ctx) => SubscriptionController.create(ctx))
})
     .prefix('/panel/stripe')
     .use(middleware.panel_access())

// Routes Stripe sans authentification
router.group(() => {
     //router.post('/stripe', (ctx) => StripeWebhookController.handle(ctx))
})
     .prefix('/panel/webhook')
