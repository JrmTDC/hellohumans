export function useBase64Asset(name: string) {
     const base64 = ref<string | null>(null)
     onMounted(async () => {
          base64.value = await useAssetBase64Loader(name)
     })
     return base64
}
