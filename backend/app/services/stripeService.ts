// services/stripeService.ts
import Stripe from 'stripe'
import supabaseService from '#services/supabaseService'

/* -------------------------------------------------------------------------- */
/*  INITIALISATION STRIPE                                                     */
/* -------------------------------------------------------------------------- */

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
     apiVersion: '2025-03-31.basil',
})

export type BillingCycle = 'month' | 'year'

/* -------------------------------------------------------------------------- */
/*  CLIENT STRIPE                                                             */
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
               /* le customer a peut-être été supprimé côté Stripe : on le recrée */
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
/*  RÉCUPÉRATION DES PRICES (plan principal + modules)                        */
/* -------------------------------------------------------------------------- */

/** Price ID pour un plan donné et une périodicité. */
async function priceForPlan(
     planId: string,
     billing: BillingCycle,
): Promise<string> {
     const { data, error } = await supabaseService
          .from('plans')
          .select('stripe_price_id_monthly, stripe_price_id_annual')
          .eq('id', planId)
          .single()

     if (error || !data)
          throw new Error(`Plan introuvable : ${planId}`)

     const priceId =
          billing === 'month'
               ? data.stripe_price_id_monthly
               : data.stripe_price_id_annual

     if (!priceId)
          throw new Error(
               `Aucun price Stripe trouvé pour le plan ${planId} (${billing})`,
          )

     return priceId as string
}

/** Liste des price_id pour les modules optionnels. */
async function pricesForModules(
     moduleIds: string[],
     billing: BillingCycle,
): Promise<string[]> {
     if (moduleIds.length === 0) return []

     const { data, error } = await supabaseService
          .from('modules')
          .select('stripe_price_id_monthly, stripe_price_id_annual, id')
          .in('id', moduleIds)

     if (error) throw error

     return (data ?? []).map((m) =>
          billing === 'month'
               ? m.stripe_price_id_monthly
               : m.stripe_price_id_annual,
     ) as string[]
}

/** Prix complet (plan + modules) pour une sélection donnée. */
export async function priceIdsForSelection(
     planId: string,
     moduleIds: string[],
     billing: BillingCycle,
): Promise<string[]> {
     return [
          await priceForPlan(planId, billing),
          ...(await pricesForModules(moduleIds, billing)),
     ]
}

/* -------------------------------------------------------------------------- */
/*  CRÉATION & MISE À JOUR D’ABONNEMENT                                       */
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

     const items: Stripe.SubscriptionCreateParams.Item[] = priceIds.map((price) => ({
          price,
     }))

     return stripe.subscriptions.create({
          customer: opts.customerId,
          items,
          payment_behavior: 'default_incomplete',
          default_payment_method: opts.paymentMethodId,
          expand: ['latest_invoice.confirmation_secret', 'items.data'],
     })
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

     const itemsPayload: Stripe.SubscriptionUpdateParams.Item[] = []

     for (const item of sub.items.data) {
          if (desiredPriceIds.includes(item.price.id)) {
               itemsPayload.push({ id: item.id }) // on garde
               desiredPriceIds.splice(desiredPriceIds.indexOf(item.price.id), 1)
          } else {
               itemsPayload.push({ id: item.id, deleted: true }) // on retire
          }
     }

     for (const price of desiredPriceIds) itemsPayload.push({ price })

     return stripe.subscriptions.update(opts.subscriptionId, {
          items: itemsPayload,
          proration_behavior: 'create_prorations',
          default_payment_method: opts.paymentMethodId,
          expand: ['latest_invoice.confirmation_secret', 'items.data'],
     })
}

/* -------------------------------------------------------------------------- */
/*  PREVIEW DE FACTURE (nouvelle API)                                         */
/* -------------------------------------------------------------------------- */

/**
 * Pré-visualise le montant à payer immédiatement (prorata) et le nouveau
 * montant récurrent après changement d’abonnement.
 *
 * @param customerId       ID client Stripe
 * @param subscriptionId   ID abonnement Stripe
 * @param priceIds         Tous les price_id désirés (plan + modules)
 */
export async function getUpcomingInvoicePreview(
     customerId: string,
     subscriptionId: string,
     priceIds: string[],
) {
     const subscriptionDetails: Stripe.InvoiceCreatePreviewParams.SubscriptionDetails =
          {
               items: priceIds.map((p) => ({ price: p })),
               proration_behavior: 'create_prorations',
          }

     /* 1️⃣ – Facture aujourd’hui (prorata, frais uniques éventuels) --------- */
     const immediate = await stripe.invoices.createPreview({
          customer: customerId,
          subscription: subscriptionId,
          subscription_details: subscriptionDetails,
     })

     /* 2️⃣ – Facture récurrente du prochain cycle --------------------------- */
     const recurring = await stripe.invoices.createPreview({
          customer: customerId,
          subscription: subscriptionId,
          subscription_details: subscriptionDetails,
          preview_mode: 'recurring',
     })

     return {
          invoice: immediate,                    // objet Stripe.Invoice
          recurringAmount: recurring.total ?? 0, // cents / cycle
          totalAmount: immediate.total ?? 0,     // cents à payer maintenant
     }
}

export default stripe
