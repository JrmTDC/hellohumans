import type { HttpContext } from '@adonisjs/core/http'
import { getUserIp } from '#services/utils'
import supabaseService from '#services/supabaseService'

export default class ChatAccessMiddleware {
     public async handle(ctx: HttpContext, next: () => Promise<void>) {
          const { request, response } = ctx

          // 1. Lecture des headers / IP / UA
          const projectPublicKey = request.header('x-project-public-key')?.trim()
          const visitorPublicKey = request.header('x-visitor-public-key')?.trim()
          const visitorIp = getUserIp(request) || request.ip()
          const visitorUserAgent = request.header('user-agent') || ''

          if (!projectPublicKey) {
               return response.unauthorized({ error: { name: 'missing_public_key' } })
          }

          const { data: project } = await supabaseService
               .from('client_projects')
               .select('*, clients(*)')
               .eq('public_key', projectPublicKey)
               .maybeSingle()

          if (!project) {
               return response.unauthorized({ error: { name: 'project_not_found' } })
          }

          // Récupération du client lié
          const { data: client } = await supabaseService
               .from('clients')
               .select('*')
               .eq('id', project.client_id)
               .maybeSingle()

          if (!client) {
               return response.unauthorized({ error: { name: 'client_not_found' } })
          }


          let visitor = null
          let visitorMessages = []

          if (visitorPublicKey) {
               const { data: existingVisitor } = await supabaseService
                    .from('visitors')
                    .select('*')
                    .eq('public_key', visitorPublicKey)
                    .eq('project_id', project.id)
                    .maybeSingle()

               if (existingVisitor && !existingVisitor.blocked) {
                    visitor = existingVisitor

                    const { data: messages } = await supabaseService
                         .from('visitor_messages')
                         .select('*')
                         .eq('visitor_id', visitor.id)
                         .order('created_at', { ascending: true })

                    visitorMessages = messages || []
               }
          }

          // 5. Contexte
          ctx.project = project
          ctx.client = client
          ctx.visitor = visitor
          ctx.visitorMessages = visitorMessages || []
          ctx.visitorIp = visitorIp || ''
          ctx.visitorUserAgent = visitorUserAgent

          await next()
     }
}
