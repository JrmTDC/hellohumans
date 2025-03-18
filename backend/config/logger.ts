import env from '#start/env'
import { defineConfig, targets } from '@adonisjs/core/logger'

const loggerConfig = defineConfig({
  default: 'app',

  loggers: {
    app: {
      enabled: true,
      level: env.get('LOG_LEVEL', 'info'), // Définit un niveau de log par défaut
      transport: {
        targets: targets()
            .pushIf(!process.env.NODE_ENV || process.env.NODE_ENV === 'development', targets.pretty()) // Logs stylisés en dev
            .toArray(),
      },
    },
  },
})

export default loggerConfig
