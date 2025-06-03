import { HttpContext } from '@adonisjs/core/http'
import supabaseService from '#services/supabaseService'

class ProjectController{
     public async getProject(ctx: HttpContext) {
          try {
               if (!ctx.project) {
                    return ctx.response.notFound({
                         error: { name: 'noProjectFound', description: 'Aucun projet lié à cet utilisateur.' }
                    })
               }
               return {
                    project: {
                         ...ctx.project,
                         subscription: ctx.subscription
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
               if (!ctx.project) {
                    return ctx.response.notFound({
                         error: { name: 'noProjectFound', description: 'Aucun projet lié à cet utilisateur.' }
                    })
               }

               // Récupération des projets du client
               const { data: projects, error: projectsError } = await supabaseService
                    .from('projects')
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
                    .from('project_users')
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
                    .from('project_projects')
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
