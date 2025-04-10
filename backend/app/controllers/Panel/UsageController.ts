import { HttpContext } from '@adonisjs/core/http'
import supabase from '#services/supabaseService'

class UsageController {
     public async index({ auth, response }: HttpContext) {
          try {
               const auth_id = auth?.user?.id
               if (!auth_id) {
                    return response.unauthorized({
                         error: { name: 'unauthorized', description: 'Utilisateur non connecté.' }
                    })
               }

               // 1. Récupération de l'utilisateur interne
               const { data: user, error: userError } = await supabase
                    .from('users')
                    .select('id, selected_client_id')
                    .eq('auth_id', auth_id)
                    .maybeSingle()

               if (!user || userError) {
                    return response.notFound({
                         error: { name: 'userNotFound', description: 'Utilisateur introuvable.' }
                    })
               }

               const user_id = user.id
               let selected_client_id = user.selected_client_id

               // 2. Vérifier que ce client est bien lié à l’utilisateur
               let { data: clientUser, error: clientUserError } = await supabase
                    .from('client_users')
                    .select('id, client_id, selected_project_id')
                    .eq('user_id', user_id)
                    .eq('client_id', selected_client_id)
                    .maybeSingle()

               // 3. Si aucun client défini, on en prend un (le + récent)
               if (!clientUser || clientUserError) {
                    const { data: lastClientUser } = await supabase
                         .from('client_users')
                         .select('id, client_id, selected_project_id')
                         .eq('user_id', user_id)
                         .order('created_at', { ascending: false })
                         .limit(1)
                         .maybeSingle()

                    if (!lastClientUser) {
                         return response.notFound({
                              error: { name: 'clientUserMissing', description: 'Aucun client trouvé pour cet utilisateur.' }
                         })
                    }

                    clientUser = lastClientUser
                    selected_client_id = clientUser.client_id

                    // Mettre à jour la sélection client dans `users`
                    await supabase
                         .from('users')
                         .update({ selected_client_id: selected_client_id })
                         .eq('id', user_id)
               }

               const selected_project_id = clientUser.selected_project_id

               if (!selected_project_id) {
                    return response.badRequest({
                         error: { name: 'missingProject', description: 'Aucun projet sélectionné pour ce client.' }
                    })
               }

               // 4. Récupérer les usages liés à ce projet
               const { data: project_usages, error: usageError } = await supabase
                    .from('client_project_usages')
                    .select('id, usage, limit')
                    .eq('project_id', selected_project_id)

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
