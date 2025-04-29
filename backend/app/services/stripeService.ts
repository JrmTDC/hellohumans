// app/services/stripeService.ts

import Stripe from 'stripe'
import supabaseService from '#services/supabaseService'

/** Initialisation du SDK Stripe */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
     apiVersion: "2025-03-31.basil",
})

/** Garantit qu’on a un customer Stripe et synchronise Supabase. */
export async function ensureCustomer(client: {
     id: string
     email: string
     stripe_customer_id?: string
}): Promise<string> {
     if (client.stripe_customer_id) {
          try {
               await stripe.customers.retrieve(client.stripe_customer_id)
               return client.stripe_customer_id
          } catch {
               // supprimé côté Stripe : on recrée
          }
     }
     const customer = await stripe.customers.create({
          email: client.email,
          metadata: { supabase_id: client.id },
     })
     await supabaseService
          .from('clients')
          .update({ stripe_customer_id: customer.id })
          .eq('id', client.id)
     return customer.id
}

/** Créé un SetupIntent pour enregistrer une carte (off_session). */
export function createSetupIntent(customerId: string) {
     return stripe.setupIntents.create({
          customer: customerId,
          usage: 'off_session',
          payment_method_types: ['card'],
     })
}

/** Liste les cartes enregistrées pour un client. */
export function listPaymentMethods(customerId: string) {
     return stripe.paymentMethods.list({
          customer: customerId,
          type: 'card',
     })
}

/** Structure d’entrée pour (création ou mise à jour) d’abonnement. */
export interface SubscriptionInput {
     customerId: string
     subscriptionId?: string
     planId: string
     modules: string[]
     cycle: 'month' | 'year'
     paymentMethodId?: string
}

/** Récupère les price_id du plan + modules depuis Supabase. */
async function getPriceIds(
     planId: string,
     modules: string[],
     cycle: 'month' | 'year'
): Promise<string[]> {
     const field = cycle === 'year' ? 'stripe_price_id_year' : 'stripe_price_id_month'
     const { data: plan } = await supabaseService
          .from('subscription_plans')
          .select(field)
          .eq('id', planId)
          .single()
     if (!plan) throw new Error('Plan introuvable')
     const modulePrices = modules.length
          ? (await supabaseService
                    .from('subscription_modules')
                    .select(field)
                    .in('id', modules)
          ).data!.map((m: any) => m[field])
          : []
     return [plan[field], ...modulePrices]
}

/** Transforme les price_id en items Stripe. */
async function buildLineItems(
     planId: string,
     modules: string[],
     cycle: 'month' | 'year'
): Promise<Stripe.SubscriptionCreateParams.Item[]> {
     return (await getPriceIds(planId, modules, cycle)).map((price) => ({ price }))
}

/** Crée un abonnement (status : incomplete). */
export async function createSubscription(input: SubscriptionInput) {
     return stripe.subscriptions.create({
          customer: input.customerId,
          items: await buildLineItems(input.planId, input.modules, input.cycle),
          payment_behavior: 'default_incomplete',
          ...(input.paymentMethodId && {
               default_payment_method: input.paymentMethodId,
          }),
          expand: ['latest_invoice.payment_intent'],
     })
}

/** Met à jour un abonnement existant (prorata). */
export async function updateSubscription(input: SubscriptionInput) {
     return stripe.subscriptions.update(input.subscriptionId!, {
          items: await buildLineItems(input.planId, input.modules, input.cycle),
          proration_behavior: 'create_prorations',
          ...(input.paymentMethodId && {
               default_payment_method: input.paymentMethodId,
          }),
          expand: ['latest_invoice.payment_intent'],
     })
}

/** Annule l’abonnement (fin de période ou immédiat). */
export async function cancelSubscription(
     subscriptionId: string,
     atPeriodEnd = true
) {
     return stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: atPeriodEnd,
     })
}

/** Aperçu de la prochaine facture (prorata, upgrade, etc.). */
export async function previewUpcomingInvoice(
     customerId: string,
     subscriptionId: string,
     planId: string,
     modules: string[],
     cycle: 'month' | 'year'
) {
     const items = await buildLineItems(planId, modules, cycle)
     return stripe.invoices.retrieveUpcoming({
          customer: customerId,
          subscription: subscriptionId,
          subscription_items: items,
          expand: ['latest_invoice.payment_intent', 'subscription_items'],
     })
}

export default stripe
