import { HttpContext } from '@adonisjs/core/http'
import { ensureCustomer, upcomingInvoice } from '#services/stripeService'
import stripe from '#services/stripeService'
import supabaseService from '#services/supabaseService'

class StripeController {
     public async createSetupIntent({ client, response }: HttpContext) {
          try {
               const cid = await ensureCustomer(client)
               const intent = await stripe.setupIntents.create({
                    customer: cid,
                    usage: 'off_session',
                    payment_method_types: ['card'],
               })
               return response.ok({ client_secret: intent.client_secret })
          } catch (e) {
               console.error('[createSetupIntent]', e)
               return response.internalServerError({ error: { name: 'stripe' } })
          }
     }

     public async paymentMethods({ client, response }: HttpContext) {
          try {
               const cid = await ensureCustomer(client)
               const list = await stripe.paymentMethods.list({ customer: cid, type: 'card' })

               return response.ok({
                    paymentMethods: list.data.map((pm) => ({
                         id: pm.id,
                         brand: pm.card?.brand,
                         last4: pm.card?.last4,
                         exp_month: pm.card?.exp_month,
                         exp_year: pm.card?.exp_year,
                    })),
               })
          } catch (e) {
               console.error('[paymentMethods]', e)
               return response.internalServerError({ error: { name: 'stripe' } })
          }
     }

     public async previewUpgrade({ client, subscription, request, response }: HttpContext) {
          try {
               const { plan_id, modules = [], billing_cycle } = request.all()

               if (!plan_id || !billing_cycle) {
                    return response.badRequest({ error: { name: 'missingParams' } })
               }

               if (!subscription?.stripe_subscription_id) {
                    const { data: plan } = await supabaseService
                         .from('subscription_plans')
                         .select('*')
                         .eq('id', plan_id)
                         .maybeSingle()

                    if (!plan) return response.badRequest({ error: { name: 'invalidPlan' } })

                    let total =
                         billing_cycle === 'year'
                              ? plan.monthlyPrice * (12 - (plan.discountMonths ?? 0))
                              : plan.monthlyPrice

                    if (modules.length) {
                         const { data: modRows } = await supabaseService
                              .from('subscription_modules')
                              .select('*')
                              .in('id', modules)

                         for (const m of modRows || []) {
                              const modPrice =
                                   billing_cycle === 'year'
                                        ? m.basePrice * (12 - (m.discountMonths ?? 0))
                                        : m.basePrice
                              total += modPrice
                         }
                    }

                    return response.ok({
                         todayAmount: total,
                         monthlyAmount: total,
                         endsAt: null,
                    })
               }

               const invoice = await upcomingInvoice(
                    await ensureCustomer(client),
                    subscription.stripe_subscription_id,
               )

               return response.ok({
                    todayAmount: (invoice.total || 0) / 100,
                    monthlyAmount: (invoice.amount_due || 0) / 100,
                    endsAt: subscription.current_period_end
                         ? new Date(subscription.current_period_end * 1_000)
                         : null,
               })
          } catch (e) {
               console.error('[previewUpgrade]', e)
               return response.internalServerError({ error: { name: 'stripe' } })
          }
     }
}

export default new StripeController()
