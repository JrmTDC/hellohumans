// Pseudo code, adapter aux besoins
interface NatureResponse {
     content: string
     choices?: string[]
}

export async function handleNaturePack(message: string, client: any): Promise<NatureResponse | null> {
     // Vérifier si le message correspond à un "déclencheur" nature
     const lowerMsg = message.toLowerCase()
     if (lowerMsg.includes('activité') || lowerMsg.includes('quoi faire')) {
          // On propose un "menu"
          return {
               content: `Dans la région de ${client.name} vous pouvez pratiquer plusieurs activités. Laquelle vous intéresse ?`,
               choices: ['VTT', 'Randonnée', 'Trail', 'Équitation', 'Grande Randonnée'],
          }
     }

     // Autre exemple : si l'utilisateur a cliqué "VTT" précédemment, tu pourrais
     // faire un appel Geotrek via fetch(...) et construire un message.
     // ...
     // return { content: 'Voici 3 itinéraires VTT ...', choices: [] }

     // Si on n'a pas trouvé de correspondance, on retourne null
     return null
}
