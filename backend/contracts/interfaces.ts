export interface MistralResponse {
     choices?: {
          message?: {
               content?: string
          }
     }[]
}
export interface ClientEntity {
     client_key: string
     name: string
     activity: string
     allowed_domains: string[]
}

export interface ClientDataRow {
     prompt?: string
     lists?: any
}
