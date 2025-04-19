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

               // 1. Récupération de l'utilisateur interne
               const { data: userData, error: userError } = await supabaseService
                    .from('users')
                    .select('id, selected_client_id')
                    .eq('auth_id', auth_id)
                    .single()

               if (userError || !userData) {
                    return response.notFound({
                         error: { name: 'userNotFound', description: 'Utilisateur introuvable.' },
                    })
               }

               const user_id = userData.id
               const selected_client_id = userData.selected_client_id

               // 2. Récupération du lien utilisateur ↔ client
               const { data: clientUser, error: clientUserError } = await supabaseService
                    .from('client_users')
                    .select('id, selected_project_id')
                    .eq('user_id', user_id)
                    .eq('client_id', selected_client_id)
                    .maybeSingle()

               if (!clientUser || clientUserError) {
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

               // 3. Récupération du plan pour voir s’il est gratuit
               const { data: plan, error: planError } = await supabaseService
                    .from('subscription_plans')
                    .select('id, monthly_price')
                    .eq('id', body.plan_id)
                    .single()

               if (planError || !plan) {
                    return response.notFound({
                         error: { name: 'planNotFound', description: 'Plan introuvable.' },
                    })
               }

               const isFree = plan.monthly_price === 0 && (!body.modules || body.modules.length === 0)

               // 4. Si plan gratuit → on crée directement l’abonnement sans Stripe
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

               // 5. Si abonnement payant → réponse à gérer côté frontend
               return {
                    success: false,
                    requiresPayment: true,
                    message: 'Abonnement payant, veuillez procéder au paiement via Stripe.',
               }

          } catch (e) {
               console.error('Erreur createSubscription:', e)
               return response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur interne lors de la création de l’abonnement.' },
               })
          }
     }
}

export default new SubscriptionController()
