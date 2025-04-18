import { HttpContext } from '@adonisjs/core/http'
import supabase from '#services/supabaseService'

class ClientController {
     public async getClient({ auth, response }: HttpContext) {
          try {
               const auth_id = auth?.user?.id
               if (!auth_id) {
                    return response.unauthorized({
                         error: { name: 'unauthorized', description: 'Utilisateur non connecté.' }
                    })
               }

               // 1. Récupération de l'utilisateur interne
               const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('id, selected_client_id')
                    .eq('auth_id', auth_id)
                    .single()

               if (userError || !userData) {
                    return response.notFound({
                         error: { name: 'userNotFound', description: 'Utilisateur introuvable.' }
                    })
               }

               const user_id = userData.id
               let selected_client_id = userData.selected_client_id

               // 2. Vérifie si selected_client_id correspond à un lien dans client_users
               let client_users_data = null

               if (selected_client_id) {
                    const { data } = await supabase
                         .from('client_users')
                         .select('client_id')
                         .eq('user_id', user_id)
                         .eq('client_id', selected_client_id)
                         .maybeSingle()

                    client_users_data = data

                    // Si le client n’est pas associé à l'utilisateur → on l’ignore
                    if (!client_users_data) {
                         selected_client_id = null
                    }
               }

               // 3. Si aucun client sélectionné ou invalide → prendre le plus récent
               if (!selected_client_id) {
                    const { data: fallbackClientUsers, error: fallbackError } = await supabase
                         .from('client_users')
                         .select('client_id')
                         .eq('user_id', user_id)
                         .order('created_at', { ascending: false })
                         .limit(1)
                         .maybeSingle()

                    if (fallbackError || !fallbackClientUsers) {
                         return response.notFound({
                              error: { name: 'noClient', description: 'Aucun client lié à cet utilisateur.' }
                         })
                    }

                    selected_client_id = fallbackClientUsers.client_id

                    // Mettre à jour selected_client_id dans la table users
                    await supabase
                         .from('users')
                         .update({ selected_client_id: selected_client_id })
                         .eq('id', user_id)
               }

               // 4. Récupérer le client final
               const { data: clientData, error: clientError } = await supabase
                    .from('clients')
                    .select('*')
                    .eq('id', selected_client_id)
                    .single()

               if (clientError || !clientData) {
                    return response.notFound({
                         error: { name: 'clientNotFound', description: 'Client introuvable.' }
                    })
               }

               // 5. Retourne l’utilisateur et le client sélectionné
               return {
                    client: clientData
               }
          } catch (error) {
               console.error('Erreur ClientController.getClient:', error)
               return response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur interne' }
               })
          }
     }

     public async getClients({ auth, response }: HttpContext) {
          try {
               const auth_id = auth?.user?.id
               if (!auth_id) {
                    return response.unauthorized({
                         error: { name: 'unauthorized', description: 'Utilisateur non connecté.' }
                    })
               }

               // 1. On récupère l’utilisateur interne (par auth_id)
               const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('id')
                    .eq('auth_id', auth_id)
                    .single()

               if (userError || !userData) {
                    return response.notFound({
                         error: { name: 'userNotFound', description: 'Utilisateur introuvable.' }
                    })
               }

               // 2. On récupère tous les clients associés via client_users
               const { data: clientUsers, error: clientUsersError } = await supabase
                    .from('client_users')
                    .select('client_id')
                    .eq('user_id', userData.id)

               if (clientUsersError || !clientUsers || clientUsers.length === 0) {
                    return response.notFound({
                         error: { name: 'noClients', description: 'Aucun client associé à cet utilisateur.' }
                    })
               }

               const client_id = clientUsers.map((cu) => cu.client_id)

               // 3. On récupère les infos des clients
               const { data: clients, error: clientsError } = await supabase
                    .from('clients')
                    .select('*')
                    .in('id', client_id)

               if (clientsError || !clients) {
                    return response.internalServerError({
                         error: { name: 'clientsFetchError', description: 'Erreur lors de la récupération des clients.' }
                    })
               }

               return {
                    clients
               }

          } catch (error) {
               console.error('Erreur ClientController.getClients:', error)
               return response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur interne.' }
               })
          }
     }
}

export default new ClientController()
