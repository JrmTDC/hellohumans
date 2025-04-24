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

          // Vérifie via Supabase Auth
          const { data: authData, error: authError } = await supabaseService .auth.getUser(token)
          if (authError || !authData.user) {
               return ctx.response.unauthorized({
                    error: { name: 'invalidToken', description: 'Token invalide' },
               })
          }

          const auth_id = authData.user.id
          ctx.user = null
          ctx.client = null
          ctx.project = null
          ctx.subscription = null

          // 1. User interne
          const { data: userData } = await supabaseService
               .from('users')
               .select('id, selected_client_id')
               .eq('auth_id', auth_id)
               .maybeSingle()

          if (!userData) return ctx.response.unauthorized()

          ctx.user = userData
          let selectedClientId = userData.selected_client_id

          // 2. Client User (lien utilisateur ↔ client)
          let { data: clientUser } = await supabaseService
               .from('client_users')
               .select('id, client_id, selected_project_id')
               .eq('user_id', userData.id)
               .eq('client_id', selectedClientId)
               .maybeSingle()

          if (!clientUser) {
               // Fallback sur dernier client
               const { data: fallbackClient } = await supabaseService
                    .from('client_users')
                    .select('id, client_id, selected_project_id')
                    .eq('user_id', userData.id)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .maybeSingle()

               if (!fallbackClient) return await next()

               selectedClientId = fallbackClient.client_id
               clientUser = fallbackClient

               // Met à jour selected_client_id dans users
               await supabaseService
                    .from('users')
                    .update({ selected_client_id: selectedClientId })
                    .eq('id', userData.id)
          }

          const { data: clientData } = await supabaseService
               .from('clients')
               .select('*')
               .eq('id', selectedClientId)
               .maybeSingle()

          ctx.client = clientData

          // 3. Project (via selected_project_id)
          let selectedProjectId = clientUser.selected_project_id
          if (selectedProjectId) {
               const { data: project } = await supabaseService
                    .from('client_projects')
                    .select('id, website')
                    .eq('id', selectedProjectId)
                    .eq('client_id', selectedClientId)
                    .maybeSingle()

               if (project) {
                    ctx.project = project

                    // 4. Sub (abonnement projet)
                    const { data: sub } = await supabaseService
                         .from('client_project_subscriptions')
                         .select('*')
                         .eq('project_id', project.id)
                         .maybeSingle()

                    ctx.subscription = sub || null
                    return await next()
               }
          }

          // Fallback si projet inexistant / supprimé
          const { data: fallbackProject } = await supabaseService
               .from('client_projects')
               .select('id, website')
               .eq('client_id', selectedClientId)
               .order('created_at', { ascending: false })
               .limit(1)
               .maybeSingle()

          if (!fallbackProject) return await next()

          // Mise à jour selected_project_id
          await supabaseService
               .from('client_users')
               .update({ selected_project_id: fallbackProject.id })
               .eq('user_id', userData.id)
               .eq('client_id', selectedClientId)

          ctx.project = fallbackProject

          const { data: subscriptionData } = await supabaseService
               .from('client_project_subscriptions')
               .select('*')
               .eq('project_id', fallbackProject.id)
               .maybeSingle()

          ctx.subscription = subscriptionData || null

          await next()
     }
}
export default PanelAccessMiddleware
