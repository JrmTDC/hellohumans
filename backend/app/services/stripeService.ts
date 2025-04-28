import Stripe from 'stripe'
import supabase from '#services/supabaseService'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
     apiVersion: '2025-03-31.basil',
})

/* -------------------------------------------------------------- */
/*  util – construit la liste des items Stripe à partir du plan   */
/* -------------------------------------------------------------- */
export async function buildSubscriptionItems (
     plan_id: string,
     modules: string[] = [],
     cycle: 'month' | 'year',
) {
     const items: { price: string }[] = []

     /* Plan principal ------------------------------------------------ */
     const { data: plan } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('id', plan_id)
          .maybeSingle()

     if (!plan) throw new Error('Plan introuvable')

     const planPrice = cycle === 'year' ? plan.stripe_price_id_annual : plan.stripe_price_id_monthly
     if (!planPrice) throw new Error('Plan sans price_id')
     items.push({ price: planPrice })

     /* Modules ------------------------------------------------------- */
     if (modules.length) {
          const { data: moduleList } = await supabase
               .from('subscription_modules')
               .select('*')
               .in('id', modules)

          for (const m of moduleList || []) {
               const priceId = cycle === 'year' ? m.stripe_price_id_annual : m.stripe_price_id_monthly
               if (priceId) items.push({ price: priceId })
          }
     }
     return items
}

/* ------------------ */
/* createSubscription */
/* ------------------ */
export async function createSubscription (params: {
     customerId : string
     plan_id    : string
     modules    : string[]
     cycle      : 'month' | 'year'
     paymentMethodId: string            // carte choisie
}) {
     const items = await buildSubscriptionItems(params.plan_id, params.modules, params.cycle)

     const sub = await stripe.subscriptions.create({
          customer: params.customerId,
          items,
          payment_behavior      : 'default_incomplete',
          default_payment_method: params.paymentMethodId,
          expand: ['latest_invoice'],          // ⬅️  plus de .payment_intent
     })

     let clientSecret: string | null = null
     if (sub.latest_invoice) {
          const inv = await stripe.invoices.retrieve(
               sub.latest_invoice as string,
               { expand: ['payment_intent'] }      // ⬅️  PI ici
          )
          clientSecret = inv.payment_intent?.client_secret ?? null
     }

     return { sub, clientSecret }
}

/* ----------------- */
/* updateSubscription */
/* ----------------- */
export async function updateSubscription (params: {
     subscriptionId  : string
     plan_id         : string
     modules         : string[]
     cycle           : 'month' | 'year'
     paymentMethodId?: string        // si l'utilisateur change aussi la carte
}) {
     const items = await buildSubscriptionItems(params.plan_id, params.modules, params.cycle)

     const sub = await stripe.subscriptions.update(params.subscriptionId, {
          items: items.map(i => ({ price: i.price })),
          proration_behavior     : 'create_prorations',
          default_payment_method : params.paymentMethodId,
          expand: ['latest_invoice'],          // idem
     })

     let clientSecret: string | null = null
     if (sub.latest_invoice) {
          const inv = await stripe.invoices.retrieve(
               sub.latest_invoice as string,
               { expand: ['payment_intent'] }
          )
          clientSecret = inv.payment_intent?.client_secret ?? null
     }

     return { sub, clientSecret }
}

/* --------------- */
/* upcoming invoice */
/* --------------- */
export async function previewUpcomingInvoice (customerId: string, subscriptionId: string) {
     return stripe.invoices.retrieveUpcoming({
          customer    : customerId,
          subscription: subscriptionId,
     })
}
export default stripe;
