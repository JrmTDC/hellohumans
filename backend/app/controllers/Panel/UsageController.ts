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

               // 1. Récupération de l'utilisateur interne
               const { data: user, error: userError } = await supabase
                    .from('users')
                    .select('uuid, selected_client_uuid')
                    .eq('auth_uuid', authUuid)
                    .maybeSingle()

               if (!user || userError) {
                    return response.notFound({
                         error: { name: 'userNotFound', description: 'Utilisateur introuvable.' }
                    })
               }

               const userUuid = user.uuid
               let selectedClientUuid = user.selected_client_uuid

               // 2. Vérifier que ce client est bien lié à l’utilisateur
               let { data: clientUser, error: clientUserError } = await supabase
                    .from('client_users')
                    .select('uuid, client_uuid, selected_project_uuid')
                    .eq('user_uuid', userUuid)
                    .eq('client_uuid', selectedClientUuid)
                    .maybeSingle()

               // 3. Si aucun client défini, on en prend un (le + récent)
               if (!clientUser || clientUserError) {
                    const { data: lastClientUser } = await supabase
                         .from('client_users')
                         .select('uuid, client_uuid, selected_project_uuid')
                         .eq('user_uuid', userUuid)
                         .order('created_at', { ascending: false })
                         .limit(1)
                         .maybeSingle()

                    if (!lastClientUser) {
                         return response.notFound({
                              error: { name: 'clientUserMissing', description: 'Aucun client trouvé pour cet utilisateur.' }
                         })
                    }

                    clientUser = lastClientUser
                    selectedClientUuid = clientUser.client_uuid

                    // Mettre à jour la sélection client dans `users`
                    await supabase
                         .from('users')
                         .update({ selected_client_uuid: selectedClientUuid })
                         .eq('uuid', userUuid)
               }

               const selectedProjectUuid = clientUser.selected_project_uuid

               if (!selectedProjectUuid) {
                    return response.badRequest({
                         error: { name: 'missingProject', description: 'Aucun projet sélectionné pour ce client.' }
                    })
               }

               // 4. Récupérer les usages liés à ce projet
               const { data: project_usages, error: usageError } = await supabase
                    .from('client_project_usages')
                    .select('id, usage, limit')
                    .eq('project_uuid', selectedProjectUuid)

               if (usageError) {
                    console.error('Erreur récupération usage:', usageError)
                    return response.internalServerError({
                         error: { name: 'usageError', description: 'Impossible de récupérer les données d’usage.' }
                    })
               }

               return {
                    usages: project_usages || []
               }
          } catch (error) {
               console.error('Erreur UsageController.index:', error)
               return response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur interne' }
               })
          }
     }
}

export default new UsageController()
