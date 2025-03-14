// app/exceptions/handler.ts
import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'

export default class HttpExceptionHandler extends ExceptionHandler {
     protected debug = !app.inProduction

     public async handle(error: any, ctx: HttpContext) {
          const statusCode = error.status || 500

          // Erreurs spécifiques
          if (error.code === 'E_ROUTE_NOT_FOUND') {
               return ctx.response.status(404).send({
                    error: {
                         name: 'not_found',
                         description: 'The requested route does not exist.',
                    },
                    request: ctx.request.id(),
               })
          }

          if (statusCode === 403) {
               return ctx.response.status(403).send({
                    error: {
                         name: 'forbidden',
                         description: 'You do not have permission to access this resource.',
                    },
                    request: ctx.request.id(),
               })
          }

          if (statusCode === 422) {
               return ctx.response.status(422).send({
                    error: {
                         name: 'validation_error',
                         description: error.message || 'Invalid input data.',
                    },
                    request: ctx.request.id(),
               })
          }

          // Par défaut
          return ctx.response.status(statusCode).send({
               error: {
                    name: 'internal_server_error',
                    description: 'An unexpected error occurred.',
               },
               request: ctx.request.id(),
          })
     }

     public async report(error: any, ctx: HttpContext) {
          console.error(`[ERROR] ${error.message} /n [CTX] ${ctx}`, error)
     }
}
