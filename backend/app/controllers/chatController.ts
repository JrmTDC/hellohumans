// app/controllers/chatController.ts
import { HttpContext } from '@adonisjs/core/http'
import Env from '#start/env'

// Services
import ipService from '#services/ipService'
import blockedUserAgentsService from '#services/blockedUserAgentsService'
import clientService from '#services/clientService'
import { loadClientData } from '#services/clientDataService'
import { getUserIp, verifyDomainAndIp } from '#services/utils'
import { MistralResponse } from '#contracts/interfaces'

class ChatController {
     public async chat({ request, response }: HttpContext) {
          try {
               // IP
               const userIp = getUserIp(request)
               if (!userIp) {
                    return response.unauthorized({
                         error: "Accès interdit : Impossible de déterminer l'adresse IP.",
                         status: 'error',
                    })
               }
               // Check bannissement
               const isBanned = await ipService.isIpBanned(userIp)
               if (isBanned) {
                    return response.unauthorized({
                         error: 'Accès interdit : Adresse IP bannie.',
                         status: 'error',
                    })
               }

               // User-Agent
               const userAgent = request.header('user-agent') || ''
               const isBlockedUA = await blockedUserAgentsService.isUserAgentBlocked(userAgent)
               if (isBlockedUA) {
                    await ipService.addInfraction(userIp)
                    return response.unauthorized({
                         error: 'Accès interdit : Requête suspecte (User-Agent bloqué).',
                         status: 'error',
                    })
               }

               // ClientKey
               const clientKey = request.header('x-client-key') || ''
               const client = await clientService.getClient(clientKey)
               if (!client) {
                    await ipService.addInfraction(userIp)
                    return response.unauthorized({
                         error: 'Accès interdit : Clé client invalide.',
                         status: 'error',
                    })
               }

               // Vérifier domaine + IP
               const requestOriginCall = request.header('origin') || request.header('referer') || ''
               const isDomainValid = await verifyDomainAndIp(
                    requestOriginCall,
                    userIp,
                    client.allowed_domains
               )
               if (!isDomainValid) {
                    await ipService.addInfraction(userIp)
                    return response.unauthorized({
                         error: 'Accès interdit : Domaine ou IP non autorisés.',
                         status: 'error',
                    })
               }

               // Message
               const body = request.all()
               const message = (body.message || '').trim()
               if (!message) {
                    return response.badRequest({
                         error: "Le champ 'message' est requis.",
                    })
               }

               // Charger le prompt du client
               const { prompt: clientPrompt } = await loadClientData(clientKey)

               // Construire le prompt final
               let prompt = `Tu es un agent conversationnel (chatbot) intégré au site web de ${client.name}.\n`
               prompt += `Ta mission est d’aider les visiteurs en répondant à leurs questions, uniquement si elles sont en lien avec l’activité du site ${client.activity}.\n`

               if (clientPrompt) {
                    prompt += `Voici les données :\n${clientPrompt}\n`
               }

               prompt += `Ne fournis pas trop d’informations, pose plutôt des questions supplémentaires si nécessaire pour affiner ta réponse.\n`
               prompt += `Priorise des réponses concises et utiles, tout en restant naturel et engageant.\n`
               prompt += `Si une demande sort du cadre du site, indique poliment que tu ne peux pas répondre.\n`
               prompt += `Adapte ton ton et ton langage en fonction du contexte pour offrir une expérience fluide et agréable aux utilisateurs.\n`
               prompt += `Message: ${message}\nRéponse:\n`

               // Appel à Mistral
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
               const responseMessage = mistralData.choices?.[0]?.message?.content?.trim()

               return {
                    response: responseMessage || 'Je ne peux pas répondre pour l’instant.',
                    status: responseMessage ? 'success' : 'unavailable',
               }
          } catch (error) {
               console.error('Erreur générale ChatController:', error)
               return response.internalServerError({
                    error: 'Impossible de récupérer une réponse pour le moment.',
                    status: 'unavailable',
               })
          }
     }
}

export default new ChatController()
