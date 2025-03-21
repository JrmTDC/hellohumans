import '@adonisjs/core/http'

declare module '@adonisjs/core/http' {
     interface HttpContext {
          client?: any
          userIp?: string
          auth?: {
               user: {
                    id?: string // Rendre `id` optionnel
                    email?: string // Rendre `email` optionnel
                    [key: string]: any // Accepte d'autres propriétés
               }
          }
     }
}
