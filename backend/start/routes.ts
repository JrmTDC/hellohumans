import router from '@adonisjs/core/services/router'
import { HttpContext } from '@adonisjs/core/http'
import Env from "#start/env";
import fs from 'fs'
import path from 'path'

interface MistralResponse {
  choices?: { message?: { content?: string } }[];
}

// Fonction pour charger les fichiers JSON d'un client
const loadClientData = (clientKey: string) => {
     const clientDir = path.join(process.cwd(), `data/client/${clientKey}`);
     const files = fs.readdirSync(clientDir);

     // Initialiser une structure pour le contenu global
     let globalPrompt = '';

     // Parcourir chaque fichier JSON du client
     files.forEach((file) => {
          // Vérifier que c'est un fichier JSON
          if (file.endsWith('.json')) {
               // Charger le contenu du fichier
               const filePath = path.join(clientDir, file);
               const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

               // Ajouter le prompt et les listes à la structure globale
               if (fileContent.prompt) {
                    globalPrompt += fileContent.prompt + '\n'; // Ajout du prompt du fichier
               }

               if (fileContent.lists && Array.isArray(fileContent.lists)) {
                    globalPrompt += JSON.stringify(fileContent.lists) + '\n'; // Ajouter les listes du fichier
               }
          }
     });

     // Retourner l'ensemble des données combinées
     return { prompt: globalPrompt };
};

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

          // Chargement des clients depuis JSON
          const clientsFilePath = path.join(process.cwd(), 'data/clients.json')
          const clientsData = JSON.parse(fs.readFileSync(clientsFilePath, 'utf-8').replace(/^\uFEFF/, ''))

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
               const clientData = loadClientData(clientKey);

               // Préparation du prompt pour l'API (Ohoh)
               let prompt = `Tu es un agent conversationnel (chatbot) intégré au site web de ${client.name}.`+ '\n'
               prompt += `Ta mission est d’aider les visiteurs en répondant à leurs questions, uniquement si elles sont en lien avec l’activité du site ${client.activity}.`+ '\n'


               if(clientData.prompt){
                    prompt += `Voici les données :`+ '\n'
                    prompt += clientData.prompt+ '\n'
               }

               prompt += `Ne fournis pas trop d’informations, pose plutôt des questions supplémentaires si nécessaire pour affiner ta réponse.`+ '\n'
               prompt += `Priorise des réponses concises et utiles, tout en restant naturel et engageant.`+ '\n'
               prompt += `Si une demande sort du cadre du site, indique poliment que tu ne peux pas répondre.`+ '\n'
               prompt += `Adapte ton ton et ton langage en fonction du contexte pour offrir une expérience fluide et agréable aux utilisateurs.`+ '\n'
               prompt += `Message: ${message}\nRéponse:` + '\n'

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

               const mistralData = await mistralResponse.json() as MistralResponse;
               return { response: mistralData.choices?.[0]?.message?.content || "Je ne peux pas répondre pour l’instant." };

               } catch (error) {
                    console.error("Erreur API Mistral:", error)
                    return response.internalServerError({ error: "Impossible de récupérer une réponse pour le moment." })
          }
     })

}).prefix('/api/v1')
