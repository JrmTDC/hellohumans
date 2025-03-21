import { HttpContext } from '@adonisjs/core/http'
import userService from '#services/userService'

class VisitorsController {
     public async store({ request, response, client }: HttpContext) {
          try {
               const { email, rgpd } = request.all()

               if (!email || !email.includes('@')) {
                    return response.badRequest({
                         error: { name: 'email_invalid', description: 'Email requis' },
                    })
               }

               if (rgpd !== 'accepted') {
                    return response.badRequest({
                         error: { name: 'rgpd_invalid', description: 'RGPD doit être accepté' },
                    })
               }

               if (!client) {
                    return response.badRequest({
                         error: { name: 'client_missing', description: 'No client in context' },
                    })
               }

               const user = await userService.findOrCreateUser({
                    client_uuid: client.uuid,
                    email,
                    rgpd: "accepted",
               })

               return {
                    user: {
                         uuid: user.uuid,
                         rgpd: user.rgpd,
                    },
               }
          } catch (error) {
               console.error('Erreur VisitorsController.store:', error)
               return response.internalServerError({
                    error: { name: 'internal_error', description: 'Erreur interne' },
               })
          }
     }
}

export default new VisitorsController()
