import { HttpContext } from '@adonisjs/core/http'
import {
     ensureCustomer,
     priceIdsForSelection,
     getUpcomingInvoicePreview,
     BillingCycle,
} from '#services/stripeService'
import vine from '@vinejs/vine'

class StripeController {
     /** Route GET /panel/subscription/preview */
     public async previewUpgrade({
                                      client,
                                      subscription,
                                      request,
                                      response,
                                 }: HttpContext) {
          try {
               /* ---- Validation ---- */
               const schema = vine.object({
                    plan_id: vine.string(),
                    modules: vine.array(vine.string()).optional(),
                    billing_cycle: vine.enum(['month', 'year']),
               })
               const { plan_id, modules = [], billing_cycle } = await vine
                    .compile(schema)
                    .validate(request.all())

               /* ---- Prix visés ---- */
               const customerId = await ensureCustomer(client)
               const priceIds = await priceIdsForSelection(
                    plan_id,
                    modules,
                    billing_cycle as BillingCycle,
               )

               /* ---- Preview Stripe ---- */
               const { invoice, recurringAmount, totalAmount} = await getUpcomingInvoicePreview(
                    customerId,
                    subscription.stripe_subscription_id,
                    priceIds,
               )

               return response.ok({
                    today_amount: +(totalAmount / 100).toFixed(2),
                    cycle_amount: +(recurringAmount / 100).toFixed(2), // ← nouveau nom
                    ends_at: subscription.current_period_end
                         ? new Date(subscription.current_period_end * 1000)
                         : null,
                    is_new_subscription: false,
                    invoice_preview_id: invoice.id,
               })
          } catch (e: any) {
               console.error('[previewUpgrade]', e)
               return response.badRequest({
                    error: {
                         name: e.type ?? 'preview_error',
                         message: e.message ?? 'Impossible de pré-visualiser la facture',
                    },
               })
          }
     }
}

export default new StripeController()
