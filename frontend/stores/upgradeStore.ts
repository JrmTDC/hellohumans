// src/stores/upgradeStore.ts
import { defineStore } from 'pinia'

/** Représentation d’une offre */
export interface UpgradeOffer {
     id: string
     name: string
     description: string
     monthlyPrice: number
     discountMonths: number
     includedFeatures: string[]
     popular?: boolean
     baseSubtitle: string
     // Liste d'ID de modules inclus dans cette offre
     includedModules?: string[]
}

/** Représentation d’un module add-on dans le store */
export interface ModuleAddOn {
     id: string
     name: string
     description: string

     // Prix mensuel de base
     basePrice: number
     // Nombre de mois offerts si on paie annuellement
     discountMonths?: number

     // true si le module a plusieurs options (choices)
     multipleChoice?: boolean
     choices?: Array<{
          label: string
          monthlyPrice: number
          discountMonths?: number
     }>
     selectedChoiceIndex?: number

     // Coché
     selected: boolean

     // Ne pas l'afficher dans la sélection si true
     disabled?: boolean

     // L'afficher, mais input disabled, tooltip "Bientôt disponible"
     comingSoon?: boolean
}

export const useUpgradeStore = defineStore('upgrade', {
     state: () => ({
          // Offres
          offers: [
               {
                    id: 'free',
                    name: 'Free',
                    description:
                         'Pour les nouvelles entreprises qui souhaitent commencer gratuitement.',
                    monthlyPrice: 0,
                    discountMonths: 2,
                    popular: false,
                    includedFeatures: [
                         '100 conversations traitées mensuel',
                         '2 Suggestions questions',
                         'Récolte de données 1/mois',
                         'Personnalisation limitée'
                    ],
                    baseSubtitle: 'Cette offre inclut :',
                    includedModules: []
               },
               {
                    id: 'starter',
                    name: 'Starter',
                    description: "Pour passer à l'échelle et débloquer plus de fonctionnalités.",
                    monthlyPrice: 29,
                    discountMonths: 2,
                    popular: false,
                    includedFeatures: [
                         '1 000 conversations traitées mensuel',
                         '5 Suggestions questions',
                         'Personnalisation complète',
                         'Satisfaction client personnalisable',
                         'Analyse standard'
                    ],
                    baseSubtitle: 'Tout ce qui se trouve dans Free, plus :',
                    includedModules: []
               },
               {
                    id: 'grouth',
                    name: 'Grouth',
                    description: 'Pour les entreprises exigeantes (nombre illimité de conversations).',
                    monthlyPrice: 59,
                    discountMonths: 2,
                    popular: true,
                    includedFeatures: [
                         '5 000 conversations traitées mensuel',
                         'Récolte de données 1/semaine',
                         'Analyse avancée'
                    ],
                    baseSubtitle: 'Tout ce qui se trouve dans Starter, plus :',
                    includedModules: []
               },
               {
                    id: 'plus',
                    name: 'Plus',
                    description: 'Pour les entreprises exigeantes (nombre illimité de conversations).',
                    monthlyPrice: 749,
                    discountMonths: 2,
                    popular: false,
                    includedFeatures: [
                         '100 000 conversations traitées mensuel',
                         'Récolte de données 2/semaine'
                    ],
                    baseSubtitle: 'Tout ce qui se trouve dans Grouth, plus :',
                    // Exemple : le module 'white_label' inclus
                    includedModules: ['white_label','hook_messages','chat_history','predefined_answers','multilang','external_chat','prospect_manager','','','']
               }
          ] as UpgradeOffer[],

          // Liste de modules
          availableModules: [] as ModuleAddOn[],

          // Sélection de l’offre
          selectedOfferId: '' as string | null,
          // mensuel ou annuel
          billingCycle: 'monthly' as 'monthly' | 'annual'
     }),

     getters: {
          /** L'offre sélectionnée */
          currentOffer(state): UpgradeOffer | null {
               return state.offers.find((o) => o.id === state.selectedOfferId) || null
          },

          /**
           * Liste des modules affichés dans le résumé
           * => Modules cochés OU inclus dans l'offre
           */
          selectedAddOns(state): ModuleAddOn[] {
               const includedIds = state.currentOffer?.includedModules || []
               return state.availableModules.filter((m) => {
                    // Est inclus ?
                    if (includedIds.includes(m.id)) {
                         return true
                    }
                    // Sinon, est-ce qu'il est coché ?
                    return m.selected
               })
          }
     },

     actions: {
          initModules() {
               this.availableModules = [
                    {
                         id: 'white_label',
                         name: 'Marque blanche',
                         description: 'Supprime la mention « Propulsé par HelloHumans » pour un chatbot 100 % à votre image.',
                         basePrice: 69,
                         discountMonths: 2,
                         multipleChoice: false,
                         selected: false
                    },
                    {
                         id: 'hook_messages',
                         name: 'Messages d’accroche',
                         description: 'Incitez vos visiteurs à interagir grâce à des messages d’accroche personnalisés.',
                         basePrice: 14,
                         discountMonths: 2,
                         multipleChoice: true,
                         choices: [
                              { label: '20 messages', monthlyPrice: 14, discountMonths: 2 },
                              { label: '30 messages', monthlyPrice: 20, discountMonths: 2 },
                              { label: '40 messages', monthlyPrice: 26, discountMonths: 2 },
                              { label: '50 messages', monthlyPrice: 27.5, discountMonths: 2 },
                              { label: '100 messages', monthlyPrice: 44, discountMonths: 2 }
                         ],
                         selectedChoiceIndex: 0,
                         selected: false
                    },
                    {
                         id: 'chat_history',
                         name: 'Historique de chat',
                         description: 'Consultez les échanges passés et identifiez les questions les plus fréquentes.',
                         basePrice: 39,
                         discountMonths: 2,
                         multipleChoice: false,
                         selected: false
                    },
                    {
                         id: 'predefined_answers',
                         name: 'Réponses prédéfinies',
                         description: 'Programmez des réponses clés pour optimiser les échanges stratégiques.',
                         basePrice: 29,
                         discountMonths: 2,
                         multipleChoice: false,
                         selected: false
                    },
                    {
                         id: 'multilang',
                         name: 'Multilingue',
                         description: 'Traduction automatique du chatbot dans plusieurs langues pour s’adapter à votre public.',
                         basePrice: 9,
                         discountMonths: 2,
                         multipleChoice: false,
                         selected: false
                    },
                    {
                         id: 'external_chat',
                         name: 'Chat externe',
                         description: 'Partagez votre chatbot par lien, même en dehors de votre site.',
                         basePrice: 59,
                         discountMonths: 2,
                         multipleChoice: false,
                         selected: false
                    },
                    {
                         id: 'prospect_manager',
                         name: 'Prospect',
                         description: 'Collectez, segmentez et suivez vos leads avec des outils avancés de gestion.',
                         basePrice: 79,
                         discountMonths: 2,
                         multipleChoice: false,
                         selected: false
                    },
                    {
                         id: 'conversation_recharge',
                         name: 'Recharge de conversations',
                         description: 'Ajoutez des packs de conversations selon vos besoins mensuels.',
                         basePrice: 20,
                         multipleChoice: true,
                         choices: [
                              { label: '500 conversations', monthlyPrice: 20, discountMonths: 2 },
                              { label: '2 000 conversations', monthlyPrice: 70, discountMonths: 2 },
                              { label: '10 000 conversations', monthlyPrice: 250, discountMonths: 2 }
                         ],
                         selectedChoiceIndex: 0,
                         selected: false,
                         disabled: true  // => module pas affiché dans la sélection
                    },
                    {
                         id: 'guide_plus',
                         name: 'Guide+',
                         description: 'Proposez des infos détaillées sur les lieux touristiques (restos, hôtels, événements…).',
                         basePrice: 79,
                         discountMonths: 2,
                         multipleChoice: false,
                         selected: false
                    },
                    {
                         id: 'rando_plus',
                         name: 'Rando+',
                         description: 'Générez des itinéraires personnalisés pour randonnées, VTT, trail, etc.',
                         basePrice: 79,
                         discountMonths: 2,
                         multipleChoice: false,
                         selected: false
                    },
                    {
                         id: 'ecommerce_plus',
                         name: 'Ecommerce+',
                         description: 'Intégrez votre catalogue produit et permettez l’ajout au panier directement depuis le chatbot.',
                         basePrice: 129,
                         discountMonths: 2,
                         multipleChoice: false,
                         selected: false,
                         comingSoon: true
                    },
                    {
                         id: 'emailing',
                         name: 'Emailing',
                         description: 'Lancez des campagnes d’e-mails efficaces à grande échelle.',
                         basePrice: 4.75,
                         multipleChoice: true,
                         choices: [
                              { label: '5 000 emails', monthlyPrice: 4.75, discountMonths: 2 },
                              { label: '20 000 emails', monthlyPrice: 15, discountMonths: 2 },
                              { label: '60 000 emails', monthlyPrice: 33, discountMonths: 2 },
                              { label: '150 000 emails', monthlyPrice: 52.5, discountMonths: 2 }
                         ],
                         selectedChoiceIndex: 0,
                         selected: false,
                         comingSoon: true // => affiché, input disabled
                    }
               ]
          },

          setOffer(offerId: string) {
               this.selectedOfferId = offerId
          },

          setBillingCycle(cycle: 'monthly' | 'annual') {
               this.billingCycle = cycle
          },

          resetAll() {
               this.selectedOfferId = ''
               this.billingCycle = 'monthly'
               this.availableModules = []
          },

          toggleModule(moduleId: string, checked: boolean) {
               const mod = this.availableModules.find((m) => m.id === moduleId)
               if (mod) {
                    mod.selected = checked
               }
          },

          setModuleChoice(moduleId: string, choiceIndex: number) {
               const mod = this.availableModules.find((m) => m.id === moduleId)
               if (mod && mod.multipleChoice && mod.choices) {
                    mod.selectedChoiceIndex = choiceIndex
               }
          }
     }
})
