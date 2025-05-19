import { HttpContext } from '@adonisjs/core/http'
import supabase from '#services/supabaseService'

class UpgradeController {
     public async getPlans(ctx: HttpContext) {
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
                    monthlyPrice: Number(plan.monthlyPrice),
                    discountMonths: plan.discountMonths || 0,
                    includedFeatures: plan.includedFeatures?.[ctx.user.lang] || [],
                    baseSubtitle: plan.baseSubtitle?.[ctx.user.lang] || '',
                    popular: plan.popular || false,
                    includedModules: plan.includedModules || [],
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
                    basePrice: Number(mod.basePrice),
                    discountMonths: mod.discountMonths || 0,
                    selected: false,
                    multipleChoice: mod.multipleChoice || false,
                    choices: mod.choices || [],
                    selectedChoiceIndex: 0,
                    comingSoon: mod.comingSoon || false,
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
