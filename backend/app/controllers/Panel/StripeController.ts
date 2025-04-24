import { HttpContext } from '@adonisjs/core/http'
import stripeService from '#services/stripeService'
import supabaseService from '#services/supabaseService'

class StripeController {
     public async createSetupIntent(ctx : HttpContext) {
          try {
               const { client, project, subscription } = ctx

               if (!project || !subscription) {
                    return ctx.response.notFound({
                         error: { name: 'missingProjectOrSubscription', description: 'Projet ou abonnement manquant.' },
                    })
               }

               let stripeCustomerId = client?.stripe_customer_id

               // 1. Créer le customer Stripe si non existant
               if (!stripeCustomerId) {
                    const customer = await stripeService.customers.create({
                         email: undefined,
                         metadata: {
                              client_id: client?.id
                         },
                    })

                    stripeCustomerId = customer.id

                    await supabaseService
                         .from('clients')
                         .update({ stripe_customer_id: stripeCustomerId })
                         .eq('id', client.id)
               }

               // 2. Créer le SetupIntent
               const setupIntent = await stripeService.setupIntents.create({
                    customer: stripeCustomerId,
                    usage: 'off_session',
                    payment_method_types: ['card']
               })

               return {
                    setupIntent: {
                         id: setupIntent.id,
                         client_secret: setupIntent.client_secret,
                         customer: stripeCustomerId,
                         livemode: setupIntent.livemode,
                         created: setupIntent.created,
                         status: setupIntent.status,
                         payment_method: setupIntent.payment_method,
                         payment_method_types: setupIntent.payment_method_types,
                         payment_method_configuration_details: setupIntent.payment_method_configuration_details,
                         payment_method_options: setupIntent.payment_method_options,
                         latest_attempt: setupIntent.latest_attempt,
                         object: setupIntent.object,
                         usage: setupIntent.usage,
                         single_use_mandate: setupIntent.single_use_mandate,
                         on_behalf_of: setupIntent.on_behalf_of,
                         next_action: setupIntent.next_action,
                         flow_directions: setupIntent.flow_directions
                    }
               }
          } catch (error) {
               console.error('Erreur StripeController.createSetupIntent:', error)
               return ctx.response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur interne Stripe.' },
               })
          }
     }

     public async paymentMethods(ctx : HttpContext) {
          return ctx.response.ok({ok: true})
     }
}
export default new StripeController()
