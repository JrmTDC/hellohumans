import { supabase } from '#services/supabaseService'

interface ClientEntity {
     uuid: string
     client_key: string
     name: string
     activity: string
     allowed_domains: string[]
     has_nature_pack: boolean
     config: any
}

class ClientService {
     public async getClientByKey(clientKey: string): Promise<ClientEntity | null> {
          const { data, error } = await supabase
               .from('clients')
               .select('*')
               .eq('client_key', clientKey)
               .single()

          if (error || !data) {
               return null
          }

          return data as ClientEntity
     }
}

const clientService = new ClientService()
export default clientService
