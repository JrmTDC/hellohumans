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
                    .eq('auth_id', auth_id)
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
                         lang
                    })
                    .select()
                    .single()

               if (userError || !userData) {
                    return response.badRequest({ error: { name: 'userCreationFailed', description: 'Création utilisateur échouée.' } })
               }

               // Étape 3 - Création du client
               const { data: clientData, error: clientError } = await supabaseService
                    .from('clients')
                    .insert({
                         owner_user_id: userData.id,
                         name: displayName,
                    })
                    .select()
                    .single()

               if (clientError || !clientData) {
                    return response.badRequest({ error: { name: 'clientCreationFailed', description: 'Création client impossible.' } })
               }

               // Étape 4 - Mettre à jour l'utilisateur avec le client séléctionné
               await supabaseService
                    .from('users')
                    .update({
                         selected_client_id: clientData.id,
                    })
                    .eq('id', userData.id)

               // Étape 5 - Projet principal
               const { data: projectData, error: projectError } = await supabaseService
                    .from('client_projects')
                    .insert({
                         client_id: clientData.id,
                         website : null
                    })
                    .select()
                    .single()

               if (projectError || !projectData) {
                    return response.badRequest({ error: { name: 'projectCreationFailed', description: 'Création projet échouée.' } })
               }

               // Étape 6 - Relier user <=> client
               await supabaseService.from('client_users').insert({
                    client_id: clientData.id,
                    user_id: userData.id,
                    auth_id: auth_id,
                    role: 'owner',
                    selected_project_id: projectData.id
               })

               // ✅ Étape 7 - Ajout du plan gratuit (free)
               const { data: freePlan } = await supabaseService
                    .from('subscription_plans')
                    .select('id, key')
                    .eq('key', 'free')
                    .single()

               if (!freePlan?.id) {
                    await supabaseService
                         .from('client_project_subscriptions')
                         .insert({
                              project_id: projectData.id,
                              current_plan_id:null,
                              status: 'inactive',
                              billing_cycle: 'monthly',
                              current_modules: [],
                              is_trial: false,
                              payment_failed: false
                         })
               }else{
                    await supabaseService
                         .from('client_project_subscriptions')
                         .insert({
                              project_id: projectData.id,
                              current_plan_id: freePlan.id,
                              status: 'active',
                              billing_cycle: 'monthly',
                              current_modules: [],
                              is_trial: false,
                              payment_failed: false
                         })
               }

               // Étape 8 - Connexion auto
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
                         selected_project_id: projectData.id,
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
               //return response.badRequest({ error: { name: 'userLookupFailed', description: 'Impossible de rechercher l’utilisateur.' } })
               return response.ok({
                    user:{
                         email: email,
                    }
               })
          }

          const foundUser = userList.users.find(u => u.email?.toLowerCase() === email.toLowerCase())
          if (!foundUser) {
               //return response.badRequest({ error: { name: 'userNotFound', description: 'Utilisateur introuvable.' } })
               return response.ok({
                    user:{
                         email: email,
                    }
               })
          }

          const auth_id = foundUser.id

          // 2. Récupère la langue depuis ta table `users`
          const { data: userData } = await supabaseService
               .from('users')
               .select('lang')
               .eq('auth_id', auth_id)
               .maybeSingle()

          const lang = userData?.lang || 'en' // fallback si la langue n'est pas définie

          // 3. Génére le lien de récupération de mot de passe
          const { data, error } = await supabaseService.auth.admin.generateLink({
               type: 'recovery',
               email,
               options: {
                    redirectTo: process.env.SUPABASE_BASE_URL_REDIRECT + '/panel/reset-password',
               },
          })

          if (error || !data?.properties.action_link) {
               //return response.badRequest({ error: { name: 'resetLinkFailed', description: error?.message || 'Erreur lien de réinitialisation.' } })
               return response.ok({
                    user:{
                         email: email,
                    }
               })
          }

          // 4. Envoie l’email avec la langue définie
          await MailService.sendForgotPasswordEmail(email, data.properties.action_link, lang)

          return response.ok({
               user:{
                    email: email,
               }
          })
     }
}

export default new AuthController()
