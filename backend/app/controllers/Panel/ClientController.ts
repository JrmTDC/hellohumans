import { HttpContext } from '@adonisjs/core/http'
import supabase from '#services/supabaseService'

class ClientController {
     public async getClient({ auth, response }: HttpContext) {
          try {
               const authUUID = auth?.user?.id
               if (!authUUID) {
                    return response.unauthorized({
                         error: { name: 'unauthorized', description: 'Utilisateur non connecté.' }
                    })
               }

               // 1. Récupération de l'utilisateur interne
               const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('uuid, selected_client_uuid')
                    .eq('auth_uuid', authUUID)
                    .single()

               if (userError || !userData) {
                    return response.notFound({
                         error: { name: 'userNotFound', description: 'Utilisateur introuvable.' }
                    })
               }

               const userUuid = userData.uuid
               let selectedClientUuid = userData.selected_client_uuid

               // 2. Vérifie si selected_client_uuid correspond à un lien dans client_users
               let clientUsersData = null

               if (selectedClientUuid) {
                    const { data } = await supabase
                         .from('client_users')
                         .select('client_uuid')
                         .eq('user_uuid', userUuid)
                         .eq('client_uuid', selectedClientUuid)
                         .maybeSingle()

                    clientUsersData = data

                    // Si le client n’est pas associé à l'utilisateur → on l’ignore
                    if (!clientUsersData) {
                         selectedClientUuid = null
                    }
               }

               // 3. Si aucun client sélectionné ou invalide → prendre le plus récent
               if (!selectedClientUuid) {
                    const { data: fallbackClientUsers, error: fallbackError } = await supabase
                         .from('client_users')
                         .select('client_uuid')
                         .eq('user_uuid', userUuid)
                         .order('created_at', { ascending: false })
                         .limit(1)
                         .maybeSingle()

                    if (fallbackError || !fallbackClientUsers) {
                         return response.notFound({
                              error: { name: 'noClient', description: 'Aucun client lié à cet utilisateur.' }
                         })
                    }

                    selectedClientUuid = fallbackClientUsers.client_uuid

                    // Mettre à jour selected_client_uuid dans la table users
                    await supabase
                         .from('users')
                         .update({ selected_client_uuid: selectedClientUuid })
                         .eq('uuid', userUuid)
               }

               // 4. Récupérer le client final
               const { data: clientData, error: clientError } = await supabase
                    .from('clients')
                    .select('*')
                    .eq('uuid', selectedClientUuid)
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
               const authUUID = auth?.user?.id
               if (!authUUID) {
                    return response.unauthorized({
                         error: { name: 'unauthorized', description: 'Utilisateur non connecté.' }
                    })
               }

               // 1. On récupère l’utilisateur interne (par auth_uuid)
               const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('uuid')
                    .eq('auth_uuid', authUUID)
                    .single()

               if (userError || !userData) {
                    return response.notFound({
                         error: { name: 'userNotFound', description: 'Utilisateur introuvable.' }
                    })
               }

               // 2. On récupère tous les clients associés via client_users
               const { data: clientUsers, error: clientUsersError } = await supabase
                    .from('client_users')
                    .select('client_uuid')
                    .eq('user_uuid', userData.uuid)

               if (clientUsersError || !clientUsers || clientUsers.length === 0) {
                    return response.notFound({
                         error: { name: 'noClients', description: 'Aucun client associé à cet utilisateur.' }
                    })
               }

               const clientUuids = clientUsers.map((cu) => cu.client_uuid)

               // 3. On récupère les infos des clients
               const { data: clients, error: clientsError } = await supabase
                    .from('clients')
                    .select('*')
                    .in('uuid', clientUuids)

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
               const authUUID = auth?.user?.id
               if (!authUUID) {
                    return response.unauthorized({
                         error: { name: 'unauthorized', description: 'Utilisateur non connecté.' }
                    })
               }

               // 1. Récupération de l'utilisateur interne
               const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('uuid, selected_client_uuid')
                    .eq('auth_uuid', authUUID)
                    .single()

               if (userError || !userData) {
                    return response.notFound({
                         error: { name: 'userNotFound', description: 'Utilisateur introuvable.' }
                    })
               }

               const userUuid = userData.uuid
               let selectedClientUuid = userData.selected_client_uuid

               // 2. Vérifier que ce client est bien lié à l'utilisateur
               let { data: clientUser, error: clientUserError } = await supabase
                    .from('client_users')
                    .select('uuid, client_uuid, selected_project_uuid')
                    .eq('user_uuid', userUuid)
                    .eq('client_uuid', selectedClientUuid)
                    .maybeSingle()

               if (!clientUser || clientUserError) {
                    // Si non trouvé → on récupère le dernier client lié
                    const { data: lastClientUser, error: lastClientError } = await supabase
                         .from('client_users')
                         .select('client_uuid, uuid, selected_project_uuid')
                         .eq('user_uuid', userUuid)
                         .order('created_at', { ascending: false })
                         .limit(1)
                         .maybeSingle()

                    if (!lastClientUser || lastClientError) {
                         return response.notFound({
                              error: { name: 'noClientFound', description: 'Aucun client associé à cet utilisateur.' }
                         })
                    }

                    selectedClientUuid = lastClientUser.client_uuid
                    clientUser = lastClientUser

                    // Mise à jour du selected_client_uuid
                    await supabase
                         .from('users')
                         .update({ selected_client_uuid: selectedClientUuid })
                         .eq('uuid', userUuid)
               }

               const clientUserUuid = clientUser.uuid
               let selectedProjectUuid = clientUser.selected_project_uuid

               // 3. Vérifie si le projet sélectionné est bien lié au client
               if (selectedProjectUuid) {
                    const { data: validProject } = await supabase
                         .from('client_projets')
                         .select('uuid')
                         .eq('uuid', selectedProjectUuid)
                         .eq('client_uuid', selectedClientUuid)
                         .maybeSingle()

                    if (!validProject) {
                         selectedProjectUuid = null
                    }
               }

               // 4. Si aucun projet sélectionné → on récupère le dernier du client
               if (!selectedProjectUuid) {
                    const { data: lastProject } = await supabase
                         .from('client_projets')
                         .select('uuid')
                         .eq('client_uuid', selectedClientUuid)
                         .order('created_at', { ascending: false })
                         .limit(1)
                         .maybeSingle()

                    if (!lastProject) {
                         return response.notFound({
                              error: { name: 'noProjectFound', description: 'Aucun projet trouvé pour ce client.' }
                         })
                    }

                    selectedProjectUuid = lastProject.uuid

                    // Mise à jour selected_project_uuid dans client_users
                    await supabase
                         .from('client_users')
                         .update({ selected_project_uuid: selectedProjectUuid })
                         .eq('uuid', clientUserUuid)
               }

               // 5. On retourne uniquement le projet sélectionné
               const { data: selectedProject, error: selectedProjectError } = await supabase
                    .from('client_projets')
                    .select('*')
                    .eq('uuid', selectedProjectUuid)
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
               const authUUID = auth?.user?.id
               if (!authUUID) {
                    return response.unauthorized({
                         error: { name: 'unauthorized', description: 'Utilisateur non connecté.' }
                    })
               }

               // 1. Récupération de l'utilisateur interne
               const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('uuid, selected_client_uuid')
                    .eq('auth_uuid', authUUID)
                    .single()

               if (userError || !userData) {
                    return response.notFound({
                         error: { name: 'userNotFound', description: 'Utilisateur introuvable.' }
                    })
               }

               const userUuid = userData.uuid
               let selectedClientUuid = userData.selected_client_uuid

               // 2. Vérification du lien utilisateur ↔ client
               let { data: clientUser, error: clientUserError } = await supabase
                    .from('client_users')
                    .select('uuid, client_uuid')
                    .eq('user_uuid', userUuid)
                    .eq('client_uuid', selectedClientUuid)
                    .maybeSingle()

               // 3. Si le lien est invalide ou non existant, on prend le dernier client
               if (!clientUser || clientUserError) {
                    const { data: lastClientUser, error: lastClientError } = await supabase
                         .from('client_users')
                         .select('client_uuid')
                         .eq('user_uuid', userUuid)
                         .order('created_at', { ascending: false })
                         .limit(1)
                         .maybeSingle()

                    if (!lastClientUser || lastClientError) {
                         return response.notFound({
                              error: { name: 'noClientFound', description: 'Aucun client lié à cet utilisateur.' }
                         })
                    }

                    selectedClientUuid = lastClientUser.client_uuid

                    // Mise à jour du client sélectionné dans la table users
                    await supabase
                         .from('users')
                         .update({ selected_client_uuid: selectedClientUuid })
                         .eq('uuid', userUuid)
               }

               // 4. Récupération des projets du client
               const { data: projects, error: projectsError } = await supabase
                    .from('client_projets')
                    .select('*')
                    .eq('client_uuid', selectedClientUuid)
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
               const authUUID = auth?.user?.id
               const projectUuid = params.uuid

               if (!authUUID || !projectUuid) {
                    return response.badRequest({
                         error: { name: 'invalidRequest', description: 'Paramètre manquant ou utilisateur non connecté.' }
                    })
               }

               // 1. Récupération de l'utilisateur interne
               const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('uuid, selected_client_uuid')
                    .eq('auth_uuid', authUUID)
                    .single()

               if (!userData || userError) {
                    return response.notFound({
                         error: { name: 'userNotFound', description: 'Utilisateur introuvable.' }
                    })
               }

               const userUuid = userData.uuid
               const selectedClientUuid = userData.selected_client_uuid

               // 2. Vérifie que le client est bien lié à cet utilisateur
               const { data: clientUser, error: clientUserError } = await supabase
                    .from('client_users')
                    .select('uuid')
                    .eq('user_uuid', userUuid)
                    .eq('client_uuid', selectedClientUuid)
                    .maybeSingle()

               if (!clientUser || clientUserError) {
                    return response.forbidden({
                         error: { name: 'forbidden', description: 'Aucun lien avec ce client.' }
                    })
               }

               // 3. Vérifie que le projet est bien lié à ce client
               const { data: validProject, error: projectError } = await supabase
                    .from('client_projets')
                    .select('uuid')
                    .eq('uuid', projectUuid)
                    .eq('client_uuid', selectedClientUuid)
                    .maybeSingle()

               if (!validProject || projectError) {
                    return response.notFound({
                         error: { name: 'invalidProject', description: 'Ce projet n\'est pas lié à votre compte client.' }
                    })
               }

               // 4. Mise à jour de selected_project_uuid dans client_users
               const { error: updateError } = await supabase
                    .from('client_users')
                    .update({ selected_project_uuid: projectUuid })
                    .eq('uuid', clientUser.uuid)

               if (updateError) {
                    return response.internalServerError({
                         error: { name: 'updateFailed', description: 'Échec de la mise à jour du projet.' }
                    })
               }

               return {
                    user: {
                         selected_project_uuid: projectUuid
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
