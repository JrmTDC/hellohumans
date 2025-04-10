import type { HttpContext } from '@adonisjs/core/http'
import supabase from '#services/supabaseService'

export default class EnsureClientAccess {
     public async handle(ctx: HttpContext, next: () => Promise<void>) {
          const token = ctx.request.header('Authorization')?.replace('Bearer ', '')

          if (!token) {
               return ctx.response.unauthorized({
                    error: { name: 'missingToken', description: 'Token requis' }
               })
          }

          const { data: authData, error: authError } = await supabase.auth.getUser(token)
          if (authError || !authData.user) {
               return ctx.response.unauthorized({
                    error: { name: 'invalidToken', description: 'Token invalide' }
               })
          }

          const { data: userData, error: userError  } = await supabase
               .from('users')
               .select('id')
               .eq('auth_id', authData.user.id)
               .single()

          if (!userData || userError) {
               return ctx.response.notFound({
                    error: { name: 'userNotFound', description: 'Utilisateur introuvable' },
               })
          }

          const client_id = ctx.params.client_id || ctx.request.input('client_id')

          if (!client_id) {
               return ctx.response.badRequest({
                    error: { name: 'missingClient', description: 'ID client requis' }
               })
          }

          const { data: clientUser } = await supabase
               .from('client_users')
               .select('role')
               .eq('user_id', userData.id)
               .eq('client_id', client_id)
               .single()

          if (!clientUser || !['owner', 'admin'].includes(clientUser.role)) {
               return ctx.response.forbidden({
                    error: { name: 'accessDenied', description: 'Accès non autorisé à ce client' }
               })
          }

          ctx.auth = {
               user: authData.user,
               user_id: userData.id,
               client_id
          }

          await next()
     }
}
