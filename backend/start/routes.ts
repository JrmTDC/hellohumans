import router from '@adonisjs/core/services/router'
import chatController from '#controllers/chatController'

// Route simple pour la racine
router.get('/', async () => {
     return {
          name: 'HelloHuman API',
          status: 'online',
     }
})

router.group(() => {
     // Health-check de l'API V1
     router.get('/', async () => {
          return {
               name: 'HelloHuman API',
               version: '1.0.0',
               status: 'online',
          }
     })

     // Route pour le chatbot
     router.post('/chat', (ctx) => {
          return chatController.chat(ctx)
     })
}).prefix('/api/v1')
