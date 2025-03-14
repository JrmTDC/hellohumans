// app/controllers/ClientsController.ts
import { HttpContext } from '@adonisjs/core/http'

class ClientsController {
     public async show({ client, response }: HttpContext) {
          try {
               if (!client) {
                    return response.unauthorized({
                         error: {
                              name: 'client_missing',
                              description: 'No client in context',
                         },
                    })
               }

               return {
                    name: client.name,
                    activity: client.activity,
                    config: client.config,
                    has_nature_pack: client.has_nature_pack,
               }
          } catch (error) {
               console.error('Erreur ClientsController.show:', error)
               return response.internalServerError({
                    error: {
                         name: 'internal_error',
                         description: 'Erreur interne',
                    },
               })
          }
     }
}

export default new ClientsController()
