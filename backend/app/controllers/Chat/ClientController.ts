// app/controllers/ClientsController.ts
import { HttpContext } from '@adonisjs/core/http'

class ClientsController {
     public async show(ctx: HttpContext) {
          try {
               return {
                    name: ctx.client.name,
                    activity: ctx.client.activity,
                    config: ctx.client.config,
                    has_nature_pack: ctx.client.has_nature_pack,
               }
          } catch (error) {
               return ctx.response.internalServerError({
                    error: {
                         name: 'internal_error',
                         description: 'Erreur interne',
                    },
               })
          }
     }
}

export default new ClientsController()
