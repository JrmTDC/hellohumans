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

     static async sendConfirmationInscriptionEmail(email: string, tokenUrl: string, lang: string) {
          const t = i18nManager.locale(lang)
          const logoHellohumans = await svgToBase64DataUrl('assets/svg/logoHellohumansFull.svg')

          const html = await edge.render('confirmation_inscription', {
               subject: t.formatMessage('mailTemplate.confirmationInscription.subject'),
               greeting: t.formatMessage('mailTemplate.confirmationInscription.greeting'),
               thank: t.formatMessage('mailTemplate.confirmationInscription.thank'),
               cta: t.formatMessage('mailTemplate.confirmationInscription.cta'),
               expiration: t.formatMessage('mailTemplate.confirmationInscription.expiration'),
               signature: t.formatMessage('mailTemplate.confirmationInscription.signature'),
               footer_copyright: t.formatMessage('mailTemplate.confirmationInscription.footer.copyright'),
               footer_support: t.formatMessage('mailTemplate.confirmationInscription.footer.support'),

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
                    .subject(t.formatMessage('mailTemplate.confirmationInscription.subject'))
                    .html(html)
          })
     }

     static async sendForgotPasswordEmail(email: string, tokenUrl: string, lang: string) {
          const t = i18nManager.locale(lang)
          const logoHellohumans = await svgToBase64DataUrl('assets/svg/logoHellohumansFull.svg')

          const html = await edge.render('forgot_password', {
               subject: t.formatMessage('mailTemplate.forgotPassword.subject'),
               greeting: t.formatMessage('mailTemplate.forgotPassword.greeting'),
               instruction: t.formatMessage('mailTemplate.forgotPassword.instruction'),
               cta: t.formatMessage('mailTemplate.forgotPassword.cta'),
               expiration: t.formatMessage('mailTemplate.forgotPassword.expiration'),
               note: t.formatMessage('mailTemplate.forgotPassword.note'),
               signature: t.formatMessage('mailTemplate.forgotPassword.signature'),
               footer_copyright: t.formatMessage('mailTemplate.forgotPassword.footer.copyright'),
               footer_support: t.formatMessage('mailTemplate.forgotPassword.footer.support'),

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

     static async sendInvitationUtilisateurEmail(email: string, tokenUrl: string, lang: string) {
          const t = i18nManager.locale(lang)
          const logoHellohumans = await svgToBase64DataUrl('assets/svg/logoHellohumansFull.svg')

          const html = await edge.render('invitation_utilisateur', {
               subject: t.formatMessage('mailTemplate.invitationUtilisateur.subject'),
               greeting: t.formatMessage('mailTemplate.invitationUtilisateur.greeting'),
               invitation: t.formatMessage('mailTemplate.invitationUtilisateur.invitation'),
               cta: t.formatMessage('mailTemplate.invitationUtilisateur.cta'),
               expiration: t.formatMessage('mailTemplate.invitationUtilisateur.expiration'),
               signature: t.formatMessage('mailTemplate.invitationUtilisateur.signature'),
               footer_copyright: t.formatMessage('mailTemplate.invitationUtilisateur.footer.copyright'),
               footer_support: t.formatMessage('mailTemplate.invitationUtilisateur.footer.support'),

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
                    .subject(t.formatMessage('mailTemplate.invitationUtilisateur.subject'))
                    .html(html)
          })
     }

     static async sendLienMagiqueEmail(email: string, tokenUrl: string, lang: string) {
          const t = i18nManager.locale(lang)
          const logoHellohumans = await svgToBase64DataUrl('assets/svg/logoHellohumansFull.svg')

          const html = await edge.render('lien_magique', {
               subject: t.formatMessage('mailTemplate.lienMagique.subject'),
               greeting: t.formatMessage('mailTemplate.lienMagique.greeting'),
               text: t.formatMessage('mailTemplate.lienMagique.text'),
               cta: t.formatMessage('mailTemplate.lienMagique.cta'),
               expiration: t.formatMessage('mailTemplate.lienMagique.expiration'),
               warning: t.formatMessage('mailTemplate.lienMagique.warning'),
               footer_copyright: t.formatMessage('mailTemplate.lienMagique.footer.copyright'),
               footer_support: t.formatMessage('mailTemplate.lienMagique.footer.support'),

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
                    .subject(t.formatMessage('mailTemplate.lienMagique.subject'))
                    .html(html)
          })
     }

     static async sendModificationEmailEmail(email: string, tokenUrl: string, lang: string) {
          const t = i18nManager.locale(lang)
          const logoHellohumans = await svgToBase64DataUrl('assets/svg/logoHellohumansFull.svg')

          const html = await edge.render('modification_email', {
               subject: t.formatMessage('mailTemplate.modificationEmail.subject'),
               greeting: t.formatMessage('mailTemplate.modificationEmail.greeting'),
               text: t.formatMessage('mailTemplate.modificationEmail.text'),
               cta: t.formatMessage('mailTemplate.modificationEmail.cta'),
               expiration: t.formatMessage('mailTemplate.modificationEmail.expiration'),
               warning: t.formatMessage('mailTemplate.modificationEmail.warning'),
               footer_copyright: t.formatMessage('mailTemplate.modificationEmail.footer.copyright'),
               footer_support: t.formatMessage('mailTemplate.modificationEmail.footer.support'),

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
                    .subject(t.formatMessage('mailTemplate.modificationEmail.subject'))
                    .html(html)
          })
     }

     static async sendReauthentificationEmail(email: string, tokenUrl: string, lang: string) {
          const t = i18nManager.locale(lang)
          const logoHellohumans = await svgToBase64DataUrl('assets/svg/logoHellohumansFull.svg')

          const html = await edge.render('reauthentification', {
               subject: t.formatMessage('mailTemplate.reauthentification.subject'),
               greeting: t.formatMessage('mailTemplate.reauthentification.greeting'),
               text: t.formatMessage('mailTemplate.reauthentification.text'),
               cta: t.formatMessage('mailTemplate.reauthentification.cta'),
               security: t.formatMessage('mailTemplate.reauthentification.security'),
               thanks: t.formatMessage('mailTemplate.reauthentification.thanks'),
               team: t.formatMessage('mailTemplate.reauthentification.team'),
               footer_copyright: t.formatMessage('mailTemplate.reauthentification.footer.copyright'),
               footer_support: t.formatMessage('mailTemplate.reauthentification.footer.support'),

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
                    .subject(t.formatMessage('mailTemplate.reauthentification.subject'))
                    .html(html)
          })
     }

     static async sendRapportEmail(user:any, rapport_data:any) {
          const t = i18nManager.locale('fr')
          const logoHellohumans = await svgToBase64DataUrl('assets/svg/mail/logoRapportEmail.svg')

          const html = await edge.render('support_rapport', {
               subject: 'Un nouvel incident a été signalé',
               user_email: user.email,
               user_name: user.display_name,
               user_id: user.id,
               type: rapport_data.type,
               description: rapport_data.description,
               screenshot: rapport_data.screenshot,
               device_name: rapport_data.device_name,
               page_url: rapport_data.page_url,
               color_line_header: '#f30000',
               color_svg_header: '#f30000',
               image_svg_header: logoHellohumans,
     })

          await mail.send((message) => {
               message
                    .from('no-reply@hellohumans.fr')
                    .to('support@hellohumans.fr')
                    .subject('❗ Un nouvel incident a été signalé')
                    .html(html)
          })
     }
}
