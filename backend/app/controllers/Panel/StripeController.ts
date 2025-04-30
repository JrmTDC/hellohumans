import { HttpContext } from '@adonisjs/core/http'
import { ensureCustomer, getUpcomingInvoicePreview } from '#services/stripeService'
import supabaseService from '#services/supabaseService'
import vine from '@vinejs/vine'
import stripe from '#services/stripeService'

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
      * Prévisualise le coût d'une mise à jour d'abonnement
      */
     public async previewUpgrade({ client, subscription, request, response }: HttpContext) {
          try {
               const schema = vine.object({
                    plan_id: vine.string(),
                    modules: vine.array(vine.string()).optional(),
                    billing_cycle: vine.enum(['month', 'year'])
               })

               const validator = vine.compile(schema)
               const { plan_id, modules = [], billing_cycle } = await validator.validate(request.all())

               // Cas d'un nouvel abonnement
               if (!subscription?.stripe_subscription_id) {
                    const { data: plan } = await supabaseService
                         .from('subscription_plans')
                         .select('*')
                         .eq('id', plan_id)
                         .maybeSingle()

                    if (!plan) {
                         return response.badRequest({
                              error: {
                                   code: 'INVALID_PLAN',
                                   message: 'The selected plan does not exist'
                              }
                         })
                    }

                    // Calcul du montant de base
                    let total = billing_cycle === 'year'
                         ? plan.monthly_price * (12 - (plan.discount_months || 0))
                         : plan.monthly_price

                    // Ajout des modules optionnels
                    if (modules.length > 0) {
                         const { data: selectedModules } = await supabaseService
                              .from('subscription_modules')
                              .select('*')
                              .in('id', modules)

                         for (const module of selectedModules || []) {
                              const modulePrice = billing_cycle === 'year'
                                   ? module.base_price * (12 - (module.discount_months || 0))
                                   : module.base_price
                              total += modulePrice
                         }
                    }

                    return response.ok({
                         today_amount: Number(total.toFixed(2)),
                         monthly_amount: Number(total.toFixed(2)),
                         ends_at: null,
                         is_new_subscription: true
                    })
               }

               // Cas d'une mise à jour d'abonnement existant
               const customerId = await ensureCustomer(client)
               const { invoice, recurringAmount } = await getUpcomingInvoicePreview(
                    customerId,
                    subscription.stripe_subscription_id
               )

               return response.ok({
                    today_amount: Number((invoice.total / 100).toFixed(2)),
                    monthly_amount: Number((recurringAmount / 100).toFixed(2)),
                    ends_at: subscription.current_period_end
                         ? new Date(subscription.current_period_end * 1000)
                         : null,
                    is_new_subscription: false,
                    invoice_preview_id: invoice.id
               })
          } catch (error: any) {
               console.error('[StripeController.previewUpgrade]', error)
               return response.status(500).json({
                    error: {
                         code: 'UPGRADE_PREVIEW_ERROR',
                         message: error.message || 'Failed to generate upgrade preview',
                         stripe_error: error.type || undefined
                    }
               })
          }
     }

     /**
      * Annule un abonnement
      */
     public async cancelSubscription({ subscription, response }: HttpContext) {
          try {
               if (!subscription?.stripe_subscription_id) {
                    return response.badRequest({
                         error: {
                              code: 'NO_SUBSCRIPTION',
                              message: 'No active subscription to cancel'
                         }
                    })
               }

               const canceledSubscription = await stripe.subscriptions.cancel(
                    subscription.stripe_subscription_id
               )

               // Mettre à jour la base de données
               await supabaseService
                    .from('client_project_subscriptions')
                    .update({
                         status: 'canceled',
                         canceled_at: new Date().toISOString()
                    })
                    .eq('stripe_subscription_id', subscription.stripe_subscription_id)

               return response.ok({
                    status: canceledSubscription.status,
                    canceled_at: canceledSubscription.canceled_at
                         ? new Date(canceledSubscription.canceled_at * 1000)
                         : null
               })
          } catch (error: any) {
               console.error('[StripeController.cancelSubscription]', error)
               return response.status(500).json({
                    error: {
                         code: 'CANCEL_SUBSCRIPTION_ERROR',
                         message: error.message || 'Failed to cancel subscription'
                    }
               })
          }
     }
}

export default new StripeController()
