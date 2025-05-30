declare global {
     interface VisitorRegisterPayload {
          id: string
          distinct_id: string
          project_public_key: string
          name?: string
          email?: string
          ip?: string
          url?: string
          lang?: string
          browser?: string
          user_agent?: string
          screen_width?: number
          screen_height?: number
          device?: string
          isDesignMode?: boolean
          after_reconnect?: boolean
     }

     interface OperatorRegisterPayload {
          accessKey: string
          device: string
          projectPublicKey: string
          projectPrivateKey: string
          version?: number
     }
}
