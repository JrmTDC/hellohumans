import { HttpContext } from '@adonisjs/core/http'
import supabaseService from '#services/supabaseService'
import stripeService from '#services/stripeService'

class SubscriptionController {
     public async createSubscription(ctx : HttpContext) {
          try {

               const { plan_id, modules, billing_cycle } = ctx.request.only(['plan_id', 'modules', 'billing_cycle'])

               if (!plan_id || !billing_cycle) {
                    return ctx.response.badRequest({
                         error: { name: 'missingParams', description: 'Paramètres requis manquants.' }
                    })
               }

               // Vérifier ou créer l'entrée dans client_project_subscriptions
               let { data: subscription, error: subscriptionError } = await supabaseService
                    .from('client_project_subscriptions')
                    .select('*')
                    .eq('project_id', ctx.project.id)
                    .maybeSingle()

               if (!subscription || subscriptionError) {
                    const { data: newSub } = await supabaseService
                         .from('client_project_subscriptions')
                         .insert({
                              project_id: ctx.project.id,
                              status: 'inactive',
                              current_plan_id: null,
                              current_modules: [],
                              billing_cycle,
                              is_trial: false,
                              payment_failed: false
                         })
                         .select('*')
                         .single()

                    subscription = newSub
               }

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

               const isFree = planData.monthlyPrice === 0 && (!modules || modules.length === 0)

               if (isFree) {
                    // Plan gratuit → mise à jour directe
                    await supabaseService
                         .from('client_project_subscriptions')
                         .update({
                              current_plan_id: plan_id,
                              current_modules: [],
                              billing_cycle,
                              status: 'free',
                              payment_failed: false,
                              stripe_subscription_id: null,
                              current_period_end: null,
                              canceled_at: null,
                              is_trial: false,
                              trial_end_at: null
                         })
                         .eq('project_id', ctx.project.id)

                    return ctx.response.ok({
                         project: {
                              ...ctx.project,
                              subscription: {
                                   id: subscription.id,
                                   plan_id,
                                   modules: [],
                                   billing_cycle,
                                   status: 'free',
                                   stripe_subscription_id: null
                              }
                         }
                    })
               }

               // Stripe : créer un client et un abonnement
               const customer = await stripeService.customers.create({
                    metadata: { project_id: ctx.project.id },
                    description: `Client HelloHumans - Projet ${ctx.project.id}`
               })

               const stripePriceId = billing_cycle === 'monthly'
                    ? planData.stripe_price_id_monthly
                    : planData.stripe_price_id_annual

               const stripeSubscription = await stripeService.subscriptions.create({
                    customer: customer.id,
                    items: [{ price: stripePriceId }],
                    payment_behavior: 'default_incomplete',
                    expand: ['latest_invoice.payment_intent'],
                    metadata: {
                         project_id: ctx.project.id
                    }
               })

               // 6. Mettre à jour l’abonnement localement (status en attente de paiement)
               await supabaseService
                    .from('client_project_subscriptions')
                    .update({
                         current_plan_id: plan_id,
                         current_modules: modules ?? [],
                         billing_cycle,
                         status: 'pending',
                         stripe_subscription_id: stripeSubscription.id,
                         payment_failed: false
                    })
                    .eq('project_id', ctx.project.id)

               return ctx.response.ok({
                    mode: 'paid',
                    subscription_id: subscription.id,
                    stripe: {
                         subscription_id: stripeSubscription.id,
                         customer_id: customer.id,
                         //client_secret: stripeSubscription.latest_invoice?.payment_intent?.client_secret ?? null
                    }
               })

          } catch (err) {
               console.error('Erreur createSubscription:', err)
               return ctx.response.internalServerError({
                    error: { name: 'subscriptionError', description: 'Erreur lors de la création de l’abonnement.' }
               })
          }
     }

     public async confirmUpgrade(ctx: HttpContext) {
          const { plan_id, modules, billing_cycle, payment_method_id } = ctx.request.only([
               'plan_id', 'modules', 'billing_cycle', 'payment_method_id'
          ])
          const { client, project, subscription } = ctx

          try {
               if (!plan_id || !billing_cycle || !payment_method_id) {
                    return ctx.response.badRequest({
                         error: { name: 'missingParams', description: 'Certains paramètres requis sont manquants.' }
                    })
               }

               // Vérifier si le client stripe existe, sinon le créer
               let stripeCustomerId = client.stripe_customer_id
               if (!stripeCustomerId) {
                    const customer = await stripeService.customers.create({
                         metadata: { client_id: client.id }
                    })
                    stripeCustomerId = customer.id
                    await supabaseService.from('clients').update({ stripe_customer_id: stripeCustomerId }).eq('id', client.id)
               }

               // Mettre à jour la méthode de paiement par défaut
               await stripeService.customers.update(stripeCustomerId, {
                    invoice_settings: {
                         default_payment_method: payment_method_id,
                    },
               })

               // Appeler StripeController pour mettre à jour l’abonnement
               const updateResult = await stripeService.updateSubscription({
                    customerId: stripeCustomerId,
                    subscriptionId: subscription?.stripe_subscription_id,
                    plan_id,
                    modules,
                    billing_cycle,
               })

               // Si upgrade immédiat : mettre à jour directement
               if (updateResult.status === 'active' || updateResult.status === 'trialing') {
                    await supabaseService
                         .from('client_project_subscriptions')
                         .update({
                              current_plan_id: plan_id,
                              current_modules: modules ?? [],
                              billing_cycle,
                              status: 'active',
                              payment_failed: false,
                              stripe_subscription_id: updateResult.subscriptionId,
                              current_period_end: Math.floor(updateResult.currentPeriodEnd / 1000),
                         })
                         .eq('project_id', project.id)

                    return ctx.response.ok({ message: 'Upgrade effectué avec succès.' })
               }

               // Sinon si downgrade ➔ pas de changement immédiat, attendre le renouvellement
               await supabaseService
                    .from('client_project_subscriptions')
                    .update({
                         current_plan_id: plan_id,
                         current_modules: modules ?? [],
                         billing_cycle,
                    })
                    .eq('project_id', project.id)

               return ctx.response.ok({ message: 'Votre changement sera effectif à la date de renouvellement.' })

          } catch (error) {
               console.error('Erreur confirmUpgrade:', error)
               return ctx.response.internalServerError({
                    error: { name: 'upgradeError', description: 'Erreur lors de la confirmation de l’upgrade.' }
               })
          }
     }

}

export default new SubscriptionController()
