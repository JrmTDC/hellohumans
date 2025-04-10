import { loadStripe } from '@stripe/stripe-js'

let stripeInstance: any = null

export async function getStripe() {
     if (!stripeInstance) {
          const config = useRuntimeConfig()
          stripeInstance = await loadStripe(config.public.stripeKey)
     }
     return stripeInstance
}
