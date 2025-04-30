import Stripe from 'stripe'
import supabaseService from '#services/supabaseService'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
     apiVersion: '2025-03-31.basil',
})

export type BillingCycle = 'month' | 'year'

export async function ensureCustomer(clientRow: any): Promise<string> {
     let cid = clientRow?.stripe_customer_id ?? null

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

     return (data || []).map((m) =>
          billing === 'year' ? m.stripe_price_id_annual : m.stripe_price_id_monthly
     ).filter(Boolean)
}

export async function createSubscription(opts: {
     customerId: string
     plan_id: string
     modules: string[]
     billing: BillingCycle
     paymentMethodId: string
}) {
     const items = [
          await priceForPlan(opts.plan_id, opts.billing),
          ...(await pricesForModules(opts.modules, opts.billing)),
     ].map((price) => ({ price }))

     return stripe.subscriptions.create({
          customer: opts.customerId,
          items,
          payment_behavior: 'default_incomplete',
          default_payment_method: opts.paymentMethodId,
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

     const desired = [
          await priceForPlan(opts.plan_id, opts.billing),
          ...(await pricesForModules(opts.modules, opts.billing)),
     ]

     const itemsPayload: Stripe.SubscriptionUpdateParams.Item[] = []

     const existing = sub.items.data
     for (const item of existing) {
          if (desired.includes(item.price.id)) {
               itemsPayload.push({ id: item.id })
               desired.splice(desired.indexOf(item.price.id), 1)
          } else {
               itemsPayload.push({ id: item.id, deleted: true })
          }
     }

     for (const price of desired) itemsPayload.push({ price })

     return stripe.subscriptions.update(opts.subscriptionId, {
          items: itemsPayload,
          proration_behavior: 'create_prorations',
          default_payment_method: opts.paymentMethodId,
     })
}

export async function upcomingInvoice(customerId: string, subscriptionId: string) {
     return stripe.invoices.retrieveUpcoming({ customer: customerId, subscription: subscriptionId })
}

export default stripe
