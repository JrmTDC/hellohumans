import { HttpContext } from '@adonisjs/core/http'
import MailService from "#services/mail/MailService";

class SupportController {
     public async reportIssue(ctx: HttpContext) {
          /*const screenshot = ctx.request.file('screenshot', {
               size: '2mb',
               extnames: ['jpg', 'png', 'jpeg', 'gif'],
          }) || null */
          let type = ctx.request.input('type')
          switch (type) {
               case 'bug':
                    type = 'Bug fonctionne'
                    break
               case 'suggestion':
                    type = 'Suggestion'
                    break
               case 'feature':
                    type = 'Amélioration'
                    break
               default:
                    type = 'Autre'
          }

          const rapport_data = {
               type,
               description: ctx.request.input('description'),
               screenshot: null,
               device_name: ctx.request.input('device_name'),
               page_url:ctx.request.input('page_url')
          }
          await MailService.sendRapportEmail(ctx.user, rapport_data)
          return ctx.response.ok({success: true})
     }
}
export default new SupportController()
