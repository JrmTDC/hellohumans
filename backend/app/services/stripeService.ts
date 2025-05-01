import Stripe from 'stripe'
import supabaseService from '#services/supabaseService'

/* -------------------------------------------------------------------------- */
/*  CONFIG STRIPE                                                             */
/* -------------------------------------------------------------------------- */

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
     apiVersion: '2025-03-31.basil',
})

export type BillingCycle = 'month' | 'year'

/* -------------------------------------------------------------------------- */
/*  CLIENT : CRÉATION / RÉCUPÉRATION                                         */
/* -------------------------------------------------------------------------- */

export async function ensureCustomer(clientRow: {
     id: string
     email: string | null
     name: string | null
     stripe_customer_id?: string | null
}): Promise<string> {
     if (clientRow.stripe_customer_id) {
          try {
               await stripe.customers.retrieve(clientRow.stripe_customer_id)
               return clientRow.stripe_customer_id
          } catch {
               /* supprimé côté Stripe → on recrée */
          }
     }

     const customer = await stripe.customers.create({
          email: clientRow.email ?? undefined,
          name: clientRow.name ?? undefined,
          metadata: { client_id: clientRow.id },
     })

     await supabaseService
          .from('clients')
          .update({ stripe_customer_id: customer.id })
          .eq('id', clientRow.id)

     return customer.id
}

/* -------------------------------------------------------------------------- */
/*  HELPERS : PLANS & MODULES ➜ price_id                                      */
/* -------------------------------------------------------------------------- */

async function priceForPlan(planId: string, billing: BillingCycle) {
     const { data } = await supabaseService
          .from('subscription_plans')
          .select('stripe_price_id_monthly, stripe_price_id_annual')
          .eq('id', planId)
          .single()

     const priceId =
          billing === 'month'
               ? data?.stripe_price_id_monthly
               : data?.stripe_price_id_annual

     /* ➜ SI le plan n’a pas de price pour ce cycle, on lève aussitôt */
     if (!priceId) {
          throw new Error(
               `Aucun price Stripe trouvé pour le plan « ${planId} » (${billing})`,
          )
     }

     return priceId
}

async function pricesForModules(moduleIds: string[], billing: BillingCycle) {
     if (!moduleIds.length) return []

     const { data } = await supabaseService
          .from('subscription_modules')
          .select('stripe_price_id_monthly, stripe_price_id_annual, id')
          .in('id', moduleIds)

     return (data ?? []).map((m) =>
          billing === 'month'
               ? m.stripe_price_id_monthly
               : m.stripe_price_id_annual,
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
     paymentMethodId: string
}) {
     const priceIds = await priceIdsForSelection(
          opts.plan_id,
          opts.modules,
          opts.billing,
     )

     const items: Stripe.SubscriptionCreateParams.Item[] = priceIds.map((p) => ({
          price: p,
     }))

     return stripe.subscriptions.create({
          customer: opts.customerId,
          items,
          payment_behavior: 'default_incomplete',
          default_payment_method: opts.paymentMethodId,
          expand: ['latest_invoice.confirmation_secret', 'items.data'],
     })
}

/* -------- Helper : construire payload items pour update ------------------ */
function buildUpdateItems(
     current: Stripe.Subscription,
     desiredPriceIds: string[],
): Stripe.SubscriptionUpdateParams.Item[] {
     const items: Stripe.SubscriptionUpdateParams.Item[] = []

     for (const it of current.items.data) {
          if (desiredPriceIds.includes(it.price.id)) {
               items.push({ id: it.id })                     // garder
               desiredPriceIds.splice(desiredPriceIds.indexOf(it.price.id), 1)
          } else {
               items.push({ id: it.id, deleted: true })      // supprimer
          }
     }
     for (const price of desiredPriceIds) items.push({ price }) // ajouter

     return items
}

export async function updateSubscription(opts: {
     subscriptionId: string
     plan_id: string
     modules: string[]
     billing: BillingCycle
     paymentMethodId: string
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
          default_payment_method: opts.paymentMethodId,
          expand: ['latest_invoice.confirmation_secret', 'items.data'],
     })
}

/* -------------------------------------------------------------------------- */
/*  PREVIEW : PRORATA & MONTANT RÉCURRENT                                     */
/* -------------------------------------------------------------------------- */

function buildPreviewItems(
     current: Stripe.Subscription,
     desiredPriceIds: string[],
): Stripe.InvoiceCreatePreviewParams.SubscriptionDetails.Item[] {
     const items: Stripe.InvoiceCreatePreviewParams.SubscriptionDetails.Item[] = []

     for (const it of current.items.data) {
          if (desiredPriceIds.includes(it.price.id)) {
               items.push({ id: it.id })
               desiredPriceIds.splice(desiredPriceIds.indexOf(it.price.id), 1)
          } else {
               items.push({ id: it.id, quantity: 0 })
          }
     }

     for (const price of desiredPriceIds) items.push({ price }) // nouveau débit

     return items
}

/**
 * prorata immédiat & montant récurrent (mensuel ou annuel)
 */
export async function getUpcomingInvoicePreview(
     customerId: string,
     subscriptionId: string,
     desiredPriceIds: string[],
) {
     /* Récupérer l’abonnement existant (+ items)  */
     const sub = await stripe.subscriptions.retrieve(subscriptionId, {
          expand: ['items.data'],
     })

     const subscriptionItems = buildPreviewItems(sub, [...desiredPriceIds])

     /* Facture d’aujourd’hui (prorata) */
     const immediate = await stripe.invoices.createPreview({
          customer: customerId,
          subscription: subscriptionId,
          subscription_details: {
               items: subscriptionItems,
               proration_behavior: 'create_prorations',
          },
     })

     type LineWithProration =
          Stripe.InvoiceLineItem & {
          parent?: { subscription_item_details?: { proration?: boolean } }
     }

     const prorataTotal = (immediate.lines.data as LineWithProration[])
          .filter((l) => l.parent?.subscription_item_details?.proration)
          .reduce((sum, l) => sum + (l.amount ?? 0), 0)


     /* Facture récurrente (cycle suivant) */
     const recurring = await stripe.invoices.createPreview({
          customer: customerId,
          subscription: subscriptionId,
          subscription_details: { items: subscriptionItems }, // pas de proration ici
          preview_mode: 'recurring',
     })

     return {
          invoice: immediate,                    // Stripe.Invoice
          recurringAmount: recurring.total ?? 0, // cents / cycle
          totalAmount: prorataTotal ?? 0,     // cents maintenant
     }
}

//export default stripe
