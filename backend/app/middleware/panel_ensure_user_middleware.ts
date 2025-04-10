import { HttpContext } from '@adonisjs/core/http'
import supabaseService from '#services/supabaseService'

class AuthMiddleware {
     public async handle(ctx: HttpContext, next: () => Promise<void>) {
          try {
               // Récupération du token depuis les headers
               const token = ctx.request.header('Authorization')?.replace('Bearer ', '')

               if (!token) {
                    return ctx.response.unauthorized({
                         error: { name: 'missingToken', description: 'Token requis' }
                    })
               }

               // Vérification du token via Supabase
               const { data, error } = await supabaseService.auth.getUser(token)

               if (error || !data.user) {
                    return ctx.response.unauthorized({
                         error: { name: 'invalidToken', description: 'Token invalide' }
                    })
               }

               // Ajouter l'utilisateur dans le contexte (ctx.auth.user)
               ctx.auth = { user: data.user }

               await next()
          } catch (error) {
               console.error('Erreur AuthMiddleware:', error)
               return ctx.response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur interne' }
               })
          }
     }
}

export default AuthMiddleware
