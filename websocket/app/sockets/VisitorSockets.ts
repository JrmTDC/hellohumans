import type { Socket } from 'socket.io'
import supabaseService from '#services/supabaseService'

class VisitorSockets {
     async register(socket: Socket, onlineVisitors: Map<string, any>) {
          socket.on('visitorRegister', async (payload) => {
               const visitor = {
                    id: payload.id,
                    distinct_id: payload.distinct_id,
                    project_public_key: payload.project_public_key,
                    email: payload.email,
                    url: payload.url,
                    lang: payload.lang,
                    screen_width: payload.screen_width,
                    screen_height: payload.screen_height,
                    user_agent: payload.user_agent,
                    isDesignMode: payload.isDesignMode,
                    device: payload.device || 'desktop',
                    connected_at: new Date().toISOString(),
               }

               // enregistrer en mémoire
               onlineVisitors.set(visitor.id, visitor)

               // enregistrer en BDD (table: live_visitors)
               await supabaseService.from('live_visitors').upsert({
                    id: visitor.id,
                    project_public_key: visitor.project_public_key,
                    payload: visitor,
                    connected_at: new Date().toISOString(),
               })

               // informer les opérateurs
               socket.broadcast.emit('visitor_connected', visitor)

               socket.on('disconnect', async () => {
                    onlineVisitors.delete(visitor.id)
                    socket.broadcast.emit('visitor_disconnected', { id: visitor.id })

                    // supprimer de la BDD
                    await supabaseService.from('live_visitors').delete().eq('id', visitor.id)
               })
          })
     }
}

export default new VisitorSockets()
