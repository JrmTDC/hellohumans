import { HttpContext } from '@adonisjs/core/http'
import stripeService, { createCustomer, createSubscription } from '#services/stripeService'
import supabaseService from '#services/supabaseService'

class StripeController {
     /**
      * Créer un SetupIntent Stripe
      */
     public async createSetupIntent(ctx: HttpContext) {
          try {
               const { client } = ctx

               if (!client) {
                    return ctx.response.notFound({
                         error: { name: 'missingClient', description: 'Client manquant.' },
                    })
               }

               let stripeCustomerId = client.stripe_customer_id

               if (stripeCustomerId) {
                    try {
                         await stripeService.customers.retrieve(stripeCustomerId)
                    } catch (err: any) {
                         if (err?.statusCode === 404) {
                              stripeCustomerId = null
                         } else {
                              throw err
                         }
                    }
               }

               if (!stripeCustomerId) {
                    const customer = await stripeService.createCustomer({ client_id: client.id })
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
                         customer: stripeCustomerId,
                    }
               }
          } catch (error) {
               console.error('Erreur createSetupIntent:', error)
               return ctx.response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur interne Stripe (SetupIntent).' },
               })
          }
     }

     /**
      * Récupérer les méthodes de paiement d'un client Stripe
      */
     public async paymentMethods(ctx: HttpContext) {
          try {
               const { client } = ctx

               if (!client) {
                    return ctx.response.notFound({
                         error: { name: 'missingClient', description: 'Client manquant.' },
                    })
               }

               let stripeCustomerId = client.stripe_customer_id

               if (stripeCustomerId) {
                    try {
                         await stripeService.customers.retrieve(stripeCustomerId)
                    } catch (err: any) {
                         if (err?.statusCode === 404) {
                              stripeCustomerId = null
                         } else {
                              throw err
                         }
                    }
               }

               if (!stripeCustomerId) {
                    const customer = await stripeService.createCustomer({ client_id: client.id })
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
                    error: { name: 'internalError', description: 'Erreur récupération cartes Stripe.' },
               })
          }
     }

     /**
      * Prévisualiser la facture d'upgrade
      */
     public async previewUpgrade(ctx: HttpContext) {
          try {
               const { client, project, subscription } = ctx
               const { plan_id, modules, billing_cycle } = ctx.request.only(['plan_id', 'modules', 'billing_cycle'])

               if (!client || !project) {
                    return ctx.response.notFound({
                         error: { name: 'missingProject', description: 'Client ou projet manquant.' },
                    })
               }

               let stripeCustomerId = client.stripe_customer_id

               if (stripeCustomerId) {
                    try {
                         await stripeService.customers.retrieve(stripeCustomerId)
                    } catch (err: any) {
                         if (err?.statusCode === 404) {
                              stripeCustomerId = null
                         } else {
                              throw err
                         }
                    }
               }

               if (!stripeCustomerId) {
                    const customer = await stripeService.createCustomer({ client_id: client.id })
                    stripeCustomerId = customer.id
                    await supabaseService.from('clients').update({ stripe_customer_id: stripeCustomerId }).eq('id', client.id)
               }

               // Vérification abonnement actuel
               const subscriptionId = subscription?.stripe_subscription_id

               // Récupérer le plan sélectionné
               const { data: planData } = await supabaseService
                    .from('subscription_plans')
                    .select('*')
                    .eq('id', plan_id)
                    .maybeSingle()

               if (!planData) {
                    return ctx.response.badRequest({
                         error: { name: 'invalidPlan', description: 'Plan sélectionné invalide.' }
                    })
               }

               const plan_discount_months = planData.discountMonths || 0
               const planPrice = billing_cycle === 'year'
                    ? planData.monthlyPrice * (12 - plan_discount_months)
                    : planData.monthlyPrice

               if (!subscriptionId) {
                    return {
                         todayAmount: planPrice,
                         monthlyAmount: planPrice,
                         endsAt: null,
                         infoMessage: null
                    }
               }

               const invoicePreview = await stripeService.invoices.retrieveUpcoming({
                    customer: stripeCustomerId,
                    subscription: subscriptionId,
               })

               const totalToday = (invoicePreview.total || 0) / 100
               const monthlyAfter = (invoicePreview.amount_due || 0) / 100
               const endsAt = subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null

               let infoMessage = null

               if (totalToday === 0 && monthlyAfter < (subscription.amount || 0) / 100) {
                    infoMessage = `Votre plan actuel restera actif jusqu'au ${endsAt?.toLocaleDateString()} avant de changer.`
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
