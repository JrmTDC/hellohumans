import router from '@adonisjs/core/services/router'
// Chat
import ChatProjectController from '#controllers/Chat/ProjectController'
import ChatClientController from '#controllers/Chat/ClientController'
import ChatVisitorController from '#controllers/Chat/VisitorController'
import ChatMessageController from '#controllers/Chat/MessageController'
// Panel
import AuthController from '#controllers/Panel/AuthController'
import UpgradeController from '#controllers/Panel/UpgradeController'
import UsageController from '#controllers/Panel/UsageController'
import ClientController from '#controllers/Panel/ClientController'
import ProjectController from '#controllers/Panel/ProjectController'
import UserController from '#controllers/Panel/UserController'
import OnboardingController from '#controllers/Panel/OnboardingController'
import SupportController from '#controllers/Panel/SupportController'
import SubscriptionController from '#controllers/Panel/SubscriptionController'
import StripeController from "#controllers/Panel/StripeController";
import { middleware } from '#start/kernel'

// Routes de chat
router.group(() => {
     router.get('/client', (ctx) => ChatClientController.show(ctx))
     router.get('/project', (ctx) => ChatProjectController.show(ctx))
     router.get('/visitor', (ctx) => ChatVisitorController.getVisitor(ctx))
     router.post('/visitor', (ctx) => ChatVisitorController.createVisitor(ctx))
     router.post('/message', (ctx) => ChatMessageController.sendMessage(ctx))
})
     .prefix('/chat')
     .use(middleware.chat_access())

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
     router.post('/switch-client/:uuid', (ctx) => ClientController.switchClient(ctx))
     router.post('/lang', (ctx) => UserController.updateLang(ctx))
     router.get('/onboarding/activities', (ctx) => OnboardingController.getActivities(ctx))
     router.post('/onboarding', (ctx) => OnboardingController.create(ctx))
     router.post('/report-issue', (ctx) => SupportController.reportIssue(ctx))
})
     .prefix('/panel')
     .use(middleware.panel_access())

// Routes Stripe protégées par l'authentification
router.group(() => {
     router.get('/setup-intent', (ctx) => StripeController.createSetupIntent(ctx))
     router.get('/payment-methods', (ctx) => StripeController.paymentMethods(ctx))
     router.post('/preview-upgrade', (ctx) => StripeController.previewUpgrade(ctx))
     router.post('/confirm-upgrade', (ctx) => SubscriptionController.confirmUpgrade(ctx))
     //router.get('/cancel-subscription', (ctx) => StripeController.cancel(ctx))
})
     .prefix('/panel/stripe')
     .use(middleware.panel_access())

// Routes Stripe sans authentification
router.group(() => {
     //router.post('/stripe', (ctx) => StripeWebhookController.handle(ctx))
})
     .prefix('/panel/webhook')
