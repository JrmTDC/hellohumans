import { HttpContext } from '@adonisjs/core/http'
import supabase from '#services/supabaseService'

class UpgradeController {
     private async getUserLang(auth_id: string): Promise<string> {
          const { data, error } = await supabase
               .from('users')
               .select('lang')
               .eq('auth_id', auth_id)
               .single()

          if (error || !data?.lang) {
               console.warn('Langue non trouvée, fallback en')
               return 'en'
          }

          return data.lang
     }

     public async getPlans({ auth, response }: HttpContext) {
          try {
               const auth_id = auth?.user?.id
               if (!auth_id) {
                    return response.unauthorized({
                         error: { name: 'unauthorized', description: 'Utilisateur non connecté.' },
                    })
               }

               const lang = await this.getUserLang(auth_id)

               const { data, error } = await supabase
                    .from('subscription_plans')
                    .select('*')
                    .eq('disabled', false)
                    .order('order', { ascending: true })

               if (error || !data) {
                    console.error('Erreur récupération plans:', error)
                    return response.internalServerError({
                         error: { name: 'supabaseError', description: 'Erreur lors de la récupération des offres.' },
                    })
               }

               const plans = data.map((plan) => ({
                    id: plan.id,
                    name: plan.name?.[lang] || plan.name?.['fr'] || 'Sans nom',
                    description: plan.description?.[lang] || plan.description?.['fr'] || '',
                    monthlyPrice: Number(plan.monthlyPrice),
                    discountMonths: plan.discountMonths || 0,
                    includedFeatures: plan.includedFeatures?.[lang] || [],
                    baseSubtitle: plan.baseSubtitle?.[lang] || '',
                    popular: plan.popular || false,
                    includedModules: plan.includedModules || [],
               }))

               return {
                    plans
               }
          } catch (err) {
               console.error('Erreur UpgradeController.getPlans:', err)
               return response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur interne.' },
               })
          }
     }

     public async getModules({ auth, response }: HttpContext) {
          try {
               const auth_id = auth?.user?.id
               if (!auth_id) {
                    return response.unauthorized({
                         error: { name: 'unauthorized', description: 'Utilisateur non connecté.' },
                    })
               }

               const lang = await this.getUserLang(auth_id)

               const { data, error } = await supabase
                    .from('subscription_modules')
                    .select('*')
                    .eq('disabled', false)
                    .order('order', { ascending: true })

               if (error || !data) {
                    console.error('Erreur récupération modules:', error)
                    return response.internalServerError({
                         error: { name: 'supabaseError', description: 'Erreur lors de la récupération des modules.' },
                    })
               }

               const modules = data.map((mod) => ({
                    id: mod.id,
                    name: mod.name?.[lang] || mod.name?.['fr'] || 'Sans nom',
                    description: mod.description?.[lang] || mod.description?.['fr'] || '',
                    basePrice: Number(mod.basePrice),
                    discountMonths: mod.discountMonths || 0,
                    selected: false,
                    multipleChoice: mod.multipleChoice || false,
                    choices: mod.choices || [],
                    selectedChoiceIndex: 0,
                    comingSoon: mod.comingSoon || false,
                    disabled: mod.disabled || false,
               }))

               return {
                    modules
               }
          } catch (err) {
               console.error('Erreur UpgradeController.getModules:', err)
               return response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur interne.' },
               })
          }
     }
}

export default new UpgradeController()
