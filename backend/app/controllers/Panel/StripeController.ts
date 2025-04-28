import { HttpContext } from '@adonisjs/core/http'
import stripe, { buildSubscriptionItems, previewUpcomingInvoice } from '#services/stripeService'
import supabase from '#services/supabaseService'

class StripeController {
     /* -------------------------------------------------------- */
     /* GET /panel/stripe/setup-intent                           */
     /* -------------------------------------------------------- */
     public async createSetupIntent ({ client, response }: HttpContext) {
          try {
               let customerId = client?.stripe_customer_id

               /* vérifie / recrée le customer -------------------------------- */
               if (customerId) {
                    try { await stripe.customers.retrieve(customerId) }
                    catch (e: any) {
                         if (e?.statusCode === 404) customerId = null
                         else throw e
                    }
               }
               if (!customerId) {
                    const c = await stripe.customers.create({ metadata: { client_id: client.id } })
                    customerId = c.id
                    await supabase.from('clients').update({ stripe_customer_id: customerId }).eq('id', client.id)
               }

               const si = await stripe.setupIntents.create({
                    customer: customerId,
                    usage   : 'off_session',
                    payment_method_types: ['card'],
               })

               return response.ok({
                    setupIntent: { client_secret: si.client_secret },
               })
          } catch (err) {
               console.error('[setup-intent]', err)
               return response.internalServerError({ error: { name: 'internal', description: 'Stripe error' } })
          }
     }

     /* -------------------------------------------------------- */
     /* GET /panel/stripe/payment-methods                        */
     /* -------------------------------------------------------- */
     public async paymentMethods ({ client, response }: HttpContext) {
          try {
               let customerId = client?.stripe_customer_id
               if (!customerId) return response.ok({ paymentMethods: [] })

               const pm = await stripe.paymentMethods.list({ customer: customerId, type: 'card' })
               return response.ok({
                    paymentMethods: pm.data.map(c => ({
                         id: c.id,
                         brand: c.card?.brand,
                         last4: c.card?.last4,
                         exp_month: c.card?.exp_month,
                         exp_year : c.card?.exp_year,
                    })),
               })
          } catch (e) {
               console.error('[paymentMethods]', e)
               return response.internalServerError({ error: { name: 'internal', description: 'Stripe error' } })
          }
     }

     /* -------------------------------------------------------- */
     /* POST /panel/stripe/preview-upgrade                       */
     /* -------------------------------------------------------- */
     public async previewUpgrade ({ request, client, subscription, response }: HttpContext) {
          const { plan_id, modules, billing_cycle } = request.only(['plan_id', 'modules', 'billing_cycle'])

          try {
               if (!plan_id || !billing_cycle) {
                    return response.badRequest({ error: { name: 'missing', description: 'Params required' } })
               }

               /* -------- pas d’abonnement actif → plein tarif -------- */
               if (!subscription?.stripe_subscription_id) {
                    const items = await buildSubscriptionItems(plan_id, modules, billing_cycle)
                    const total = await items.reduce(async (accP, { price }) => {
                         const acc = await accP
                         const pr  = await stripe.prices.retrieve(price)
                         return acc + (pr.unit_amount ?? 0)
                    }, Promise.resolve(0))

                    const unit = billing_cycle === 'year' ? 12 : 1
                    return response.ok({
                         todayAmount  : total / 100,
                         monthlyAmount: total / 100 / unit,
                         endsAt       : null,
                    })
               }

               /* -------- abonnement existant → invoice upcoming ------- */
               const inv = await previewUpcomingInvoice(client.stripe_customer_id!, subscription.stripe_subscription_id!)
               return response.ok({
                    todayAmount  : inv.total! / 100,
                    monthlyAmount: inv.amount_due! / 100,
                    endsAt       : subscription.current_period_end
                         ? new Date(subscription.current_period_end * 1000)
                         : null,
               })
          } catch (e) {
               console.error('[previewUpgrade]', e)
               return response.internalServerError({ error: { name: 'internal', description: 'Stripe error' } })
          }
     }
}

export default new StripeController()
