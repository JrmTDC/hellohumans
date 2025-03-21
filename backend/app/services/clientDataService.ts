import { ClientDataRow } from '#contracts/interfaces'
import { supabase } from '#services/supabaseService'

export async function loadClientData(clientUUID: string): Promise<{ prompt: string }> {
     // On récupère toutes les lignes de la table client_data pour un clientKey
     const { data, error } = await supabase
          .from('client_data')
          .select('prompt, lists')
          .eq('client_uuid', clientUUID)

     if (error) {
          console.error('Erreur loadClientData:', error)
          return { prompt: '' }
     }

     let globalPrompt = ''

     for (const row of data as ClientDataRow[]) {
          if (row.prompt) {
               globalPrompt += row.prompt + '\n'
          }
          if (row.lists && Array.isArray(row.lists)) {
               globalPrompt += JSON.stringify(row.lists) + '\n'
          }
     }

     return { prompt: globalPrompt }
}
