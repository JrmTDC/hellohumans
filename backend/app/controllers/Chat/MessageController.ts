import { HttpContext } from '@adonisjs/core/http'
import supabaseService from '#services/supabaseService'

class MessagesController {
     public async sendMessage(ctx: HttpContext) {
          const { visitor, project } = ctx
          const { message } = ctx.request.all()

          if (!visitor || !project || !message) {
               return ctx.response.badRequest({
                    error: { name: 'invalid_request', description: 'visitor, project, et message requis' },
               })
          }

          // Enregistrement du message visiteur
          await supabaseService
               .from('visitor_messages')
               .insert({
                    visitor_id: visitor.id,
                    sender: 'visitor',
                    content: message,
                    type: 'text',
               })
               .select()
               .single()

          // Générer la réponse (mock ou via LLM)
          const responseText = `Vous avez dit : "${message}" 🤖`

          const { data: botMsg } = await supabaseService
               .from('visitor_messages')
               .insert({
                    visitor_id: visitor.id,
                    sender: 'bot',
                    content: responseText,
                    type: 'text',
               })
               .select()
               .single()

          return {
               message: {
                    id: botMsg.id,
                    idFromServer: botMsg.id,
                    type: 'text',
                    sender: 'bot',
                    content: botMsg.content,
                    time_sent: new Date(botMsg.created_at).getTime(),
                    isAIAssistant: true,
                    aiAssistantResponseType: 'answer_generated',
               },
          }
     }
}

export default new MessagesController()
