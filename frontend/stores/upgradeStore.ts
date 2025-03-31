import { defineStore } from 'pinia'

export interface UpgradeOffer {
     id: string
     name: string
     description: string
     monthlyPrice: number
     discountMonths: number
     includedFeatures: string[]
     popular?: boolean
     baseSubtitle: string
     includedModules?: string[]
}

export interface ModuleChoice {
     label: string
     monthlyPrice: number
     discountMonths?: number
}

export interface ModuleAddOn {
     id: string
     name: string
     description: string
     basePrice: number
     discountMonths?: number
     multipleChoice?: boolean
     choices?: ModuleChoice[]
     selectedChoiceIndex?: number
     selected: boolean
     disabled?: boolean
     comingSoon?: boolean
}

interface UpgradeState {
     offers: UpgradeOffer[]
     availableModules: ModuleAddOn[]
     selectedOfferId: string | null
     billingCycle: 'monthly' | 'annual'
}

export const useUpgradeStore = defineStore('upgrade', {
     state: (): UpgradeState => ({
          offers: [
               {
                    id: 'free',
                    name: 'Free',
                    description: 'Pour les nouvelles entreprises qui souhaitent commencer gratuitement.',
                    monthlyPrice: 0,
                    discountMonths: 2,
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
                    includedFeatures: [
                         '100 000 conversations traitées mensuel',
                         'Récolte de données 2/semaine'
                    ],
                    baseSubtitle: 'Tout ce qui se trouve dans Grouth, plus :',
                    includedModules: [
                         'white_label',
                         'hook_messages',
                         'chat_history',
                         'predefined_answers',
                         'multilang',
                         'external_chat',
                         'prospect_manager'
                    ]
               }
          ],
          availableModules: [],
          selectedOfferId: null,
          billingCycle: 'monthly'
     }),

     getters: {
          currentOffer(state): UpgradeOffer | null {
               return state.offers.find(o => o.id === state.selectedOfferId) || null
          },
          selectedAddOns(state): ModuleAddOn[] {
               const included = state.currentOffer?.includedModules || []
               return state.availableModules.filter(m => m.selected || included.includes(m.id))
          },
          billableAddOns(state): ModuleAddOn[] {
               const included = state.currentOffer?.includedModules || []
               return state.availableModules.filter(m => m.selected && !included.includes(m.id))
          }
     },

     actions: {
          initModules() {
               this.availableModules = [
                    {
                         id: 'white_label',
                         name: 'Marque blanche',
                         description: 'Supprime la mention « Propulsé par HelloHumans ».',
                         basePrice: 69,
                         discountMonths: 2,
                         selected: false
                    },
                    {
                         id: 'hook_messages',
                         name: 'Messages d’accroche',
                         description: 'Messages personnalisés pour attirer les visiteurs.',
                         basePrice: 14,
                         discountMonths: 2,
                         multipleChoice: true,
                         choices: [
                              { label: '20 messages', monthlyPrice: 14 },
                              { label: '30 messages', monthlyPrice: 20 },
                              { label: '40 messages', monthlyPrice: 26 },
                              { label: '50 messages', monthlyPrice: 27.5 },
                              { label: '100 messages', monthlyPrice: 44 }
                         ],
                         selectedChoiceIndex: 0,
                         selected: false
                    },
                    {
                         id: 'chat_history',
                         name: 'Historique de chat',
                         description: 'Consultez les échanges passés.',
                         basePrice: 39,
                         discountMonths: 2,
                         selected: false
                    },
                    {
                         id: 'predefined_answers',
                         name: 'Réponses prédéfinies',
                         description: 'Réponses automatisées pour les questions fréquentes.',
                         basePrice: 29,
                         discountMonths: 2,
                         selected: false
                    },
                    {
                         id: 'multilang',
                         name: 'Multilingue',
                         description: 'Traduction automatique en plusieurs langues.',
                         basePrice: 9,
                         discountMonths: 2,
                         selected: false
                    },
                    {
                         id: 'external_chat',
                         name: 'Chat externe',
                         description: 'Partagez votre chatbot en dehors du site.',
                         basePrice: 59,
                         discountMonths: 2,
                         selected: false
                    },
                    {
                         id: 'prospect_manager',
                         name: 'Prospect',
                         description: 'Collectez et suivez vos leads.',
                         basePrice: 79,
                         discountMonths: 2,
                         selected: false
                    },
                    {
                         id: 'conversation_recharge',
                         name: 'Recharge de conversations',
                         description: 'Ajoutez des packs de conversations.',
                         basePrice: 20,
                         multipleChoice: true,
                         choices: [
                              { label: '500 conversations', monthlyPrice: 20 },
                              { label: '2 000 conversations', monthlyPrice: 70 },
                              { label: '10 000 conversations', monthlyPrice: 250 }
                         ],
                         selectedChoiceIndex: 0,
                         selected: false,
                         disabled: true
                    },
                    {
                         id: 'guide_plus',
                         name: 'Guide+',
                         description: 'Infos sur les lieux touristiques.',
                         basePrice: 79,
                         discountMonths: 2,
                         selected: false
                    },
                    {
                         id: 'rando_plus',
                         name: 'Rando+',
                         description: 'Itinéraires personnalisés pour randonnées.',
                         basePrice: 79,
                         discountMonths: 2,
                         selected: false
                    },
                    {
                         id: 'ecommerce_plus',
                         name: 'Ecommerce+',
                         description: 'Ajout au panier directement depuis le chatbot.',
                         basePrice: 129,
                         discountMonths: 2,
                         selected: false,
                         comingSoon: true
                    },
                    {
                         id: 'emailing',
                         name: 'Emailing',
                         description: 'Campagnes d’e-mails à grande échelle.',
                         basePrice: 4.75,
                         multipleChoice: true,
                         choices: [
                              { label: '5 000 emails', monthlyPrice: 4.75 },
                              { label: '20 000 emails', monthlyPrice: 15 },
                              { label: '60 000 emails', monthlyPrice: 33 },
                              { label: '150 000 emails', monthlyPrice: 52.5 }
                         ],
                         selectedChoiceIndex: 0,
                         selected: false,
                         comingSoon: true
                    }
               ]
          },

          setOffer(id: string) {
               this.selectedOfferId = id
               this.persist()
          },

          setBillingCycle(cycle: 'monthly' | 'annual') {
               this.billingCycle = cycle
               this.persist()
          },

          toggleModule(id: string, checked: boolean) {
               const mod = this.availableModules.find(m => m.id === id)
               if (mod) {
                    mod.selected = checked
                    this.persist()
               }
          },

          setModuleChoice(id: string, choiceIndex: number) {
               const mod = this.availableModules.find(m => m.id === id)
               if (mod?.multipleChoice && mod.choices) {
                    mod.selectedChoiceIndex = choiceIndex
                    this.persist()
               }
          },

          resetAll() {
               this.selectedOfferId = null
               this.billingCycle = 'monthly'
               this.availableModules.forEach((m) => {
                    m.selected = false
                    if (m.multipleChoice) m.selectedChoiceIndex = 0
               })
               this.persist()
          },

          persist() {
               const data = {
                    selectedOfferId: this.selectedOfferId,
                    billingCycle: this.billingCycle,
                    modules: this.availableModules.map(m => ({
                         id: m.id,
                         selected: m.selected,
                         selectedChoiceIndex: m.selectedChoiceIndex
                    }))
               }
               localStorage.setItem('upgradeStore', JSON.stringify(data))
          },

          restore() {
               const raw = localStorage.getItem('upgradeStore')
               if (!raw) return
               try {
                    const parsed = JSON.parse(raw)
                    if (parsed.selectedOfferId) this.selectedOfferId = parsed.selectedOfferId
                    if (parsed.billingCycle) this.billingCycle = parsed.billingCycle
                    if (parsed.modules?.length) {
                         parsed.modules.forEach((mod: any) => {
                              const found = this.availableModules.find(m => m.id === mod.id)
                              if (found) {
                                   found.selected = mod.selected
                                   found.selectedChoiceIndex = mod.selectedChoiceIndex ?? 0
                              }
                         })
                    }
               } catch (e) {
                    console.warn('Failed to restore upgrade store:', e)
               }
          }
     }
})
