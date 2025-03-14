import '@adonisjs/core/http'

declare module '@adonisjs/core/http' {
     interface HttpContext {
          client?: any
          userIp?: string
     }
}
