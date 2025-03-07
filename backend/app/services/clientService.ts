import { supabase } from '#services/supabaseClient'
import { ClientEntity } from '#contracts/interfaces'

class ClientService {
     /**
      * Récupère les infos du client depuis la table clients
      */
     public async getClient(clientKey: string): Promise<ClientEntity | null> {
          const { data, error } = await supabase
               .from('clients')
               .select('*')
               .eq('client_key', clientKey)
               .single()

          if (error) {
               if (error.code !== 'PGRST116') {
                    console.error('Erreur getClient:', error)
               }
               return null
          }

          return data as ClientEntity
     }
}

const clientService = new ClientService()
export default clientService
