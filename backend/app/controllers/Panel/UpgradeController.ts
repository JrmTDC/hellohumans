import { HttpContext } from '@adonisjs/core/http'
import supabase from '#services/supabaseService'

class UpgradeController {
     public async getPlans(ctx: HttpContext) {
          function getPriceAmount(priceData: any, cycle: 'month' | 'year'): number | null {
               try {
                    const priceField = cycle === 'month' ? 'stripe_price_id_month' : 'stripe_price_id_year'

                    if (!priceData?.[priceField]?.default?.amount) {
                         return null
                    }

                    return Number(priceData[priceField].default.amount) / 100
               } catch (e) {
                    console.error(`Erreur lors de la récupération du prix ${cycle}:`, e)
                    return null
               }
          }
          try {
               const { data, error } = await supabase
                    .from('subscription_plans')
                    .select('*')
                    .eq('disabled', false)
                    .order('order', { ascending: true })

               if (error || !data) {
                    console.error('Erreur récupération plans:', error)
                    return ctx.response.internalServerError({
                         error: { name: 'supabaseError', description: 'Erreur lors de la récupération des offres.' },
                    })
               }

               const plans = data.map((plan) => ({
                    id: plan.id,
                    name: plan.name?.[ctx.user.lang] || plan.name?.['en'] || 'No name',
                    description: plan.description?.[ctx.user.lang] || plan.description?.['en'] || '',
                    price_month: getPriceAmount(plan, 'month'),
                    price_year: getPriceAmount(plan, 'year'),
                    includedFeatures: plan.included_features?.[ctx.user.lang] || [],
                    baseSubtitle: plan.base_subtitle?.[ctx.user.lang] || '',
                    popular: plan.popular || false,
                    includedModules: plan.included_modules || [],
                    billingYear: plan.billing_year || false,
               }))

               return {
                    plans
               }
          } catch (err) {
               console.error('Erreur UpgradeController.getPlans:', err)
               return ctx.response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur interne.' },
               })
          }
     }

     public async getModules(ctx: HttpContext) {
          function getPriceAmount(priceData: any, cycle: 'month' | 'year'): number | null {
               try {
                    const priceField = cycle === 'month' ? 'stripe_price_id_month' : 'stripe_price_id_year'

                    if (!priceData?.[priceField]?.default?.amount) {
                         return null
                    }

                    return Number(priceData[priceField].default.amount) / 100
               } catch (e) {
                    console.error(`Erreur lors de la récupération du prix ${cycle}:`, e)
                    return null
               }
          }
          try {
               const { data, error } = await supabase
                    .from('subscription_modules')
                    .select('*')
                    .eq('disabled', false)
                    .order('order', { ascending: true })

               if (error || !data) {
                    console.error('Erreur récupération modules:', error)
                    return ctx.response.internalServerError({
                         error: { name: 'supabaseError', description: 'Erreur lors de la récupération des modules.' },
                    })
               }

               const modules = data.map((mod) => ({
                    id: mod.id,
                    name: mod.name?.[ctx.user.lang] || mod.name?.['fr'] || 'Sans nom',
                    key: mod.key,
                    description: mod.description?.[ctx.user.lang] || mod.description?.['fr'] || '',
                    price_month: getPriceAmount(mod, 'month'),
                    price_year: getPriceAmount(mod, 'year'),
                    selected: false,
                    multipleChoice: mod.stripe_many_options || false,
                    choices: mod.choices || [],
                    selectedChoiceIndex: 0,
                    comingSoon: mod.coming_soon || false,
                    disabled: mod.disabled || false,
                    displayMore: mod.display_more || false,
               }))

               return {
                    modules
               }
          } catch (err) {
               console.error('Erreur UpgradeController.getModules:', err)
               return ctx.response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur interne.' },
               })
          }
     }
}

export default new UpgradeController()
