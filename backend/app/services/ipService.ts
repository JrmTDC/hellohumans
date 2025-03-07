import { supabase } from '#services/supabaseClient'

class IpService {
     /**
      * Vérifie si l'IP est bannie (et si le ban est encore valable).
      */
     public async isIpBanned(ip: string): Promise<boolean> {
          const { data, error } = await supabase
               .from('banned_ips')
               .select('*')
               .eq('ip', ip)
               .single()

          if (error || !data) {
               // pas d'entrée, donc non banni
               return false
          }

          // => On a data.infractions et data.ban_until
          if (!data.ban_until) {
               // pas de date => pas banni
               return false
          }
          if (data.ban_until === 'lifetime') {
               return true
          }

          // Sinon, c’est un datetime => on check
          const banEnd = new Date(data.ban_until)
          if (banEnd > new Date()) {
               return true
          }

          // Sinon, ban expiré => on supprime ou reset
          await supabase.from('banned_ips').delete().eq('ip', ip)
          return false
     }

     /**
      * Ajoute une infraction à l'IP et gère la durée de ban (1h, lifetime, etc.)
      */
     public async addInfraction(ip: string): Promise<void> {
          // On tente de récupérer l'entrée existante
          let { data, error } = await supabase
               .from('banned_ips')
               .select('*')
               .eq('ip', ip)
               .single()

          if (error && error.code !== 'PGRST116') {
               // Erreur inattendue
               console.error('Erreur addInfraction:', error)
               return
          }

          // Si pas d'entrée => on en crée une
          if (!data) {
               data = { ip, infractions: 1, ban_until: null }
               const { error: insertError } = await supabase.from('banned_ips').insert(data)
               if (insertError) {
                    console.error('Erreur lors de la création d entrée IP:', insertError)
               }
               return
          }

          // Sinon, on incrémente
          const infractions = data.infractions + 1
          let ban_until = data.ban_until // On modifie si besoin

          if (infractions === 2) {
               const banEnd = new Date(Date.now() + 60 * 60 * 1000) // +1h
               ban_until = banEnd.toISOString()
          } else if (infractions >= 3) {
               ban_until = 'lifetime'
          }

          const { error: updateError } = await supabase
               .from('banned_ips')
               .update({ infractions, ban_until })
               .eq('ip', ip)

          if (updateError) {
               console.error('Erreur lors de la mise à jour IP:', updateError)
          }
     }
}

const ipService = new IpService()
export default ipService
