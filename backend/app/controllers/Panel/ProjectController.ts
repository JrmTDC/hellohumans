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
               // 1. Récupération des ID de projets liés à l’utilisateur
               const { data: projectLinks, error: linkError } = await supabaseService
                    .from('project_users')
                    .select('project_id')
                    .eq('user_id', ctx.user.id)

               if (linkError || !projectLinks) {
                    return ctx.response.internalServerError({
                         error: { name: 'projectLinkError', description: 'Erreur lors de la récupération des liens projets.' }
                    })
               }

               const projectIds = projectLinks.map(link => link.project_id)

               if (projectIds.length === 0) {
                    return { projects: [] }
               }

               // 2. Récupération des projets
               const { data: projects, error: projectsError } = await supabaseService
                    .from('projects')
                    .select('id, public_key, config, widget_installed, website, stripe_customer_id, owner_user_id, organization_data, onboarding_data, created_at')
                    .in('id', projectIds)
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
               console.error('Erreur ProjectController.getProjects:', error)
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

               // 2. Vérifie que l'utilisateur est bien lié à ce projet
               const { data: clientUser, error: clientUserError } = await supabaseService
                    .from('project_users')
                    .select('id')
                    .eq('user_id', ctx.user.id)
                    .eq('project_id', ctx.params.uuid)
                    .maybeSingle()

               if (!clientUser || clientUserError) {
                    return ctx.response.forbidden({
                         error: { name: 'forbidden', description: 'Aucun lien avec ce client.' }
                    })
               }

               // 4. Mise à jour de selected_project_id dans client_users
               const { error: updateError } = await supabaseService
                    .from('users')
                    .update({ selected_project_id: ctx.params.uuid })
                    .eq('id', ctx.user.id)

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
