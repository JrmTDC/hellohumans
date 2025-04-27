import { HttpContext } from '@adonisjs/core/http'
import stripeService from '#services/stripeService'
import supabaseService from '#services/supabaseService'

class StripeController {
     public async createSetupIntent(ctx: HttpContext) {
          try {
               const { client } = ctx

               let stripeCustomerId = client.stripe_customer_id
               if (!stripeCustomerId) {
                    const customer = await stripeService.customers.create({ metadata: { client_id: client.id } })
                    stripeCustomerId = customer.id
                    await supabaseService.from('clients').update({ stripe_customer_id: stripeCustomerId }).eq('id', client.id)
               }

               const setupIntent = await stripeService.setupIntents.create({
                    customer: stripeCustomerId,
                    usage: 'off_session',
                    payment_method_types: ['card'],
               })

               return {
                    setupIntent: {
                         id: setupIntent.id,
                         client_secret: setupIntent.client_secret,
                    }
               }
          } catch (error) {
               console.error('Erreur createSetupIntent:', error)
               return ctx.response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur lors de la création du SetupIntent.' },
               })
          }
     }

     public async paymentMethods(ctx: HttpContext) {
          try {
               const { client } = ctx

               let stripeCustomerId = client.stripe_customer_id
               if (!stripeCustomerId) {
                    const customer = await stripeService.customers.create({ metadata: { client_id: client.id } })
                    stripeCustomerId = customer.id
                    await supabaseService.from('clients').update({ stripe_customer_id: stripeCustomerId }).eq('id', client.id)
               }

               const paymentMethods = await stripeService.paymentMethods.list({
                    customer: stripeCustomerId,
                    type: 'card',
               })

               return ctx.response.ok({
                    paymentMethods: paymentMethods.data.map((method) => ({
                         id: method.id,
                         brand: method.card?.brand,
                         last4: method.card?.last4,
                         exp_month: method.card?.exp_month,
                         exp_year: method.card?.exp_year,
                    })),
               })
          } catch (error) {
               console.error('Erreur paymentMethods:', error)
               return ctx.response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur lors de la récupération des méthodes de paiement.' },
               })
          }
     }

     public async previewUpgrade(ctx: HttpContext) {
          const { client, project, subscription } = ctx
          const { plan_id, modules, billing_cycle } = ctx.request.only(['plan_id', 'modules', 'billing_cycle'])

          try {
               if (!client || !project) {
                    return ctx.response.badRequest({
                         error: { name: 'missingContext', description: 'Projet ou client manquant.' },
                    })
               }

               let stripeCustomerId = client.stripe_customer_id

               if (!stripeCustomerId) {
                    const customer = await stripeService.customers.create({ metadata: { client_id: client.id } })
                    stripeCustomerId = customer.id
                    await supabaseService.from('clients').update({ stripe_customer_id: stripeCustomerId }).eq('id', client.id)
               }

               // Pas d'abonnement actif : frais total immédiat
               if (!subscription?.stripe_subscription_id) {
                    const { data: plan } = await supabaseService
                         .from('subscription_plans')
                         .select('*')
                         .eq('id', plan_id)
                         .maybeSingle()

                    if (!plan) {
                         return ctx.response.badRequest({
                              error: { name: 'invalidPlan', description: 'Plan introuvable.' }
                         })
                    }

                    const plan_discount_months = plan.discountMonths || 0
                    const price = billing_cycle === 'year'
                         ? plan.monthlyPrice * (12 - plan_discount_months)
                         : plan.monthlyPrice

                    return {
                         todayAmount: price,
                         monthlyAmount: price,
                         endsAt: null,
                         infoMessage: null,
                    }
               }

               // Si abonnement actif ➔ preview via Stripe
               const upcomingInvoice = await stripeService.invoices.retrieveUpcoming({
                    customer: stripeCustomerId,
                    subscription: subscription.stripe_subscription_id,
               })

               const totalToday = (upcomingInvoice.total ?? 0) / 100
               const monthlyAfter = (upcomingInvoice.amount_due ?? 0) / 100
               const endsAt = subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null

               let infoMessage: string | null = null

               if (totalToday === 0 && monthlyAfter < (subscription.amount || 0) / 100) {
                    infoMessage = `Votre offre actuelle restera active jusqu'au ${endsAt?.toLocaleDateString()}.`
               }

               return {
                    todayAmount: totalToday,
                    monthlyAmount: monthlyAfter,
                    endsAt,
                    infoMessage,
               }
          } catch (error) {
               console.error('Erreur previewUpgrade:', error)
               return ctx.response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur lors de la prévisualisation de l’upgrade.' },
               })
          }
     }


}

export default new StripeController()
