import { HttpContext } from '@adonisjs/core/http'
import supabase from '#services/supabaseService'

class UpgradeController {

     // Récupération des plans d’abonnement
     public async getPlans({ request, response }: HttpContext) {
          const lang = request.input('lang', 'fr')

          const { data, error } = await supabase
               .from('subscription_plans')
               .select('*')
               .eq('disabled', false)

          if (error) {
               console.error('Erreur récupération offres:', error)
               return response.internalServerError({
                    error: { name: 'supabaseError', description: 'Erreur lors de la récupération des offres' },
               })
          }

          const plans = data.map((plan) => ({
               id: plan.id,
               name: plan.name?.[lang] || plan.name?.['fr'] || 'Sans nom',
               description: plan.description?.[lang] || plan.description?.['fr'] || '',
               monthlyPrice: Number(plan.monthlyPrice),
               discountMonths: plan.discountMonths || 0,
               includedFeatures: plan.includedFeatures?.[lang] || plan.includedFeatures?.['fr'] || '',
               baseSubtitle: plan.baseSubtitle?.[lang] || '',
               includedModules: plan.includedModules || [],
          }))

          return { plans }
     }

     // Récupération des modules
     public async getModules({ request, response }: HttpContext) {
          const lang = request.input('lang', 'fr')

          const { data, error } = await supabase
               .from('subscription_modules')
               .select('*')
               .eq('disabled', false)

          if (error) {
               console.error('Erreur récupération modules:', error)
               return response.internalServerError({
                    error: { name: 'supabaseError', description: 'Erreur lors de la récupération des modules' },
               })
          }

          const modules = data.map((mod) => ({
               id: mod.id,
               name: mod.name?.[lang] || mod.name?.['fr'] || 'Sans nom',
               description: mod.description?.[lang] || mod.description?.['fr'] || '',
               basePrice: Number(mod.basePrice),
               discountMonths: mod.discountMonths || 0,
               selected: false, // toujours false à l’init
               multipleChoice: mod.multipleChoice || false,
               choices: mod.choices || [],
               selectedChoiceIndex: 0,
               comingSoon: mod.comingSoon || false,
               disabled: mod.disabled || false,
          }))

          return { modules }
     }
}

export default new UpgradeController()
