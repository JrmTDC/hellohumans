import { HttpContext } from '@adonisjs/core/http'
import {
     ensureCustomer,
     priceIdsForSelection,
     getUpcomingInvoicePreview,
     BillingCycle,
     stripe
} from '#services/stripeService'
import vine from '@vinejs/vine'

class StripeController {
     /**
      * Crée un SetupIntent pour ajouter une nouvelle carte
      */
     public async createSetupIntent({ client, response }: HttpContext) {
          try {
               const customerId = await ensureCustomer(client)
               const setupIntent = await stripe.setupIntents.create({
                    customer: customerId,
                    payment_method_types: ['card'],
                    usage: 'off_session'
               })

               return response.ok({
                    client_secret: setupIntent.client_secret,
                    setup_intent_id: setupIntent.id
               })
          } catch (error: any) {
               console.error('[StripeController.createSetupIntent]', error)
               return response.status(500).json({
                    error: {
                         code: 'STRIPE_SETUP_INTENT_ERROR',
                         message: error.message || 'Failed to create setup intent'
                    }
               })
          }
     }

     /**
      * Liste les méthodes de paiement du client
      */
     public async paymentMethods({ client, response }: HttpContext) {
          try {
               const customerId = await ensureCustomer(client)
               const paymentMethods = await stripe.paymentMethods.list({
                    customer: customerId,
                    type: 'card'
               })

               return response.ok({
                    payment_methods: paymentMethods.data.map(method => ({
                         id: method.id,
                         card: {
                              brand: method.card?.brand,
                              last4: method.card?.last4,
                              exp_month: method.card?.exp_month,
                              exp_year: method.card?.exp_year
                         }
                    }))
               })
          } catch (error: any) {
               console.error('[StripeController.paymentMethods]', error)
               return response.status(500).json({
                    error: {
                         code: 'STRIPE_LIST_PAYMENT_METHODS_ERROR',
                         message: error.message || 'Failed to list payment methods'
                    }
               })
          }
     }

     /**
      * Prévisualise la mise à niveau d'un abonnement
      */
     public async previewUpgrade({client, subscription, request, response,}: HttpContext) {
          try {
               /* ---- Validation ---- */
               const schema = vine.object({
                    plan_id: vine.string(),
                    modules: vine.array(vine.string()).optional(),
                    billing_cycle: vine.enum(['month', 'year']),
               })
               const { plan_id, modules = [], billing_cycle } = await vine
                    .compile(schema)
                    .validate(request.all())

               /* ---- Prix visés ---- */
               const customerId = await ensureCustomer(client)
               const priceIds = await priceIdsForSelection(
                    plan_id,
                    modules,
                    billing_cycle as BillingCycle,
               )

               /* ---- Preview Stripe ---- */
               const { invoice, recurringAmount, totalAmount} = await getUpcomingInvoicePreview(
                    customerId,
                    subscription.stripe_subscription_id,
                    priceIds,
               )

               return response.ok({
                    today_amount: +(totalAmount / 100).toFixed(2),
                    cycle_amount: +(recurringAmount / 100).toFixed(2), // ← nouveau nom
                    ends_at: subscription.current_period_end
                         ? new Date(subscription.current_period_end * 1000)
                         : null,
                    is_new_subscription: false,
                    invoice_preview_id: invoice.id,
               })
          } catch (e: any) {
               console.error('[previewUpgrade]', e)
               return response.badRequest({
                    error: {
                         name: e.type ?? 'preview_error',
                         message: e.message ?? 'Impossible de pré-visualiser la facture',
                    },
               })
          }
     }
}

export default new StripeController()
