import { HttpContext } from '@adonisjs/core/http'
import {
     ensureCustomer,
     createSubscription,
     updateSubscription,
     getInvoiceClientSecret,
} from '#services/stripeService'
import supabaseService from '#services/supabaseService'
import stripe from '#services/stripeService'

class SubscriptionController {
     public async confirmUpgrade({ client, project, subscription, request, response }: HttpContext) {
          try {
               const {
                    plan_id,
                    modules = [],
                    billing_cycle,
                    payment_method_id,
               } = request.all()

               if (!plan_id || !billing_cycle || !payment_method_id) {
                    return response.badRequest({ error: { name: 'missingParams' } })
               }

               const cid = await ensureCustomer(client)

               await stripe.paymentMethods.attach(payment_method_id, { customer: cid })

               let subStripe
               if (!subscription?.stripe_subscription_id) {
                    subStripe = await createSubscription({
                         customerId: cid,
                         plan_id,
                         modules,
                         billing: billing_cycle,
                         paymentMethodId: payment_method_id,
                    })
               } else {
                    subStripe = await updateSubscription({
                         subscriptionId: subscription.stripe_subscription_id,
                         plan_id,
                         modules,
                         billing: billing_cycle,
                         paymentMethodId: payment_method_id,
                    })
               }

               let clientSecret: string | null = null
               if (typeof subStripe.latest_invoice === 'string') {
                    clientSecret = await getInvoiceClientSecret(subStripe.latest_invoice)
               }

               await supabaseService
                    .from('client_project_subscriptions')
                    .update({
                         current_plan_id: plan_id,
                         current_modules: modules,
                         billing_cycle,
                         stripe_subscription_id: subStripe.id,
                         current_period_end: subStripe.current_period_end,
                         status: subStripe.status,
                    })
                    .eq('project_id', project.id)

               return response.ok({
                    subscription_status: subStripe.status,
                    invoice_client_secret: clientSecret,
               })
          } catch (e) {
               console.error('[confirmUpgrade]', e)
               return response.internalServerError({ error: { name: 'stripe' } })
          }
     }
}

export default new SubscriptionController()
