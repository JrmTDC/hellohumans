import { defineStore } from 'pinia'
import { useChatApi } from '@/composables/useChatApi'

export const useChatStore = defineStore('chat', {
     state: () => ({
          config: {
               name: 'HelloHumans',
               suggestedQuestionsString: '',
               showChat: true,
               has_nature_pack: false,
               apiKey: '4a250974433e6ea35fad46637734b8fe',
               backgroundColor: '#0566ff',
               textColor: '#ffffff',
               actionColor: '#0566ff',
               isCustomBackground: false
          },
          defaultConfig: {},
          isLoaded: false
     }),

     actions: {
          async fetchConfig() {
               try {
                    const { apiFetch } = useChatApi()
                    const data = await apiFetch('/clients')

                    if (data.success) {
                         this.defaultConfig = data.success
                         this.config = { ...this.config, ...data.success }
                         this.isLoaded = true
                    }
               } catch (error) {
                    console.error('Erreur lors du chargement de la configuration :', error)
               }
          },

          async saveConfig() {
               try {
                    const { apiFetch } = useChatApi()
                    await apiFetch('/config', {
                         method: 'POST',
                         body: JSON.stringify(this.config)
                    })

                    alert('Configuration sauvegardée avec succès !')
               } catch (error) {
                    console.error('Erreur de sauvegarde :', error)
                    alert('Erreur lors de la sauvegarde.')
               }
          },

          resetConfig() {
               this.config = { ...this.config, ...this.defaultConfig }
          }
     }
})
