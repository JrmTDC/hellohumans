import { HttpContext } from '@adonisjs/core/http'
import supabaseService from '#services/supabaseService'

class SubscriptionController {
     public async create({ auth, request, response }: HttpContext) {
          try {
               const auth_id = auth?.user?.id
               if (!auth_id) {
                    return response.unauthorized({
                         error: { name: 'unauthorized', description: 'Utilisateur non connecté.' },
                    })
               }

               const body = request.only(['plan_id', 'modules', 'billing_cycle'])

               if (!body.plan_id || !body.billing_cycle) {
                    return response.badRequest({
                         error: { name: 'missingFields', description: 'Plan ou cycle manquant.' },
                    })
               }

               // 1. Utilisateur
               const { data: userData } = await supabaseService
                    .from('users')
                    .select('id, selected_client_id')
                    .eq('auth_id', auth_id)
                    .single()

               if (!userData) {
                    return response.notFound({
                         error: { name: 'userNotFound', description: 'Utilisateur introuvable.' },
                    })
               }

               const user_id = userData.id
               const selected_client_id = userData.selected_client_id

               // 2. Client_user
               const { data: clientUser } = await supabaseService
                    .from('client_users')
                    .select('id, selected_project_id')
                    .eq('user_id', user_id)
                    .eq('client_id', selected_client_id)
                    .maybeSingle()

               if (!clientUser) {
                    return response.forbidden({
                         error: { name: 'noClientAccess', description: 'Aucun lien avec ce client.' },
                    })
               }

               const selected_project_id = clientUser.selected_project_id
               if (!selected_project_id) {
                    return response.badRequest({
                         error: { name: 'noProjectSelected', description: 'Aucun projet sélectionné.' },
                    })
               }

               // 3. Vérification du plan
               const { data: plan } = await supabaseService
                    .from('subscription_plans')
                    .select('id, monthly_price')
                    .eq('id', body.plan_id)
                    .single()

               if (!plan) {
                    return response.notFound({
                         error: { name: 'planNotFound', description: 'Plan introuvable.' },
                    })
               }

               const isFree = plan.monthly_price === 0 && (!body.modules || body.modules.length === 0)

               // 4. Vérifie s’il existe une subscription pour le projet
               const { data: existingSubscription } = await supabaseService
                    .from('client_project_subscriptions')
                    .select('id')
                    .eq('project_id', selected_project_id)
                    .maybeSingle()

               if (!existingSubscription) {
                    // On en crée une vide avec le statut "pending"
                    const { error: createError } = await supabaseService
                         .from('client_project_subscriptions')
                         .insert({
                              project_id: selected_project_id,
                              status: 'pending',
                              current_modules: [],
                              billing_cycle: body.billing_cycle,
                              is_trial: false,
                              payment_failed: false,
                         })

                    if (createError) {
                         return response.internalServerError({
                              error: {
                                   name: 'subscriptionCreationFailed',
                                   description: 'Impossible de créer l’abonnement initial pour ce projet.',
                              },
                         })
                    }
               }

               if (isFree) {
                    const { error: updateError } = await supabaseService
                         .from('client_project_subscriptions')
                         .update({
                              current_plan_id: plan.id,
                              current_modules: [],
                              status: 'active',
                              stripe_subscription_id: null,
                              payment_failed: false,
                              billing_cycle: body.billing_cycle,
                              canceled_at: null,
                              trial_end_at: null,
                              current_period_end: null,
                              is_trial: false,
                         })
                         .eq('project_id', selected_project_id)

                    if (updateError) {
                         return response.internalServerError({
                              error: { name: 'subscriptionUpdateFailed', description: 'Erreur lors de la mise à jour de l’abonnement.' },
                         })
                    }

                    return {
                         success: true,
                         message: 'Abonnement gratuit activé.',
                    }
               }

               // Stripe requis
               return {
                    success: false,
                    requiresPayment: true,
                    message: 'Abonnement payant, veuillez procéder au paiement.',
               }

          } catch (error) {
               console.error('Erreur SubscriptionController.create:', error)
               return response.internalServerError({
                    error: {
                         name: 'internalError',
                         description: 'Erreur interne lors de la création de l’abonnement.',
                    },
               })
          }
     }
}

export default new SubscriptionController()
