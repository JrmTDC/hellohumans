import { HttpContext } from '@adonisjs/core/http'
import {
     ensureCustomer,
     priceForPlan,
     pricesForModules,
     getUpcomingInvoicePreview,
     BillingCycle,
     stripe
} from '#services/stripeService'
import supabaseService from '#services/supabaseService'
import vine from '@vinejs/vine'

class StripeController {

     /**
      * Crée un SetupIntent pour ajouter une nouvelle carte
      */
     public async createSetupIntent(ctx: HttpContext) {
          try {
               const customerId = await ensureCustomer(ctx.project)
               const setupIntent = await stripe.setupIntents.create({
                    customer: customerId,
                    payment_method_types: ['card'],
                    usage: 'off_session'
               })

               return ctx.response.ok({
                    setupIntent: {
                         client_secret: setupIntent.client_secret,
                         setup_intent_id: setupIntent.id
                    }
               })
          } catch (error: any) {
               return ctx.response.status(500).json({
                    error: {
                         code: 'STRIPE_SETUP_INTENT_ERROR',
                         message: error.message || 'Failed to create setup intent'
                    }
               })
          }
     }

     /**
      * Liste les méthodes de paiement du client
      */
     public async paymentMethods(ctx: HttpContext) {
          try {
               const customerId = await ensureCustomer(ctx.project)
               const paymentMethods = await stripe.paymentMethods.list({
                    customer: customerId,
                    type: 'card'
               })

               return ctx.response.ok({
                    payment_methods: paymentMethods.data.map(method => ({
                         id: method.id,
                         card: {
                              brand: method.card?.brand,
                              last4: method.card?.last4,
                              exp_month: method.card?.exp_month,
                              exp_year: method.card?.exp_year
                         }
                    }))
               })
          } catch (error: any) {
               return ctx.response.status(500).json({
                    error: {
                         code: 'STRIPE_LIST_PAYMENT_METHODS_ERROR',
                         message: error.message || 'Failed to list payment methods'
                    }
               })
          }
     }

