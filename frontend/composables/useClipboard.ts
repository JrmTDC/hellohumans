export function useClipboard(text: string) {
     const copy = () => navigator.clipboard.writeText(text)
     return { copy }
}
