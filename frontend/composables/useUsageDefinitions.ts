import { computed } from 'vue'
import { usePanelStore } from '~/stores/panelStore'

const { t } = useI18n()
export const useUsageDefinitions = () => {

     const panelStore = usePanelStore()

     const rawDefinitions = computed(() => [
          {
               id: 'audience',
               showInHeader: true,
               showInDashboard: true,
               type: 'core',
               title: t('panel.composables.useUsageDefinitions.audience.title'),
               description: t('panel.composables.useUsageDefinitions.audience.description'),
               titleUsage: t('panel.composables.useUsageDefinitions.audience.titleUsage'),
               autoColor: false,
               centerContent: 'infinity',
               progressColor: '#22c55e',
               bgColor: '#e5e7eb',
          },
          {
               id: 'interactions',
               showInHeader: true,
               showInDashboard: true,
               type: 'plan',
               title: t('panel.composables.useUsageDefinitions.interactions.title'),
               description: t('panel.composables.useUsageDefinitions.interactions.description'),
               titleUsage: t('panel.composables.useUsageDefinitions.interactions.titleUsage'),
               autoColor: true,
               centerContent: 'none',
               progressColor: '#f59e0b',
               bgColor: '#e5e7eb',
          },
          {
               id: 'rando',
               showInHeader: false,
               showInDashboard: true,
               type: 'module',
               requiredModule: 'rando_plus',
               title: t('panel.composables.useUsageDefinitions.rando.title'),
               description: t('panel.composables.useUsageDefinitions.rando.description'),
               titleUsage: t('panel.composables.useUsageDefinitions.rando.titleUsage'),
               autoColor: true,
               centerContent: 'none',
               progressColor: '#10b981',
               bgColor: '#e5e7eb',
          }
     ])

     return computed(() => {
          return rawDefinitions.value
               .filter((def) => {
                    if (def.type === 'module' && def.requiredModule) {
                         return panelStore.modules.includes(def.requiredModule)
                    }
                    return true
               })
               .map((def) => {
                    const usageEntry = panelStore.project_usages.find((u) => u.id === def.id)
                    const usage = usageEntry?.usage || 0
                    const limit = usageEntry?.limit ?? '∞'
                    const isNumeric = !isNaN(Number(limit))
                    const parsedLimit = isNumeric ? Number(limit) : null
                    const percentage = isNumeric && parsedLimit
                         ? Math.min(100, Math.round((usage / parsedLimit) * 100))
                         : 100

                    return {
                         ...def,
                         usage,
                         limit,
                         percentage,
                         numberContent: limit === '∞' ? '∞' : usage.toString(),
                    }
               })
     })
}
