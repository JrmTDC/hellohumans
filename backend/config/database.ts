import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: '', // Aucune connexion définie
  connections: {}, // Pas de configuration de base de données
})

export default dbConfig
