import Stripe from 'stripe'
import supabaseService from '#services/supabaseService'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
     apiVersion: '2025-03-31.basil'
})

export async function updateSubscription({customerId, subscriptionId, plan_id, modules, billing_cycle}: {customerId: string, subscriptionId: string, plan_id: string, modules: string[], billing_cycle: 'month' | 'year' }) {
     // Récupérer abonnement existant
     const subscription = await stripe.subscriptions.retrieve(subscriptionId)

     if (!subscription) {
          throw new Error('Subscription introuvable')
     }

     // Construire nouvelle liste d'items
     const items: { price: string }[] = []

     // 1. Ajouter l’offre principale
     const { data: plan } = await supabaseService
          .from('subscription_plans')
          .select('*')
          .eq('id', plan_id)
          .maybeSingle()

     if (!plan) {
          throw new Error('Plan principal introuvable')
     }

     const planPriceId = billing_cycle === 'year'
          ? plan.stripe_price_id_annual
          : plan.stripe_price_id_monthly

     if (!planPriceId) {
          throw new Error('Plan sans price_id')
     }

     items.push({ price: planPriceId })

     // 2. Ajouter les modules si présents
     if (modules?.length > 0) {
          const { data: moduleList } = await supabaseService
               .from('subscription_modules')
               .select('*')
               .in('id', modules)

          for (const mod of moduleList || []) {
               const modulePriceId = billing_cycle === 'year'
                    ? mod.stripe_price_id_annual
                    : mod.stripe_price_id_monthly

               if (!modulePriceId) continue // ignore les modules mal configurés

               items.push({ price: modulePriceId })
          }
     }

     // 3. Mise à jour de l'abonnement
     const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
          items: items.map(item => ({ price: item.price })),
          proration_behavior: 'create_prorations', // facture aujourd'hui le prorata
     })

     return {
          status: updatedSubscription.status,
          subscriptionId: updatedSubscription.id,
          currentPeriodEnd: updatedSubscription.current_period_end * 1000,
     }
}

export default stripe
