import { HttpContext } from '@adonisjs/core/http'
import supabaseService from '#services/supabaseService'
import stripe from '#services/stripeService'

class SubscriptionController {
     public async createSubscription({ auth, request, response }: HttpContext) {
          try {
               const auth_id = auth?.user?.id
               if (!auth_id) {
                    return response.unauthorized({
                         error: { name: 'unauthorized', description: 'Utilisateur non connecté.' }
                    })
               }

               const { plan_id, modules, billing_cycle } = request.only(['plan_id', 'modules', 'billing_cycle'])

               if (!plan_id || !billing_cycle) {
                    return response.badRequest({
                         error: { name: 'missingParams', description: 'Paramètres requis manquants.' }
                    })
               }

               // 1. Récupérer l'utilisateur interne
               const { data: userData } = await supabaseService
                    .from('users')
                    .select('id, selected_client_id')
                    .eq('auth_id', auth_id)
                    .single()

               const user_id = userData?.id
               const client_id = userData?.selected_client_id

               // 2. Récupérer le projet sélectionné
               const { data: clientUser } = await supabaseService
                    .from('client_users')
                    .select('selected_project_id')
                    .eq('user_id', user_id)
                    .eq('client_id', client_id)
                    .maybeSingle()

               const selected_project_id = clientUser?.selected_project_id
               if (!selected_project_id) {
                    return response.badRequest({
                         error: { name: 'noProjectSelected', description: 'Aucun projet sélectionné pour ce client.' }
                    })
               }

               // 3. Vérifier ou créer l'entrée dans client_project_subscriptions
               let { data: subscription, error: subscriptionError } = await supabaseService
                    .from('client_project_subscriptions')
                    .select('*')
                    .eq('project_id', selected_project_id)
                    .maybeSingle()

               if (!subscription || subscriptionError) {
                    const { data: newSub } = await supabaseService
                         .from('client_project_subscriptions')
                         .insert({
                              project_id: selected_project_id,
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

               // 4. Récupérer les détails du plan
               const { data: planData } = await supabaseService
                    .from('subscription_plans')
                    .select('*')
                    .eq('id', plan_id)
                    .maybeSingle()

               if (!planData) {
                    return response.badRequest({
                         error: { name: 'invalidPlan', description: 'Offre introuvable.' }
                    })
               }

               const isFree = planData.monthlyPrice === 0 && (!modules || modules.length === 0)

               if (isFree) {
                    // 🎁 Plan gratuit → mise à jour directe
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
                         .eq('project_id', selected_project_id)

                    return response.ok({
                         subscription: {
                              id: subscription.id,
                              plan_id,
                              modules: [],
                              billing_cycle,
                              status: 'free',
                              stripe_subscription_id: null
                         }
                    })
               }

               // 5. 💳 Stripe : créer un client et un abonnement
               const customer = await stripe.customers.create({
                    metadata: { project_id: selected_project_id },
                    description: `Client HelloHumans - Projet ${selected_project_id}`
               })

               const stripePriceId = billing_cycle === 'monthly'
                    ? planData.stripe_price_id_monthly
                    : planData.stripe_price_id_annual

               const stripeSubscription = await stripe.subscriptions.create({
                    customer: customer.id,
                    items: [{ price: stripePriceId }],
                    payment_behavior: 'default_incomplete',
                    expand: ['latest_invoice.payment_intent'],
                    metadata: {
                         project_id: selected_project_id
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
                    .eq('project_id', selected_project_id)

               return response.ok({
                    mode: 'paid',
                    subscription_id: subscription.id,
                    stripe: {
                         subscription_id: stripeSubscription.id,
                         customer_id: customer.id,
                         client_secret: stripeSubscription.latest_invoice?.payment_intent?.client_secret ?? null
                    }
               })

          } catch (err) {
               console.error('Erreur createSubscription:', err)
               return response.internalServerError({
                    error: { name: 'subscriptionError', description: 'Erreur lors de la création de l’abonnement.' }
               })
          }
     }
}

export default new SubscriptionController()
