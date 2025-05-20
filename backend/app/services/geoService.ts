import { fetch } from 'undici'

interface GeoInfo {
     city: string
     country: string
}
interface IpApiResponse{
     city?: string
     country?: string
}

export async function getGeolocationFromIp(ip: string): Promise<GeoInfo> {
     try {
          const res = await fetch(`https://ipapi.co/${ip}/json/`)
          const data = await res.json() as IpApiResponse

          return {
               city: data.city || '',
               country: data.country || '',
          }
     } catch {
          return { city: '', country: '' }
     }
}
