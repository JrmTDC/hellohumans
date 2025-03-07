import { supabase } from '#services/supabaseClient'

class BlockedUserAgentsService {
     /**
      * Vérifie si un userAgent se trouve dans la table blocked_user_agents
      */
     public async isUserAgentBlocked(userAgent: string): Promise<boolean> {
          // On récupère toutes les entrées de la table
          const { data, error } = await supabase
               .from('blocked_user_agents')
               .select('user_agent')

          if (error) {
               console.error('Erreur isUserAgentBlocked:', error)
               // En cas d'erreur, on considère qu'il n'est pas bloqué pour éviter un false-ban
               return false
          }

          if (!data || data.length === 0) {
               // Pas de user-agents bloqués
               return false
          }

          // On check si userAgent inclut l'un des patterns
          return data.some((row) => userAgent.includes(row.user_agent))
     }
}

const blockedUserAgentsService = new BlockedUserAgentsService()
export default blockedUserAgentsService
