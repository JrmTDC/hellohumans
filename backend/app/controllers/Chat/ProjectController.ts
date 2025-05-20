import { HttpContext } from '@adonisjs/core/http'

class ProjectsController {
     public async show(ctx: HttpContext) {
          try {
               if (!ctx.project) {
                    return ctx.response.unauthorized({
                         error: {
                              name: 'project_missing',
                              description: 'No project in context',
                         },
                    })
               }
               return {
                    project:{
                         public_key: ctx.project.public_key,
                         website: ctx.project.website,
                         config: ctx.project.config || {},
                    }
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

export default new ProjectsController()
