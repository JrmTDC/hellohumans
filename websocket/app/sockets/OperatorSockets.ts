import type { Socket } from 'socket.io'

class OperatorSockets {
     public register(socket: Socket, onlineVisitors: Map<string, any>) {
          // Envoie la liste complète des visiteurs au moment de la connexion
          socket.emit('connected')
          //socket.emit('operatorRegister', Array.from(onlineVisitors.values()))
     }
}
export default new OperatorSockets()
