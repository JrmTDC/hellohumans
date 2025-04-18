import { HttpContext } from '@adonisjs/core/http'
import supabaseService, {supabaseAdmin} from '#services/supabaseService'
import MailService from "#services/mail/MailService";

class AuthController {

     // Vérification des identifiants via Supabase, retour JWT
     public async login({ request, response }: HttpContext) {
          try {
               const email = request.input('email')?.trim()
               const password = request.input('password')?.trim()

               // Vérifications
               if (!email) {
                    return response.badRequest({
                         error: { name: 'missingEmail', description: 'Adresse e-mail manquante.' }
                    })
               }

               const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
               if (!emailRegex.test(email)) {
                    return response.badRequest({
                         error: { name: 'invalidEmail', description: 'Adresse e-mail invalide.' }
                    })
               }

               if (!password) {
                    return response.badRequest({
                         error: { name: 'missingPassword', description: 'Mot de passe manquant.' }
                    })
               }

               // Étape 1 : Authentification via Supabase
               const { data: sessionData, error: sessionError } = await supabaseService.auth.signInWithPassword({
                    email,
                    password,
               })

               if (sessionError || !sessionData.user) {
                    return response.unauthorized({
                         error: { name: 'invalidCredentials', description: 'Identifiants incorrects.' }
                    })
               }

               const auth_id = sessionData.user.id

               // Étape 2 : Récupération de l'utilisateur interne
               const { data: userData, error: userError } = await supabaseService
                    .from('users')
                    .select('id, lang')
                    .eq('auth_id', auth_id)
                    .maybeSingle()

               if (userError || !userData) {
                    return response.badRequest({
                         error: { name: 'userNotFound', description: 'Utilisateur introuvable dans la base.' }
                    })
               }

               // Étape 3 : Récupération des infos client_user
               const { data: clientUserData, error: clientUserError } = await supabaseService
                    .from('client_users')
                    .select('id, selected_project_id')
                    .eq('user_id', userData.id)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .maybeSingle()

               if (clientUserError || !clientUserData) {
                    return response.badRequest({
                         error: {
                              name: 'clientUserNotFound',
                              description: 'Impossible de récupérer les informations du client associé à cet utilisateur.'
                         }
                    })
               }

               return response.ok({
                    token: sessionData.session?.access_token,
                    refresh_token: sessionData.session?.refresh_token,
                    user: {
                         id: userData.id,
                         email,
                         lang: userData.lang,
                         selected_project_id: clientUserData.selected_project_id
                    }
               })
          } catch (error) {
               console.error('Erreur AuthController.login:', error)
               return response.internalServerError({
                    error: { name: 'internalError', description: 'Une erreur interne est survenue.' }
               })
          }
     }

     // Inscription utilisateur (email, password, site web, acceptation CG)
     public async register({ request, response }: HttpContext) {
          try {
               const email = request.input('email')?.trim()
               const password = request.input('password')?.trim()
               const displayName = request.input('displayName')?.trim()
               const lang = request.input('lang') || 'fr'
               const accept_cg = request.input('accept_cg')

               // Vérification des champs
               if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    return response.badRequest({ error: { name: 'invalidEmail', description: 'Email invalide.' } })
               }
               if (!password || password.length < 6) {
                    return response.badRequest({ error: { name: 'weakPassword', description: 'Mot de passe trop court.' } })
               }
               if (!displayName || displayName.length < 3) {
                    return response.badRequest({ error: { name: 'invalidDisplayName', description: 'Prénom ou Pseudonyme trop court.' } })
               }
               if (!accept_cg) {
                    return response.badRequest({ error: { name: 'cgNotAccepted', description: 'CG non acceptées.' } })
               }

               // Étape 1 - Supabase Auth
               const { data: authData, error: authError } = await supabaseService.auth.signUp({ email, password })
               if (authError || !authData.user) {
                    return response.badRequest({ error: { name: authError?.code || 'registrationFailed', description: authError?.message || 'Erreur inconnue' } })
               }

               const auth_id = authData.user.id

               // Étape 2 - Création de l'utilisateur interne
               const { data: userData, error: userError } = await supabaseService
                    .from('users')
                    .insert({
                         auth_id: auth_id,
                         lang,
                         email
                    })
                    .select()
                    .single()

               if (userError || !userData) {
                    return response.badRequest({ error: { name: 'userCreationFailed', description: 'Création utilisateur échouée.' } })
               }

               // Étape 3 - Connexion auto
               const { data: sessionData, error: sessionError } = await supabaseService.auth.signInWithPassword({ email, password })

               if (sessionError || !sessionData.session) {
                    return response.internalServerError({
                         error: { name: 'sessionCreationFailed', description: 'Impossible de créer une session.' }
                    })
               }

               return response.created({
                    token: sessionData.session.access_token,
                    user: {
                         id: userData.id,
                         email,
                         lang: userData.lang
                    }
               })
          } catch (error) {
               console.error('Erreur AuthController.register:', error)
               return response.internalServerError({
                    error: { name: 'internalError', description: 'Une erreur interne est survenue.' }
               })
          }
     }

     // Envoie un email de réinitialisation de mot de passe
     public async forgotPassword({ request, response }: HttpContext) {
          const { email } = request.all()

          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(email)) {
               return response.badRequest({
                    error: { name: 'invalidEmail', description: 'Adresse e-mail invalide.' }
               })
          }

          // 1. Vérifie si l'utilisateur existe via la table `users` (avec la anon key)
          const { data: userData, error: userError } = await supabaseService
               .from('users')
               .select('auth_id, lang')
               .eq('email', email)
               .maybeSingle()

          if (userError || !userData?.auth_id) {
               return response.ok({
                    user: { email }
               })
          }

          const { lang = 'en' } = userData

          // 2. Génére le lien de récupération de mot de passe
          const { data, error } = await supabaseAdmin.auth.admin.generateLink({
               type: 'recovery',
               email,
               options: {
                    redirectTo: process.env.SUPABASE_BASE_URL_REDIRECT + '/panel/reset-password',
               },
          })

          if (error || !data?.properties.action_link) {
               return response.ok({
                    user: { email }
               })
          }

          // 3. Envoie l’e-mail
          await MailService.sendForgotPasswordEmail(email, data.properties.action_link, lang)

          return response.ok({
               user: { email }
          })
     }
}

export default new AuthController()
