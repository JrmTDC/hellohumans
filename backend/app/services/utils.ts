import { HttpContext } from '@adonisjs/core/http'
import dns from 'dns'
import { promisify } from 'util'

const lookup = promisify(dns.lookup)

/**
 * Récupère l'IP de l'utilisateur via plusieurs sources possibles
 */
export function getUserIp(request: HttpContext['request']): string {
     let ip = request.ip()
     if (Array.isArray(ip)) {
          ip = ip[0]
     }
     if (!ip) {
          const xForwardedFor = request.headers()['x-forwarded-for']
          if (typeof xForwardedFor === 'string') {
               ip = xForwardedFor
          } else if (Array.isArray(xForwardedFor)) {
               ip = xForwardedFor[0]
          } else {
               ip = request.request.socket.remoteAddress || ''
          }
     }
     return ip || ''
}

/**
 * Extrait le domaine d'une URL (par ex. 'https://monsite.com' => 'monsite.com').
 */
export function extractDomain(url: string): string {
     try {
          const { hostname } = new URL(url)
          return hostname
     } catch {
          return url
     }
}

/**
 * Vérifie que le domaine fait partie des allowedDomains
 * puis compare l'IP résolue de ce domaine à l'userIp.
 */
export async function verifyDomainAndIp(
     requestOriginCall: string,
     userIp: string,
     allowedDomains: string[]
): Promise<boolean> {
     try {
          // On extrait le domaine
          const domain = extractDomain(requestOriginCall)

          // On vérifie qu'il fait partie des domaines autorisés
          if (!allowedDomains.includes(domain)) {
               console.error(`Domaine non autorisé: ${domain}`)
               return false
          }

          // On compare l'IP du domaine
          const domainIp = await lookup(domain)
          if (domainIp.address !== userIp) {
               console.error(
                    `L'IP ${userIp} ne correspond pas à l'IP du domaine ${domain} (${domainIp.address})`
               )
               return false
          }

          return true
     } catch (error) {
          console.error('Erreur lors de la vérification du domaine et de l’IP:', error)
          return false
     }
}
