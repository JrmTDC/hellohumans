// app/middleware/format_response_middleware.ts
import { HttpContext } from '@adonisjs/core/http'

export default class FormatResponseMiddleware {
     public async handle(ctx: HttpContext, next: () => Promise<void>) {
          await next()

          const responseBody = ctx.response.getBody()

          if (typeof responseBody === 'object' && responseBody !== null) {
               // Si la réponse contient "error", ne pas encapsuler dans "success"
               if (responseBody.error) {
                    ctx.response.send({
                         ...responseBody,
                         request: ctx.request.id(),
                    })
               } else {
                    ctx.response.send({
                         success: responseBody,
                         request: ctx.request.id(),
                    })
               }
          }
     }
}
