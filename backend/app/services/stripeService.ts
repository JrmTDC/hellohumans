/* -------------------------------------------------------------------------- */
/*  stripeService.ts – compatible API 2025-03-31.basil                        */
/* -------------------------------------------------------------------------- */
import Stripe from 'stripe'
import supabaseService from '#services/supabaseService'

/* -------------------------------------------------------------------------- */
/*  CONFIG STRIPE                                                             */
/* -------------------------------------------------------------------------- */

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
     apiVersion: '2025-04-30.basil',
})

export type BillingCycle = 'month' | 'year'

/* -------------------------------------------------------------------------- */
/*  CLIENT : CRÉATION / RÉCUPÉRATION                                         */
/* -------------------------------------------------------------------------- */

export async function ensureCustomer(client: {
     id: string
     email: string | null
     name: string | null
     stripe_customer_id?: string | null
}) {
     console.log('ensureCustomer')
     if (client.stripe_customer_id) {
          try {
               const customer = await stripe.customers.retrieve(client.stripe_customer_id)
               if (customer.deleted) {
                    console.log('customer deleted')
                    await supabaseService
                         .from('clients')
                         .update({ stripe_customer_id: null })
                         .eq('id', client.id)
               } else {
                    console.log('customer retrieved')
                    return client.stripe_customer_id
               }
          } catch (error) {
               console.error('customer retrieval failed')
               await supabaseService
                    .from('clients')
                    .update({ stripe_customer_id: null })
                    .eq('id', client.id)
          }
     }
     console.log('customer not found')

     const customer = await stripe.customers.create({
          name: client.name ?? undefined,
          metadata: { client_id: client.id },
     })

     await supabaseService
          .from('clients')
          .update({ stripe_customer_id: customer.id })
          .eq('id', client.id)

     console.log('customer created', customer)
     return customer.id
}

/* -------------------------------------------------------------------------- */
/*  HELPERS : PLANS & MODULES ➜ price_id                                      */
/* -------------------------------------------------------------------------- */

export async function priceForPlan(planId: string, billing: BillingCycle) {
     const { data } = await supabaseService
          .from('subscription_plans')
          .select('stripe_price_id_monthly, stripe_price_id_annual')
          .eq('id', planId)
          .single()

     const priceId =
          billing === 'month' ? data?.stripe_price_id_monthly : data?.stripe_price_id_annual
     if (!priceId) throw new Error(`Plan ${planId} sans price pour ${billing}`)
     return priceId
}

export async function pricesForModules(moduleIds: string[], billing: BillingCycle) {
     if (!moduleIds.length) return []

     const { data } = await supabaseService
          .from('subscription_modules')
          .select('id, stripe_price_id_monthly, stripe_price_id_annual')
          .in('id', moduleIds)

     return (data ?? []).map((m) =>
          billing === 'month' ? m.stripe_price_id_monthly : m.stripe_price_id_annual,
     )
}

/** Tous les price_id désirés (plan + modules). */
export async function priceIdsForSelection(
     planId: string,
     moduleIds: string[],
     billing: BillingCycle,
) {
     return [
          await priceForPlan(planId, billing),
          ...(await pricesForModules(moduleIds, billing)),
     ].filter(Boolean) as string[]
}

/* -------------------------------------------------------------------------- */
/*  ABONNEMENTS : CRÉATION & MISE À JOUR                                      */
/* -------------------------------------------------------------------------- */

export async function createSubscription(opts: {
     customerId: string
     plan_id: string
     modules: string[]
     billing: BillingCycle
     paymentMethodId: string | null | undefined
}) {
     const priceIds = await priceIdsForSelection(opts.plan_id, opts.modules, opts.billing)

     const items: Stripe.SubscriptionCreateParams.Item[] = priceIds.map((p) => ({ price: p }))

     return stripe.subscriptions.create({
          customer: opts.customerId,
          items,
          payment_behavior: 'default_incomplete',
          ...(opts.paymentMethodId ? { default_payment_method: opts.paymentMethodId } : {}),
          expand: ['latest_invoice.confirmation_secret', 'items.data'],
     })
}

/* -- Helper pour updateSubscription : construit un payload items propre ---- */
function buildUpdateItems(
     current: Stripe.Subscription,
     desiredPriceIds: string[],
): Stripe.SubscriptionUpdateParams.Item[] {
     const items: Stripe.SubscriptionUpdateParams.Item[] = []

     for (const it of current.items.data) {
          if (desiredPriceIds.includes(it.price.id)) {
               items.push({ id: it.id }) // on garde
               desiredPriceIds.splice(desiredPriceIds.indexOf(it.price.id), 1)
          } else {
               items.push({ id: it.id, deleted: true }) // on supprime
          }
     }
     for (const price of desiredPriceIds) items.push({ price }) // on ajoute

     return items
}

