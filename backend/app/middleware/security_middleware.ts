// app/middleware/security_middleware.ts
import { HttpContext } from '@adonisjs/core/http'
import ipService from '#services/ipService'
import blockedUserAgentsService from '#services/blockedUserAgentsService'
import clientService from '#services/clientService'
import { getUserIp } from '#services/utils'

export default async function securityMiddleware(ctx: HttpContext, next: () => Promise<void>) {
     const { request, response } = ctx

     // 1) Récupérer l'IP
     const userIp = getUserIp(request)
     if (!userIp) {
          return response.unauthorized({
               error: {
                    name: 'ip_undefined',
                    description: 'Impossible de déterminer votre IP',
               },
          })
     }

     // 2) Vérifier si l'IP est bannie
     if (await ipService.isIpBanned(userIp)) {
          return response.unauthorized({
               error: {
                    name: 'ip_banned',
                    description: 'Adresse IP bannie',
               },
          })
     }

     // 3) Vérifier le User-Agent
     const userAgent = request.header('user-agent') || ''
     if (await blockedUserAgentsService.isUserAgentBlocked(userAgent)) {
          await ipService.addInfraction(userIp)
          return response.unauthorized({
               error: {
                    name: 'user_agent_blocked',
                    description: 'User-Agent bloqué',
               },
          })
     }

     // 4) Vérifier x-client-key
     const clientKey = request.header('x-client-key') || ''
     if (!clientKey) {
          await ipService.addInfraction(userIp)
          return response.unauthorized({
               error: {
                    name: 'client_key_invalid',
                    description: 'Clé client requise (x-client-key manquante)',
               },
          })
     }

     // 5) Charger le client
     const client = await clientService.getClientByKey(clientKey)
     if (!client) {
          await ipService.addInfraction(userIp)
          return response.unauthorized({
               error: {
                    name: 'client_key_invalid',
                    description: 'Clé client invalide',
               },
          })
     }

     // 6) Attacher client & IP au contexte
     ctx.client = client
     ctx.userIp = userIp

     // Poursuivre
     await next()
}
