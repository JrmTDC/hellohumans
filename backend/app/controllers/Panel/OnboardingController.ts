import { HttpContext } from '@adonisjs/core/http'
import supabaseService  from '#services/supabaseService'

class OnboardingController {
     private async getUserLang(auth_id: string): Promise<string> {
          const { data, error } = await supabaseService
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

     public async create({ auth, request, response }: HttpContext) {
          try {
               const auth_id = auth?.user?.id
               if (!auth_id) {
                    return response.unauthorized({
                         error: { name: 'unauthorized', description: 'Utilisateur non connecté.' }
                    })
               }

               const { data: userData, error: userError } = await supabaseService
                    .from('users')
                    .select('id, selected_client_id')
                    .eq('auth_id', auth_id)
                    .single()

               if (userError || !userData) {
                    return response.unauthorized({
                         error: { name: 'userNotFound', description: 'Utilisateur introuvable.' }
                    })
               }

               //  Extraction des champs
               const webSite = request.input('webSite')?.trim() || null
               const newClientName = request.input('newClientName')?.trim() || null
               const selectedClientId = request.input('selectedClientId')?.trim() || null
               const serviceModel = request.input('serviceModel')?.trim() || null
               const businessModel = request.input('businessModel')?.trim() || null
               const communicationMethods = request.input('communicationMethods') || null
               const selectedActivity = request.input('selectedActivity')?.trim() || null
               const conversationsPerMonth = request.input('conversationsPerMonth')?.trim() || null
               const monthlyWebsiteVisitors = request.input('monthlyWebsiteVisitors')?.trim() || null
               const websiteHostingPlatform = request.input('websiteHostingPlatform')?.trim() || null
               const primaryUse = request.input('primaryUse')?.trim() || null

               if (!webSite || !/^(https?:\/\/)?([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/i.test(webSite)) {
                    return response.badRequest({
                         error: { name: 'invalidWebsite', description: 'URL de site invalide.' }
                    })
               }

               if (!newClientName && !selectedClientId) {
                    return response.badRequest({
                         error: { name: 'clientMissing', description: 'Vous devez créer ou sélectionner un compte client.' }
                    })
               }

               // Si client existant → Vérifier ownership
               if (selectedClientId) {
                    const { data: existingLink, error: linkError } = await supabaseService
                         .from('client_users')
                         .select('id')
                         .eq('client_id', selectedClientId)
                         .eq('user_id', userData.id)
                         .maybeSingle()

                    if (linkError || !existingLink) {
                         return response.unauthorized({
                              error: { name: 'unauthorizedClient', description: 'Ce client ne vous appartient pas.' }
                         })
                    }
               }

               // Vérif des autres champs requis
               const requiredFields = [
                    { name: 'serviceModel', value: serviceModel },
                    { name: 'businessModel', value: businessModel },
                    { name: 'communicationMethods', value: communicationMethods },
                    { name: 'selectedActivity', value: selectedActivity },
                    { name: 'conversationsPerMonth', value: conversationsPerMonth },
                    { name: 'monthlyWebsiteVisitors', value: monthlyWebsiteVisitors },
                    { name: 'websiteHostingPlatform', value: websiteHostingPlatform },
                    { name: 'primaryUse', value: primaryUse },
               ]

               for (const field of requiredFields) {
                    if (!field.value || (Array.isArray(field.value) && field.value.length === 0)) {
                         return response.badRequest({
                              error: {
                                   name: 'missingField',
                                   description: `Le champ ${field.name} est requis.`
                              }
                         })
                    }
               }

               // Création ou récupération du client
               let clientId: string
               let createdNewClient = false

               if (newClientName) {
                    const { data: clientData, error: clientError } = await supabaseService
                         .from('clients')
                         .insert({
                              name: newClientName,
                              owner_user_id: userData.id
                         })
                         .select()
                         .single()

                    if (clientError || !clientData) {
                         return response.badRequest({
                              error: { name: 'clientCreationFailed', description: 'Création du client échouée.' }
                         })
                    }

                    clientId = clientData.id
                    createdNewClient = true
               } else {
                    clientId = selectedClientId!
               }

               //  Mise à jour du selected_project_id (si lien existant)
               const { error: updateUserError } = await supabaseService
                    .from('users')
                    .update({ selected_client_id: clientId })
                    .eq('id', userData.id)

               if (updateUserError) {
                    console.warn('⚠️ Impossible de mettre à jour le selected_client_id')
               }

               // Lier user et client (si nouveau client)
               if (createdNewClient) {
                    await supabaseService.from('client_users').insert({
                         client_id: clientId,
                         user_id: userData.id,
                         role: 'owner'
                    })
               }

               // Création du projet principal
               const { data: projectData, error: projectError } = await supabaseService
                    .from('client_projects')
                    .insert({
                         client_id: clientId,
                         website: webSite,
                         service_model: serviceModel,
                         business_model: businessModel,
                         communication_methods: communicationMethods,
                         selected_activity: selectedActivity,
                         conversations_per_month: conversationsPerMonth,
                         monthly_website_visitors: monthlyWebsiteVisitors,
                         website_hosting_platform: websiteHostingPlatform,
                         primary_use: primaryUse
                    })
                    .select()
                    .single()

               if (projectError || !projectData) {
                    return response.badRequest({
                         error: { name: 'projectCreationFailed', description: 'Création du projet échouée.' }
                    })
               }

               //  Mise à jour du selected_project_id (si lien existant)
               const { error: updateClientUserError } = await supabaseService
                    .from('client_users')
                    .update({ selected_project_id: projectData.id })
                    .eq('client_id', clientId)
                    .eq('user_id', userData.id)

               if (updateClientUserError) {
                    console.warn('⚠️ Impossible de mettre à jour le selected_project_id')
               }

               // Création de l’abonnement placeholder
               await supabaseService
                    .from('client_project_subscriptions')
                    .insert({
                         project_id: projectData.id,
                         current_plan_id: null,
                         status: 'inactive',
                         billing_cycle: 'monthly',
                         current_modules: [],
                         is_trial: false,
                         payment_failed: false
                    })

               return {
                    client: {
                         id: clientId
                    },
                    project: {
                         id: projectData.id
                    }
               }
          } catch (error) {
               console.error('Erreur OnboardingController.create:', error)
               return response.internalServerError({
                    error: { name: 'internalError', description: 'Une erreur est survenue.' }
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

               const { data: activitiesData, error: activitiesError } = await supabaseService
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
