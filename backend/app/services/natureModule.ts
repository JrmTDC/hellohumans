// Pseudo code, adapter aux besoins
interface NatureResponse {
     content: string
     choices?: string[]
}

export async function handleNaturePack(message: string, client: any): Promise<NatureResponse | null> {
     // Vérifier si le message correspond à un "déclencheur" nature
     const lowerMsg = message.toLowerCase()
     if (lowerMsg.includes('activité') || lowerMsg.includes('quoi faire')) {
          return {
               content: `Dans la région de ${client.name} vous pouvez pratiquer plusieurs activités. Laquelle vous intéresse ?`,
               choices: ['Randonnée', 'Grandes Randonnées', 'VTT', 'Vélo', 'Équitation', 'Trail','Escalade','Vol libre'],
          }
     }

     if (lowerMsg.includes('randonnée') || lowerMsg.includes('grandes randonnées') || lowerMsg.includes('vtt') || lowerMsg.includes('vélo') || lowerMsg.includes('équitation') || lowerMsg.includes('trail') || lowerMsg.includes('escalade') || lowerMsg.includes('vol libre')) {
          return {
               content: `J'ai des itinéraires de différentes difficultés. Laquelle vous intéresse ?`,
               choices: ['Très facile', 'Facile', 'Intermédiaire', 'Difficile', 'Très difficile'],
          }
     }

     // Si on n'a pas trouvé de correspondance, on retourne null
     return null
}
