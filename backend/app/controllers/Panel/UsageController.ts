import { HttpContext } from '@adonisjs/core/http'
import { getClientUsagesWithLimits } from '#services/usageService'

class UsageController {
     public async index({ auth, response }: HttpContext) {
          try {
               if (!auth || !auth.user?.client_id) {
                    return response.unauthorized({
                         error: { name: 'clientMissing', description: 'Client introuvable dans le contexte' },
                    })
               }
               const clientId = auth.user?.client_id
               if (!clientId) {
                    return response.unauthorized({
                         error: { name: 'clientMissing', description: 'Client introuvable dans le contexte' },
                    })
               }

               const { modules, usage } = await getClientUsagesWithLimits(clientId)

               return {
                    modules,
                    usage,
               }
          } catch (err) {
               console.error('Erreur UsageController.index:', err)
               return response.internalServerError({
                    error: { name: 'usageError', description: 'Erreur lors de la récupération des usages' },
               })
          }
     }
}

export default new UsageController()
