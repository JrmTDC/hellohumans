import Stripe from 'stripe'
import supabaseService from '#services/supabaseService'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
     apiVersion: '2025-03-31.basil'
})

export async function createCustomer(metadata: any) {
     return await stripe.customers.create({ metadata })
}

export async function createSubscription({ customerId, plan_id, modules, billing_cycle }: {
     customerId: string
     plan_id: string
     modules: string[]
     billing_cycle: 'month' | 'year'
}) {
     const items: { price: string }[] = []

     const { data: plan } = await supabaseService
          .from('subscription_plans')
          .select('*')
          .eq('id', plan_id)
          .maybeSingle()

     if (!plan) throw new Error('Plan introuvable')

     const planPriceId = billing_cycle === 'year' ? plan.stripe_price_id_annual : plan.stripe_price_id_monthly
     if (!planPriceId) throw new Error('Plan sans price_id')

     items.push({ price: planPriceId })

     if (modules?.length > 0) {
          const { data: moduleList } = await supabaseService
               .from('subscription_modules')
               .select('*')
               .in('id', modules)

          for (const mod of moduleList || []) {
               const modulePriceId = billing_cycle === 'year' ? mod.stripe_price_id_annual : mod.stripe_price_id_monthly
               if (modulePriceId) items.push({ price: modulePriceId })
          }
     }

     return await stripe.subscriptions.create({
          customer: customerId,
          items: items,
          payment_behavior: 'default_incomplete',
          expand: ['latest_invoice.payment_intent'],
     })
}

export async function updateSubscription({ subscriptionId, plan_id, modules, billing_cycle }: {
     subscriptionId: string
     plan_id: string
     modules: string[]
     billing_cycle: 'month' | 'year'
}) {
     const subscription = await stripe.subscriptions.retrieve(subscriptionId)
     if (!subscription) throw new Error('Subscription introuvable')

     const items: { price: string }[] = []

     const { data: plan } = await supabaseService
          .from('subscription_plans')
          .select('*')
          .eq('id', plan_id)
          .maybeSingle()

     if (!plan) throw new Error('Plan introuvable')

     const planPriceId = billing_cycle === 'year' ? plan.stripe_price_id_annual : plan.stripe_price_id_monthly
     if (!planPriceId) throw new Error('Plan sans price_id')

     items.push({ price: planPriceId })

     if (modules?.length > 0) {
          const { data: moduleList } = await supabaseService
               .from('subscription_modules')
               .select('*')
               .in('id', modules)

          for (const mod of moduleList || []) {
               const modulePriceId = billing_cycle === 'year' ? mod.stripe_price_id_annual : mod.stripe_price_id_monthly
               if (modulePriceId) items.push({ price: modulePriceId })
          }
     }

     return await stripe.subscriptions.update(subscriptionId, {
          items: items.map((item) => ({ price: item.price })),
          proration_behavior: 'create_prorations'
     })
}

export async function previewUpcomingInvoice({ customerId, subscriptionId }: {
     customerId: string
     subscriptionId: string
}) {
     return await stripe.invoices.retrieveUpcoming({
          customer: customerId,
          subscription: subscriptionId
     })
}

export default stripe
