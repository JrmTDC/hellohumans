import { HttpContext } from '@adonisjs/core/http'
import supabase from '#services/supabaseService'

class UsageController {
     public async index(ctx: HttpContext) {
          try {
               // 1. Récupérer les usages liés à ce projet
               const { data: project_usages, error: usageError } = await supabase
                    .from('client_project_usages')
                    .select('id, usage, limit')
                    .eq('project_id', ctx.project.id)

               if (usageError) {
                    console.error('Erreur récupération usage:', usageError)
                    return ctx.response.internalServerError({
                         error: { name: 'usageError', description: 'Impossible de récupérer les données d’usage.' }
                    })
               }

               return {
                    usages: project_usages || []
               }
          } catch (error) {
               console.error('Erreur UsageController.index:', error)
               return ctx.response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur interne' }
               })
          }
     }
}

export default new UsageController()
