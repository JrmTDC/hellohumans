// bin/server.ts  (ou websocket/server.ts si service dédié)
import 'dotenv/config'                       // <── charge .env
import { createServer } from 'node:http'
import { Server }       from 'socket.io'
import { nanoid }       from 'nanoid'        // <── après  npm i nanoid

/* ------------------------------------------------------------------ */
/* 1.  Serveur HTTP minimal (aucune route) */
const httpServer = createServer()

/* 2.  Socket.io v4 */
export const io = new Server(httpServer, {
     cors: { origin: '*', methods: ['GET', 'POST'] },
     transports: ['websocket'],
})

/* 3. Helpers */
type Role = 'visitor' | 'admin'
const room = (ppk: string, role?: Role) => (role ? `${ppk}:${role}` : ppk)

/* 4.  Gestion des connexions */
io.on('connection', (socket) => {
     const ppk  = String(socket.handshake.query.ppk  || '')
     const role = (socket.handshake.query.role ?? 'visitor') as Role
     const ua   = String(socket.handshake.query.device || 'unknown')

     if (!ppk) return socket.disconnect()

     socket.join(room(ppk, role))

     if (role === 'visitor') {
          const visitorId = nanoid(8)
          socket.data.visitorId = visitorId

          io.to(room(ppk, 'admin')).emit('visitor_connected', {
               id: visitorId,
               device: ua,
               firstAt: Date.now(),
          })
     }

     socket.on('disconnect', () => {
          if (role === 'visitor')
               io.to(room(ppk, 'admin')).emit('visitor_disconnected', {
                    id: socket.data.visitorId,
               })
     })
})

/* 5.  Lancement */
const port = Number(process.env.PORT ?? 4444)
httpServer.listen(port, () => {
     console.log(`[WS] listening on ${port}`)
})
