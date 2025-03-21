import { supabase } from '#services/supabaseService'

class MessagesService {
     public async saveUserMessage(userUUID: string, content: string) {
          const { error } = await supabase.from('user_messages').insert({
               user_uuid: userUUID,
               sender: 'user',
               content,
          })
          if (error) {
               console.error('Erreur saveUserMessage:', error)
          }
     }

     public async saveBotMessage(userUUID: string, content: string) {
          const { error } = await supabase.from('user_messages').insert({
               user_uuid: userUUID,
               sender: 'bot',
               content,
          })
          if (error) {
               console.error('Erreur saveBotMessage:', error)
          }
     }
}

const messagesService = new MessagesService()
export default messagesService
