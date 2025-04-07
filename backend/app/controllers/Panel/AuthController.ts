import { HttpContext } from '@adonisjs/core/http'
import supabaseService from '#services/supabaseService'
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

               const authUUID = sessionData.user.id

               // Étape 2 : Récupération de l'utilisateur interne
               const { data: userData, error: userError } = await supabaseService
                    .from('users')
                    .select('uuid, lang')
                    .eq('auth_uuid', authUUID)
                    .maybeSingle()

               if (userError || !userData) {
                    return response.badRequest({
                         error: { name: 'userNotFound', description: 'Utilisateur introuvable dans la base.' }
                    })
               }

               // Étape 3 : Récupération des infos client_user
               const { data: clientUserData, error: clientUserError } = await supabaseService
                    .from('client_users')
                    .select('uuid, selected_project_uuid')
                    .eq('auth_uuid', authUUID)
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
                         uuid: userData.uuid,
                         email,
                         lang: userData.lang,
                         selected_project_uuid: clientUserData.selected_project_uuid
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
               const website = request.input('website')?.trim()
               const lang = request.input('lang') || 'fr'
               const accept_cg = request.input('accept_cg')

               // Vérification des champs obligatoires
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

               if (!password || password.length < 6) {
                    return response.badRequest({
                         error: { name: 'weakPassword', description: 'Le mot de passe est trop court (min 6 caractères).' }
                    })
               }

               if (!website) {
                    return response.badRequest({
                         error: { name: 'missingWebsite', description: 'L\'URL du site est requise.' }
                    })
               }

               const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,}$/
               if (!urlRegex.test(website)) {
                    return response.badRequest({
                         error: { name: 'invalidWebsite', description: 'L\'URL du site est invalide.' }
                    })
               }

               if (!accept_cg) {
                    return response.badRequest({
                         error: { name: 'cgNotAccepted', description: 'Vous devez accepter les CG pour vous inscrire.' }
                    })
               }

               // Étape 1 : Créer l'utilisateur via Supabase Auth
               const { data: authData, error: authError } = await supabaseService.auth.signUp({
                    email,
                    password
               })

               if (authError || !authData.user) {
                    console.error('Erreur Supabase signUp:', authError)
                    return response.badRequest({
                         error: { name: 'registrationFailed', description: authError?.message || 'Erreur Supabase.' }
                    })
               }

               const authUUID = authData.user.id

               // Étape 2 : Créer le client
               const { data: clientData, error: clientError } = await supabaseService
                    .from('clients')
                    .insert({})
                    .select()
                    .single()

               if (clientError || !clientData) {
                    console.error('Erreur création client:', clientError)
                    return response.badRequest({
                         error: { name: 'clientCreationFailed', description: 'Impossible de créer le client.' }
                    })
               }

               // Étape 3 : Créer l'utilisateur interne
               const { data: userData, error: userError } = await supabaseService
                    .from('users')
                    .insert({
                         auth_uuid: authUUID,
                         lang,
                         selected_client_uuid: clientData.uuid
                    })
                    .select()
                    .single()

               if (userError || !userData) {
                    console.error('Erreur création user:', userError)
                    return response.badRequest({
                         error: { name: 'userCreationFailed', description: 'Impossible de créer l\'utilisateur.' }
                    })
               }

               // Étape 4 : Créer le projet principal
               const { data: projectData, error: projectError } = await supabaseService
                    .from('client_projets')
                    .insert({
                         client_uuid: clientData.uuid,
                         website
                    })
                    .select()
                    .single()

               if (projectError || !projectData) {
                    console.error('Erreur création projet:', projectError)
                    return response.badRequest({
                         error: { name: 'projectCreationFailed', description: 'Impossible de créer le projet.' }
                    })
               }

               // Étape 5 : Relier user <=> client
               const { data: clientUserData, error: clientUserError } = await supabaseService
                    .from('client_users')
                    .insert({
                         client_uuid: clientData.uuid,
                         user_uuid: userData.uuid,
                         auth_uuid: authUUID,
                         role: 'admin',
                         selected_project_uuid: projectData.uuid
                    })
                    .select()
                    .single()

               if (clientUserError || !clientUserData) {
                    console.error('Erreur liaison client_users:', clientUserError)
                    return response.badRequest({
                         error: { name: 'clientUserLinkFailed', description: 'Impossible de lier l\'utilisateur au client.' }
                    })
               }

               // Étape 6 : Connexion automatique post-inscription
               const { data: sessionData, error: sessionError } = await supabaseService.auth.signInWithPassword({
                    email,
                    password
               })

               if (sessionError || !sessionData.session) {
                    console.error('Erreur création session post-inscription:', sessionError)
                    return response.internalServerError({
                         error: { name: 'sessionCreationFailed', description: 'Impossible de récupérer une session.' }
                    })
               }

               // Réponse finale
               return response.created({
                    token: sessionData.session.access_token,
                    user: {
                         uuid: userData.uuid,
                         email,
                         selected_project_uuid: projectData.uuid,
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

          // 1. Récupère l'utilisateur via l'API Admin Supabase
          const { data: userList, error: userListError } = await supabaseService.auth.admin.listUsers()
          if (userListError || !userList?.users) {
               return response.badRequest({
                    error: { name: 'userLookupFailed', description: 'Impossible de rechercher l’utilisateur.' }
               })
          }

          const foundUser = userList.users.find(u => u.email?.toLowerCase() === email.toLowerCase())
          if (!foundUser) {
               return response.badRequest({
                    error: { name: 'userNotFound', description: 'Utilisateur introuvable.' }
               })
          }

          const authUUID = foundUser.id

          // 2. Récupère la langue depuis ta table `users`
          const { data: userData } = await supabaseService
               .from('users')
               .select('lang')
               .eq('auth_uuid', authUUID)
               .maybeSingle()

          const lang = userData?.lang || 'fr' // fallback si la langue n'est pas définie

          // 3. Génére le lien de récupération de mot de passe
          const { data, error } = await supabaseService.auth.admin.generateLink({
               type: 'recovery',
               email,
               options: {
                    redirectTo: process.env.SUPABASE_BASE_URL_REDIRECT + '/panel/reset-password',
               },
          })

          if (error || !data?.properties.action_link) {
               return response.badRequest({
                    error: { name: 'resetLinkFailed', description: error?.message || 'Erreur lien de réinitialisation.' }
               })
          }

          // 4. Envoie l’email avec la langue définie
          await MailService.sendForgotPasswordEmail(email, data.properties.action_link, lang)

          return response.ok({
               message: 'Email envoyé.'
          })
     }
}

export default new AuthController()
