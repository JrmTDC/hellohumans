export function setApiError(target: Ref<string | null>, error: any, baseLocalKey: string): void {
     const parsed = parseApiError(error, baseLocalKey)
     target.value = parsed.key || parsed.name || parsed.description || 'api.errors.unknown'
}
