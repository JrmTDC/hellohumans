import router from '@adonisjs/core/services/router'
import { HttpContext } from '@adonisjs/core/http'
import Env from "#start/env";

interface MistralResponse {
  choices?: { message?: { content?: string } }[];
}

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
    const body = request.all()
    const message = body.message?.trim()
    const location = body.location?.trim() // Récupération de la ville envoyée par le frontend

    if (!message) {
      return response.badRequest({ error: "Le champ 'message' est requis." })
    }

    try {
      // Construire le prompt avec la localisation
      let prompt = `Réponds de manière naturelle et compréhensible. Si l'utilisateur parle mal, essaye de deviner son intention.\n`
      if (location) {
        prompt += `L'utilisateur est actuellement à ${location}. Fournis des informations locales si nécessaire.\n`
      }
      prompt += `Message: ${message}\nRéponse:`

      // Appel à l'API Mistral AI
      const mistralResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Env.get('MISTRAL_API_KEY')}`
        },
        body: JSON.stringify({
          model: "mistral-medium",
          messages: [{ role: "user", content: prompt }]
        })
      })

      // 🔥 Typage + validation
      const mistralData = await mistralResponse.json() as MistralResponse;

      return { response: mistralData.choices?.[0]?.message?.content || "Je ne peux pas répondre pour l’instant." };
    } catch (error) {
      console.error("Erreur API Mistral:", error)
      return response.internalServerError({ error: "Impossible de récupérer une réponse pour le moment." })
    }
  })

}).prefix('/api/v1')
