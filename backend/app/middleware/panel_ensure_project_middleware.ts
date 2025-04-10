import type { HttpContext } from '@adonisjs/core/http'
import supabase from '#services/supabaseService'

class EnsureProjectAccess {
     public async handle(ctx: HttpContext, next: () => Promise<void>) {
          const token = ctx.request.header('Authorization')?.replace('Bearer ', '')

          if (!token) {
               return ctx.response.unauthorized({
                    error: { name: 'missingToken', description: 'Token requis' }
               })
          }

          // Vérifie via Supabase Auth
          const { data: authData, error: authError } = await supabase.auth.getUser(token)
          if (authError || !authData.user) {
               return ctx.response.unauthorized({
                    error: { name: 'invalidToken', description: 'Token invalide' }
               })
          }

          const auth_id = authData.user.id

          // Récupère l'utilisateur interne
          const { data: user, error: userError } = await supabase
               .from('users')
               .select('id')
               .eq('auth_id', auth_id)
               .single()

          if (!user || userError) {
               return ctx.response.notFound({
                    error: { name: 'userNotFound', description: 'Utilisateur introuvable' }
               })
          }

          const user_id = user.id
          const project_id = ctx.params.project_id || ctx.request.input('project_id')

          if (!project_id) {
               return ctx.response.badRequest({
                    error: { name: 'missingProject', description: 'ID projet requis' }
               })
          }

          // Vérifie que le projet appartient à un client associé à cet utilisateur
          const { data: project, error: projectError } = await supabase
               .from('client_projects')
               .select('client_id')
               .eq('id', project_id)
               .single()

          if (!project || projectError) {
               return ctx.response.notFound({
                    error: { name: 'projectNotFound', description: 'Projet introuvable' }
               })
          }

          const { data: clientUser, error: clientUserError } = await supabase
               .from('client_users')
               .select('role')
               .eq('user_id', user_id)
               .eq('client_id', project.client_id)
               .single()

          if (!clientUser || clientUserError || !['owner', 'admin'].includes(clientUser.role)) {
               return ctx.response.forbidden({
                    error: { name: 'accessDenied', description: 'Accès non autorisé à ce projet' }
               })
          }

          // Conserve les infos utiles dans le contexte
          ctx.auth = {
               user: authData.user,
               user_id,
               project_id,
               client_id: project.client_id
          }

          await next()
     }
}
export default EnsureProjectAccess
