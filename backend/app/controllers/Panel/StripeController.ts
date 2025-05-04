import { HttpContext } from '@adonisjs/core/http'
import {
     ensureCustomer,
     priceForPlan,
     pricesForModules,
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
                    setupIntent: {
                         client_secret: setupIntent.client_secret,
                         setup_intent_id: setupIntent.id
                    }
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
     public async previewUpgrade({ client, subscription, request, response }: HttpContext) {
          try {
               /* ---- Validation ---- */
               const schema = vine.object({
                    plan_id: vine.string(),
                    modules: vine.array(vine.string()).optional(),
                    billing_cycle: vine.enum(['month', 'year']),
               })
               const { plan_id, modules = [], billing_cycle } = await vine.compile(schema).validate(request.all())

               /* ---- Prix ---- */
               const customerId = await ensureCustomer(client)
               const planPriceId   = await priceForPlan(plan_id, billing_cycle as BillingCycle)
               const modulePriceIds = await pricesForModules(modules, billing_cycle as BillingCycle)
               const desiredPriceIds = [planPriceId, ...modulePriceIds]

               /* ---- Pré-visualisation ---- */
               const {
                    invoice,
                    totalAmount,
                    totalDebit,
                    totalCredit,
                    recurringAmount,
                    debitByPrice,
                    creditByPrice,
                    recurringByPrice,
               } = await getUpcomingInvoicePreview(
                    customerId,
                    subscription.stripe_subscription_id,
                    desiredPriceIds,
               )

               /* ------- helpers ------- */
               function euros(c: number | undefined) {
                    return +((c ?? 0) / 100).toFixed(2)
               }
               function buildAction(charge: number, credit: number) {
                    return charge > 0 || credit > 0 ? 'immediate' : 'end_of_period'
               }
               /* ------- plan ------- */
               const planProrata   = debitByPrice [planPriceId] ?? 0
               const planCreditRaw = creditByPrice[planPriceId] ?? 0

               const planChange = {
                    id:               plan_id,
                    effective_date:   new Date().toISOString(),
                    effective_action: buildAction(planProrata, planCreditRaw),
                    price_now:        euros(planProrata),
                    credit_amount:    euros(planCreditRaw),
                    price_cycle:      euros(recurringByPrice[planPriceId]),
               }

               /* ------- modules ajoutés ------- */
               const modulesAdded = modulePriceIds.map((priceId, idx) => {
                    const prorata = debitByPrice [priceId] ?? 0
                    const credit  = creditByPrice[priceId] ?? 0
                    return {
                         id:               modules[idx],
                         effective_date:   new Date().toISOString(),
                         effective_action: buildAction(prorata, credit),
                         price_now:        euros(prorata),
                         credit_amount:    euros(credit),
                         price_cycle:      euros(recurringByPrice[priceId]),
                    }
               })

               /* ------- réponse ------- */
               return response.ok({
                    today_debit:   euros(totalDebit),
                    today_credit:  euros(totalCredit),
                    today_amount:  euros(totalAmount),
                    cycle_amount:  euros(recurringAmount),
                    ends_at:       subscription.current_period_end
                         ? new Date(subscription.current_period_end * 1000)
                         : null,
                    is_new_subscription: false,
                    changes: {
                         plan:    planChange,
                         modules: { added: modulesAdded },
                    },
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
