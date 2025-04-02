import { HttpContext } from '@adonisjs/core/http'
import supabaseService from '#services/supabaseService'

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

     // Inscription utilisateur (email, password, acceptation CG)
     public async register({ request, response }: HttpContext) {
          try {
               const { email, password, siteweb, accept_cg } = request.all()

               // Vérification des entrées
               if (!email || !password || !siteweb) {
                    return response.badRequest({
                         error: { name: 'missingFields', description: '' }
                    })
               }

               if (!accept_cg) {
                    return response.badRequest({
                         error: { name: 'cgNotAccepted', description: 'Vous devez accepter les CG pour vous inscrire' }
                    })
               }

               // Création de l'utilisateur via Supabase
               const { data, error } = await supabaseService.auth.signUp({
                    email,
                    password,
                    options: { data: { accept_cg: true } },
               })

               if (error) {
                    return response.badRequest({
                         error: { name: 'registrationFailed', description: error.message }
                    })
               }

               return response.created({
                    message: 'Utilisateur créé avec succès',
                    user: data.user,
               })
          } catch (error) {
               console.error('Erreur AuthController.register:', error)
               return response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur interne' }
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
}

export default new AuthController()
