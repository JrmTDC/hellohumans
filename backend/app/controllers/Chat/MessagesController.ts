import { HttpContext } from '@adonisjs/core/http'
import Env from '#start/env'
import messagesService from '#services/messagesService'
import userService from '#services/userService'
import { loadClientData } from '#services/clientDataService'
import { MistralResponse } from '#contracts/interfaces'
import { handleNaturePack } from '#services/natureModule'

class MessagesController {
     public async sendMessage({ request, response, client }: HttpContext) {
          try {
               // On récupère user_uuid et message
               const { user_uuid, message } = request.all()
               if (!user_uuid || !message) {
                    return response.badRequest({
                         error: {
                              name: 'invalid_input',
                              description: 'user_uuid et message sont requis',
                         },
                    })
               }

               if (!client) {
                    return response.unauthorized({
                         error: {
                              name: 'client_missing',
                              description: 'No client in context',
                         },
                    })
               }

               // Vérifier que l'utilisateur existe et appartient à ce client
               const user = await userService.getUserByUuid(user_uuid)
               if (!user || user.client_uuid !== client.uuid) {
                    return response.unauthorized({
                         error: {
                              name: 'user_invalid',
                              description: 'Utilisateur invalide pour ce client',
                         },
                    })
               }

               // Enregistrer le message "user" en DB
               await messagesService.saveUserMessage(user.uuid, message)

               // Construire le prompt
               let prompt = `Tu es un agent conversationnel pour le site ${client.name} (activité: ${client.activity}).\n`
               const { prompt: clientPrompt } = await loadClientData(client.uuid)
               if (clientPrompt) {
                    prompt += `Données du client:\n${clientPrompt}\n`
               }
               prompt += `Message: ${message}\nRéponse:\n`

               // Vérifier le pack nature
               if (client.has_nature_pack) {
                    const natureResponse = await handleNaturePack(message, client)
                    if (natureResponse) {
                         // On enregistre la réponse bot
                         await messagesService.saveBotMessage(user.uuid, natureResponse.content)
                         return {
                              response: natureResponse.content,
                              choices: natureResponse.choices || null,
                              status: 'success',
                         }
                    }
               }

               // Sinon, appel Mistral
               const mistralResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/json',
                         Authorization: `Bearer ${Env.get('MISTRAL_API_KEY')}`,
                    },
                    body: JSON.stringify({
                         model: 'mistral-medium',
                         messages: [{ role: 'user', content: prompt }],
                    }),
               })

               const mistralData = (await mistralResponse.json()) as MistralResponse
               const responseText = mistralData.choices?.[0]?.message?.content?.trim() || '...'

               // Enregistrer la réponse bot
               await messagesService.saveBotMessage(user.uuid, responseText)

               // Retour au client
               return {
                    response: responseText,
                    status: 'success',
                    choices: null,
               }
          } catch (error) {
               console.error('MessagesController.sendMessage error:', error)
               return response.internalServerError({
                    error: {
                         name: 'internal_error',
                         description: 'Erreur interne',
                    },
               })
          }
     }
}
export default new MessagesController()
