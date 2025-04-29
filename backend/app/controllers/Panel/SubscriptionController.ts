import { HttpContext } from '@adonisjs/core/http'
import {
     ensureCustomer,
     createSetupIntent,
     listPaymentMethods,
     previewUpcomingInvoice,
} from '#services/stripeService'

export default class StripeController {
     /** SetupIntent → client_secret pour Stripe.js */
     public async createSetupIntent({ client, response }: HttpContext) {
          try {
               const cid = await ensureCustomer(client)
               const si = await createSetupIntent(cid)
               return response.ok({ client_secret: si.client_secret })
          } catch (err) {
               console.error('[createSetupIntent]', err)
               return response.internalServerError({
                    error: { name: 'stripe', description: 'Erreur Stripe' },
               })
          }
     }

     /** Liste des cartes stockées */
     public async paymentMethods({ client, response }: HttpContext) {
          try {
               const cid = await ensureCustomer(client)
               const pm = await listPaymentMethods(cid)
               return response.ok({
                    paymentMethods: pm.data.map((m) => ({
                         id: m.id,
                         brand: m.card?.brand,
                         last4: m.card?.last4,
                         exp_month: m.card?.exp_month,
                         exp_year: m.card?.exp_year,
                    })),
               })
          } catch (err) {
               console.error('[paymentMethods]', err)
               return response.internalServerError({
                    error: { name: 'stripe', description: 'Erreur Stripe' },
               })
          }
     }

     /** Aperçu de l’upgrade/prorata */
     public async previewUpgrade({ client, project, request, response }: HttpContext) {
          try {
               const { plan_id, modules = [], billing_cycle } = request.only([
                    'plan_id',
                    'modules',
                    'billing_cycle',
               ])
               const cid = await ensureCustomer(client)
               const invoice = await previewUpcomingInvoice(
                    cid,
                    project.stripe_subscription_id!,
                    plan_id,
                    modules,
                    billing_cycle
               )
               return response.ok({ invoice })
          } catch (err) {
               console.error('[previewUpgrade]', err)
               return response.internalServerError({
                    error: { name: 'stripe', description: 'Erreur preview' },
               })
          }
     }
}
