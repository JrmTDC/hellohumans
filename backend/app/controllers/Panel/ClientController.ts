import { HttpContext } from '@adonisjs/core/http'
import supabaseService from '#services/supabaseService'

class ClientController {
     public async getClient(ctx: HttpContext) {
          try {
               // 1. Vérifie si selected_client_id correspond à un lien dans client_users
               let client_users_data = null
               let selected_client_id = ctx.user.selected_client_id
               if (selected_client_id) {
                    const { data } = await supabaseService
                         .from('client_users')
                         .select('client_id')
                         .eq('user_id', ctx.user.id)
                         .eq('client_id', selected_client_id)
                         .maybeSingle()

                    client_users_data = data

                    // Si le client n’est pas associé à l'utilisateur → on l’ignore
                    if (!client_users_data) {
                         selected_client_id = null
                    }
               }

               // 2. Si aucun client sélectionné ou invalide → prendre le plus récent
               if (!selected_client_id) {
                    const { data: fallbackClientUsers, error: fallbackError } = await supabaseService
                         .from('client_users')
                         .select('client_id')
                         .eq('user_id', ctx.user.id)
                         .order('created_at', { ascending: false })
                         .limit(1)
                         .maybeSingle()

                    if (fallbackError || !fallbackClientUsers) {
                         return ctx.response.notFound({
                              error: { name: 'noClient', description: 'Aucun client lié à cet utilisateur.' }
                         })
                    }

                    selected_client_id = fallbackClientUsers.client_id

                    // Mettre à jour selected_client_id dans la table users
                    await supabaseService
                         .from('users')
                         .update({ selected_client_id: selected_client_id })
                         .eq('id', ctx.user.id)
               }

               // 3. Récupérer le client final
               const { data: clientData, error: clientError } = await supabaseService
                    .from('clients')
                    .select('*')
                    .eq('id', selected_client_id)
                    .single()

               if (clientError || !clientData) {
                    return ctx.response.notFound({
                         error: { name: 'clientNotFound', description: 'Client introuvable.' }
                    })
               }

               // 4. Retourne l’utilisateur et le client sélectionné
               return {
                    client: clientData
               }
          } catch (error) {
               console.error('Erreur ClientController.getClient:', error)
               return ctx.response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur interne' }
               })
          }
     }

     public async getClients(ctx: HttpContext) {
          try {
               // 1. On récupère tous les clients associés via client_users
               const { data: clientUsers, error: clientUsersError } = await supabaseService
                    .from('client_users')
                    .select('client_id')
                    .eq('user_id', ctx.user.id)

               if (clientUsersError || !clientUsers || clientUsers.length === 0) {
                    return ctx.response.notFound({
                         error: { name: 'noClients', description: 'Aucun client associé à cet utilisateur.' }
                    })
               }

               const client_id = clientUsers.map((cu) => cu.client_id)

               // 2. On récupère les infos des clients
               const { data: clients, error: clientsError } = await supabaseService
                    .from('clients')
                    .select('*')
                    .in('id', client_id)

               if (clientsError || !clients) {
                    return ctx.response.internalServerError({
                         error: { name: 'clientsFetchError', description: 'Erreur lors de la récupération des clients.' }
                    })
               }

               return {
                    clients
               }

          } catch (error) {
               console.error('Erreur ClientController.getClients:', error)
               return ctx.response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur interne.' }
               })
          }
     }

     public async switchClient(ctx: HttpContext) {
          try {
               // 1. Vérifie si l'utilisateur envoie bien un uuid client
               if (!ctx.params.uuid) {
                    return ctx.response.badRequest({
                         error: { name: 'invalidRequest', description: 'Paramètre manquant.' }
                    })
               }
               // 2. Vérifie que le client est bien lié à cet utilisateur
               const { data: clientUser, error: clientUserError } = await supabaseService
                    .from('client_users')
                    .select('id')
                    .eq('user_id', ctx.user.id)
                    .eq('client_id', ctx.params.uuid)
                    .maybeSingle()

               if (!clientUser || clientUserError) {
                    return ctx.response.forbidden({
                         error: { name: 'forbidden', description: 'Aucun lien avec ce client.' }
                    })
               }

               // 3. Mise à jour de selected_client_id dans users
               const { error: updateError } = await supabaseService
                    .from('users')
                    .update({ selected_client_id: ctx.params.uuid })
                    .eq('id', ctx.user.id)

               if (updateError) {
                    return ctx.response.internalServerError({
                         error: { name: 'updateFailed', description: 'Échec de la mise à jour du client.' }
                    })
               }

               return {
                    user: {
                         selected_client_id: ctx.params.uuid
                    }
               }

          } catch (error) {
               console.error('Erreur ClientController.switchClient:', error)
               return ctx.response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur interne.' }
               })
          }
     }
}

export default new ClientController()
