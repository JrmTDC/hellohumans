import { HttpContext } from '@adonisjs/core/http'
import supabaseService from '#services/supabaseService'

class ProjectController{
     public async getProject(ctx: HttpContext) {
          try {
               let selected_client_id = ctx.user.selected_client_id

               // 1. Vérifier que ce client est bien lié à l'utilisateur
               let { data: clientUser, error: clientUserError } = await supabaseService
                    .from('client_users')
                    .select('id, client_id, selected_project_id')
                    .eq('user_id', ctx.user.id)
                    .eq('client_id', selected_client_id)
                    .maybeSingle()

               if (!clientUser || clientUserError) {
                    // Si non trouvé → on récupère le dernier client lié
                    const { data: lastClientUser, error: lastClientError } = await supabaseService
                         .from('client_users')
                         .select('client_id, id, selected_project_id')
                         .eq('user_id', ctx.user.id)
                         .order('created_at', { ascending: false })
                         .limit(1)
                         .maybeSingle()

                    if (!lastClientUser || lastClientError) {
                         return ctx.response.notFound({
                              error: { name: 'noClientFound', description: 'Aucun client associé à cet utilisateur.' }
                         })
                    }

                    selected_client_id = lastClientUser.client_id
                    clientUser = lastClientUser

                    // Mise à jour du selected_client_id
                    await supabaseService
                         .from('users')
                         .update({ selected_client_id: selected_client_id })
                         .eq('id', ctx.user.id)
               }

               const client_user_id = clientUser.client_id
               let selected_project_id = clientUser.selected_project_id

               // 2. Vérifie si le projet sélectionné est bien lié au client
               if (selected_project_id) {
                    const { data: validProject } = await supabaseService
                         .from('client_projects')
                         .select('id')
                         .eq('id', selected_project_id)
                         .eq('client_id', client_user_id)
                         .maybeSingle()

                    if (!validProject) {
                         selected_project_id = null
                    }
               }

               // 3. Si aucun projet sélectionné → on récupère le dernier du client
               if (!selected_project_id) {
                    const { data: lastProject } = await supabaseService
                         .from('client_projects')
                         .select('id')
                         .eq('client_id', selected_client_id)
                         .order('created_at', { ascending: false })
                         .limit(1)
                         .maybeSingle()

                    if (!lastProject) {
                         return ctx.response.notFound({
                              error: { name: 'noProjectFound', description: 'Aucun projet trouvé pour ce client.' }
                         })
                    }

                    selected_project_id = lastProject.id

                    // Mise à jour selected_project_id dans client_users
                    await supabaseService
                         .from('client_users')
                         .update({ selected_project_id: selected_project_id })
                         .eq('id', client_user_id)
               }

               // 4. On retourne uniquement le projet sélectionné
               const { data: selectedProject, error: selectedProjectError } = await supabaseService
                    .from('client_projects')
                    .select('*')
                    .eq('id', selected_project_id)
                    .single()

               if (selectedProjectError || !selectedProject) {
                    return ctx.response.notFound({
                         error: { name: 'projectNotFound', description: 'Projet introuvable.' }
                    })
               }

               // 5. On retourne uniquement le projet sélectionné
               const { data: projectSubscription } = await supabaseService
                    .from('client_project_subscriptions')
                    .select('*')
                    .eq('project_id', selected_project_id)
                    .maybeSingle()


               return {
                    project: {
                         ...selectedProject,
                         subscription: projectSubscription || null
                    }
               }

          } catch (error) {
               console.error('Erreur ClientController.getProject:', error)
               return ctx.response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur interne.' }
               })
          }
     }

     public async getProjects(ctx: HttpContext) {
          try {
               if (!ctx.user.selected_client_id) {
                    return ctx.response.notFound({
                         error: { name: 'noClientFound', description: 'Aucun client lié à cet utilisateur.' }
                    })
               }

               // Récupération des projets du client
               const { data: projects, error: projectsError } = await supabaseService
                    .from('client_projects')
                    .select('*')
                    .eq('client_id', ctx.user.selected_client_id)
                    .order('created_at', { ascending: false })

               if (projectsError) {
                    return ctx.response.internalServerError({
                         error: { name: 'projectFetchError', description: 'Erreur lors de la récupération des projets.' }
                    })
               }

               return {
                    projects
               }
          } catch (error) {
               console.error('Erreur ClientController.getProjects:', error)
               return ctx.response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur interne.' }
               })
          }
     }

     public async switchProject(ctx: HttpContext) {
          try {
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
                    .eq('client_id', ctx.user.selected_client_id)
                    .maybeSingle()

               if (!clientUser || clientUserError) {
                    return ctx.response.forbidden({
                         error: { name: 'forbidden', description: 'Aucun lien avec ce client.' }
                    })
               }

               // 3. Vérifie que le projet est bien lié à ce client
               const { data: validProject, error: projectError } = await supabaseService
                    .from('client_projects')
                    .select('id')
                    .eq('id', ctx.params.uuid)
                    .eq('client_id', ctx.user.selected_client_id)
                    .maybeSingle()

               if (!validProject || projectError) {
                    return ctx.response.notFound({
                         error: { name: 'invalidProject', description: 'Ce projet n\'est pas lié à votre compte client.' }
                    })
               }

               // 4. Mise à jour de selected_project_id dans client_users
               const { error: updateError } = await supabaseService
                    .from('client_users')
                    .update({ selected_project_id: ctx.params.uuid })
                    .eq('id', clientUser.id)

               if (updateError) {
                    return ctx.response.internalServerError({
                         error: { name: 'updateFailed', description: 'Échec de la mise à jour du projet.' }
                    })
               }

               return {
                    user: {
                         selected_project_id: ctx.params.uuid
                    }
               }

          } catch (error) {
               console.error('Erreur ClientController.switchProject:', error)
               return ctx.response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur interne.' }
               })
          }
     }
}
export default new ProjectController()