export async function updateSubscription(opts: {
     subscriptionId: string
     plan_id: string
     modules: string[]
     billing: BillingCycle
     paymentMethodId: string | null | undefined
}) {
     const sub = await stripe.subscriptions.retrieve(opts.subscriptionId, {
          expand: ['items.data'],
     })

     const desiredPriceIds = await priceIdsForSelection(
          opts.plan_id,
          opts.modules,
          opts.billing,
     )

     const itemsPayload = buildUpdateItems(sub, [...desiredPriceIds])

     return stripe.subscriptions.update(opts.subscriptionId, {
          items: itemsPayload,
          proration_behavior: 'create_prorations',
          ...(opts.paymentMethodId ? { default_payment_method: opts.paymentMethodId } : {}),
          expand: ['latest_invoice.confirmation_secret', 'items.data'],
     })
}

/* -------------------------------------------------------------------------- */
/*  PREVIEW : PRORATA & MONTANT RÉCURRENT                                     */
/* -------------------------------------------------------------------------- */

/** Construit `subscription_details.items` pour createPreview. */
function buildPreviewItems(
     sub: Stripe.Subscription,
     desiredPriceIds: string[],
): Stripe.InvoiceCreatePreviewParams.SubscriptionDetails.Item[] {
     const items: Stripe.InvoiceCreatePreviewParams.SubscriptionDetails.Item[] = []

     for (const it of sub.items.data) {
          if (desiredPriceIds.includes(it.price.id)) {
               items.push({ id: it.id }) // on garde
               desiredPriceIds.splice(desiredPriceIds.indexOf(it.price.id), 1)
          } else {
               items.push({ id: it.id, quantity: 0 }) // quantité 0 → suppression
          }
     }
     desiredPriceIds.forEach((p) => items.push({ price: p })) // nouveaux items
     return items
}

/* -- alias local reflétant la forme 2025-03-31 des lignes de facture ------- */
type Line = Stripe.InvoiceLineItem & {
     parent?: {
          subscription_item_details?: { proration?: boolean }
          invoice_item_details?:       { proration?: boolean }
     }
     pricing?: { price_details?: { price: string } }
}

/**
 * Prévisualise :
 *  • le prorata immédiat (total et ventilé par price_id)
 *  • le montant récurrent du prochain cycle (total et ventilé par price_id)
 */
export async function getUpcomingInvoicePreview(
     customerId: string,
     subId: string,
     desiredPriceIds: string[],
) {
     const sub   = await stripe.subscriptions.retrieve(subId, { expand: ['items.data'] })
     const items = buildPreviewItems(sub, [...desiredPriceIds])

     /* -------- 1) prorata immédiat -------- */
     const immediate = await stripe.invoices.createPreview({
          customer: customerId,
          subscription: subId,
          subscription_details: { items, proration_behavior: 'create_prorations' },
          expand: ['lines.data.pricing'],
     })

     const debitByPrice:  Record<string, number> = {}   // montants > 0
     const creditByPrice: Record<string, number> = {}   // montants < 0
     const prorationsByPrice: Record<string, number> = {}
     let totalProrata = 0

     for (const l of immediate.lines.data as Line[]) {
          const priceId     = l.pricing?.price_details?.price
          const isProration =
               l.parent?.subscription_item_details?.proration ??
               l.parent?.invoice_item_details?.proration ?? false

          if (priceId && isProration) {
               prorationsByPrice[priceId] = (prorationsByPrice[priceId] ?? 0) + (l.amount ?? 0)
               totalProrata += l.amount ?? 0
               if ((l.amount ?? 0) >= 0) {
                    debitByPrice [priceId] = (debitByPrice [priceId] ?? 0) + (l.amount ?? 0)
               } else {
                    creditByPrice[priceId] = (creditByPrice[priceId] ?? 0) + Math.abs(l.amount ?? 0)
               }
          }
     }

     /* -------- 2) récurrence prochaine période -------- */
     const recurring = await stripe.invoices.createPreview({
          customer: customerId,
          subscription: subId,
          subscription_details: { items },
          preview_mode: 'recurring',
          expand: ['lines.data.pricing'],
     })

     const recurringByPrice: Record<string, number> = {}
     for (const l of recurring.lines.data as Line[]) {
          const priceId = l.pricing?.price_details?.price
          if (priceId) {
               recurringByPrice[priceId] =
                    (recurringByPrice[priceId] ?? 0) + (l.amount ?? 0)
          }
     }

     const totalDebit  = Object.values(debitByPrice ).reduce((s, n) => s + n, 0)
     const totalCredit = Object.values(creditByPrice).reduce((s, n) => s + n, 0)

     return {
          invoice:immediate,
          totalAmount: Math.max(0, totalProrata),
          totalDebit,
          totalCredit,
          netAmount: totalDebit - totalCredit,
          recurringAmount: Math.max(0, recurring.total ?? 0),
          debitByPrice,
          creditByPrice,
          recurringByPrice,
     }
}
