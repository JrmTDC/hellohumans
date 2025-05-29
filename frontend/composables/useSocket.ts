import { io, type Socket } from 'socket.io-client'
type Devices = 'desktop' | 'mobile' | 'web'
type Role = 'visitor' | 'operator'
export function useSocket(ppk: string, role: Role) {
     const config = useRuntimeConfig()
     const socketUrl = `${config.public.wssBaseUrl}`
     return io(socketUrl, {
          path        : '/socket.io',
          transports  : ['websocket'],
          query       : { ppk, role, device: 'desktop' },
     })
}
