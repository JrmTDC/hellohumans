export function usePanelPageMeta(title: string, description?: string) {
     const titleDisplay = title ? `Hellohumans -  ${title}` : 'Hellohumans - Panel '
     useHead({
          title : titleDisplay,
          meta: description
               ? [
                    {
                         name: 'description',
                         content: description
                    }
               ]
               : []
     })
}
