import Stripe from 'stripe'
import supabaseService from '#services/supabaseService'

/* ─────────────────────────── CONFIG STRIPE ──────────────────────────────── */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
     apiVersion: '2025-04-30.basil',
})

export type BillingCycle = 'month' | 'year'

/* ──────────────────────── CUSTOMER UTILITIES ────────────────────────────── */
export async function ensureCustomer(project: {
     id: string
     email: string | null
     organization_data: { name?: string | null }
     stripe_customer_id?: string | null
}): Promise<string> {
     if (project.stripe_customer_id) {
          try {
               const cust = await stripe.customers.retrieve(project.stripe_customer_id)
               if (!('deleted' in cust && cust.deleted)) return project.stripe_customer_id // ok
          } catch (_) {/* fallthrough – recreate below */}

          await supabaseService.from('projects').update({ stripe_customer_id: null }).eq('id', project.id)
     }
     console.log('Creating Stripe customer for project', project.id)
     const customer = await stripe.customers.create({
          name: project.organization_data.name ?? undefined,
          metadata: { project_id: project.id },
     })
     await supabaseService.from('projects').update({ stripe_customer_id: customer.id }).eq('id', project.id)
     return customer.id
}

/* ───────────────────────── PRICE HELPERS ─────────────────────────────────── */
export async function priceForPlan(planId: string, billing: BillingCycle) {
     const { data } = await supabaseService
          .from('subscription_plans')
          .select('stripe_price_id_monthly, stripe_price_id_annual')
          .eq('id', planId)
          .single()
     const priceId = billing === 'month' ? data?.stripe_price_id_monthly : data?.stripe_price_id_annual
     if (!priceId) throw new Error(`Plan ${planId} missing price for ${billing}`)
     return priceId
}

export async function pricesForModules(moduleIds: string[], billing: BillingCycle) {
     if (!moduleIds.length) return []
     const { data } = await supabaseService
          .from('subscription_modules')
          .select('id, stripe_price_id_monthly, stripe_price_id_annual')
          .in('id', moduleIds)
     return (data ?? []).map(m => billing === 'month' ? m.stripe_price_id_monthly : m.stripe_price_id_annual)
}

export async function priceIdsForSelection(planId: string, moduleIds: string[], billing: BillingCycle) {
     return [await priceForPlan(planId, billing), ...(await pricesForModules(moduleIds, billing))].filter(Boolean) as string[]
}

/* ───────────────────────── SUBSCRIPTION CRUD ────────────────────────────── */
export async function createSubscription(opts: {
     customerId: string; plan_id: string; modules: string[]; billing: BillingCycle; paymentMethodId?: string | null; projectId: string;
}) {
     const priceIds = await priceIdsForSelection(opts.plan_id, opts.modules, opts.billing)
     const items: Stripe.SubscriptionCreateParams.Item[] = priceIds.map(price => ({ price }))

     return stripe.subscriptions.create({
          customer: opts.customerId,
          items,
          payment_behavior: 'default_incomplete',
          ...(opts.paymentMethodId ? { default_payment_method: opts.paymentMethodId } : {}),
          metadata: { project_id: opts.projectId },
          expand: ['latest_invoice.confirmation_secret', 'items.data'],
     })
}

function buildUpdateItems(current: Stripe.Subscription, desiredPriceIds: string[]): Stripe.SubscriptionUpdateParams.Item[] {
     const items: Stripe.SubscriptionUpdateParams.Item[] = []
     for (const it of current.items.data) {
          if (desiredPriceIds.includes(it.price.id)) {
               items.push({ id: it.id })
               desiredPriceIds.splice(desiredPriceIds.indexOf(it.price.id), 1)
          } else {
               items.push({ id: it.id, deleted: true })
          }
     }
     desiredPriceIds.forEach(price => items.push({ price }))
     return items
}

/* ──────────────────────── CHANGE DETECTION ──────────────────────────────── */
export async function detectChangeType(currentSub: Stripe.Subscription, desiredPriceIds: string[]): Promise<'increase' | 'decrease'> {
     const currentPrices = await Promise.all(currentSub.items.data.map(i => stripe.prices.retrieve(i.price.id)))
     const desiredPrices = await Promise.all(desiredPriceIds.map(id => stripe.prices.retrieve(id)))
     const sum = (acc: number, p: Stripe.Price) => acc + (p.unit_amount ?? 0)
     const currentTotal = currentPrices.reduce(sum, 0)
     const desiredTotal = desiredPrices.reduce(sum, 0)
     return desiredTotal > currentTotal ? 'increase' : 'decrease'
}

