import { HttpContext } from '@adonisjs/core/http'
import supabaseService, {exchangeRecoveryTokenForSession } from '#services/supabaseService'

class AuthController {

     // Envoie un email de réinitialisation de mot de passe
     public async forgotPassword({ request, response }: HttpContext) {
          try {
               const { email } = request.all()

               if (!email) {
                    return response.badRequest({
                         error: { name: 'missingEmail', description: 'Email requis' },
                    })
               }

               // Envoi du lien de réinitialisation
               const { error } = await supabaseService.auth.resetPasswordForEmail(email, {
                    redirectTo: process.env.FRONTEND_RESET_URL || 'https://hellohumans.fr/panel/reset-password',
               })

               if (error) {
                    return response.badRequest({
                         error: { name: 'resetEmailFailed', description: error.message },
                    })
               }

               return response.ok({
                    message: 'Un email de réinitialisation a été envoyé.',
               })
          } catch (error) {
               console.error('Erreur AuthController.forgotPassword:', error)
               return response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur interne' },
               })
          }
     }

     // Réinitialise le mot de passe avec un nouveau (après avoir cliqué sur le lien)
     public async resetPassword({ request, response }: HttpContext) {
          try {
               const { password } = request.all()

               if (!password || password.length < 6) {
                    return response.badRequest({
                         error: { name: 'invalidPassword', description: 'Le mot de passe doit contenir au moins 6 caractères' },
                    })
               }

               // Met à jour le mot de passe via Supabase (utilisateur déjà authentifié après le reset)
               const { data, error } = await supabaseService.auth.updateUser({
                    password,
               })

               if (error) {
                    return response.badRequest({
                         error: { name: 'resetFailed', description: error.message },
                    })
               }

               return response.ok({
                    message: 'Mot de passe mis à jour avec succès',
                    user: data.user,
               })
          } catch (error) {
               console.error('Erreur AuthController.resetPassword:', error)
               return response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur interne' },
               })
          }
     }

     // Permet à un utilisateur connecté de changer son mot de passe
     public async changePassword({ request, response, auth }: HttpContext) {
          try {
               const { oldPassword, newPassword } = request.all()

               if (!oldPassword || !newPassword || newPassword.length < 6) {
                    return response.badRequest({
                         error: { name: 'invalidPassword', description: 'Le nouveau mot de passe doit contenir au moins 6 caractères' },
                    })
               }

               if (!auth?.user) {
                    return response.unauthorized({
                         error: { name: 'unauthorized', description: 'Utilisateur non authentifié' },
                    })
               }

               // Vérifier l'ancien mot de passe (connexion pour valider)
               const { error: loginError } = await supabaseService.auth.signInWithPassword({
                    email: auth.user.email ?? 'unknown@email.com',
                    password: oldPassword,
               })

               if (loginError) {
                    return response.unauthorized({
                         error: { name: 'wrongPassword', description: 'Ancien mot de passe incorrect' },
                    })
               }

               // Met à jour le mot de passe
               const { error } = await supabaseService.auth.updateUser({
                    password: newPassword,
               })

               if (error) {
                    return response.badRequest({
                         error: { name: 'passwordChangeFailed', description: error.message },
                    })
               }

               return response.ok({
                    message: 'Mot de passe changé avec succès',
               })
          } catch (error) {
               console.error('Erreur AuthController.changePassword:', error)
               return response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur interne' },
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

    // Vérifie la validité du JWT via Supabase
     public async verify({ request, response }: HttpContext) {
          try {
               // Récupérer le token d'authentification depuis le header Authorization
               const token = request.header('Authorization')?.replace('Bearer ', '')

               if (!token) {
                    return response.unauthorized({
                         error: { name: 'missingToken', description: 'Token requis' }
                    })
               }

               // Vérification du token avec Supabase
               const { data, error } = await supabaseService.auth.getUser(token)

               if (error || !data.user) {
                    return response.unauthorized({
                         error: { name: 'invalidToken', description: 'Token invalide' }
                    })
               }
               return response.ok({
                    valid: true
               })
          } catch (error) {
               console.error('Erreur AuthController.verify:', error)
               return response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur interne' }
               })
          }
     }

      // Vérifie que le token Supabase est valide pour une tentative de reset
     public async verifyResetToken({ request, response }: HttpContext) {
          try {
               const {token} = request.only(['token'])

               if (!token) {
                    return response.badRequest({
                         error: {name: 'missingToken', description: 'Token manquant'},
                    })
               }
               // Échange du recovery token contre une session
               const {data, error} = await exchangeRecoveryTokenForSession(token)
               if (error || !data?.session) {
                    return response.unauthorized({
                         //error: {name: 'invalidToken', description: 'Token invalide ou expiré'},
                         error: {name: 'invalidToken', description: error}
                    })
               }

               return response.ok({
                    message: 'Token valide',
                    access_token: data.session.access_token,
                    refresh_token: data.session.refresh_token,
                    user: data.user,
               })
          } catch (error) {
               console.error('Erreur AuthController.verifyResetToken:', error)
               return response.internalServerError({
                    error: {name: 'internalError', description: 'Erreur serveur'},
               })
          }
     }

}

export default new AuthController()
