export const ERROR_LIST = {
     missingToken: {
          name: 'missingToken',
          description: 'Token requis.',
     },
     invalidToken: {
          name: 'invalidToken',
          description: 'Token invalide.',
     },
     userNotFound: {
          name: 'userNotFound',
          description: 'Utilisateur introuvable.',
     },
     projectNotFound: {
          name: 'projectNotFound',
          description: 'Projet introuvable.',
     },
     accessDenied: {
          name: 'accessDenied',
          description: 'Accès non autorisé à ce projet.',
     },
     missingProject: {
          name: 'missingProject',
          description: 'UUID du projet requis.',
     },
     missingEmail: {
          name: 'missingEmail',
          description: 'Adresse e-mail manquante.',
     },
     invalidEmail: {
          name: 'invalidEmail',
          description: 'Adresse e-mail invalide.',
     },
     weakPassword: {
          name: 'weakPassword',
          description: 'Le mot de passe est trop court (min 6 caractères).',
     },
     missingWebsite: {
          name: 'missingWebsite',
          description: "L'URL du site est requise.",
     },
     invalidWebsite: {
          name: 'invalidWebsite',
          description: "L'URL du site est invalide.",
     },
     cgNotAccepted: {
          name: 'cgNotAccepted',
          description: 'Vous devez accepter les CG pour vous inscrire.',
     },
     registrationFailed: {
          name: 'registrationFailed',
          description: "Erreur lors de l'inscription.",
     },
     clientCreationFailed: {
          name: 'clientCreationFailed',
          description: 'Impossible de créer le client.',
     },
     userCreationFailed: {
          name: 'userCreationFailed',
          description: "Impossible de créer l'utilisateur.",
     },
     projectCreationFailed: {
          name: 'projectCreationFailed',
          description: 'Impossible de créer le projet.',
     },
     clientUserLinkFailed: {
          name: 'clientUserLinkFailed',
          description: "Impossible de lier l'utilisateur au client.",
     },
     sessionCreationFailed: {
          name: 'sessionCreationFailed',
          description: 'Impossible de créer une session.',
     },
     subscriptionNotFound: {
          name: 'subscriptionNotFound',
          description: 'Aucun abonnement trouvé pour ce projet.',
     },
     stripeError: {
          name: 'stripeError',
          description: 'Erreur lors de la communication avec Stripe.',
     },
     missingStripePaymentMethod: {
          name: 'missingStripePaymentMethod',
          description: 'Méthode de paiement Stripe manquante ou invalide.',
     },
     invalidBillingCycle: {
          name: 'invalidBillingCycle',
          description: "Cycle de facturation invalide. Utilisez 'month' ou 'year'.",
     },
     webhookError: {
          name: 'webhookError',
          description: 'Erreur lors du traitement du webhook Stripe.',
     },
     internalError: {
          name: 'internalError',
          description: 'Une erreur interne est survenue.',
     },
}
