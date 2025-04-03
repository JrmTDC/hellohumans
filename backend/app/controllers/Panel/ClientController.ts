import { HttpContext } from '@adonisjs/core/http'
import supabase from '#services/supabaseService'

class ClientController {
     public async getClient({ auth, response }: HttpContext) {
          try {
               const authUuid = auth?.user?.id
               if (!authUuid) {
                    return response.unauthorized({
                         error: { name: 'unauthorized', description: 'Utilisateur non connecté.' }
                    })
               }

               const { data: client, error } = await supabase
                    .from('clients')
                    .select('*')
                    .eq('auth_uuid', authUuid)
                    .single()

               if (error || !client) {
                    return response.notFound({
                         error: { name: 'clientNotFound', description: 'Client introuvable.' }
                    })
               }

               return { user: client }
          } catch (error) {
               console.error('Erreur ClientController.me:', error)
               return response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur interne' }
               })
          }
     }

     public async getProjects({ auth, response }: HttpContext) {
          try {
               const authUuid = auth?.user?.id
               if (!authUuid) {
                    return response.unauthorized({
                         error: { name: 'unauthorized', description: 'Utilisateur non connecté.' }
                    })
               }

               const { data: client, error: clientError } = await supabase
                    .from('clients')
                    .select('uuid')
                    .eq('auth_uuid', authUuid)
                    .single()

               if (clientError || !client) {
                    return response.notFound({
                         error: { name: 'clientNotFound', description: 'Client introuvable.' }
                    })
               }

               const { data: projets, error: projectError } = await supabase
                    .from('client_projets')
                    .select('*')
                    .eq('client_uuid', client.uuid)

               if (projectError) {
                    return response.internalServerError({
                         error: { name: 'projectFetchFailed', description: 'Impossible de récupérer les projets.' }
                    })
               }

               return { projets }
          } catch (error) {
               console.error('Erreur ClientController.projects:', error)
               return response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur interne' }
               })
          }
     }
}

export default new ClientController()
