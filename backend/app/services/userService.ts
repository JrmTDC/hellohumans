import { supabase } from '#services/supabaseService'

interface UserEntity {
     uuid: string
     client_uuid: string
     email: string
     rgpd: boolean
}

class UserService {
     public async findOrCreateUser(params: {
          client_uuid: string
          email: string
          rgpd: string
     }): Promise<UserEntity> {
          // Chercher l'user
          let { data, error } = await supabase
               .from('users')
               .select('*')
               .eq('client_uuid', params.client_uuid)
               .eq('email', params.email)
               .single()

          if (!error && data) {
               // S'il existe déjà
               // On met éventuellement à jour le champ rgpd
               if (!data.rgpd && params.rgpd) {
                    await supabase
                         .from('users')
                         .update({ rgpd: "accepted" })
                         .eq('uuid', data.uuid)
               }
               return data as UserEntity
          }

          // Sinon on le crée
          const { data: newUser, error: insertError } = await supabase
               .from('users')
               .insert({
                    client_uuid: params.client_uuid,
                    email: params.email,
                    rgpd: params.rgpd,
               })
               .select('*')
               .single()

          if (insertError || !newUser) {
               console.error('Erreur findOrCreateUser insert:', insertError)
               throw new Error('Impossible de créer user')
          }
          return newUser as UserEntity
     }

     public async getUserByUuid(userUUID: string): Promise<UserEntity | null> {
          const { data, error } = await supabase
               .from('users')
               .select('*')
               .eq('uuid', userUUID)
               .single()

          if (error || !data) {
               return null
          }
          return data as UserEntity
     }
}

const userService = new UserService()
export default userService
