import { HttpContext } from '@adonisjs/core/http'
import supabase from '#services/supabaseService'

function priceToNumber(row: any, cycle: 'month' | 'year'): number | null {
     try {
          const field = cycle === 'month' ? 'stripe_price_id_month' : 'stripe_price_id_year'
          return row?.[field]?.default?.amount ? Number(row[field].default.amount) / 100 : null
     } catch (_) { return null }
}

class UpgradeController {
     public async getPlans(ctx: HttpContext) {
          // 1. Récupérer d'abord tous les plans
          const { data: plansData, error: plansError } = await supabase
               .from('subscription_plans')
               .select('*')
               .eq('disabled', false)
               .order('order')

          if (plansError || !plansData) throw plansError

          // 2. Récupérer tous les modules
          const { data: modulesData, error: modulesError } = await supabase
               .from('subscription_modules')
               .select('*')
               .eq('disabled', false)

          if (modulesError || !modulesData) throw modulesError

          // 3. Traiter les plans et enrichir les included_modules
          if(plansData.length > 0) {
               plansData.forEach(plan => {
                    if (plan.included_modules && Array.isArray(plan.included_modules) && plan.included_modules.length > 0) {
                         plan.included_modules = plan.included_modules.map(moduleId => {
                              const moduleInfo = modulesData.find(m => m.key === moduleId)
                              if (!moduleInfo) return null
                              return {
                                   id: moduleInfo.id,
                                   key: moduleInfo.key,
                                   name: moduleInfo.name?.[ctx.user.lang] ?? moduleInfo.name?.en ?? 'Module',
                              }
                         }).filter(module => module !== null)
                    }
               })
          }

          return {
               plans: plansData.map(p => ({
                    id: p.id,
                    name: p.name?.[ctx.user.lang] ?? p.name?.en ?? 'Plan',
                    description: p.description?.[ctx.user.lang] ?? '',
                    price_month: priceToNumber(p, 'month'),
                    price_year: priceToNumber(p, 'year'),
                    includedFeatures: p.included_features?.[ctx.user.lang] ?? [],
                    baseSubtitle: p.base_subtitle?.[ctx.user.lang] ?? '',
                    popular: p.popular,
                    includedModules: p.included_modules,
                    billingYear: p.billing_year,
                    agentLimit: p.agent_limit,
                    agentIncluded: p.agent_included
               })),
          }

     }

     public async getModules(ctx: HttpContext) {
          const { data, error } = await supabase
               .from('subscription_modules')
               .select('*')
               .eq('disabled', false)
               .order('order')

          if (error || !data) throw error

          return {
               modules: data.map(m => ({
                    id: m.id,
                    key: m.key,
                    name: m.name?.[ctx.user.lang] ?? m.name?.fr ?? 'Module',
                    description: m.description?.[ctx.user.lang] ?? '',
                    price_month: priceToNumber(m, 'month'),
                    price_year:  priceToNumber(m, 'year'),
                    multipleChoice: m.stripe_many_options,
                    choices: m.choices ?? [],
                    comingSoon: m.coming_soon,
                    disabled: m.disabled,
                    displayMore: m.display_more,
               })),
          }
     }
}

export default new UpgradeController()
