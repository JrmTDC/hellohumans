import supabase from '#services/supabaseService'

export async function getClientUsagesWithLimits(clientId: string) {
     // 1. Récupère les modules et le plan du client
     const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('subscription_plan, active_modules')
          .eq('id', clientId)
          .single()

     if (clientError || !clientData) {
          throw new Error('Impossible de récupérer les données client')
     }

     const planId = clientData.subscription_plan
     const modules = clientData.active_modules || []

     // 2. Récupère les limites liées au plan
     const { data: limitsData, error: limitsError } = await supabase
          .from('plans_usage_limits')
          .select('usage_id, limit')
          .eq('plan_id', planId)

     if (limitsError || !limitsData) {
          throw new Error('Impossible de récupérer les limites du plan')
     }

     // 3. Récupère les usages enregistrés du client
     const { data: usageData } = await supabase
          .from('client_usages')
          .select('usage_id, usage, limit')
          .eq('client_id', clientId)

     // 4. Fusionne : une ligne par usage connu du plan
     const merged = limitsData.map((item) => {
          const usageEntry = usageData?.find(u => u.usage_id === item.usage_id)
          return {
               id: item.usage_id,
               usage: usageEntry?.usage || 0,
               limit: item.limit,
          }
     })

     return { modules, usage: merged }
}
