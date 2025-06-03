import router from '@adonisjs/core/services/router'
// Chat
import ChatProjectController from '#controllers/Chat/ProjectController'
import ChatClientController from '#controllers/Chat/ClientController'
import ChatVisitorController from '#controllers/Chat/VisitorController'
import ChatMessageController from '#controllers/Chat/MessageController'
// Panel
import PanelAuthController from '#controllers/Panel/AuthController'
import PanelUpgradeController from '#controllers/Panel/UpgradeController'
import PanelUsageController from '#controllers/Panel/UsageController'
import PanelProjectController from '#controllers/Panel/ProjectController'
import PanelUserController from '#controllers/Panel/UserController'
import PanelOnboardingController from '#controllers/Panel/OnboardingController'
import PanelSupportController from '#controllers/Panel/SupportController'
import PanelSubscriptionController from '#controllers/Panel/SubscriptionController'
import PanelStripeController from "#controllers/Panel/StripeController";
import PanelChatController from "#controllers/Panel/ChatController";
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
     router.post('/login', (ctx) => PanelAuthController.login(ctx))
     router.post('/register', (ctx) => PanelAuthController.register(ctx))
     router.post('/forgot-password', (ctx) => PanelAuthController.forgotPassword(ctx))
})
     .prefix('/panel/auth')

// Routes protégées par l'authentification
router.group(() => {
     router.get('/upgrade/plans', (ctx) => PanelUpgradeController.getPlans(ctx))
     router.get('/upgrade/modules', (ctx) => PanelUpgradeController.getModules(ctx))
     router.get('/user', (ctx) => PanelUserController.getUser(ctx))
     router.get('/usages', (ctx) => PanelUsageController.index(ctx))
     router.get('/project', (ctx) => PanelProjectController.getProject(ctx))
     router.get('/projects', (ctx) => PanelProjectController.getProjects(ctx))
     router.post('/switch-project/:uuid', (ctx) => PanelProjectController.switchProject(ctx))
     router.post('/lang', (ctx) => PanelUserController.updateLang(ctx))
     router.get('/onboarding/activities', (ctx) => PanelOnboardingController.getActivities(ctx))
     router.post('/onboarding', (ctx) => PanelOnboardingController.create(ctx))
     router.post('/report-issue', (ctx) => PanelSupportController.reportIssue(ctx))
     router.post('/config-chat', (ctx) => PanelChatController.configChat(ctx))
})
     .prefix('/panel')
     .use(middleware.panel_access())

// Routes Stripe protégées par l'authentification
router.group(() => {
     router.get('/setup-intent', (ctx) => PanelStripeController.createSetupIntent(ctx))
     router.get('/payment-methods', (ctx) => PanelStripeController.paymentMethods(ctx))
     router.post('/preview-upgrade', (ctx) => PanelStripeController.previewUpgrade(ctx))
     router.post('/confirm-upgrade', (ctx) => PanelSubscriptionController.confirmUpgrade(ctx))
     //router.get('/cancel-subscription', (ctx) => PanelStripeController.cancel(ctx))
})
     .prefix('/panel/stripe')
     .use(middleware.panel_access())

// Routes Stripe sans authentification
router.group(() => {
     //router.post('/stripe', (ctx) => PanelStripeWebhookController.handle(ctx))
})
     .prefix('/panel/webhook')
