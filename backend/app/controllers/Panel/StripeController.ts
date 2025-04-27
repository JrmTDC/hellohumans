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

               // Étape 1 : Vérifie que le client Stripe existe encore
               if (stripeCustomerId) {
                    try {
                         await stripeService.customers.retrieve(stripeCustomerId)
                    } catch (err: any) {
                         if (err?.statusCode === 404) {
                              // Le client n'existe plus chez Stripe → on le recrée
                              stripeCustomerId = null
                         } else {
                              throw err // autre erreur à remonter
                         }
                    }
               }

               // Étape 2 : Crée un nouveau client si nécessaire
               if (!stripeCustomerId) {
                    const customer = await stripeService.customers.create({
                         email: undefined,
                         metadata: {
                              client_id: client?.id,
                         },
                    })

                    stripeCustomerId = customer.id

                    await supabaseService
                         .from('clients')
                         .update({ stripe_customer_id: stripeCustomerId })
                         .eq('id', client.id)
               }

               // Étape 3 : Crée le SetupIntent
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

     public async paymentMethods(ctx: HttpContext) {
          try {
               const { client } = ctx

               let stripeCustomerId = client?.stripe_customer_id

               // Étape 1 : Vérifie l’existence du customer Stripe
               if (stripeCustomerId) {
                    try {
                         await stripeService.customers.retrieve(stripeCustomerId)
                    } catch (err: any) {
                         if (err?.statusCode === 404) {
                              // → Customer supprimé chez Stripe : on en crée un nouveau
                              stripeCustomerId = null
                         } else {
                              throw err
                         }
                    }
               }

               // Étape 2 : Création d’un nouveau client si nécessaire
               if (!stripeCustomerId) {
                    const customer = await stripeService.customers.create({
                         email: undefined, // tu peux mettre `ctx.user.email` si dispo
                         metadata: {
                              client_id: client?.id,
                         },
                    })

                    stripeCustomerId = customer.id

                    // Mise à jour dans la base
                    await supabaseService
                         .from('clients')
                         .update({ stripe_customer_id: stripeCustomerId })
                         .eq('id', client.id)
               }

               // Étape 3 : Liste des cartes
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
               console.error('Erreur StripeController.paymentMethods:', error)
               return ctx.response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur lors de la récupération des cartes Stripe.' },
               })
          }
     }

     public async previewUpgrade(ctx: HttpContext) {
          const { client, project, subscription } = ctx

          const { plan_id, modules, billing_cycle } = ctx.request.only(['plan_id', 'modules', 'billing_cycle'])

          try {
               // 1. Vérifie que le client existe
               if (!project || !client) {
                    return ctx.response.notFound({
                         error: { name: 'missingProject', description: 'Projet manquant.' },
                    })
               }

               let stripeCustomerId = client.stripe_customer_id

               // 2. Vérifie si customer Stripe existe, sinon on le crée
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
                    const customer = await stripeService.customers.create({
                         metadata: {
                              client_id: client.id,
                         },
                    })
                    stripeCustomerId = customer.id

                    await supabaseService
                         .from('clients')
                         .update({ stripe_customer_id: stripeCustomerId })
                         .eq('id', client.id)
               }

               // 3. Vérifie abonnement existant
               const subscriptionId = subscription?.stripe_subscription_id

               // Récupérer les détails du plan
               const { data: planData } = await supabaseService
                    .from('subscription_plans')
                    .select('*')
                    .eq('id', plan_id)
                    .maybeSingle()

               if (!planData) {
                    return ctx.response.badRequest({
                         error: { name: 'invalidPlan', description: 'Offre introuvable.' }
                    })
               }


               const plan_discount_months = planData.discountMonths || 0
               const planPrice = billing_cycle === 'years'
                    ? planData.monthlyPrice *  (12 - plan_discount_months)
                    : planData.monthlyPrice

               console.log(planData.monthlyPrice)

               // 4. Cas : pas d'abonnement actif
               if (!subscriptionId) {
                    // Pas de prorata → on paye la totalité
                    return {
                         todayAmount: planPrice,  // ou price_annual selon cycle choisi
                         monthlyAmount: planPrice,
                         endsAt: null,
                    }
               }

               // 5. Cas : abonnement existant → on demande à Stripe le prorata
               const invoicePreview = await stripeService.invoices.retrieveUpcoming({
                    customer: stripeCustomerId,
                    subscription: subscriptionId,
                    // avec subscription_items si tu veux ajouter / modifier des modules
               })

               const totalToday = (invoicePreview.total || 0) / 100
               const monthlyAfter = (invoicePreview.amount_due || 0) / 100
               const endsAt = subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null

               let infoMessage = null

               if (totalToday === 0 && monthlyAfter < (subscription.amount || 0) / 100) {
                    // C'est un downgrade ➔ affiche un message rassurant
                    infoMessage = `Votre plan actuel reste actif jusqu'au ${endsAt.toLocaleDateString()} avant le changement.`
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
