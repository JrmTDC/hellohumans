import router from '@adonisjs/core/services/router'
import { HttpContext } from '@adonisjs/core/http'

//  Importation correcte des contrôleurs

// Route principale
router.get('/', async () => {
  return {
    name: 'ChataDataSense API',
    version: '1.0.0',
    status: 'online'
  }
})

// Routes API v1
router.group(() => {

  router.get('/', async () => {
    return {
      name: 'ChataDataSense API',
      version: '1.0.0',
      status: 'online'
    }
  })

  router.post('/chat', async ({ request, response }: HttpContext) => {
    const body = request.all() // Récupère tout le body
    const message = body.message?.trim() // Vérifie et nettoie la donnée

    if (!message) {
      return response.badRequest({ error: "Le champ 'message' est requis." })
    }

    const responses: Record<string, string> = {
      "bonjour": "Bonjour ! Comment puis-je vous aider ?",
      "qui es-tu ?": "Je suis un chatbot MVP basé sur AdonisJS et Nuxt.",
      "au revoir": "Au revoir ! À bientôt."
    }

    return { response: responses[message.toLowerCase()] || "Je ne comprends pas encore cette question." }
  })
}).prefix('/api/v1')
