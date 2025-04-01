import { HttpContext } from '@adonisjs/core/http'
import supabase from '#services/supabaseService'

class UpgradeController {
     /**
      * GET /panel/upgrade/offers
      */
     public async getOffers({ request, response }: HttpContext) {
          const lang = request.input('lang', 'fr')

          const { data, error } = await supabase
               .from('subscription_offers')
               .select('*')
               .eq('disabled', false)

          if (error) {
               console.error('Erreur récupération offres:', error)
               return response.internalServerError({
                    error: { name: 'supabaseError', description: 'Erreur lors de la récupération des offres' },
               })
          }

          const offers = data.map((offer) => ({
               id: offer.id,
               name: offer.name?.[lang] || offer.name?.['fr'] || 'Sans nom',
               description: offer.description?.[lang] || offer.description?.['fr'] || '',
               monthlyPrice: Number(offer.monthlyPrice),
               discountMonths: offer.discountMonths || 0,
               includedFeatures: offer.includedFeatures?.[lang] || offer.includedFeatures?.['fr'] || '',
               baseSubtitle: offer.baseSubtitle?.[lang] || '',
               includedModules: offer.includedModules || [],
          }))

          return { offers }
     }

     /**
      * GET /panel/upgrade/modules
      */
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
