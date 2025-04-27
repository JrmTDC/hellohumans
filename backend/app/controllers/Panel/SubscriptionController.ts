import { HttpContext } from '@adonisjs/core/http'
import supabaseService from '#services/supabaseService'
import stripeService, { updateSubscription } from '#services/stripeService'

class SubscriptionController {
     public async createSubscription(ctx: HttpContext) {
          const { plan_id, modules, billing_cycle } = ctx.request.only(['plan_id', 'modules', 'billing_cycle'])

          try {
               if (!plan_id || !billing_cycle) {
                    return ctx.response.badRequest({
                         error: { name: 'missingParams', description: 'Paramètres requis manquants.' },
                    })
               }

               let { data: subscription } = await supabaseService
                    .from('client_project_subscriptions')
                    .select('*')
                    .eq('project_id', ctx.project.id)
                    .maybeSingle()

               if (!subscription) {
                    const { data: newSub } = await supabaseService
                         .from('client_project_subscriptions')
                         .insert({
                              project_id: ctx.project.id,
                              status: 'inactive',
                              current_plan_id: null,
                              current_modules: [],
                              billing_cycle,
                              is_trial: false,
                              payment_failed: false,
                         })
                         .select('*')
                         .single()

                    subscription = newSub
               }

               const { data: plan } = await supabaseService
                    .from('subscription_plans')
                    .select('*')
                    .eq('id', plan_id)
                    .maybeSingle()

               if (!plan) {
                    return ctx.response.badRequest({ error: { name: 'invalidPlan', description: 'Plan introuvable.' } })
               }

               const isFree = plan.monthlyPrice === 0 && (!modules || modules.length === 0)

               if (isFree) {
                    await supabaseService.from('client_project_subscriptions').update({
                         current_plan_id: plan_id,
                         current_modules: [],
                         billing_cycle,
                         status: 'free',
                         payment_failed: false,
                         stripe_subscription_id: null,
                         current_period_end: null,
                         canceled_at: null,
                         is_trial: false,
                         trial_end_at: null,
                    }).eq('project_id', ctx.project.id)

                    return ctx.response.ok({ message: 'Abonnement gratuit activé.' })
               }

               const customer = await stripeService.customers.create({
                    metadata: { project_id: ctx.project.id },
                    description: `Client HelloHumans - Projet ${ctx.project.id}`,
               })

               const stripePriceId = billing_cycle === 'monthly'
                    ? plan.stripe_price_id_monthly
                    : plan.stripe_price_id_annual

               const stripeSubscription = await stripeService.subscriptions.create({
                    customer: customer.id,
                    items: [{ price: stripePriceId }],
                    payment_behavior: 'default_incomplete',
                    expand: ['latest_invoice.payment_intent'],
                    metadata: { project_id: ctx.project.id },
               })

               await supabaseService.from('client_project_subscriptions').update({
                    current_plan_id: plan_id,
                    current_modules: modules ?? [],
                    billing_cycle,
                    status: 'pending',
                    stripe_subscription_id: stripeSubscription.id,
                    payment_failed: false,
               }).eq('project_id', ctx.project.id)

               return ctx.response.ok({
                    mode: 'paid',
                    subscription_id: subscription.id,
                    stripe: {
                         subscription_id: stripeSubscription.id,
                         customer_id: customer.id,
                    }
               })
          } catch (err) {
               console.error('Erreur createSubscription:', err)
               return ctx.response.internalServerError({
                    error: { name: 'subscriptionError', description: 'Erreur lors de la création de l’abonnement.' },
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
                         error: { name: 'missingParams', description: 'Paramètres requis manquants.' },
                    })
               }

               let stripeCustomerId = client.stripe_customer_id
               if (!stripeCustomerId) {
                    const customer = await stripeService.customers.create({ metadata: { client_id: client.id } })
                    stripeCustomerId = customer.id
                    await supabaseService.from('clients').update({ stripe_customer_id: stripeCustomerId }).eq('id', client.id)
               }

               await stripeService.customers.update(stripeCustomerId, {
                    invoice_settings: {
                         default_payment_method: payment_method_id,
                    },
               })

               const updateResult = await updateSubscription({
                    customerId: stripeCustomerId,
                    subscriptionId: subscription?.stripe_subscription_id,
                    plan_id,
                    modules,
                    billing_cycle,
               })

               await supabaseService.from('client_project_subscriptions').update({
                    current_plan_id: plan_id,
                    current_modules: modules ?? [],
                    billing_cycle,
                    status: updateResult.status === 'active' ? 'active' : subscription.status,
                    payment_failed: false,
                    stripe_subscription_id: updateResult.subscriptionId,
                    current_period_end: Math.floor(updateResult.currentPeriodEnd / 1000),
               }).eq('project_id', project.id)

               return ctx.response.ok({
                    message: updateResult.status === 'active'
                         ? 'Upgrade appliqué immédiatement.'
                         : 'Votre changement prendra effet à la prochaine période.'
               })

          } catch (error) {
               console.error('Erreur confirmUpgrade:', error)
               return ctx.response.internalServerError({
                    error: {
                         name: 'upgradeError',
                         description: 'Erreur lors de la confirmation de l’upgrade.'
                    },
               })
          }
     }
}

export default new SubscriptionController()
