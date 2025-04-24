import '@adonisjs/core/http'

declare module '@adonisjs/core/http' {
     interface HttpContext {
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
          user?: any
          client?: any
          project?: any
          subscription?: any
          userIp?: string
     }
}
