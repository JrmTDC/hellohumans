import type { Socket } from 'socket.io'
import supabaseService from '#services/supabaseService'

class VisitorSockets {
     public async register(socket: Socket, onlineVisitors: Map<string, any>) {
          const data = socket.handshake.query
          const visitorId = socket.id
          socket.emit('connected')


          const visitor = {
               id: visitorId,
               originalVisitorId: data.originalVisitorId,
               distinct_id: data.distinct_id,
               country: data.country,
               browser: data.browser,
               browser_version: data.browser_version,
               user_agent: data.user_agent,
               os_name: data.os_name,
               os_version: data.os_version,
               mobile: data.mobile === 'true',
               screen_width: Number(data.screen_width),
               screen_height: Number(data.screen_height),
               ip: socket.handshake.address,
               created: new Date().toISOString(),
               project_public_key: data.ppk,
          }


          onlineVisitors.set(visitorId, visitor)
          socket.broadcast.emit('visitorDataUpdated', { visitor_id: visitorId, data: { status: 'online', returning: true } })
          socket.broadcast.emit('visitorEnterWebsite', visitor)
          socket.broadcast.emit('visitorsCount', { online:onlineVisitors.size })



          //await supabaseService.from('visitor_lives').upsert({ ...visitor, id: visitor.distinct_id })

          socket.on('disconnect', async () => {
               socket.broadcast.emit('visitor_disconnected', { id: visitorId })
               onlineVisitors.delete(visitorId)

               //await supabaseService.from('visitor_lives').delete().eq('id', visitor.distinct_id)
          })
     }
}

export default new VisitorSockets()
