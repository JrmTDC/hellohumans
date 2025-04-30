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
               /* s’il a été supprimé côté Stripe, on en crée un nouveau */
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

/**
 * Renvoie le `price_id` Stripe correspondant à un plan et à une périodicité.
 */
async function priceForPlan(
     planId: string,
     billing: BillingCycle,
): Promise<string> {
     const { data, error } = await supabaseService
          .from('subscription_plans')
          .select('stripe_price_id_annual, stripe_price_id_monthly')
          .eq('id', planId)
          .single()

     if (error || !data?.stripe_price_id_annual || !data?.stripe_price_id_monthly) {
          throw new Error(
               `Aucun prix Stripe trouvé pour le plan ${planId} (${billing})`,
          )
     }

     return billing === 'year' ? data.stripe_price_id_annual : data.stripe_price_id_monthly as string
}

/**
 * Renvoie la liste des `price_id` Stripe à activer pour les modules choisis.
 */
async function pricesForModules(
     moduleIds: string[],
     billing: BillingCycle,
): Promise<string[]> {
     if (moduleIds.length === 0) return []

     const { data, error } = await supabaseService
          .from('subscription_modules')
          .select('stripe_price_id_annual, stripe_price_id_monthly')
          .eq('id', moduleIds)
          .single()

     if (error || !data?.stripe_price_id_annual || !data?.stripe_price_id_monthly) {
          throw new Error(
               `Aucun prix Stripe trouvé pour le module ${moduleIds} (${billing})`,
          )
     }

     return billing === 'year' ? data.stripe_price_id_annual : data.stripe_price_id_monthly
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
     const priceIds = [
          await priceForPlan(opts.plan_id, opts.billing),
          ...(await pricesForModules(opts.modules, opts.billing)),
     ]

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

     const desiredPriceIds = [
          await priceForPlan(opts.plan_id, opts.billing),
          ...(await pricesForModules(opts.modules, opts.billing)),
     ]

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
/*  PREVIEW DE FACTURE (remplace /invoices/upcoming)                          */
/* -------------------------------------------------------------------------- */

export async function getUpcomingInvoicePreview(
     customerId: string,
     subscriptionId: string,
) {
     const invoice = await stripe.invoices.createPreview({
          customer: customerId,
          subscription: subscriptionId,
     })

     // Types des lignes dans la nouvelle API
     const lines = invoice.lines.data as Array<
          Stripe.InvoiceLineItem & { price?: Stripe.Price }
     >

     const recurringAmount = lines
          .filter((l) => l.price?.recurring)
          .reduce((sum, l) => sum + (l.amount ?? 0), 0)

     return {
          invoice,
          recurringAmount,
          totalAmount: invoice.total,
     }
}

export default stripe
