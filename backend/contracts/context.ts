import '@adonisjs/core/http'

declare module '@adonisjs/core/http' {
     interface HttpContext {
          /**
           * Données auth supabase
           */
          auth: {
               user: {
                    id: string
                    email: string
                    display_name?: string
               }
          }

          /**
           * Utilisateur interne (back-office)
           */
          user: any

          /**
           * Client (entreprise liée à l'utilisateur)
           */
          client: any

          /**
           * Projet (chatbot configuré)
           */
          project: any

          /**
           * Abonnement lié au projet
           */
          subscription: any

          /**
           * IP de l'utilisateur (visiteur)
           */
          visitorIp?: string

          /**
           * Données visiteur du chatbot
           */
          visitor?: {
               id: string
               distinct_id: string
               originalVisitorId?: string
               project_id: string
               [key: string]: any
          }

          /**
           * Messages du visiteur
           */
          visitorMessages?: any[]

          /**
           * User-Agent brut
           */
          visitorUserAgent?: string
     }
}
