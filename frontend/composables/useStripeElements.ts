import { loadStripe } from '@stripe/stripe-js'

let stripeInstance: any = null
let elementsInstance: any = null

export async function useStripeElements() {
     if (!stripeInstance) {
          const stripeKey = useRuntimeConfig().public.stripeKey
          stripeInstance = await loadStripe(stripeKey)
     }

     if (!elementsInstance && stripeInstance) {
          elementsInstance = stripeInstance.elements()
     }

     return {
          stripeInstance,
          elementsInstance
     }
}
