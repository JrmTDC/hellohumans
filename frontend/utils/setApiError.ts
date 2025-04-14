export function setApiError(target: Ref<string | null>, error: any): void {
     const parsed = parseApiError(error)
     target.value = parsed.key || parsed.description
}
