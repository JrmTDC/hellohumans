import { HttpContext } from '@adonisjs/core/http'
import stripeService, { ensureCustomer, upcomingInvoice } from '#services/stripeService'
import supabaseService from '#services/supabaseService'

class StripeController {
     public async createSetupIntent({ client, response }: HttpContext) {
          try {
               const cid = await ensureCustomer(client)
               const si = await stripeService.setupIntents.create({
                    customer: cid,
                    usage: 'off_session',
                    payment_method_types: ['card'],
               })
               return response.ok({ setupIntent: { client_secret: si.client_secret } })
          } catch (e) {
               console.error('[SetupIntent]', e)
               return response.internalServerError({ error: { name: 'stripe' } })
          }
     }

     public async paymentMethods({ client, response }: HttpContext) {
          try {
               const cid = await ensureCustomer(client)
               const cards = await stripeService.paymentMethods.list({
                    customer: cid,
                    type: 'card',
               })

               return response.ok({
                    paymentMethods: cards.data.map((c) => ({
                         id: c.id,
                         brand: c.card?.brand,
                         last4: c.card?.last4,
                         exp_month: c.card?.exp_month,
                         exp_year: c.card?.exp_year,
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
               if (!plan_id || !billing_cycle) return response.badRequest({ error: { name: 'missingParams' } })

               if (!subscription?.stripe_subscription_id) {
                    const { data: plan } = await supabaseService
                         .from('subscription_plans')
                         .select('*')
                         .eq('id', plan_id)
                         .maybeSingle()

                    if (!plan) return response.badRequest({ error: { name: 'invalidPlan' } })

                    const discount = plan.discountMonths || 0
                    const base = billing_cycle === 'year'
                         ? plan.monthlyPrice * (12 - discount)
                         : plan.monthlyPrice

                    let modulesPrice = 0
                    if (modules.length) {
                         const { data: rows } = await supabaseService
                              .from('subscription_modules')
                              .select('*')
                              .in('id', modules)

                         for (const m of rows || []) {
                              modulesPrice += billing_cycle === 'year'
                                   ? m.basePrice * (12 - (m.discountMonths || 0))
                                   : m.basePrice
                         }
                    }

                    const total = base + modulesPrice

                    return response.ok({
                         todayAmount: total,
                         monthlyAmount: total,
                         endsAt: null,
                    })
               }

               const inv = await upcomingInvoice(await ensureCustomer(client), subscription.stripe_subscription_id)

               return response.ok({
                    todayAmount: (inv.total || 0) / 100,
                    monthlyAmount: (inv.amount_due || 0) / 100,
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
