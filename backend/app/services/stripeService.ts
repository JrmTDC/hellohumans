     import Stripe from 'stripe'
     import supabaseService from '#services/supabaseService'
     import { HttpContext } from '@adonisjs/core/http'

     /* ───────── CONFIG ───────── */
     export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
          apiVersion: '2025-04-30.basil',
     })
     export type BillingCycle = 'month' | 'year'
     type OptKey = 'default' | string
     const centsToEuro = (c: number) => Number((c / 100).toFixed(2))

     /* ───── Customer helper ───── */
     export async function ensureCustomer(project: { id:string; organization_data:any; stripe_customer_id?:string|null }) {
          if (project.stripe_customer_id) {
               try {
                    const c = await stripe.customers.retrieve(project.stripe_customer_id)
                    if (!('deleted' in c && c.deleted)) return project.stripe_customer_id
               } catch (_) {/* recreate */}
               await supabaseService.from('projects').update({ stripe_customer_id:null }).eq('id', project.id)
          }
          const cust = await stripe.customers.create({
               name: project.organization_data?.name ?? undefined,
               metadata:{ project_id: project.id },
          })
          await supabaseService.from('projects').update({ stripe_customer_id:cust.id }).eq('id', project.id)
          return cust.id
     }

     /* ───── Price helpers ───── */
     async function pickPriceId(row:any, cycle:BillingCycle, opt:OptKey='default'){
          const fld = cycle==='month' ? 'stripe_price_id_month':'stripe_price_id_year'
          const block=row?.[fld] ?? {}
          if (row?.stripe_many_options && opt!=='default') return block?.[opt]?.id ?? null
          return block?.default?.id ?? null
     }
     export async function priceIdsForSelection(planId: string, modules: { id: string; opt?: OptKey }[], cycle: BillingCycle): Promise<string[]> {
          const { data: plan } = await supabaseService
               .from('subscription_plans')
               .select('stripe_price_id_month, stripe_price_id_year, stripe_many_options')
               .eq('id', planId).single()

          const planPrice = await pickPriceId(plan, cycle)

          const { data: mods } = await supabaseService
               .from('subscription_modules')
               .select('id, stripe_price_id_month, stripe_price_id_year, stripe_many_options')
               .in('id', modules.map(m => m.id))

          const modPrices = await Promise.all(modules.map(async sel => {
               const row = mods!.find(m => m.id === sel.id)!
               return await pickPriceId(row, cycle, sel.opt ?? 'default')
          }))

          return [planPrice, ...modPrices].filter(Boolean) as string[]
     }

     /* ───── small utils ───── */
     const split=(cur:string[],des:string[])=>({
          add: des.filter(p=>!cur.includes(p)),
          remove: cur.filter(p=>!des.includes(p)),
          keep: des.filter(p=>cur.includes(p)),
     })
     const isProration = (l:any)=>
          l.parent?.subscription_item_details?.proration === true
          || l.parent?.invoice_item_details?.proration === true

     /* ───── PREVIEW main ───── */
     export async function previewChange(opts:{ planId:string; modules:{id:string;opt?:OptKey}[]; cycle:BillingCycle }, ctx: HttpContext){
          const customerId=await ensureCustomer(ctx.project)
          const desiredRaw = await priceIdsForSelection(opts.planId, opts.modules, opts.cycle)
          const desired = desiredRaw.filter(Boolean) // safety
          const userLang = ctx.user?.lang ?? 'en'

          /* ---------------- NO SUB ---------------- */
          if(!ctx.subscription?.stripe_subscription_id){
               const tot = await Promise.all(desired.map(id=>stripe.prices.retrieve(id)))
                    .then(a=>a.reduce((s,p)=>s+(p.unit_amount??0),0))
               return { today_debit:centsToEuro(tot), today_credit:0, today_amount:centsToEuro(tot),
                    cycle_amount:centsToEuro(tot), is_new_subscription:true, ends_at:null,
                    changes:{}, invoice_preview_id:null }
          }

          /* ---------------- EXISTING SUB ---------------- */
          const sub = await stripe.subscriptions.retrieve(ctx.subscription?.stripe_subscription_id ?? null,{expand:['items.data',  'latest_invoice.payment_intent']})
          const currentIds = sub.items.data.map(i=>i.price.id).filter(Boolean)
          const {add,remove,keep}=split(currentIds,desired)

          /* ---- preview immediate (add) ---- */
          let debitBy:Record<string,number>={}, creditBy:Record<string,number>={}, invNow=''
          if(add.length){
               /* reconcile — on référence les items existants pour remove */
               const itemsForPrev = [
                    ...sub.items.data.map(it=>{
                         if(remove.includes(it.price.id))
                              return { id: it.id, quantity: 0 }
                         if(keep.includes(it.price.id))
                              return { id: it.id }
                         return null
                    }).filter(Boolean),
                    ...add.map(price=>({ price })),
               ] as Stripe.InvoiceCreatePreviewParams.SubscriptionDetails.Item[]

               const prev = await stripe.invoices.createPreview({
                    customer:customerId,
                    subscription:sub.id,
                    subscription_details:{
                         items:itemsForPrev,
                         proration_behavior:'create_prorations',
                         proration_date:Math.floor(Date.now()/1000),
                    }, expand:['lines.data'],
               })
               invNow = prev.id
               prev.lines.data.forEach((l:any)=>{
                    if(!isProration(l)) return
                    const pid=l.pricing?.price_details?.price
                    if(!pid) return
                    const amt=l.amount??0
                    if (amt >= 0) {
                         debitBy[pid] = (debitBy[pid] ?? 0) + amt
                    } else {
                         const isPlanChange = pid === desired[0] && pid !== currentIds[0] // plan modifié
                         if (isPlanChange) {
                              creditBy[pid] = (creditBy[pid] ?? 0) + Math.abs(amt)
                         }
                         // sinon on ignore les crédits dus aux modules supprimés ou au downgrade de plan
                    }
               })
          }

          /* ---- preview recurring (post-renewal) ---- */
          const itemsRecurring = [
               ...sub.items.data.map(it=>{
                    if(remove.includes(it.price.id))
                         return { id: it.id, quantity: 0 }
                    if(keep.includes(it.price.id))
                         return { id: it.id }
                    return null
               }).filter(Boolean),
               ...add.map(price=>({ price })),
          ] as Stripe.InvoiceCreatePreviewParams.SubscriptionDetails.Item[]

          const recur = await stripe.invoices.createPreview({
               customer:customerId,
               subscription:sub.id,
               subscription_details:{ items:itemsRecurring, proration_behavior:'none' },
               preview_mode:'recurring',
               expand:['lines.data'],
          })
          const recurBy:Record<string,number>={}
          recur.lines.data.forEach((l:any)=>{
               const pid=l.pricing?.price_details?.price
               if(pid) recurBy[pid]=(recurBy[pid]??0)+(l.amount??0)
          })


          /* ---- lookup names ---- */
          const {data:planRow} = await supabaseService
               .from('subscription_plans')
               .select('id,name,stripe_price_id_month,stripe_price_id_year')
               .eq('id',opts.planId)
               .single()

          const planName = planRow?.name?.[userLang]
               ?? planRow?.name?.['en']
               ?? 'Plan'



          const {data:modsRows} = await supabaseService
               .from('subscription_modules')
               .select('id,name,stripe_price_id_month,stripe_price_id_year')

          const modName = (id: string) =>
               modsRows?.find(m => m.id === id)?.name?.[userLang]
               ?? modsRows?.find(m => m.id === id)?.name?.['en']
               ?? 'Module'


          /* map price→module via metadata */
          const priceToModule: Record<string, string> = {}
          const endOfPeriodDate = sub.current_period_end
               ? new Date(sub.current_period_end * 1000)
               : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

          modsRows?.forEach((mod) => {
               const block = opts.cycle === 'month' ? mod.stripe_price_id_month : mod.stripe_price_id_year
               if (block && typeof block === 'object') {
                    for (const optKey in block) {
                         const priceId = block[optKey]?.id
                         if (priceId) priceToModule[priceId] = mod.id
                    }
               }
          })


          const planCur = currentIds[0]
          const planNext = desired[0]
          const planChangeType = planCur === planNext ? null : remove.includes(planCur) ? 'end_of_period' : 'immediate'

          let planChange = null
          let planNextObj = null

          if (planCur === planNext) {
               planChange = {
                    id: opts.planId,
                    name: planName,
                    effective_date: endOfPeriodDate,
                    effective_action: 'same',
                    price_now: 0,
                    credit_amount: 0,
                    price_cycle: centsToEuro(recurBy[planCur] ?? 0),
               }
          } else if (remove.includes(planCur)) {
               // downgrade → plan actuel reste jusqu'à la fin
               planChange = {
                    id: ctx.subscription.plan_id,
                    name: planName,
                    effective_date: endOfPeriodDate,
                    effective_action: 'end_of_period',
                    price_now: 0,
                    credit_amount: centsToEuro(creditBy[planCur] ?? 0),
                    price_cycle: centsToEuro(recurBy[planCur] ?? 0),
               }
               planNextObj = {
                    id: opts.planId,
                    name: planName,
                    effective_date: endOfPeriodDate,
                    effective_action: 'start_of_next_cycle',
                    price_now: 0,
                    credit_amount: 0,
                    price_cycle: centsToEuro(recurBy[planNext] ?? 0),
               }
          } else {
               // upgrade → immédiat
               planChange = {
                    id: opts.planId,
                    name: planName,
                    effective_date: new Date().toISOString(),
                    effective_action: 'immediate',
                    price_now: centsToEuro(debitBy[planNext] ?? 0),
                    credit_amount: centsToEuro(creditBy[planCur] ?? 0),
                    price_cycle: centsToEuro(recurBy[planNext] ?? 0),
               }
          }

     // Ajoute cette ligne AVANT moduleCurrent pour éviter que le plan ne soit pris dedans
          const planPriceIds: string[] = []
          const planBlock = opts.cycle === 'month' ? planRow?.stripe_price_id_month : planRow?.stripe_price_id_year
          if (planBlock && typeof planBlock === 'object') {
               for (const key in planBlock) {
                    const priceId = planBlock[key]?.id
                    if (priceId) planPriceIds.push(priceId)
               }
          }

          const moduleCurrent = keep
               .filter(pid => !planPriceIds.includes(pid)) // exclut les plans
               .map(pid => {
                    const mid = priceToModule[pid] ?? 'unknown'
                    return {
                         id: mid,
                         name: modName(mid),
                         stripe_price_id: pid,
                         effective_date: endOfPeriodDate,
                         effective_action: 'same',
                         price_now: 0,
                         credit_amount: 0,
                         price_cycle: centsToEuro(recurBy[pid] ?? 0),
                    }
               })


          const moduleAdded = add
               .filter(pid => !planPriceIds.includes(pid))
               .map(pid => {
                    const mid = priceToModule[pid] ?? 'unknown'
                    return {
                         id: mid,
                         name: modName(mid),
                         stripe_price_id: pid,
                         effective_date: new Date().toISOString(),
                         effective_action: 'immediate',
                         price_now: centsToEuro(debitBy[pid] ?? 0),
                         credit_amount: 0,
                         price_cycle: centsToEuro(recurBy[pid] ?? 0),
                    }
               })

          const moduleRemoved = remove
               .filter(pid => !planPriceIds.includes(pid))
               .map(pid => {
                    const mid = priceToModule[pid] ?? 'unknown'
                    return {
                         id: mid,
                         name: modName(mid),
                         stripe_price_id: pid,
                         effective_date: endOfPeriodDate,
                         effective_action: 'end_of_period',
                         price_now: 0,
                         credit_amount: 0,
                         price_cycle: 0,
                    }
               })

          const totalDebit = Object.values(debitBy).reduce((s, n) => s + n, 0)
          const totalCredit = Object.values(creditBy).reduce((s, n) => s + n, 0)

          return {
               total: centsToEuro(totalDebit),
               credit: centsToEuro(totalCredit),
               today_amount: centsToEuro(totalDebit - totalCredit),
               cycle_amount: centsToEuro(recur.total ?? 0),
               is_new_subscription: false,
               ends_at: endOfPeriodDate,
               changes: {
                    plan: {
                         current: planChange,
                         next: planNextObj,
                    },
                    modules: {
                         current: moduleCurrent,
                         added: moduleAdded,
                         removed: moduleRemoved,
                    },
               },
               invoice_preview_id: invNow,
          }
     }
