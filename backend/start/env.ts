import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
     NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
     PORT: Env.schema.number(),
     APP_KEY: Env.schema.string(),
     HOST: Env.schema.string({ format: 'host' }),
     LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),
     SMTP_HOST: Env.schema.string(),
     SMTP_PORT: Env.schema.string(),
     SMTP_USERNAME: Env.schema.string(),
     SMTP_PASSWORD: Env.schema.string(),
     STRIPE_SECRET_KEY: Env.schema.string(),
     STRIPE_WEBHOOK_SECRET: Env.schema.string()
})
