import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { Edge } from 'edge.js'
import mail from '@adonisjs/mail/services/main'
import i18nManager from '@adonisjs/i18n/services/main'
const __dirname = fileURLToPath(new URL('.', import.meta.url))

const edge = new Edge()
edge.mount(join(__dirname, 'templates'))

export async function svgToBase64DataUrl(relativePath: string): Promise<string> {
     const absolutePath = resolve(relativePath)
     const svgBuffer = await readFile(absolutePath)
     const base64 = svgBuffer.toString('base64')
     return `data:image/svg+xml;base64,${base64}`
}

export default class MailService {

     static async sendForgotPasswordEmail(email: string, tokenUrl: string, lang: string = 'fr') {
          const t = i18nManager.locale(lang)
          const logoHellohumans = await svgToBase64DataUrl('public/assets/svg/logoHellohumansFull.svg')

          const html = await edge.render('forgot_password', {
               subject: t.formatMessage('mailTemplate.forgotPassword.subject'),
               text_hello: t.formatMessage('mailTemplate.forgotPassword.hello'),
               text_instruction: t.formatMessage('mailTemplate.forgotPassword.instruction'),
               text_cta: t.formatMessage('mailTemplate.forgotPassword.cta'),
               text_expire: t.formatMessage('mailTemplate.forgotPassword.expire'),
               text_validity: t.formatMessage('mailTemplate.forgotPassword.expire'),
               text_ignore: t.formatMessage('mailTemplate.forgotPassword.ignore'),
               text_signature: t.formatMessage('mailTemplate.forgotPassword.signature'),
               color_line_header: '#4303f9f',
               color_svg_header: '#4f46e5',
               color_svg_footer: '#4f46e5',
               color_button_cta_text: '#ffffff',
               color_button_cta_bg: '#303f9f',
               color_text_footer: '#939eb4',
               image_svg_header: logoHellohumans,
               image_svg_footer: logoHellohumans,

               reset_link: tokenUrl,
          })

          await mail.send((message) => {
               message
                    .from('no-reply@hellohumans.fr')
                    .to(email)
                    .subject(t.formatMessage('mailTemplate.forgotPassword.subject'))
                    .html(html)
          })
     }
}
