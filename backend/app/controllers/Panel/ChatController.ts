import { HttpContext } from '@adonisjs/core/http'
import supabaseService from '#services/supabaseService'

class ChatController{
     public async configChat(ctx: HttpContext) {
          const { config } = ctx.request.all()

          if (!ctx.project || !config) {
               return ctx.response.badRequest({ error: 'Missing config or project' })
          }

          const { error } = await supabaseService
               .from('client_projects')
               .update({ config })
               .eq('id', ctx.project.id)

          if (error) {
               return ctx.response.internalServerError({ error: 'Erreur sauvegarde' })
          }

          return { success: true }
     }
}
export default new ChatController()
