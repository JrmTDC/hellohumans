import { io, type Socket } from 'socket.io-client'
type Devices = 'desktop' | 'mobile' | 'web'
type Role = 'visitor' | 'operator'
export function useSocket(ppk: string, role: Role, device: Devices) {
     const config = useRuntimeConfig()
     const socketUrl = `${config.public.wssBaseUrl}`
     const returnQuery: Record<string, string> = {
          ppk
     }
     if(role === 'visitor'){
          returnQuery.device = device
     }
     if(role === 'operator') {
          returnQuery.platform = 'web'
     }
     return io(socketUrl, {
          path        : '/socket.io',
          transports  : ['websocket'],
          query       : returnQuery,
     })
}
