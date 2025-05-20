import { HttpContext } from '@adonisjs/core/http'
import dns from 'dns'
import { v4 as uuidv4 } from 'uuid'
import * as UAParser from 'ua-parser-js'
import { promisify } from 'util'

const lookup = promisify(dns.lookup)

export function generateUuid(): string {
     return uuidv4()
}

export function getUserIp(request: HttpContext['request']): string | null {
     return request.header('x-forwarded-for')?.split(',')[0]?.trim() ||
          request.ip() ||
          null
}

export function parseUserAgent(userAgent: string) {
     const parser = new UAParser.UAParser(userAgent)
     const result = parser.getResult()

     return {
          browser: result.browser.name || '',
          browserVersion: result.browser.version || '',
          os: result.os.name || '',
          osVersion: result.os.version || '',
          isMobile: result.device?.type === 'mobile' || result.device?.type === 'tablet' || false
     }
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
