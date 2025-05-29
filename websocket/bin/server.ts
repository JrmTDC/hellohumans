import 'dotenv/config'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import VisitorSockets from '#sockets/VisitorSockets'
import OperatorSockets from '#sockets/OperatorSockets'

const httpServer = createServer()
const io = new Server(httpServer, {
     cors: { origin: '*', methods: ['GET', 'POST'] },
     transports: ['websocket'],
})

const onlineVisitors = new Map<string, any>()

io.on('connection', (socket) => {
     const platform = socket.handshake.query.platform
     const device = socket.handshake.query.device

     if (device === 'desktop' || device === 'mobile') {
          VisitorSockets.register(socket, onlineVisitors)
     }

     if (platform === 'web') {
          OperatorSockets.register(socket, onlineVisitors)
     }
})

const port = Number(process.env.PORT ?? 4444)
httpServer.listen(port, () => {
     console.log(`🧠 WebSocket server ready at ws://localhost:${port}`)
})
