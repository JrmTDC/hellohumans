import router from '@adonisjs/core/services/router'
import { HttpContext } from '@adonisjs/core/http'
import Env from "#start/env";
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// 🔹 Définition manuelle de `__dirname` en ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface MistralResponse {
  choices?: { message?: { content?: string } }[];
}

// Chargement des clients depuis JSON
const clientsFilePath = path.join(__dirname, '../data/clients.json')
const clientsData = JSON.parse(fs.readFileSync(clientsFilePath, 'utf-8').replace(/^\uFEFF/, ''))

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
    const clientKey = body.clientKey?.trim() // Clé du client
    const requestHost = request.header('host') // Récupère le domaine du client

    // Vérification de la clé client
    if (!clientKey || !clientsData[clientKey]) {
      return response.badRequest({ error: "Clé client invalide." })
    }

    const client = clientsData[clientKey]

    // Vérification du domaine
    if (!requestHost || !client.allowed_domains.includes(requestHost)) {
      return response.unauthorized({ error: `Accès interdit : Domaine non autorisé (${requestHost}).` })
    }

    // Vérification du message
    if (!message) {
      return response.badRequest({ error: "Le champ 'message' est requis." })
    }

    try {

      // Charger les données locales JSON selon le client
      const dataPath = path.join(__dirname, `../data/client/${clientKey}.json`)
      const data = fs.existsSync(dataPath) ? JSON.parse(fs.readFileSync(dataPath, 'utf-8')) : {}


      // Construire le prompt avec la localisation
      let prompt = `Tu es un agent conversationnel (chatbot) intégré au site web Office de Tourisme de la ville de Brioude`
        prompt += `Ta mission est d’aider les visiteurs en répondant à leurs questions, uniquement si elles sont en lien avec l’activité du site.`
      if (data) {
        prompt += `Pour les sujets suivants : restaurants, activités et événements, tu peux t’appuyer sur ces données :\n${JSON.stringify(data)}\n`
      }
      prompt += `Ne fournis pas trop d’informations, pose plutôt des questions supplémentaires si nécessaire pour affiner ta réponse.`
      prompt += `Priorise des réponses concises et utiles, tout en restant naturel et engageant.`
      prompt += `Si une demande sort du cadre du site, indique poliment que tu ne peux pas répondre.`
      prompt += `Adapte ton ton et ton langage en fonction du contexte pour offrir une expérience fluide et agréable aux utilisateurs.`
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
