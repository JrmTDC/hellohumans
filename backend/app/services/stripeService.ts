import Stripe from 'stripe'
import supabaseService from '#services/supabaseService'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
     apiVersion: '2025-03-31.basil',
})

type BillingCycle = 'month' | 'year'

export async function ensureCustomer(clientRow: any): Promise<string> {
     let cid: string | null = clientRow?.stripe_customer_id ?? null

     if (cid) {
          try {
               await stripe.customers.retrieve(cid)
               return cid
          } catch (e: any) {
               if (e?.statusCode !== 404) throw e
               cid = null
          }
     }

     const customer = await stripe.customers.create({
          metadata: { client_id: clientRow.id },
     })

     await supabaseService
          .from('clients')
          .update({ stripe_customer_id: customer.id })
          .eq('id', clientRow.id)

     return customer.id
}

async function priceForPlan(plan_id: string, billing: BillingCycle) {
     const { data: plan } = await supabaseService
          .from('subscription_plans')
          .select('*')
          .eq('id', plan_id)
          .maybeSingle()

     if (!plan) throw new Error('Plan introuvable')

     return billing === 'year' ? plan.stripe_price_id_annual : plan.stripe_price_id_monthly
}

async function pricesForModules(ids: string[], billing: BillingCycle) {
     if (!ids.length) return []

     const { data } = await supabaseService
          .from('subscription_modules')
          .select('*')
          .in('id', ids)

     const out: string[] = []
     for (const m of data || []) {
          const price = billing === 'year' ? m.stripe_price_id_annual : m.stripe_price_id_monthly
          if (price) out.push(price)
     }

     return out
}

export async function createSubscription(opts: {
     customerId: string
     plan_id: string
     modules: string[]
     billing: BillingCycle,
     paymentMethodId?: string
}) {
     const desired = [
          await priceForPlan(opts.plan_id, opts.billing),
          ...(await pricesForModules(opts.modules, opts.billing)),
     ]

     return stripe.subscriptions.create({
          customer: opts.customerId,
          items: desired.map((p) => ({ price: p })),
          payment_behavior: 'default_incomplete',
     })
}

export async function updateSubscription(opts: {
     subscriptionId: string
     plan_id: string
     modules: string[]
     billing: BillingCycle
     paymentMethodId?: string
}) {
     const sub = await stripe.subscriptions.retrieve(opts.subscriptionId, {
          expand: ['items.data'],
     })

     const desired = [
          await priceForPlan(opts.plan_id, opts.billing),
          ...(await pricesForModules(opts.modules, opts.billing)),
     ]

     const payload: Stripe.SubscriptionUpdateParams.Item[] = []
     for (const it of sub.items.data) {
          if (desired.includes(it.price.id)) {
               payload.push({ id: it.id })
          } else {
               payload.push({ id: it.id, deleted: true })
          }
     }

     for (const price of desired) {
          if (!sub.items.data.find((i) => i.price.id === price)) {
               payload.push({ price })
          }
     }

     return stripe.subscriptions.update(opts.subscriptionId, {
          items: payload,
          proration_behavior: 'create_prorations',
          ...(opts.paymentMethodId && { default_payment_method: opts.paymentMethodId }),
     })
}

export async function upcomingInvoice(customerId: string, subscriptionId: string) {
     return stripe.invoices.retrieveUpcoming({ customer: customerId, subscription: subscriptionId })
}

export async function getInvoiceClientSecret(invoiceId: string): Promise<string | null> {
     const invoice = await stripe.invoices.retrieve(invoiceId)
     if (invoice.payment_intent && typeof invoice.payment_intent === 'string') {
          const pi = await stripe.paymentIntents.retrieve(invoice.payment_intent)
          return pi.client_secret ?? null
     }
     return null
}

export default stripe
