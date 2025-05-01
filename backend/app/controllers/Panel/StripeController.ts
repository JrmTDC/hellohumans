// controllers/Panel/SubscriptionController.ts
import { HttpContext } from '@adonisjs/core/http'
import stripe, {
     ensureCustomer,
     priceIdsForSelection,
     getUpcomingInvoicePreview,
     createSubscription,
     updateSubscription,
     BillingCycle,
} from '#services/stripeService'
import supabaseService from '#services/supabaseService'
import vine from '@vinejs/vine'

class SubscriptionController {

     public async confirmUpgrade({
                                      client,
                                      project,
                                      subscription,
                                      request,
                                      response,
                                 }: HttpContext) {
          try {
               /* -------- Validation -------- */
               const schema = vine.object({
                    plan_id: vine.string(),
                    modules: vine.array(vine.string()).optional(),
                    billing_cycle: vine.enum(['month', 'year']),
                    payment_method_id: vine.string().optional(), // pas obligatoire pour preview
                    preview_only: vine.boolean().optional().default(false),
               })

               const {
                    plan_id,
                    modules = [],
                    billing_cycle,
                    payment_method_id,
                    preview_only,
               } = await vine.compile(schema).validate(request.all())

               const customerId = await ensureCustomer(client)
               const priceIds = await priceIdsForSelection(
                    plan_id,
                    modules,
                    billing_cycle as BillingCycle,
               )

               /* ------------------------------------------------------------------ */
               /*  PREVIEW UNIQUEMENT (pas de création / mise à jour Stripe)         */
               /* ------------------------------------------------------------------ */
               if (preview_only) {
                    const { invoice, recurringAmount } = await getUpcomingInvoicePreview(
                         customerId,
                         subscription.stripe_subscription_id,
                         priceIds,
                    )

                    return response.ok({
                         today_amount: Number((invoice.total / 100).toFixed(2)),
                         monthly_amount: Number((recurringAmount / 100).toFixed(2)),
                         ends_at: subscription.current_period_end
                              ? new Date(subscription.current_period_end * 1000)
                              : null,
                         is_new_subscription: false,
                         invoice_preview_id: invoice.id,
                    })
               }

               /* ------------------------------------------------------------------ */
               /*  CRÉATION OU MISE À JOUR EFFECTIVE DE L’ABONNEMENT                 */
               /* ------------------------------------------------------------------ */
               let subStripe
               if (!subscription?.stripe_subscription_id) {
                    subStripe = await createSubscription({
                         customerId,
                         plan_id,
                         modules,
                         billing: billing_cycle as BillingCycle,
                         paymentMethodId: payment_method_id!,
                    })
               } else {
                    subStripe = await updateSubscription({
                         subscriptionId: subscription.stripe_subscription_id,
                         plan_id,
                         modules,
                         billing: billing_cycle as BillingCycle,
                         paymentMethodId: payment_method_id!,
                    })
               }

               /* -------- Paiement possiblement “requires_action” -------- */
               let requiresAction = false
               let clientSecret: string | null = null

               if (subStripe.status === 'incomplete') {
                    const confirmation = (subStripe.latest_invoice as any)?.confirmation_secret
                    if (confirmation?.client_secret) {
                         requiresAction = true
                         clientSecret = confirmation.client_secret
                    }
               }

               /* -------- Nouvelle date de fin -------- */
               const nextPeriodEnd = (subStripe.items?.data || []).reduce(
                    (max: number, it: any) =>
                         it.current_period_end && it.current_period_end > max
                              ? it.current_period_end
                              : max,
                    0,
               )

               /* -------- Persistance -------- */
               await supabaseService
                    .from('client_project_subscriptions')
                    .upsert(
                         {
                              project_id: project.id,
                              current_plan_id: plan_id,
                              current_modules: modules,
                              billing_cycle,
                              stripe_subscription_id: subStripe.id,
                              current_period_end: nextPeriodEnd || null,
                              status: subStripe.status,
                              payment_failed: subStripe.status === 'incomplete',
                         },
                         { onConflict: 'project_id' },
                    )

               return response.ok({
                    status: subStripe.status,
                    requiresAction,
                    clientSecret,
                    subscriptionId: subStripe.id,
               })
          } catch (e: any) {
               /* ---------------- Gestion des erreurs Stripe / serveur ---------------- */
               console.error('[confirmUpgrade]', e)

               if (e.type === 'StripeCardError') {
                    return response.status(402).json({
                         error: {
                              name: 'payment_error',
                              type: e.type,
                              code: e.code,
                              message: e.message || 'Paiement refusé',
                              decline_code: e.decline_code,
                         },
                    })
               }

               if (e.type?.startsWith('Stripe')) {
                    return response.status(400).json({
                         error: {
                              name: 'stripe_error',
                              type: e.type,
                              message: e.message || 'Erreur Stripe',
                         },
                    })
               }

               return response.internalServerError({
                    error: {
                         name: 'server_error',
                         message: e.message || 'Erreur interne',
                    },
               })
          }
     }
}

export default new SubscriptionController()
