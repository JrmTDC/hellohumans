import type { Socket } from 'socket.io'
import supabaseService from '#services/supabaseService'

class OperatorSockets {
     async register(socket: Socket, onlineVisitors: Map<string, any>) {
          socket.on('operatorRegister', async (payload) => {
               const ppk = payload.projectPublicKey

               // 1. Envoie les visiteurs en mémoire
               const fromMemory = Array.from(onlineVisitors.values()).filter(v => v.project_public_key === ppk)

               // 2. Envoie aussi les visiteurs en BDD (si jamais redémarrage socket)
               const { data: fromDb } = await supabaseService
                    .from('live_visitors')
                    .select('payload')
                    .eq('project_public_key', ppk)

               const allVisitors = [
                    ...fromDb?.map(d => d.payload) || [],
                    ...fromMemory,
               ]

               const merged = allVisitors.reduce((acc, visitor) => {
                    acc[visitor.id] = visitor
                    return acc
               }, {} as Record<string, any>)

               socket.emit('current_visitors', Object.values(merged))
          })
     }
}

export default new OperatorSockets()
