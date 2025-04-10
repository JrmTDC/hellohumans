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

     public async getProject({ auth, response }: HttpContext) {
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

               // 2. Vérifier que ce client est bien lié à l'utilisateur
               let { data: clientUser, error: clientUserError } = await supabase
                    .from('client_users')
                    .select('id, client_id, selected_project_id')
                    .eq('user_id', user_id)
                    .eq('client_id', selected_client_id)
                    .maybeSingle()

               if (!clientUser || clientUserError) {
                    // Si non trouvé → on récupère le dernier client lié
                    const { data: lastClientUser, error: lastClientError } = await supabase
                         .from('client_users')
                         .select('client_id, id, selected_project_id')
                         .eq('user_id', user_id)
                         .order('created_at', { ascending: false })
                         .limit(1)
                         .maybeSingle()

                    if (!lastClientUser || lastClientError) {
                         return response.notFound({
                              error: { name: 'noClientFound', description: 'Aucun client associé à cet utilisateur.' }
                         })
                    }

                    selected_client_id = lastClientUser.client_id
                    clientUser = lastClientUser

                    // Mise à jour du selected_client_id
                    await supabase
                         .from('users')
                         .update({ selected_client_id: selected_client_id })
                         .eq('id', user_id)
               }

               const client_user_id = clientUser.id
               let selected_project_id = clientUser.selected_project_id

               // 3. Vérifie si le projet sélectionné est bien lié au client
               if (selected_project_id) {
                    const { data: validProject } = await supabase
                         .from('client_projects')
                         .select('id')
                         .eq('id', selected_project_id)
                         .eq('client_id', client_user_id)
                         .maybeSingle()

                    if (!validProject) {
                         selected_project_id = null
                    }
               }

               // 4. Si aucun projet sélectionné → on récupère le dernier du client
               if (!selected_project_id) {
                    const { data: lastProject } = await supabase
                         .from('client_projects')
                         .select('id')
                         .eq('client_id', selected_client_id)
                         .order('created_at', { ascending: false })
                         .limit(1)
                         .maybeSingle()

                    if (!lastProject) {
                         return response.notFound({
                              error: { name: 'noProjectFound', description: 'Aucun projet trouvé pour ce client.' }
                         })
                    }

                    selected_project_id = lastProject.id

                    // Mise à jour selected_project_id dans client_users
                    await supabase
                         .from('client_users')
                         .update({ selected_project_id: selected_project_id })
                         .eq('id', client_user_id)
               }

               // 5. On retourne uniquement le projet sélectionné
               const { data: selectedProject, error: selectedProjectError } = await supabase
                    .from('client_projects')
                    .select('*')
                    .eq('id', selected_project_id)
                    .single()

               if (selectedProjectError || !selectedProject) {
                    return response.notFound({
                         error: { name: 'projectNotFound', description: 'Projet introuvable.' }
                    })
               }

               return {
                    project: selectedProject
               }

          } catch (error) {
               console.error('Erreur ClientController.getProject:', error)
               return response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur interne.' }
               })
          }
     }

     public async getProjects({ auth, response }: HttpContext) {
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

               // 2. Vérification du lien utilisateur ↔ client
               let { data: clientUser, error: clientUserError } = await supabase
                    .from('client_users')
                    .select('id, client_id')
                    .eq('user_id', user_id)
                    .eq('client_id', selected_client_id)
                    .maybeSingle()

               // 3. Si le lien est invalide ou non existant, on prend le dernier client
               if (!clientUser || clientUserError) {
                    const { data: lastClientUser, error: lastClientError } = await supabase
                         .from('client_users')
                         .select('client_id')
                         .eq('user_id', user_id)
                         .order('created_at', { ascending: false })
                         .limit(1)
                         .maybeSingle()

                    if (!lastClientUser || lastClientError) {
                         return response.notFound({
                              error: { name: 'noClientFound', description: 'Aucun client lié à cet utilisateur.' }
                         })
                    }

                    selected_client_id = lastClientUser.client_id

                    // Mise à jour du client sélectionné dans la table users
                    await supabase
                         .from('users')
                         .update({ selected_client_id: selected_client_id })
                         .eq('id', user_id)
               }

               // 4. Récupération des projets du client
               const { data: projects, error: projectsError } = await supabase
                    .from('client_projects')
                    .select('*')
                    .eq('client_id', selected_client_id)
                    .order('created_at', { ascending: false })

               if (projectsError) {
                    return response.internalServerError({
                         error: { name: 'projectFetchError', description: 'Erreur lors de la récupération des projets.' }
                    })
               }

               return {
                    projects
               }
          } catch (error) {
               console.error('Erreur ClientController.getProjects:', error)
               return response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur interne.' }
               })
          }
     }

     public async switchProject({ auth, params, response }: HttpContext) {
          try {
               const auth_id = auth?.user?.id
               const project_id = params.uuid

               if (!auth_id || !project_id) {
                    return response.badRequest({
                         error: { name: 'invalidRequest', description: 'Paramètre manquant ou utilisateur non connecté.' }
                    })
               }

               // 1. Récupération de l'utilisateur interne
               const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('id, selected_client_id')
                    .eq('auth_id', auth_id)
                    .single()

               if (!userData || userError) {
                    return response.notFound({
                         error: { name: 'userNotFound', description: 'Utilisateur introuvable.' }
                    })
               }

               const user_id = userData.id
               const selected_client_id = userData.selected_client_id

               // 2. Vérifie que le client est bien lié à cet utilisateur
               const { data: clientUser, error: clientUserError } = await supabase
                    .from('client_users')
                    .select('id')
                    .eq('user_id', user_id)
                    .eq('client_id', selected_client_id)
                    .maybeSingle()

               if (!clientUser || clientUserError) {
                    return response.forbidden({
                         error: { name: 'forbidden', description: 'Aucun lien avec ce client.' }
                    })
               }

               // 3. Vérifie que le projet est bien lié à ce client
               const { data: validProject, error: projectError } = await supabase
                    .from('client_projects')
                    .select('id')
                    .eq('id', project_id)
                    .eq('client_id', selected_client_id)
                    .maybeSingle()

               if (!validProject || projectError) {
                    return response.notFound({
                         error: { name: 'invalidProject', description: 'Ce projet n\'est pas lié à votre compte client.' }
                    })
               }

               // 4. Mise à jour de selected_project_id dans client_users
               const { error: updateError } = await supabase
                    .from('client_users')
                    .update({ selected_project_id: project_id })
                    .eq('id', clientUser.id)

               if (updateError) {
                    return response.internalServerError({
                         error: { name: 'updateFailed', description: 'Échec de la mise à jour du projet.' }
                    })
               }

               return {
                    user: {
                         selected_project_id: project_id
                    }
               }

          } catch (error) {
               console.error('Erreur ClientController.switchProject:', error)
               return response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur interne.' }
               })
          }
     }

}

export default new ClientController()
