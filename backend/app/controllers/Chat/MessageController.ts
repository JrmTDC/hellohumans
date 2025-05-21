import { HttpContext } from '@adonisjs/core/http'
import supabaseService from '#services/supabaseService'
import { loadClientData } from '#services/clientDataService'
import { MistralResponse } from '#contracts/interfaces'

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


          // Construire le prompt
          let prompt = `Tu es un agent conversationnel pour le site ${ctx.project.website} (activité: ${ctx.project.activity}).\n`
          const { prompt: clientPrompt } = await loadClientData(ctx.client.id)
          if (clientPrompt) {
               prompt += `Données du client:\n${clientPrompt}\n`
          }
          prompt += `Message: ${message}\nRéponse:\n`

          // Sinon, appel Mistral
          const mistralResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
               method: 'POST',
               headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
               },
               body: JSON.stringify({
                    model: 'mistral-medium',
                    messages: [{ role: 'user', content: prompt }],
               }),
          })

          const mistralData = (await mistralResponse.json()) as MistralResponse
          const responseText = mistralData.choices?.[0]?.message?.content?.trim() || '...'

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
