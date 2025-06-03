import { HttpContext } from '@adonisjs/core/http'
import supabaseService  from '#services/supabaseService'
import { randomBytes } from 'crypto'

class OnboardingController {
     public async create(ctx: HttpContext) {
          try {
               //  Extraction des champs
               const webSite = ctx.request.input('webSite')?.trim() || null
               const organizationName = ctx.request.input('organizationName')?.trim() || null
               const organizationType = ctx.request.input('organizationType')?.trim() || null
               const serviceModel = ctx.request.input('serviceModel')?.trim() || null
               const businessModel = ctx.request.input('businessModel')?.trim() || null
               const communicationMethods = ctx.request.input('communicationMethods') || null
               const selectedActivity = ctx.request.input('selectedActivity')?.trim() || null
               const conversationsPerMonth = ctx.request.input('conversationsPerMonth')?.trim() || null
               const monthlyWebsiteVisitors = ctx.request.input('monthlyWebsiteVisitors')?.trim() || null
               const websiteHostingPlatform = ctx.request.input('websiteHostingPlatform')?.trim() || null
               const primaryUse = ctx.request.input('primaryUse')?.trim() || null

               if (!webSite || !/^(https?:\/\/)?([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/i.test(webSite)) {
                    return ctx.response.badRequest({
                         error: { name: 'invalidWebsite', description: 'URL de site invalide.' }
                    })
               }

               if (!organizationName || !organizationType) {
                    return ctx.response.badRequest({
                         error: { name: 'clientMissing', description: 'Vous devez créer ou sélectionner un compte client.' }
                    })
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
                         return ctx.response.badRequest({
                              error: {
                                   name: 'missingField',
                                   description: `Le champ ${field.name} est requis.`
                              }
                         })
                    }
               }

               // Génération automatique d'une clé publique sécurisée
               const publicKey = randomBytes(32).toString('hex')
               const privateKey = randomBytes(32).toString('hex')

               // Création du projet principal
               const onboardingData = {
                    service_model: serviceModel,
                    business_model: businessModel,
                    communication_methods: communicationMethods,
                    selected_activity: selectedActivity,
                    conversations_per_month: conversationsPerMonth,
                    monthly_website_visitors: monthlyWebsiteVisitors,
                    website_hosting_platform: websiteHostingPlatform,
                    primary_use: primaryUse,
               }

               const organizationData = {
                    name: organizationName,
                    type: organizationType,
               }

               const { data: projectData, error: projectError } = await supabaseService
                    .from('projects')
                    .insert({
                         website: webSite,
                         public_key: publicKey,
                         private_key: privateKey,
                         onboarding_data: onboardingData,
                         organization_data: organizationData,
                         owner_user_id: ctx.user.id,
                    })
                    .select()
                    .single()

               if (projectError || !projectData) {
                    return ctx.response.badRequest({
                         error: { name: 'projectCreationFailed', description: 'Création du projet échouée.' }
                    })
               }

               // Lier user et le project
               await supabaseService.from('project_users').insert({
                    project_id: projectData.id,
                    user_id: ctx.user.id,
                    role: 'owner'
               })

               return {
                    project: {
                         id: projectData.id,
                         website: projectData.website,
                         subscription: null
                    }
               }
          } catch (error) {
               console.error('Erreur OnboardingController.create:', error)
               return ctx.response.internalServerError({
                    error: { name: 'internalError', description: 'Une erreur est survenue.' }
               })
          }
     }

     public async getActivities(ctx: HttpContext) {
          try {
               const { data: activitiesData, error: activitiesError } = await supabaseService
                    .from('onboarding_activities')
                    .select('id, name, slug')
                    .eq('active', true)
                    .order('order', { ascending: true })

               if (activitiesError || !activitiesData) {
                    return ctx.response.notFound({
                         error: { name: 'activityNotFound', description: 'Activité introuvable.' }
                    })
               }

               const activities = activitiesData.map((activity) => ({
                    id: activity.id,
                    name: activity.name?.[ctx.user.lang] || activity.name?.['en'] || '',
                    slug: activity.slug,
               }))

               return {
                    activities
               }
          } catch (error) {
               console.error('Erreur OnboardingController.getActivities:', error)
               return ctx.response.internalServerError({
                    error: { name: 'internalError', description: 'Erreur interne' }
               })
          }
     }
}

export default new OnboardingController()
