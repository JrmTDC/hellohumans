import { loadStripe } from '@stripe/stripe-js'
import type { Stripe, StripeElements, StripeElementsOptionsClientSecret, Appearance } from '@stripe/stripe-js'

export async function useStripeElements(clientSecret: string): Promise<{ stripeInstance: Stripe | null; elementsInstance: StripeElements | null }> {
     const config = useRuntimeConfig()

     if (!clientSecret) return { stripeInstance: null, elementsInstance: null }

     const stripeInstance = await loadStripe(config.public.stripeKey!)
     if (!stripeInstance) return { stripeInstance: null, elementsInstance: null }

     const appearance: Appearance = {
          theme: 'night',
          labels: 'floating',
          variables: {
               //colorPrimary: '#0566ff',
               colorBackground: '#f5f7fa',
               colorText: '#080f1a',
          },
          rules: {
               '.Input': {
                    padding: '10px',
                    border: '1px solid #e2e8ef',
                    boxShadow: "none"
               },
               '.Input--invalid': {
                    boxShadow: 'none'
               },
               '.Label': {
                    backgroundColor: 'transparent',
                    border: 'none',
                    boxShadow: 'none'
               },
               '.Input--focus': {
                    boxShadow: 'none'
               },
               '.PickerItem': {
                    boxShadow: 'none'
               },
               '.Tab': {
                    boxShadow: 'none'
               },
               '.AccordionItem': {
                    boxShadow: 'none'
               },
               '.Input:focus': {
                    boxShadow: 'none',
                    border: '2px solid #0566ff',
               },
               '.Block': {
                    backgroundColor: 'transparent',
                    border: 'none',
                    boxShadow: 'none'
               },
               '.Placeholder': {
                    boxShadow: 'none'
               },
               '.Loading': {
                    boxShadow: 'none'
               }
          }
     }

     const elementsOptions: StripeElementsOptionsClientSecret = {
          clientSecret,
          appearance,
     }



     const elementsInstance = stripeInstance.elements(elementsOptions)

     return {
          stripeInstance,
          elementsInstance
     }
}
