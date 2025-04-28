// controllers/SubscriptionController.ts
import { HttpContext } from '@adonisjs/core/http'
import supabaseService from '#services/supabaseService'
import * as stripeService from '#services/stripeService'

class SubscriptionController {
     public async confirmUpgrade(ctx: HttpContext) {
          const { plan_id, modules, billing_cycle, payment_method_id } = ctx.request.only([
               'plan_id', 'modules', 'billing_cycle', 'payment_method_id'
          ])

          const { client, project, subscription } = ctx

          try {
               if (!plan_id || !billing_cycle || !payment_method_id) {
                    return ctx.response.badRequest({ error: { name: 'missingParams', description: 'Paramètres manquants.' } })
               }

               // Customer Stripe
               let stripeCustomerId = client.stripe_customer_id
               if (!stripeCustomerId) {
                    const customer = await stripeService.createCustomer({ client_id: client.id })
                    stripeCustomerId = customer.id
                    await supabaseService.from('clients').update({ stripe_customer_id: stripeCustomerId }).eq('id', client.id)
               }

               // Set default payment method
               await stripeService.stripe.customers.update(stripeCustomerId, {
                    invoice_settings: { default_payment_method: payment_method_id }
               })

               let stripeSubscription

               if (subscription?.stripe_subscription_id) {
                    // Mise à jour abonnement existant
                    stripeSubscription = await stripeService.updateSubscription({
                         subscriptionId: subscription.stripe_subscription_id,
                         plan_id,
                         modules,
                         billing_cycle
                    })
               } else {
                    // Création nouvel abonnement
                    stripeSubscription = await stripeService.createSubscription({
                         customerId: stripeCustomerId,
                         plan_id,
                         modules,
                         billing_cycle
                    })
               }

               // Mise à jour BDD
               await supabaseService
                    .from('client_project_subscriptions')
                    .update({
                         current_plan_id: plan_id,
                         current_modules: modules ?? [],
                         billing_cycle,
                         status: 'active',
                         stripe_subscription_id: stripeSubscription.id,
                         current_period_end: stripeSubscription.current_period_end,
                         payment_failed: false,
                    })
                    .eq('project_id', project.id)

               return ctx.response.ok({ message: 'Abonnement mis à jour avec succès.' })
          } catch (error) {
               console.error('Erreur confirmUpgrade:', error)
               return ctx.response.internalServerError({ error: { name: 'upgradeError', description: 'Erreur upgrade.' } })
          }
     }
}

export default new SubscriptionController()
