     import { defineStore } from 'pinia'
     import { usePanelApi } from '@/composables/usePanelApi'

     export interface UpgradeOffer {
          id: string
          name: string
          description: string
          monthlyPrice: number
          discountMonths: number
          includedFeatures: string[]
          baseSubtitle: string
          popular?: boolean
          includedModules?: string[]
     }

     export interface ModuleAddOn {
          id: string
          name: string
          description: string
          basePrice: number
          discountMonths?: number
          multipleChoice?: boolean
          choices?: Array<{
               label: string
               monthlyPrice: number
               discountMonths?: number
          }>
          selectedChoiceIndex?: number
          selected: boolean
          disabled?: boolean
          comingSoon?: boolean
     }

     export const useUpgradeStore = defineStore('upgrade', {
          state: () => ({
               offers: [] as UpgradeOffer[],
               availableModules: [] as ModuleAddOn[],
               selectedOfferId: null as string | null,
               billingCycle: 'monthly' as 'monthly' | 'annual'
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
               async fetchOffers() {
                    const { apiFetch } = usePanelApi()
                    const res = await apiFetch('/upgrade/offers')
                    this.offers = res.offers
               },

               async fetchModules() {
                    const { apiFetch } = usePanelApi()
                    const res = await apiFetch('/upgrade/modules')
                    this.availableModules = res.modules
               },

               setOffer(offerId: string) {
                    this.selectedOfferId = offerId
                    this.save()
               },

               setBillingCycle(cycle: 'monthly' | 'annual') {
                    this.billingCycle = cycle
                    this.save()
               },

               toggleModule(moduleId: string, checked: boolean) {
                    const mod = this.availableModules.find(m => m.id === moduleId)
                    if (mod) {
                         mod.selected = checked
                         this.save()
                    }
               },

               setModuleChoice(moduleId: string, index: number) {
                    const mod = this.availableModules.find(m => m.id === moduleId)
                    if (mod?.multipleChoice && mod.choices) {
                         mod.selectedChoiceIndex = index
                         this.save()
                    }
               },

               resetAll() {
                    this.selectedOfferId = null
                    this.billingCycle = 'monthly'
                    this.availableModules = []
                    this.offers = []
                    localStorage.removeItem('upgradeStore')
               },

               save() {
                    if (process.client) {
                         const data = {
                              selectedOfferId: this.selectedOfferId,
                              billingCycle: this.billingCycle,
                              modules: this.availableModules.map(m => ({
                                   id: m.id,
                                   selected: m.selected,
                                   selectedChoiceIndex: m.selectedChoiceIndex ?? 0
                              }))
                         }
                         localStorage.setItem('upgradeStore', JSON.stringify(data))
                    }
               },

               restore() {
                    if (process.client) {
                         const raw = localStorage.getItem('upgradeStore')
                         if (!raw) return
                         try {
                              const saved = JSON.parse(raw)
                              this.selectedOfferId = saved.selectedOfferId
                              this.billingCycle = saved.billingCycle

                              for (const m of saved.modules || []) {
                                   const mod = this.availableModules.find(am => am.id === m.id)
                                   if (mod) {
                                        mod.selected = m.selected
                                        mod.selectedChoiceIndex = m.selectedChoiceIndex
                                   }
                              }
                         } catch (e) {
                              console.error('Erreur restauration store upgrade:', e)
                         }
                    }
               }
          }
     })
