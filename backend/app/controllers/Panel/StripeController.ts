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
               const customerId = await ensureCustomer(ctx.client)
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
               const customerId = await ensureCustomer(ctx.client)
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
               const customerId = await ensureCustomer(ctx.client)
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
               function buildAction(charge: number, credit: number) {
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

               const planChange = {
                    id:               plan_id,
                    name:             planName,
                    effective_date:   new Date().toISOString(),
                    effective_action: buildAction(planProrata, planCreditRaw),
                    price_now:        euros(planProrata),
                    credit_amount:    euros(planCreditRaw),
                    price_cycle:      euros(recurringByPrice[planPriceId]),
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
                    .select('id, name, stripe_price_id_monthly, stripe_price_id_annual')
                    .in('id', modules)

               if (priceDetails.error) {
                    console.error('Erreur récupération détails modules:', priceDetails.error)
               }

               const modulesAdded = modulePriceIds.map((priceId) => {
                    const prorata = debitByPrice[priceId] ?? 0
                    const credit = creditByPrice[priceId] ?? 0
                    const moduleId = priceDetails.data?.find(m => {
                        const stripePriceId = ctx.subscription.billing_cycle === 'month' 
                            ? m.stripe_price_id_monthly 
                            : m.stripe_price_id_annual
                        return stripePriceId === priceId
                    })?.id

                    const moduleName = moduleId 
                        ? modulesData?.find(m => m.id === moduleId)?.name[ctx.user?.lang] 
                        || modulesData?.find(m => m.id === moduleId)?.name['en'] 
                        || `Unknown module`
                        : `Unknown module`

                    return {
                         id: moduleId || 'unknown',
                         name: moduleName,
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

               // Identifier les modules supprimés en utilisant removedModules de Stripe
               const modulesRemoved = removedModules.map((moduleId: string) => {
                    const currentModule = currentModules.find(mod => mod.id === moduleId)
                    if (!currentModule) {
                        return {
                            id: moduleId,
                            name: `Unknown module`,
                            effective_date: new Date().toISOString(),
                            effective_action: 'end_of_period',
                            price_now: euros(0),
                            credit_amount: euros(0),
                            price_cycle: euros(0)
                        }
                    }

                    const prorata = debitByPrice[currentModule.priceId] ?? 0
                    const credit = creditByPrice[currentModule.priceId] ?? 0
                    const recurring = recurringByPrice[currentModule.priceId] ?? 0
                    
                    return {
                         id:               currentModule.id,
                         name:             currentModule.name,
                         effective_date:   new Date().toISOString(),
                         effective_action: buildAction(prorata, credit),
                         price_now:        euros(prorata - credit),
                         credit_amount:    euros(credit),
                         price_cycle:      euros(recurring),
                    }
               })

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
