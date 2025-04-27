import Stripe from 'stripe'
import supabaseService from '#services/supabaseService'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
     apiVersion: '2025-03-31.basil'
})

export async function updateSubscription({customerId, subscriptionId, plan_id, modules, billing_cycle }: { customerId: string, subscriptionId: string, plan_id: string, modules: string[], billing_cycle: 'month' | 'year' }) {
     // Vérifier abonnement existant
     const subscription = await stripe.subscriptions.retrieve(subscriptionId)

     if (!subscription) {
          throw new Error('Abonnement introuvable')
     }

     const items: { price: string }[] = []

     // Ajouter l'offre principale
     const { data: plan } = await supabaseService
          .from('subscription_plans')
          .select('*')
          .eq('id', plan_id)
          .maybeSingle()

     if (!plan) {
          throw new Error('Offre principale introuvable')
     }

     const planPriceId = billing_cycle === 'year'
          ? plan.stripe_price_id_annual
          : plan.stripe_price_id_monthly

     if (!planPriceId) {
          throw new Error('Plan sans price_id configuré')
     }

     items.push({ price: planPriceId })

     // Ajouter les modules
     if (modules && modules.length > 0) {
          const { data: modulesList } = await supabaseService
               .from('subscription_modules')
               .select('*')
               .in('id', modules)

          for (const mod of modulesList || []) {
               const modulePriceId = billing_cycle === 'year'
                    ? mod.stripe_price_id_annual
                    : mod.stripe_price_id_monthly

               if (!modulePriceId) continue

               items.push({ price: modulePriceId })
          }
     }

     const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
          items: items.map(item => ({ price: item.price })),
          proration_behavior: 'create_prorations',
     })

     return {
          status: updatedSubscription.status,
          subscriptionId: updatedSubscription.id,
          currentPeriodEnd: updatedSubscription.current_period_end * 1000,
     }
}

export default stripe