     /**
      * Prévisualise la mise à niveau d'un abonnement
      */
     public async previewUpgrade(ctx: HttpContext) {
          try {
               /* ---- Validation ---- */
               const schema = vine.object({
                    plan_id: vine.string(),
                    modules: vine.array(vine.string()).optional(),
                    billing_cycle: vine.enum(['month', 'year']),
               })
               const { plan_id, modules = [], billing_cycle } = await vine.compile(schema).validate(ctx.request.all())

               /* ---- Prix ---- */
               const customerId = await ensureCustomer(ctx.project)
               const planPriceId   = await priceForPlan(plan_id, billing_cycle as BillingCycle)
               const modulePriceIds = await pricesForModules(modules, billing_cycle as BillingCycle)
               const desiredPriceIds = [planPriceId, ...modulePriceIds]


               if (!ctx.subscription || !ctx.subscription.stripe_subscription_id) {
                    const planPriceId   = await priceForPlan(plan_id, billing_cycle as BillingCycle)
                    const modulePriceIds = await pricesForModules(modules, billing_cycle as BillingCycle)
                    const desiredPriceIds = [planPriceId, ...modulePriceIds]

                    // Récupération manuelle de tous les prix
                    const prices = await Promise.all(
                         desiredPriceIds.map(id =>
                              stripe.prices.retrieve(id, { expand: ['product'] })
                         )
                    )

                    // Conversion cents → euros
                    const euros = (amount?: number | null) => +((amount ?? 0) / 100).toFixed(2)

                    const getPrice = (id: string) => prices.find(p => p.id === id)
                    const planPrice = getPrice(planPriceId)
                    const modulePrices = modulePriceIds.map(id => getPrice(id))

                    const planChange = {
                         id:               plan_id,
                         effective_date:   new Date().toISOString(),
                         effective_action: 'immediate',
                         price_now:        euros(planPrice?.unit_amount),
                         credit_amount:    0,
                         price_cycle:      euros(planPrice?.unit_amount),
                    }

                    const modulesAdded = modules.map((id, idx) => {
                         const price = modulePrices[idx]
                         return {
                              id,
                              effective_date:   new Date().toISOString(),
                              effective_action: 'immediate',
                              price_now:        euros(price?.unit_amount),
                              credit_amount:    0,
                              price_cycle:      euros(price?.unit_amount),
                         }
                    })

                    const totalNow = prices.reduce((sum, p) => sum + (p.unit_amount ?? 0), 0)

                    return ctx.response.ok({
                         preview:{
                              today_debit:   euros(totalNow),
                              today_credit:  0,
                              today_amount:  euros(totalNow),
                              cycle_amount:  euros(totalNow),
                              ends_at:       null,
                              is_new_subscription: true,
                              changes: {
                                   plan: planChange,
                                   modules: {
                                        added: modulesAdded
                                   }
                              },
                              invoice_preview_id: null
                         }
                    })
               }

               /* ---- Pré-visualisation ---- */

               const {
                    invoice,
                    totalAmount,
                    totalDebit,
                    totalCredit,
                    recurringAmount,
                    debitByPrice,
                    creditByPrice,
                    recurringByPrice,
                    removedModules
               } = await getUpcomingInvoicePreview(
                    customerId,
                    ctx.subscription.stripe_subscription_id,
                    desiredPriceIds,
               )

               /* ------- helpers ------- */
               function euros(c: number | undefined) {
                    return +((c ?? 0) / 100).toFixed(2)
               }
               function buildAction(charge: number, credit: number, isRemoval = false) {
                    if (isRemoval) return 'end_of_period'
                    return charge > 0 || credit > 0 ? 'immediate' : 'end_of_period'
               }

               /* ------- plan ------- */
               const planProrata   = debitByPrice[planPriceId] ?? 0
               const planCreditRaw = creditByPrice[planPriceId] ?? 0

               const { data: planData, error: planError } = await supabaseService
                    .from('subscription_plans')
                    .select('name')
                    .eq('id', plan_id)
                    .single()

               if (planError || !planData?.name) {
                    console.error('Erreur récupération plan:', planError)
                    return ctx.response.internalServerError({
                         error: { name: 'supabprice_nowaseError', description: 'Erreur lors de la récupération du plan.' },
                    })
               }

               const planName = planData.name[ctx.user?.lang] || planData.name['en'] || 'Unknown plan'

               const currentPlanPriceId = ctx.subscription.items?.data.find((item: any) =>
                    item.price?.metadata?.is_plan === 'true'
               )?.price.id

               const isSamePlan = currentPlanPriceId === planPriceId
               const planChange = isSamePlan ? null : {
                    id: plan_id,
                    name: planName || 'Unknown plan',
                    effective_date: new Date().toISOString(),
                    effective_action: buildAction(planProrata, planCreditRaw),
                    price_now: euros(planProrata),
                    credit_amount: euros(planCreditRaw),
                    price_cycle: euros(recurringByPrice[planPriceId]),
               }


               /* ------- modules ajoutés ------- */
               const { data: modulesData, error: modulesError } = await supabaseService
                    .from('subscription_modules')
                    .select('id, name')
                    .in('id', modules)

               if (modulesError) {
                    console.error('Erreur récupération modules:', modulesError)
               }

               // Récupérer les prix et leurs IDs correspondants
               const priceDetails = await supabaseService
                    .from('subscription_modules')
                    .select('id, name, stripe_price_id_monthly, stripe_price_id_annual,stripe_price_once, stripe_many_options, stripe_type_price')
                    .in('id', modules)

               if (priceDetails.error) {
                    console.error('Erreur récupération détails modules:', priceDetails.error)
               }

               const modulesAdded = modulePriceIds.map((priceId) => {
                    const prorata = debitByPrice[priceId] ?? 0
                    const credit = creditByPrice[priceId] ?? 0
                    const module = priceDetails.data?.find(m => {
                         if(m.stripe_type_price === 'once') {
                              const stripe_price_once = m.stripe_price_once
                              if(m.stripe_many_options === true) {
                                   //todo: handle multiple options for once payment
                              }
                              return stripe_price_once.default === priceId
                         }else{
                              if(m.stripe_many_options === true) {
                                   //todo: handle multiple options for monthly/annual payment
                              }
                              const stripe_price_recurring = ctx.subscription.billing_cycle === 'month'
                                   ? m.stripe_price_id_monthly
                                   : m.stripe_price_id_annual
                              return stripe_price_recurring.default === priceId
                         }

                    })

                    const moduleName = module?.name[ctx.user?.lang]
                        || module?.name['en']
                        || `Unknown module`

                    return {
                         id: module?.id || 'unknown',
                         name: moduleName,
                         stripe_price_id: priceId,
                         effective_date: new Date().toISOString(),
                         effective_action: buildAction(prorata, credit),
                         price_now: euros(prorata),
                         credit_amount: euros(credit),
                         price_cycle: euros(recurringByPrice[priceId]),
                    }
               })

               // Identifier les modules actuels
               const currentModules = ctx.subscription.items?.data ?
                    ctx.subscription.items.data
                        .filter((item: any) => item.price?.metadata?.is_module === 'true')
                        .map((item: any) => ({
                            id: item.price?.metadata?.module_id,
                            priceId: item.price?.id,
                            name: item.price?.metadata?.name
                        }))
                        .filter((mod: any): mod is { id: string, priceId: string, name: string } =>
                            mod.id !== undefined && mod.priceId !== undefined && mod.name !== undefined) :
                    []

               function buildRemovalRow(stripePriceId: string, module: any /* ou null */) {
                    const lang = ctx.user?.lang ?? 'en'

                    return {
                         id:               module?.id   ?? 'unknown',
                         name:             module?.name?.[lang] ?? module?.name?.en ?? 'Unknown module',
                         stripe_price_id:  stripePriceId,
                         effective_date:   new Date().toISOString(),
                         effective_action: 'end_of_period',   // ← on sait déjà que c’est un retrait
                         price_now:        euros(0),          // ← rien à facturer aujourd’hui
                         credit_amount:    euros(0),          // ← pas de crédit immédiat
                         price_cycle:      euros(0),          // ← ne sera plus facturé au prochain cycle
                    }
               }

               // Identifier les modules supprimés en utilisant removedModules de Stripe
               const modulesRemoved = await Promise.all(
                    removedModules.map(async (stripePriceId: string) => {
                      const { data } = await supabaseService
                        .from('subscription_modules')
                        .select('id, name, stripe_price_id_monthly, stripe_price_id_annual,stripe_price_once, stripe_many_options, stripe_type_price')
                        .or(`stripe_price_id_monthly.eq.${stripePriceId},stripe_price_id_annual.eq.${stripePriceId}`)
                        .limit(1)

                      return buildRemovalRow(stripePriceId, data?.[0])
                    }),
               )

               /* ------- réponse ------- */
               return ctx.response.ok({
                    preview : {
                         today_debit:   euros(totalDebit),
                         today_credit:  euros(totalCredit),
                         today_amount:  euros(totalAmount),
                         cycle_amount:  euros(recurringAmount),
                         ends_at:       ctx.subscription.current_period_end
                              ? new Date(ctx.subscription.current_period_end * 1000)
                              : null,
                         is_new_subscription: false,
                         changes: {
                              plan:    planChange,
                              modules: {
                                   added: modulesAdded,
                                   removed: modulesRemoved
                              },
                         },
                         invoice_preview_id: invoice.id
                    }
               })
          } catch (e: any) {
               console.error('[previewUpgrade]', e)
               return ctx.response.badRequest({
                    error: {
                         name: e.type ?? 'preview_error',
                         message: e.message ?? 'Impossible de pré-visualiser la facture',
                    },
               })
          }
     }
}

export default new StripeController()
