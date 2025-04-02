import { HttpContext } from '@adonisjs/core/http'
import supabase from '#services/supabaseService'

class UsageController {
     public async index({ auth, response }: HttpContext) {
          try {
               const authUuid = auth?.user?.id
               if (!authUuid) {
                    return response.unauthorized({
                         error: { name: 'unauthorized', description: 'Utilisateur non connecté.' }
                    })
               }

               // Récupérer l'utilisateur -> client
               const { data: client, error: clientError } = await supabase
                    .from('clients')
                    .select('uuid, selected_project_uuid')
                    .eq('auth_uuid', authUuid)
                    .single()

               if (clientError || !client) {
                    return response.notFound({
                         error: { name: 'clientNotFound', description: 'Client introuvable.' }
                    })
               }

               const projectId = client.selected_project_uuid
               if (!projectId) {
                    return response.badRequest({
                         error: { name: 'missingProject', description: 'Aucun projet sélectionné.' }
                    })
               }

               // TODO: Récupérer dynamiquement les données d’usage réelles plus tard
               const usage = [
                    { id: 'audience', usage: 320 },
                    { id: 'interactions', usage: 4600, limit: 5000 },
                    { id: 'guideplus', usage: 87, limit: 100 },
               ]

               return { usage }
          } catch (error) {
               console.error('Erreur UsageController.index:', error)
               return response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur interne' }
               })
          }
     }
}

export default new UsageController()
