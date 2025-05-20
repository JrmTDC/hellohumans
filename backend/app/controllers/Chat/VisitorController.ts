import { HttpContext } from '@adonisjs/core/http'
import supabaseService from '#services/supabaseService'
import { randomBytes } from 'crypto'

class VisitorsController {
     public async getVisitor(ctx: HttpContext) {
          return {
               visitor: {
                    public_key: ctx.visitor?.public_key,
                    gdprConsent: ctx.visitor?.gdprConsent || false,
               },
          }
     }

     public async createVisitor(ctx: HttpContext) {
          try {
               const { email, gdprConsent } = ctx.request.all()

               // 1. Vérification basique des inputs
               if (!email || !email.includes('@')) {
                    return ctx.response.badRequest({
                         error: { name: 'email_invalid', description: 'Email requis' },
                    })
               }

               if (gdprConsent !== 'accepted') {
                    return ctx.response.badRequest({
                         error: { name: 'rgpd_invalid', description: 'RGPD doit être accepté' },
                    })
               }

               // 2. Si le visiteur est déjà présent dans le contexte, on le retourne
               if (ctx.visitor) {
                    return {
                         visitor: {
                              public_key: ctx.visitor.public_key,
                              email: ctx.visitor.email,
                              gdprConsent: ctx.visitor.gdprConsent || false,
                         },
                    }
               }

               // 3. Sinon, on crée un nouveau visiteur
               const publicKey = randomBytes(32).toString('hex')

               const { data: visitorData, error: visitorError } = await supabaseService
                    .from('visitors')
                    .insert({
                         project_id: ctx.project.id,
                         gdprConsent: true,
                         email: email,
                         public_key: publicKey,
                    })
                    .select()
                    .single()

               if (visitorError || !visitorData) {
                    console.error('Erreur VisitorsController.createVisitor:', visitorError)
                    return ctx.response.badRequest({
                         error: {
                              name: 'visitorCreationFailed',
                              description: 'Création du visiteur échouée.',
                         },
                    })
               }

               return {
                    visitor: {
                         public_key: visitorData.public_key,
                         email: visitorData.email,
                         gdprConsent: true,
                    },
               }
          } catch (error) {
               console.error('Erreur VisitorsController.createVisitor:', error)
               return ctx.response.internalServerError({
                    error: { name: 'internal_error', description: 'Erreur interne' },
               })
          }
     }
}

export default new VisitorsController()
