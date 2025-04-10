import '@adonisjs/core/http'

declare module '@adonisjs/core/http' {
     interface HttpContext {
          client?: any
          userIp?: string
          auth?: {
               user: {
                    id?: string
                    email?: string
                    [key: string]: any
               }
               user_id?: string
               project_id?: string
               client_id?: string
          }
     }
}
