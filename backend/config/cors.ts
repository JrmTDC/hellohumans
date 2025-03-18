import { defineConfig } from '@adonisjs/cors'

const corsConfig = defineConfig({
  enabled: true,
  origin: true, // Permet à n'importe quel domaine d'accéder à l'API
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE'],
  headers: true, // Autorise tous les headers
  credentials: false, // Désactivé si API stateless (pas de cookies)
})

export default corsConfig
