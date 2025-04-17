export function usePanelPageMeta() {
     // États partagés dans le layout
     const pageHeaderTitle = useState<string>('pageHeaderTitle', () => '')
     const pageHeaderBilled = useState<boolean>('pageHeaderBilled', () => false)
     const pageHeaderPaid = useState<boolean>('pageHeaderPaid', () => false)
     const pageMenuPanel = useState<boolean>('pageMenuPanel', () => true)

     // Setter pratique pour le <head>
     function setMeta({ title, description }: { title?: string; description?: string }) {
          const finalTitle = title ? `Hellohumans - ${title}` : 'Hellohumans - Panel'
          useHead({
               title: finalTitle,
               meta: description
                    ? [
                         {
                              name: 'description',
                              content: description,
                         },
                    ]
                    : [],
          })
     }

     return {
          pageHeaderTitle,
          pageHeaderBilled,
          pageHeaderPaid,
          pageMenuPanel,
          setMeta,
     }
}
