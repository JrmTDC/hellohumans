import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import {
     ensureCustomer,
     previewChange,
     BillingCycle,
     stripe,
} from '#services/stripeService'

class StripeController {
     /* ---------- SetupIntent ---------- */
     public async createSetupIntent(ctx: HttpContext) {
          const customerId = await ensureCustomer(ctx.project)
          const si = await stripe.setupIntents.create({
               customer: customerId,
               payment_method_types: ['card'],
               usage: 'off_session',
          })
          return ctx.response.ok({
               setupIntent: {
                    client_secret: si.client_secret,
                    setup_intent_id: si.id,
               },
          })
     }

     /* ---------- Cartes du client ---------- */
     public async paymentMethods(ctx: HttpContext) {
          const customerId = await ensureCustomer(ctx.project)
          const { data } = await stripe.paymentMethods.list({
               customer: customerId,
               type: 'card',
          })
          return ctx.response.ok({
               payment_methods: data.map((m) => ({
                    id: m.id,
                    card: {
                         brand: m.card?.brand,
                         last4: m.card?.last4,
                         exp_month: m.card?.exp_month,
                         exp_year: m.card?.exp_year,
                    },
               })),
          })
     }

     /* ---------- Preview Upgrade ---------- */
     public async previewUpgrade(ctx: HttpContext) {
          const schema = vine.object({
               plan_id: vine.string(),
               modules: vine.array(vine.string()).optional(),
               billing_cycle: vine.enum(['month', 'year']),
          })
          const { plan_id, modules = [], billing_cycle } =
               await vine.compile(schema).validate(ctx.request.all())

          const preview = await previewChange({
               planId: plan_id,
               modules: modules.map((id: string) => ({ id })),
               cycle: billing_cycle as BillingCycle,
          }, ctx)

          return ctx.response.ok({ preview })
     }

     /* ---------- Cancel Subscription ---------- */
     public async cancelSubscription(ctx: HttpContext) {}

     /* ---------- Confirm Upgrade ---------- */
     public async confirmUpgrade(ctx: HttpContext) {
     }

}

export default new StripeController()
