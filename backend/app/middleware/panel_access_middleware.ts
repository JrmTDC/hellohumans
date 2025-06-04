import type { HttpContext } from '@adonisjs/core/http'
import supabaseService from '#services/supabaseService'

class PanelAccessMiddleware {
     public async handle(ctx: HttpContext, next: () => Promise<void>) {
          const token = ctx.request.header('Authorization')?.replace('Bearer ', '')
          if (!token) {
               return ctx.response.unauthorized({
                    error: { name: 'missingToken', description: 'Token requis' },
               })
          }

          const { data: authData, error: authError } = await supabaseService.auth.getUser(token)
          if (authError || !authData.user) {
               return ctx.response.unauthorized({
                    error: { name: 'invalidToken', description: 'Token invalide' },
               })
          }

          const auth_id = authData.user.id
          ctx.user = null
          ctx.project = null
          ctx.subscription = null

          // Récupération de l'utilisateur
          const { data: userData } = await supabaseService
               .from('users')
               .select('id, selected_project_id, blocked, lang, email, display_name')
               .eq('auth_id', auth_id)
               .maybeSingle()

          if (!userData) return ctx.response.unauthorized()
          if (userData.blocked) {
               return ctx.response.unauthorized({
                    error: { name: 'blockedUser', description: 'Utilisateur bloqué' },
               })
          }

          ctx.user = userData
          let selectedProjectId = userData.selected_project_id

          // Vérifie que l'utilisateur a accès à ce projet
          let { data: projectUser } = await supabaseService
               .from('project_users')
               .select('id, project_id')
               .eq('user_id', userData.id)
               .eq('project_id', selectedProjectId)
               .maybeSingle()

          if (!projectUser) {
               // Fallback : dernier projet disponible
               const { data: fallbackProject } = await supabaseService
                    .from('project_users')
                    .select('id, project_id')
                    .eq('user_id', userData.id)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .maybeSingle()

               if (!fallbackProject) return await next()

               selectedProjectId = fallbackProject.project_id

               // Mise à jour du selected_project_id
               await supabaseService
                    .from('users')
                    .update({ selected_project_id: selectedProjectId })
                    .eq('id', userData.id)
          }

          // Récupération du projet
          const { data: project } = await supabaseService
               .from('projects')
               .select('id, public_key, config, widget_installed, website, stripe_customer_id, owner_user_id, organization_data, onboarding_data, created_at').eq('id', selectedProjectId)
               .maybeSingle()

          if (!project) return await next()

          ctx.project = project

          // Récupération de l'abonnement du projet
          const { data: subscriptionData } = await supabaseService
               .from('project_subscriptions')
               .select('*')
               .eq('project_id', project.id)
               .maybeSingle()

          ctx.subscription = subscriptionData || null

          await next()
     }
}

export default PanelAccessMiddleware
