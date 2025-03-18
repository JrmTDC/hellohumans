import env from '#start/env'
import { Secret } from '@adonisjs/core/helpers'
import { defineConfig } from '@adonisjs/core/http'

/**
 * Clé secrète utilisée pour les cookies et les encryptions.
 */
export const appKey = new Secret(env.get('APP_KEY'))

/**
 * Configuration du serveur HTTP
 */
export const http = defineConfig({
  generateRequestId: true,
  allowMethodSpoofing: false,

  /**
   * Désactiver AsyncLocalStorage si non nécessaire (permet d'accéder au contexte HTTP globalement).
   */
  useAsyncLocalStorage: false,
})