export async function updateSubscription(opts: {
     subscriptionId: string; plan_id: string; modules: string[]; billing: BillingCycle; paymentMethodId?: string | null; projectId: string;
}) {
     const sub = await stripe.subscriptions.retrieve(opts.subscriptionId, { expand: ['items.data'] })
     const desiredPriceIds = await priceIdsForSelection(opts.plan_id, opts.modules, opts.billing)
     const changeType = await detectChangeType(sub, desiredPriceIds)
     const itemsPayload = buildUpdateItems(sub, [...desiredPriceIds])

     return stripe.subscriptions.update(opts.subscriptionId, {
          items: itemsPayload,
          proration_behavior: changeType === 'increase' ? 'create_prorations' : 'none',
          ...(changeType === 'increase' && { proration_date: Math.floor(Date.now() / 1000) }),
          ...(opts.paymentMethodId ? { default_payment_method: opts.paymentMethodId } : {}),
          metadata: { project_id: opts.projectId },
          expand: ['latest_invoice.confirmation_secret', 'items.data'],
     })
}

/* ─────────────────────────── PREVIEW HELPERS ────────────────────────────── */
function buildPreviewItems(sub: Stripe.Subscription, desiredPriceIds: string[]): Stripe.InvoiceCreatePreviewParams.SubscriptionDetails.Item[] {
     const items: Stripe.InvoiceCreatePreviewParams.SubscriptionDetails.Item[] = []
     for (const it of sub.items.data) {
          if (desiredPriceIds.includes(it.price.id)) {
               items.push({ id: it.id })
               desiredPriceIds.splice(desiredPriceIds.indexOf(it.price.id), 1)
          } else {
               items.push({ id: it.id, quantity: 0 })
          }
     }
     desiredPriceIds.forEach(price => items.push({ price }))
     return items
}

type Line = Stripe.InvoiceLineItem & {
     parent?: { subscription_item_details?: { proration?: boolean }; invoice_item_details?: { proration?: boolean } }
     pricing?: { price_details?: { price: string } }
}

async function analyzeChanges(currentSub: Stripe.Subscription, desiredPriceIds: string[]) {
     const immediate: string[] = []
     const future: string[] = []
     const removed: string[] = []
     const existingIds = currentSub.items.data.map(i => i.price.id)

     // Analyser les nouveaux items
     desiredPriceIds.forEach(id => {
          if (!existingIds.includes(id)) immediate.push(id) // new price → immediate
     })

     // Analyser les items existants
     existingIds.forEach(id => {
          if (!desiredPriceIds.includes(id)) {
               // Item supprimé
               removed.push(id)
               // Si c'est un module, facturation future
               if (!id.startsWith('plan_')) {
                    future.push(id)
               }
          }
     })

     return {
          immediateProrations: immediate,
          futureChanges: future,
          removedItems: removed
     }
}

export async function getUpcomingInvoicePreview(customerId: string, subId: string, desiredPriceIds: string[]) {
     const sub = await stripe.subscriptions.retrieve(subId, { expand: ['items.data'] })
     const items = buildPreviewItems(sub, [...desiredPriceIds])
     const { immediateProrations, removedItems } = await analyzeChanges(sub, desiredPriceIds)
     const now = Math.floor(Date.now() / 1000)

     /* preview with prorations (if any) */
     const preview = await stripe.invoices.createPreview({
          customer: customerId,
          subscription: subId,
          subscription_details: {
               items,
               proration_behavior: immediateProrations.length ? 'create_prorations' : 'none',
               ...(immediateProrations.length && { proration_date: now }),
          },
          expand: ['lines.data.pricing'],
     })

     /* helper to sum cents */
     const sum = (obj: Record<string, number>) => Object.values(obj).reduce((s, n) => s + n, 0)

     const debit: Record<string, number> = {}
     const credit: Record<string, number> = {}
     for (const l of preview.lines.data as Line[]) {
          if (!(l.parent?.subscription_item_details?.proration ?? l.parent?.invoice_item_details?.proration)) continue
          const pid = l.pricing?.price_details?.price
          if (!pid) continue
          const amt = l.amount ?? 0
          if (amt >= 0) debit[pid] = (debit[pid] ?? 0) + amt
          else          credit[pid] = (credit[pid] ?? 0) + Math.abs(amt)
     }

     /* recurring preview */
     const recurring = await stripe.invoices.createPreview({
          customer: customerId,
          subscription: subId,
          subscription_details: { items },
          preview_mode: 'recurring',
          expand: ['lines.data.pricing'],
     })
     const recurringByPrice: Record<string, number> = {}
     for (const l of recurring.lines.data as Line[]) {
          const pid = l.pricing?.price_details?.price
          if (pid) recurringByPrice[pid] = (recurringByPrice[pid] ?? 0) + (l.amount ?? 0)
     }

     return {
          invoice: preview,
          totalAmount: Math.max(0, sum(debit) - sum(credit)),
          totalDebit: sum(debit),
          totalCredit: sum(credit),
          recurringAmount: Math.max(0, recurring.total ?? 0),
          debitByPrice: debit,
          creditByPrice: credit,
          recurringByPrice,
          removedModules: removedItems.filter(id => !id.startsWith('plan_'))
     }
}
