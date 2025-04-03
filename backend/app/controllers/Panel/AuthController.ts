import { HttpContext } from '@adonisjs/core/http'
import supabaseService from '#services/supabaseService'

class AuthController {

     // Vérification des identifiants via Supabase, retour JWT
     public async login({ request, response }: HttpContext) {
          try {
               const { email, password } = request.all()

               if (!email || !password) {
                    return response.badRequest({
                         error: { name: 'missingFields', description: 'Email et mot de passe sont requis' }
                    })
               }

               // Connexion via Supabase
               const { data, error } = await supabaseService.auth.signInWithPassword({
                    email,
                    password,
               })

               if (error) {
                    return response.unauthorized({
                         error: { name: 'invalidCredentials', description: 'Identifiants invalides' }
                    })
               }

               return response.ok({
                    token: data.session?.access_token,
                    refresh_token: data.session?.refresh_token
               })
          } catch (error) {
               console.error('Erreur AuthController.login:', error)
               return response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur interne' }
               })
          }
     }

     // Inscription utilisateur (email, password, site web, acceptation CG)
     public async register({ request, response }: HttpContext) {
          try {
               const {email, password, website, accept_cg, lang } = request.all()

               if (!email || !password || !website) {
                    return response.badRequest({
                         error: {name: 'missingFields', description: 'Email, mot de passe et site web sont requis.'}
                    })
               }

               if (!accept_cg) {
                    return response.badRequest({
                         error: {name: 'cgNotAccepted', description: 'Vous devez accepter les CG pour vous inscrire.'}
                    })
               }

               // Étape 1 : Créer l'utilisateur via Supabase
               const {data: authData, error: authError} = await supabaseService.auth.signUp({
                    email,
                    password,
                    options: {
                         data: {accept_cg: true}
                    }
               })

               if (authError || !authData.user) {
                    return response.badRequest({
                         error: {name: 'registrationFailed', description: authError?.message || 'Erreur Supabase.'}
                    })
               }

               const auth_uuid = authData.user.id

               // Étape 2 : Créer le client dans la table `clients`
               const {data: clientData, error: clientError} = await supabaseService
                    .from('clients')
                    .insert({
                         auth_uuid,
                         email,
                         selected_project_uuid: null,
                         lang: lang || null
                    })
                    .select()
                    .single()

               if (clientError || !clientData) {
                    return response.badRequest({
                         error: {name: 'clientCreationFailed', description: 'Impossible de créer le client.' }
                    })
               }

               // Étape 3 : Créer un projet associé au client
               const {data: projectData, error: projectError} = await supabaseService
                    .from('client_projets')
                    .insert({
                         client_uuid: clientData.uuid,
                         website: website
                    })
                    .select()
                    .single()

               if (projectError || !projectData) {
                    return response.badRequest({
                         error: {name: 'projectCreationFailed', description: website }
                         // description: 'Impossible de créer le projet.'}
                    })
               }

               // Étape 4 : Mettre à jour le client avec le projet sélectionné
               await supabaseService
                    .from('clients')
                    .update({selected_project_uuid: projectData.uuid})
                    .eq('uuid', clientData.uuid)

               // Étape 5 : Récupérer un token de session (connexion auto)
               const {data: sessionData, error: sessionError} = await supabaseService.auth.signInWithPassword({
                    email,
                    password
               })

               if (sessionError || !sessionData.session) {
                    return response.internalServerError({
                         error: {
                              name: 'sessionCreationFailed',
                              description: sessionError?.message || 'Impossible de récupérer le token.'
                         }
                    })
               }

               return response.created({
                    token: sessionData.session.access_token,
                    user: {
                         uuid: clientData.uuid,
                         email,
                         selected_project_uuid: projectData.uuid,
                         lang: clientData.lang
                    },
                    project: projectData
               })
          } catch (error) {
               console.error('Erreur AuthController.register:', error)
               return response.internalServerError({
                    error: {name: 'internalError', description: 'Une erreur interne est survenue.'}
               })
          }
     }
}

export default new AuthController()
