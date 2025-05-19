import { HttpContext } from '@adonisjs/core/http'
import supabase from '#services/supabaseService'

class UserController {
     public async getUser(ctx: HttpContext) {
          try {
               return {
                    user: {
                         id: ctx.user.id,
                         email: ctx.user.email,
                         lang: ctx.user.lang,
                         selected_client_id: ctx.user.selected_client_id,
                         display_name: ctx.user.display_name,
                         blocked: ctx.user.blocked
                    }
               }
          } catch (error) {
               console.error('Erreur UserController.me:', error)
               return ctx.response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur interne' }
               })
          }
     }

     public async updateLang(ctx: HttpContext) {
          try {
               const { lang } = ctx.request.only(['lang'])

               if (!lang || typeof lang !== 'string') {
                    return ctx.response.badRequest({
                         error: { name: 'invalidLang', description: 'Langue invalide.' }
                    })
               }

               const { error } = await supabase
                    .from('users')
                    .update({ lang })
                    .eq('id', ctx.user.id)

               if (error) {
                    console.error(error)
                    return ctx.response.internalServerError({
                         error: { name: 'updateError', description: 'Erreur lors de la mise à jour de la langue.' }
                    })
               }

               return { success: true }
          } catch (error) {
               console.error('updateLang error:', error)
               return ctx.response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur interne.' }
               })
          }
     }

}

export default new UserController()
