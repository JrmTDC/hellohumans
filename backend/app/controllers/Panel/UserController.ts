import { HttpContext } from '@adonisjs/core/http'
import supabase from '#services/supabaseService'

class UserController {
     public async getUser({ auth, response }: HttpContext) {
          try {
               const authUuid = auth?.user?.id
               if (!authUuid) {
                    return response.unauthorized({
                         error: { name: 'unauthorized', description: 'Utilisateur non connecté.' }
                    })
               }

               const { data: user, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('auth_uuid', authUuid)
                    .single()

               if (error || !user) {
                    return response.notFound({
                         error: { name: 'userNotFound', description: 'Utilisateur introuvable.' }
                    })
               }

               return { user: user }
          } catch (error) {
               console.error('Erreur UserController.me:', error)
               return response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur interne' }
               })
          }
     }

     public async updateLang({ auth, request, response }: HttpContext) {
          try {
               const authUUID = auth?.user?.id
               if (!authUUID) {
                    return response.unauthorized({
                         error: { name: 'unauthorized', description: 'Utilisateur non connecté.' }
                    })
               }

               const { lang } = request.only(['lang'])

               if (!lang || typeof lang !== 'string') {
                    return response.badRequest({
                         error: { name: 'invalidLang', description: 'Langue invalide.' }
                    })
               }

               const { error } = await supabase
                    .from('users')
                    .update({ lang })
                    .eq('auth_uuid', authUUID)

               if (error) {
                    console.error(error)
                    return response.internalServerError({
                         error: { name: 'updateError', description: 'Erreur lors de la mise à jour de la langue.' }
                    })
               }

               return { success: true }
          } catch (error) {
               console.error('updateLang error:', error)
               return response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur interne.' }
               })
          }
     }

}

export default new UserController()
