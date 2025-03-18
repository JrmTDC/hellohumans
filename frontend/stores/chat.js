import { defineStore } from 'pinia'
import {useRuntimeConfig} from "#imports";

export const useChatStore = defineStore('chat', {
     state: () => {
          const config = useRuntimeConfig()
          return {
               apiUrl: `${config.public.apiBaseUrl}/api/${config.public.apiVersion}`,
               config: {
                    name: 'HelloHumans',
                    suggestedQuestionsString: 'Quels sont les restaurants ?;Quels sont les événements à venir ?;Quels sites touristiques visiter ?;Où trouver un hôtel ?;Quels sont les transport ?',
                    showChat: true,
                    has_nature_pack: false,
                    apiKey: '4a250974433e6ea35fad46637734b8fe',
                    actionColor: '#0566ff',
                    backgroundColor: '#0566ff'
               },
               defaultConfig: {},
               isLoaded: false
          }
     },

     actions: {
          async fetchConfig() {
               try {
                    const response = await fetch(`${this.apiUrl}/clients`,{
                         method: 'GET',
                         headers: { 'Content-Type': 'application/json', 'x-client-key': `${this.config.apiKey}` }
                    })
                    if (!response.ok) throw new Error('Erreur de récupération de la configuration')

                    const data = await response.json()
                    if (data.success) {
                         this.defaultConfig = data.success // Sauvegarde la config API
                         this.config = { ...this.config, ...data.success } // Applique la config API, en gardant les valeurs locales si manquantes
                         this.isLoaded = true
                    }
               } catch (error) {
                    console.error('Erreur lors du chargement de la configuration :', error)
               }
          },

          async saveConfig() {
               try {
                    const response = await fetch('/api/chat-config', {
                         method: 'POST',
                         headers: { 'Content-Type': 'application/json' },
                         body: JSON.stringify(this.config)
                    })
                    if (!response.ok) throw new Error('Erreur lors de la sauvegarde')

                    alert('Configuration sauvegardée avec succès !')
               } catch (error) {
                    console.error('Erreur de sauvegarde :', error)
                    alert('Erreur lors de la sauvegarde.')
               }
          },

          resetConfig() {
               this.config = { ...this.config, ...this.defaultConfig } // Restaure la config API
          }
     }
})
