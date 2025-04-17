import { HttpContext } from '@adonisjs/core/http'
import supabase from '#services/supabaseService'

class OnboardingController {
     private async getUserLang(auth_id: string): Promise<string> {
          const { data, error } = await supabase
               .from('users')
               .select('lang')
               .eq('auth_id', auth_id)
               .single()

          if (error || !data?.lang) {
               console.warn('Langue non trouvée, fallback "en"')
               return 'en'
          }

          return data.lang
     }

     public async index({ auth, response }: HttpContext) {
          try {
               const auth_id = auth?.user?.id
               if (!auth_id) {
                    return response.unauthorized({
                         error: { name: 'unauthorized', description: 'Utilisateur non connecté.' }
                    })
               }
               return {

               }
          } catch (error) {
               console.error('Erreur OnboardingController.getActivities:', error)
               return response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur interne' }
               })
          }
     }

     public async getActivities({ auth, response }: HttpContext) {
          try {
               const auth_id = auth?.user?.id
               if (!auth_id) {
                    return response.unauthorized({
                         error: { name: 'unauthorized', description: 'Utilisateur non connecté.' }
                    })
               }

               const lang = await this.getUserLang(auth_id)

               const { data: activitiesData, error: activitiesError } = await supabase
                    .from('onboarding_activities')
                    .select('id, name, slug')
                    .eq('active', true)
                    .order('order', { ascending: true })

               if (activitiesError || !activitiesData) {
                    return response.notFound({
                         error: { name: 'activityNotFound', description: 'Activité introuvable.' }
                    })
               }

               const activities = activitiesData.map((activity) => ({
                    id: activity.id,
                    name: activity.name?.[lang] || activity.name?.['en'] || '',
                    slug: activity.slug,
               }))

               return {
                    activities
               }
          } catch (error) {
               console.error('Erreur OnboardingController.getActivities:', error)
               return response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur interne' }
               })
          }
     }
}

export default new OnboardingController()
