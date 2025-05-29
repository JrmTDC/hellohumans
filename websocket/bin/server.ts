import 'dotenv/config'
import { createServer } from 'node:http'
import { Server }       from 'socket.io'
import { nanoid }       from 'nanoid'

const httpServer = createServer()

//  Socket.io v4
export const io = new Server(httpServer, {
     cors: { origin: '*', methods: ['GET', 'POST'] },
     transports: ['websocket'],
})

// Helpers
type Role = 'visitor' | 'operator'
const room = (ppk: string, role?: Role) => (role ? `${ppk}:${role}` : ppk)
const onlineVisitors = new Map<string, any>()

// Gestion des connexions
io.on('connection', (socket) => {
     const role = socket.handshake.query.role
     const ppk = socket.handshake.query.ppk

     if (role === 'visitor') {
          const visitorId = socket.id

          // stocker le visiteur
          onlineVisitors.set(visitorId, {
               id: visitorId,
               ppk,
               ip: socket.handshake.address,
               // tu peux rajouter plus de métadonnées ici
          })

          // informer tous les panels
          io.emit('visitor_connected', onlineVisitors.get(visitorId))

          socket.on('disconnect', () => {
               io.emit('visitor_disconnected', { id: visitorId })
               onlineVisitors.delete(visitorId)
          })
     }

     if (role === 'operator') {
          // envoyer la liste des visiteurs en ligne
          socket.emit('current_visitors', Array.from(onlineVisitors.values()))
     }
})

// Lancement
const port = Number(process.env.PORT ?? 4444)
httpServer.listen(port, () => {
     console.log(`
╭─────────────────────────────────────────────────╮
│                                                 │
│    WebSocket server listening                   │
│    http://localhost:${port}                        │
│                                                 │
╰─────────────────────────────────────────────────╯
`)
})
