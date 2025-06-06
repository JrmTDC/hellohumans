import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import supabaseService from '#services/supabaseService'
import { BillingCycle } from '#services/stripeService'

class SubscriptionController {
     public async confirmUpgrade(ctx: HttpContext) {
          try {
               /* -------- Validation -------- */
               const schema = vine.object({
                    plan_id: vine.string(),
                    modules: vine.array(vine.string()).optional(),
                    billing_cycle: vine.enum(['month', 'year']),
                    payment_method_id: vine.string().optional(),
               })
               const { plan_id, modules = [], billing_cycle, payment_method_id } =
                    await vine.compile(schema).validate(ctx.request.all())

               /* -------- Stripe -------- */
               const subStripe = await createOrUpdateSub({
                    project: ctx.project,
                    currentSubId: ctx.subscription?.stripe_subscription_id ?? null,
                    planId: plan_id,
                    modules: modules.map((id: string) => ({ id })),
                    cycle: billing_cycle as BillingCycle,
                    paymentMethodId: payment_method_id ?? undefined,
               })

               /* -------- Paiement 3-DS ? -------- */
               const pi = (subStripe.latest_invoice as any)?.payment_intent
               const requiresAction =
                    subStripe.status === 'incomplete' && pi?.status === 'requires_action'

               /* -------- Persistance -------- */
               await supabaseService.from('project_subscriptions').upsert(
                    {
                         project_id: ctx.project.id,
                         current_plan_id: plan_id,
                         current_modules: modules,
                         billing_cycle,
                         stripe_subscription_id: subStripe.id,
                         current_period_end: subStripe.current_period_end,
                         status: subStripe.status,
                    },
                    { onConflict: 'project_id' },
               )

               return ctx.response.ok({
                    status: subStripe.status,
                    requiresAction,
                    clientSecret: requiresAction ? pi.client_secret : null,
                    subscriptionId: subStripe.id,
               })
          } catch (e: any) {
               console.error('[confirmUpgrade]', e)
               const isStripe = e.type?.startsWith('Stripe')
               return ctx.response.status(isStripe ? 400 : 500).json({
                    error: {
                         name: isStripe ? 'stripe_error' : 'server_error',
                         type: e.type,
                         message: e.message ?? 'Erreur interne',
                         code: e.code,
                    },
               })
          }
     }
}

export default new SubscriptionController()
