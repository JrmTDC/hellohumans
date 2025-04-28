import { HttpContext } from '@adonisjs/core/http'
import supabase from '#services/supabaseService'
import stripe, { createSubscription, updateSubscription } from '#services/stripeService'

class SubscriptionController {

     /* -------------------------------------------------------- */
     /* POST /panel/stripe/confirm-upgrade                       */
     /* -------------------------------------------------------- */
     public async confirmUpgrade ({ request, client, project, subscription, response }: HttpContext) {

          const { plan_id, modules = [], billing_cycle, payment_method_id } =
               request.only(['plan_id', 'modules', 'billing_cycle', 'payment_method_id'])

          if (!plan_id || !billing_cycle || !payment_method_id) {
               return response.badRequest({ error: { name: 'missing', description: 'Params required' } })
          }

          try {
               /* 1️⃣ assurer le customer Stripe ------------------------ */
               let customerId = client.stripe_customer_id
               if (!customerId) {
                    const c = await stripe.customers.create({ metadata: { client_id: client.id } })
                    customerId = c.id
                    await supabase.from('clients').update({ stripe_customer_id: customerId }).eq('id', client.id)
               }

               /* 2️⃣ créer ou mettre à jour la subscription ------------ */
               let invoice, sub

               if (!subscription?.stripe_subscription_id) {
                    /* Nouveau -------------------------------------------------- */
                    const res = await createSubscription({
                         customerId,
                         plan_id,
                         modules,
                         cycle: billing_cycle,
                         paymentMethodId: payment_method_id,
                    })
                    sub     = res.sub
                    invoice = res.invoice
               } else {
                    /* Mise à jour --------------------------------------------- */
                    sub = await updateSubscription({
                         subscriptionId  : subscription.stripe_subscription_id,
                         plan_id,
                         modules,
                         cycle           : billing_cycle,
                         paymentMethodId : payment_method_id,
                    })
                    invoice = await stripe.invoices.retrieve(
                         sub.latest_invoice as string,
                         { expand: ['payment_intent'] }
                    )
               }

               /* 3️⃣ mise à jour locale --------------------------------- */
               await supabase.from('client_project_subscriptions').update({
                    current_plan_id : plan_id,
                    current_modules : modules,
                    billing_cycle   : billing_cycle,
                    stripe_subscription_id: sub.id,
                    status          : sub.status,
                    current_period_end   : sub.current_period_end,
               }).eq('project_id', project.id)

               /* 4️⃣ réponse au front ----------------------------------- */
               return response.ok({
                    stripe_subscription_id: sub.id,
                    status       : sub.status,
                    client_secret: clientSecret,          // null = rien à confirmer côté front
               })
          } catch (e) {
               console.error('[confirmUpgrade]', e)
               return response.internalServerError({ error: { name: 'stripe', description: 'Upgrade failed' } })
          }
     }
}

export default new SubscriptionController()
